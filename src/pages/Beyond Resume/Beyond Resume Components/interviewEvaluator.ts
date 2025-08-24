type QuestionResult = {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
};

export const evaluateInterviewResponses = async ({
  parsedData,
  userResponses,
  brJobId,
  brInterviewId,
  sessionType,
  getUserAnswerFromAi,
  updateByIdDataInTable,
  openSnackBar,
  redirectToSuccess = true,
  speakText,
  setLoading,
  jobsData,
}: {
  parsedData: any;
  jobsData?: any;
  userResponses: string[][];
  brJobId?: number;
  brInterviewId?: number;
  sessionType: string;
  getUserAnswerFromAi: Function;
  updateByIdDataInTable: Function;
  openSnackBar: Function;
  redirectToSuccess?: boolean;
  speakText?: (text: string) => Promise<void>;
  setLoading?: (val: boolean) => void;
}) => {
  setLoading?.(true);

  // console.log(jobsData);

  try {
    if (speakText) {
      await speakText(
        "Thank you for your time. This concludes your virtual interview."
      );
    }

    

    const output = parsedData?.categories.flatMap(
      (category: any, catIndex: number) =>
        category.questions.map((q: any, qIndex: number) => ({
          categoryName: category.name,
          question: q.question,
          options: q.options,
          userAnswer: userResponses[catIndex][qIndex],
          suggestedAnswer: q.suggestedAnswer,
          AnswerKey: q.AnswerKey,
        }))
    );

    let generatedResume: string | null = null;
    let generatedCoverLetter: string | null = null;



    if  (jobsData?.[0]?.candidateResume) {
      const resumePrompt = `
I have found a job opportunity for the role of "${
        jobsData[0]?.jobTitle
      }" and I would like to apply for it. Before proceeding, I want to assess my suitability for the position.

I am providing the following for your evaluation:
- My complete resume
- The full job description
- A JSON file containing a simulation of interview questions and my responses

Please analyze the information and return your evaluation in **exactly** the format specified below.


Resume:
${jobsData[0]?.candidateResume}


Job Description:
${jobsData[0]?.jobDescriptions}


Simulation JSON (Questions and Answers):
${JSON.stringify(output)}


### Response Format (Return in exactly this JSON structure):

{
  "generatedResume": "Generate a fully formatted and polished HTML version of my resume, tailored especially to the job description and my simulation responses. Ensure it is refined, visually structured, and ready to render on a webpage, preserving all original formatting including headings, bullet points, and line breaks.",
  "generatedCoverLetter": "Write a fully polished and ready-to-use HTML cover letter addressed to the hiring manager at ${
    jobsData[0]?.companyName
  }. Ensure it is fully personalized with no placeholders or dummy content. 
   Highlight how my skills align with the specific requirements of the job and explain how I can contribute to the company’s success. Include a real-life example where I overcame a challenging task, resolved it effectively, and what I learned from the experience. The final output should be professional, tailored, and suitable for direct submission without further edits."

}
`;

      try {
        const resumeRes = await getUserAnswerFromAi({ question: resumePrompt });
        const rawResumeText =
          resumeRes?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawResumeText) {
          const cleanedText = rawResumeText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          generatedResume = parsed.generatedResume || null;
          generatedCoverLetter = parsed.generatedCoverLetter || null;
        }
      } catch (error) {
        console.error("Failed to parse AI resume/cover letter:", error);
      }
    }

    
    // console.log(generatedResume);
    // console.log(generatedCoverLetter);

    const fullCommand = `You are an expert interview evaluator. Based on the candidate's responses, you will return a strict and objective evaluation in JSON format.

    ### Evaluation Instructions:
    
    1. **Level Progression Logic:**
       - Start at level: "beginner"
       - Levels: ["beginner", "intermediate", "advance", "complex"]
       - Promote only after **3 consecutive correct** answers.
       - Demote by **1 level** on **any incorrect** answer (but never below "beginner").
       - After demotion, restart correct count — 3 new consecutive correct answers required for next promotion.
    
    2. **Scoring Logic (Very Strict):**
       - Compare each \`userAnswer\` with the **idealAnswer**
       - Cross-verify factual correctness using trusted online sources
       - Mark each answer as **"Correct"** or **"Incorrect"**
       - Assign a score from 0 to 10:
         - Assign **score = 0** if:
           - \`userAnswer.length === 0\` (i.e., no answer provided)
           - The answer is incorrect, vague, off-topic, hallucinated, or lacks structure
         - Assign **score = 10** if:
           - The answer is fully correct, factually accurate, precise, and well-structured
       - **Do not assign partial scores**. Only assign **0** or **10** based on the above rules.
    
    3. **Total Score Calculation:**
       - The final \`interviewScore\` is based on the **sum of all individual scores**, **normalized to 100**
       - Example: If there are 5 questions, total possible = 50, so actual score = (sum of scores / 50) × 100
       - **If all answers received a score of 0, then \`interviewScore\` must be exactly 0 — no exceptions**
       - Follow this logic strictly with no rounding errors or default values
    
    ### JSON Format:
    Return your evaluation in **exactly** the following JSON format:
    
    {
      "interviewScore": [number from 0 to 100],
      "brInterviewLevel": "[beginner | intermediate | advance | complex]",
      "interviewOverview": "[1–2 sentence summary of performance, key strengths/weaknesses, and selection likelihood: High / Medium / Low]",
      "interviewSuggestion": "[Encouraging feedback focusing on improvement areas, with a positive and motivational tone]",
      "questionResults": [
        {
          "question": "[text of the question]",
          "userAnswer": "[candidate's response]",
          "isCorrect": [true or false],
          "score": [0 to 10]
        }
      ]
    }
    
    ### Input:
    Here is the input JSON to evaluate: ${JSON.stringify(output)}
    `;

    // console.log(fullCommand);
    const res = await getUserAnswerFromAi({ question: fullCommand });
    const rawText = res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // console.log(rawText);



    let interviewScore: number | null = null;
    let interviewOverview: string | null = null;
    let interviewSuggestion: string | null = null;
    let brInterviewLevel: string | null = null;
    let questionResults: QuestionResult[] = [];

    let updatedOutput = output;

    try {
      const cleanedText = rawText.replace(/```json|```/g, "").trim();

      // console.log(cleanedText);
      const parsed = JSON.parse(cleanedText);
      // console.log(parsed);

      interviewScore = parsed.interviewScore;
      interviewOverview = parsed.interviewOverview;
      brInterviewLevel = parsed.brInterviewLevel;
      interviewSuggestion = parsed.interviewSuggestion;
      questionResults = parsed.questionResults;

      if (!output) {
        openSnackBar("No questions found for evaluation.");
        return;
      }

      updatedOutput = output.map((item: any) => {
        const match = questionResults.find(
          (qr) =>
            qr.question === item.question && qr.userAnswer === item.userAnswer
        );
        return {
          ...item,
          isCorrect: match?.isCorrect ?? null,
          score: match?.score ?? null,
        };
      });
    } catch (error) {
      console.error("Failed to parse AI response:", error);
    }

    try {
      if (brJobId) {
        await updateByIdDataInTable(
          "brJobApplicant",
          brJobId,
          {
            interviewQuestionAnswer: updatedOutput,
            interviewScore,
            interviewOverview,
            interviewSuggestion,
            brInterviewLevel,
            brJobApplicantStatus: "CONFIRMED",
            generatedResume,
            generatedCoverLetter,
          },
          "brJobApplicantId"
        );
      }

      if (brInterviewId) {
        await updateByIdDataInTable(
          "brInterviews",
          brInterviewId,
          {
            interviewQuestionAnswer: updatedOutput,
            interviewScore,
            interviewOverview,
            interviewSuggestion,
            brInterviewLevel,
            brInterviewStatus: "CONFIRMED",
          },
          "brInterviewId"
        );
      }

      if (redirectToSuccess) {
        location.href = `/beyond-resume-interview-success?sessionType=${encodeURIComponent(
          sessionType || "aiInterview"
        )}`;
      }
    } catch (error: any) {
      openSnackBar(
        error?.response?.data?.msg ||
          "Something went wrong while saving responses."
      );
    }
  } finally {
    setLoading?.(false);
  }
};
