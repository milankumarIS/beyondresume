import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { getUserId } from "../../../services/axiosClient";
import {
  getProfile,
  getUserAnswerFromAi,
  searchDataFromTable,
  searchListDataFromTable,
  syncDataInTable,
} from "../../../services/services";
import color from "../../../theme/color";

const AIProfileInterview = ({ open, onConversationComplete }) => {
  if (!open) return null;

  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    getProfile().then((result: any) => {
      setCurrentUser({ ...result?.data?.data });
    });
  }, []);
  const [step, setStep] = useState<number>(-1);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [finalUserData, setFinalUserData] = useState<Record<string, string>>(
    {}
  );
  const userSummary = summarizeKnownUserData(currentUser);

  // console.log(userSummary)

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.cancel();

      speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    const stopSpeech = () => {
      speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", stopSpeech);
    window.addEventListener("popstate", stopSpeech);

    return () => {
      stopSpeech();
      window.removeEventListener("beforeunload", stopSpeech);
      window.removeEventListener("popstate", stopSpeech);
    };
  }, []);

  const startRecording = async () => {
    try {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.error("Speech Recognition API not supported in this browser.");
        alert("Speech Recognition is not supported in this browser.");
        return;
      }

      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;

        if (transcript) {
          setUserInput(transcript);
        } else {
          console.warn("Empty transcript received.");
        }

        setIsListening(false);

        recognition.stop();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        recognition.stop();
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition failed:", error);
    }
  };

  useEffect(() => {
    const fetchAllUserData = async () => {
      const userId = getUserId();

      try {
        const [profile, education, experience, preference, skills] =
          await Promise.all([
            getProfile(),
            searchListDataFromTable("userEducation", { userId }),
            searchListDataFromTable("experience", { userId }),
            searchDataFromTable("userJobPreference", { userId }),
            searchDataFromTable("userPersonalInfo", { userId }),
          ]);

        const basic = profile?.data?.data;
        const eduArray = (education?.data?.data || []).map((entry: any) => ({
          academy: entry.academyName,
          degree: entry.degreeName,
          specialization: entry.specialization,
          startMonthYear: entry.startDate,
          endMonthYear: entry.endDate,
        }));

        const expArray = (experience?.data?.data || []).map((entry: any) => ({
          jobTitle: entry.jobTitle,
          employmentType: entry.employmentType,
          noticePeriod: entry.noticePeriod,
          current: entry.isCurrentlyWorking,
          years: entry.duration,
          company: entry.jobProviderName,
        }));

        const jobPref = {
          location: preference?.data?.data?.preferedLocation,
          shift: preference?.data?.data?.preferedShipt,
          workplace: preference?.data?.data?.workplace,
          employmentType: preference?.data?.data?.employmentType,
        };

        const skillList = Array.isArray(skills?.data?.data?.skills)
          ? skills.data.data.skills
          : [];

        setCurrentUser({
          ...basic,
          education: eduArray,
          experience: expArray,
          preference: jobPref,
          skills: skillList,
        });
      } catch (err) {
        console.error("Failed fetching user data:", err);
      }
    };

    fetchAllUserData();
  }, []);

  const handleUserSubmit = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const fullPrompt = getConversationPrompt({
      conversationContext: [...conversationContext, userSummary],
      userInput,
      currentUser,
    });
    // console.log(fullPrompt)

    try {
      const res = await getUserAnswerFromAi({ question: fullPrompt });
      const aiText =
        res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setConversationContext((prev) => [
        ...prev,
        `Candidate: ${userInput}`,
        `AI: ${aiText}`,
      ]);

      // console.log(conversationContext);
      setUserInput("");
      await speakText(aiText);

      const finalJsonPrompt = getFinalJsonPrompt(conversationContext);

      if (
        aiText.toLowerCase().includes("you’re all set to do great") ||
        aiText.toLowerCase().includes("let’s go crush")
      ) {
        try {
          setAiLoading(true);
          const res = await getUserAnswerFromAi({
            question: finalJsonPrompt,
          });

          const jsonString =
            res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          console.log("Final Captured Data:", jsonString);

          const cleanJsonString = jsonString
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          const parsedJson = JSON.parse(cleanJsonString);
          setFinalUserData(parsedJson);
          console.log("Final Captured Data:", parsedJson);

          const userId = getUserId();

          if (parsedJson.basicDetails) {
            const languagesArray = parsedJson.basicDetails.languages
              ?.split(",")
              .map((lang: string) => lang.trim())
              .filter(Boolean);

            const dobInIST = parsedJson.basicDetails.dob
              ? dayjs
                  .utc(dayjs(parsedJson.basicDetails.dob).format("YYYY-MM-DD"))
                  .toISOString()
              : null;

            const payload = {
              userId,
              dob: dobInIST,
              languagesKnown: languagesArray,
              about: parsedJson.basicDetails.about || "",
            };

            console.log("userPersonalInfo payload:", payload);
            await syncDataInTable("userPersonalInfo", payload, "userId");
          }

          if (parsedJson.preference) {
            const payload = {
              userId,
              preferedLocation: parsedJson.preference.location || "",
              preferedShipt: parsedJson.preference.shift || "",
              workplace: parsedJson.preference.workplace || "",
              employmentType: parsedJson.preference.employmentType || "",
            };

            console.log("userJobPreference payload:", payload);
            await syncDataInTable("userJobPreference", payload, "userId");
          }

          for (const edu of parsedJson.education || []) {
            const {
              academy,
              degree,
              specialization,
              startMonthYear,
              endMonthYear,
            } = edu;

            const payload = {
              userId,
              academyName: academy,
              degreeName: degree,
              specialization: specialization || "",
              startDate: startMonthYear || dayjs(),
              endDate: endMonthYear || dayjs(),
            };

            console.log("userEducation payload:", payload);
            await syncDataInTable("userEducation", payload, "userId");
          }

          for (const exp of parsedJson.experience || []) {
            const {
              jobTitle,
              company,
              years,
              employmentType,
              current,
              noticePeriod,
            } = exp;

            if (!jobTitle || !company) continue;

            const payload = {
              userId,
              jobTitle: jobTitle,
              jobProviderName: company,
              duration: years || "",
              employmentType: employmentType || "",
              isCurrentlyWorking: current ?? false,
              noticePeriod: noticePeriod || "",

              aStartDate: "Tue, 08 Jul 2025 07:22:30 GMT",
              aEndDate: "Tue, 08 Jul 2025 07:22:30 GMT",
              city: "example",
              state: "example",
              country: "example",
              categoryId: 1,
              subCategoryId: 1,
            };

            console.log("experience payload:", payload);
            await syncDataInTable("experience", payload, "userId");
          }

          if (parsedJson.skills?.skills) {
            const skillsArray = parsedJson.skills.skills
              .split(",")
              .map((s: string) => s)
              .filter(Boolean);

            if (skillsArray.length > 0) {
              const payload = {
                userId,
                skills: skillsArray,
              };

              console.log("skills payload (userPersonalInfo):", payload);
              await syncDataInTable("userPersonalInfo", payload, "userId");
            }
          }

          onConversationComplete?.();
        } catch (err) {
          onConversationComplete?.();
          console.error("Failed to fetch or parse final AI data:", err);
        }
      }
    } catch (err) {
      console.error("AI follow-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 0) {
      const intro = `Hey ${currentUser?.userPersonalInfo?.firstName}! I’ll be your friendly guide before the interview. Let’s start with something simple. Tell me a bit about yourself?`;
      setConversationContext([`${intro}`]);
      speakText(intro);
    }
  }, [step]);

  const [showDelayMessage, setShowDelayMessage] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (aiLoading) {
      timer = setTimeout(() => {
        setShowDelayMessage(true);
      }, 5000);
    } else {
      setShowDelayMessage(false);
      if (timer) clearTimeout(timer);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [aiLoading]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.21)",
        backdropFilter: "blur(4px)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              width: { xs: "90vw", sm: "600px" },
              maxHeight: "80vh",
              overflowY: "auto",
              p: 4,
              borderRadius: 4,
              background: color.background2,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              boxShadow: "0 8px 32px 0 rgba(11, 14, 48, 0.37)",
            }}
          >
            {step === -1 && (
              <>
                <Typography variant="h4" align="center" mb={2}>
                  Welcome to your AI Companion
                </Typography>
                <Typography align="center" mb={4}>
                  You'll be asked a series of friendly questions to help get
                  into the interview.
                </Typography>
                <Box textAlign="center">
                  <BeyondResumeButton
                    variant="contained"
                    onClick={() => setStep(0)}
                  >
                    Start
                  </BeyondResumeButton>
                </Box>
              </>
            )}

            {step === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {conversationContext.at(-1)?.replace("AI: ", "")}
                </Typography>

                <BeyondResumeButton
                  variant="outlined"
                  onClick={startRecording}
                  disabled={isSpeaking || loading}
                  sx={{ m: "auto", display: "block", my: 4, mt: 3 }}
                >
                  {isListening ? "Listening..." : "Speak your answer"}
                </BeyondResumeButton>
                {userInput.trim() && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="textField"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        sx={{
                          ...commonFormTextFieldSx,
                          mb: 3,
                          borderRadius: "12px",
                          transition: "all 0.3s",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  mt={3}
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  {!aiLoading ? (
                    <BeyondResumeButton
                      variant="contained"
                      onClick={handleUserSubmit}
                      disabled={!userInput.trim() || loading}
                    >
                      Send{" "}
                      <FontAwesomeIcon
                        style={{ marginLeft: "4px" }}
                        icon={faPaperPlane}
                      />
                    </BeyondResumeButton>
                  ) : (
                    <>
                      <BeyondResumeButton variant="contained">
                        Analyzing...{" "}
                        <CircularProgress
                          color="inherit"
                          style={{ marginLeft: "4px" }}
                          size={18}
                        />
                      </BeyondResumeButton>
                    </>
                  )}
                </Box>

                {showDelayMessage && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign={"center"}
                    mt={1}
                  >
                    Hang on while we analyze your data. This may take a while or
                    be delayed due to slow network.
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AIProfileInterview;

const summarizeKnownUserData = (user: any): string => {
  if (!user) return "";

  const parts: string[] = [];

  const { userPersonalInfo, education, experience, preference, skills } = user;

  const name = `${userPersonalInfo?.firstName || ""} ${
    userPersonalInfo?.lastName || ""
  }`.trim();
  if (userPersonalInfo?.dob) parts.push(`- DOB: ${userPersonalInfo.dob}`);
  if (userPersonalInfo?.gender?.gender)
    parts.push(`- Gender: ${userPersonalInfo.gender.gender}`);
  if (Array.isArray(userPersonalInfo?.languagesKnown))
    parts.push(`- Languages: ${userPersonalInfo.languagesKnown.join(", ")}`);
  if (userPersonalInfo?.about) parts.push(`- About: ${userPersonalInfo.about}`);

  if (Array.isArray(education) && education.length > 0) {
    const edu = education[0];
    parts.push(
      `- Education: ${edu.degree} in ${edu.specialization} from ${edu.academy} (${edu.startMonthYear} – ${edu.endMonthYear})`
    );
  }

  if (Array.isArray(experience) && experience.length > 0) {
    const exp = experience[0];
    parts.push(
      `- Work: ${exp.jobTitle} at ${exp.company} (${exp.years}), ${
        exp.current ? "currently working" : "previously"
      }`
    );
  }

  if (preference?.location || preference?.shift || preference?.workplace) {
    parts.push(
      `- Job Preference: ${[
        preference?.location,
        preference?.shift,
        preference?.workplace,
        preference?.employmentType,
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  if (Array.isArray(skills) && skills.length > 0) {
    parts.push(`- Skills: ${skills.join(", ")}`);
  }

  return `\n\nKnown background info about the candidate ${
    name ? `"${name}"` : ""
  }:\n${parts.join("\n")}\n\nUse this info to personalize your conversation.`;
};

const getConversationPrompt = ({
  conversationContext,
  userInput,
  currentUser,
}: {
  conversationContext: string[];
  userInput: string;
  currentUser: any;
}) => `
You are a warm, friendly, and encouraging AI companion supporting a candidate named ${
  currentUser?.userPersonalInfo?.firstName
} as they prepare for their upcoming job interview.

Your Mission:
- Help them feel relaxed, confident, and mentally ready.
- Keep the tone conversational — like a kind guide breaking the ice before an interview.
- Reassure and connect through light, casual small talk.
- Casually explore or confirm basic personal and professional info — even if you already know it — as part of natural flow.

These are the fields and info we need to gather from the candidate
1. **Basic Info**  
   - Age (e.g., “How long have you been out of college?”)  
   - Gender (mention only if naturally brought up)  
   - Languages spoken  
   - A little “about them” (e.g., hobbies, mindset, personality)

2. **Education**  
   - Degree and specialization  
   - College/institute name  
   - Start and end year

3. **Experience**  
   - Current or past job roles  
   - Company name(s)  
   - Years of experience  
   - Whether they’re currently working  
   - If applicable, their notice period

4. **Job Preference**  
   - Desired location  
   - Preferred work hours or shift (e.g., day/night)  
   - Remote, hybrid, or onsite preference  
   - Type of employment (e.g., full-time, part-time, contract)

5. **Skills**  
   - Tools or technologies they enjoy using  
   - Areas they feel confident or strong in

Do not list these like a form — just explore them casually as part of your flow.

User Known Info Subtly:
You may already know some details (education, job preference, skills, etc). Use them *naturally* in your responses or questions.

Tone & Style:
- Supportive, calm, slightly casual yet professional.
- Speak like a thoughtful human — not robotic or scripted.
- Avoid formal or structured interview questions.
- Use soft transitions to keep it flowing smoothly.

Wrap-Up:
When only you've touched all the above mentioned fields and the conversation feels complete:
- End with a motivational, friendly line that clearly and naturally wraps up the exchange.
- This closing line must end with the exact phrase: “you’re all set to do great” (maintaining this exact fontcase)..
- Do not use the phrase “you’re all set to do great” anywhere before the final line.
- Do not include any questions in the final line or after it. The wrap-up should feel complete and confident.

Important:
- Never ask for info using labels like “What is your date of birth?” instaed ask the same question more humanly.
- Don’t copy sample lines — use them as tone/style guides.
- Think of it like a light, encouraging pre-interview warm-up — not a form.
- Do NOT include internal reasoning or notes in the response.
- Only output the message intended for the user — no explanations or decision comments.

**Conversation so far:**
${conversationContext.join("\n")}

**Candidate’s latest message:**
${userInput}

Now respond with:
- A short, natural follow-up (it should under 30 words) **if more conversation is needed**, OR
- A warm, motivational closing line if everything feels covered which will include “you’re all set to do great”.

**Only one — never both.**
`;

const getFinalJsonPrompt = (conversationContext: string[]) => `
You’ve been having a warm-up conversation with a job candidate.

Your task:
Analyze the full conversation and extract all clearly shared, relevant information. Return the result as a clean, well-structured JSON object. DO NOT guess or fabricate data.

Only include fields that were **explicitly mentioned** by the candidate.

Expected JSON format:
{
  "basicDetails": {
    "dob": "string (date)",
    "gender": "string",
    "languages": "string",
    "about": "string",
  },
  "education": [
    {
      "academy": "string",
      "degree": "string",
      "specialization": "string",
      "startMonthYear": date (example: Thu, 10 Jul 2025 06:59:39 GMT),
      "endMonthYear": "date (example: Thu, 10 Jul 2025 06:59:39 GMT),
    }
  ],
  "experience": [
    {
      "jobTitle": "string",
      "company": "string",
      "years": "string",
      "employmentType": "string",
      "current": "boolean",
      "noticePeriod": "string"
    }
  ],
  "preference": {
    "location": "string",
    "shift": "string",
    "workplace": "string",
    "employmentType": "string"
  },
  "skills": {
    "skills": "string"
  }
}

Rules:
1. Compare the **existing data** with the newly captured data.
2. Only update if the new data is clearly better or more complete.
3. If values differ only by spelling (e.g., "Onsite" vs "on site"), keep the **correct and valid version**.
4. For fields like shift, workplace, and employmentType — use only exact values from these enums:

\`\`\`ts
const employmentType = [
  "Full-Time",
  "Part-Time",
  "Temporary",
  "Freelance",
  "Internship"
];
const workplace = ["Hybrid", "Onsite", "Work From Home"];
const shift = ["Day", "Night", "Flexible"];
\`\`\`

Return:
- **Only** the final merged JSON object.
- No additional explanation, description, or formatting.

Conversation:
${conversationContext.join("\n")}
`;
