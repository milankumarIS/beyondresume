import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  getProfile,
  getUserAnswerFromAi,
  getUserAnswerFromAiThroughPdf,
  searchListDataFromTable,
  UploadAuthFile,
} from "../../../services/services";

import { safeParseAiJson } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  StyledTypography,
} from "../../../components/util/CommonStyle";
import FileUpload from "../Beyond Resume Components/FileUpload";

interface JobFitmentPageProps {
  jobId: string;
}

const JobFitmentPage: React.FC<JobFitmentPageProps> = ({ jobId }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<File | string | null>(null);
  const [fitmentSummary, setFitmentSummary] = useState<string>("");
  const [fitmentDetail, setFitmentDetail] = useState<string>("");
  const [fitmentPercentage, setFitmentPercentage] = useState<string>("");
  const [recommendation, setRecommendation] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile().then((result: any) => {
      const data = result?.data?.data;
      setResume(data?.userPersonalInfo?.resumeFile || "");
    });
  }, [jobId]);

  useEffect(() => {
    const fetchJD = async () => {
      try {
        const result: any = await searchListDataFromTable("brJobs", {
          brJobId: jobId,
        });
        const jd = result?.data?.data?.[0]?.jobDescriptions;
        if (!jd) {
          console.warn("No job description found");
          return;
        }

        const cleanedResponse = jd.replace(/^```html\s*|\s*```$/g, "").trim();
        const cleaned = cleanedResponse
          .replace(/<p><br><\/p>/g, "")
          .replace(/<p>\s*<\/p>/g, "");
        setJobDescription(cleaned);
      } catch (err) {
        console.error("Error fetching job description", err);
      } finally {
      }
    };

    if (jobId) fetchJD();
    else console.warn("No jobId found in location.state or params");
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resumeLink: string | null = null;

      if (resume instanceof File) {
        const formData = new FormData();
        formData.append("file", resume);
        const result = await UploadAuthFile(formData);
        e;

        resumeLink = result?.data?.data?.location;
        if (!resumeLink)
          throw new Error("Resume upload failed. No link returned.");
      } else if (typeof resume === "string" && resume.length > 0) {
        resumeLink = resume;
      }

      const prompt1 =
        `Here I'm attaching a job description link. From the linked PDF, extract the text and give the response in plain innerHTML.`.replace(
          /\s+/g,
          " "
        );

      const response = await getUserAnswerFromAiThroughPdf({
        question: prompt1,
        urls: [resumeLink],
      });
      console.log(response);
      const resumeText = response?.data?.data?.candidates[0]?.content?.parts[0].text || "";


      console.log(resumeText);

      const prompt = `
You are an AI career fitment evaluator. Given a job description and a resume (text or link), return a **strictly valid JSON object** with the following structure only:

{
  "fitmentPercentage": "<numeric percentage string (e.g. '87%') showing how much the resume matches the JD, formatted in HTML>",
  "recommendations": "<Recommendation based on fitment logic below>",
  "summary": "<HTML summary with color-coded analysis — Green for fully matched, Yellow for partial match, Red for not matched>",
  "detail": "<Comprehensive HTML section broken into: 1. Gaps & Explanations, 2. Upskilling Resources, 3. GAP Bridging Plan with timeline>"
}

Important Output Guidelines:
- Only return the JSON. No explanations, markdown, or wrapping characters.
- The output must be well-formatted and **valid JSON**.

Recommendation Logic (Only one should apply):
- "Top Contender" → if fitmentPercentage ≥ 95% AND all mandatory requirements (education, certification, experience) are met
- "Close Contender" → if 85% ≤ fitmentPercentage < 95% AND all mandatory requirements are met
- "Average Candidacy" → if fitmentPercentage < 85% AND all mandatory requirements are met
- "Non Qualified Candidate" → if even one mandatory requirement is missing that cannot be quickly fulfilled

Summary Formatting:
- Present a color-coded summary using:
  - **Green Tick** for fully matched
  - **Yellow Tilde** for partial match
  - **Red Cross** for not matched
- Use clean, styled HTML list to make it visually scannable.

Detail Section Formatting (must be structured in HTML):
1. **Gaps & Explanations** — explain where the candidate falls short
2. **Upskilling Resources** — list recommended courses, certifications, platforms, etc.
3. **GAP Bridging Plan** — provide a timeline with specific  goals and milestones

Positive Tone for Disqualification:
- If candidate lacks **required academic qualifications** (e.g., BTech, Graduation), say:
  “You're currently not eligible to apply. Please pursue the necessary educational qualifications to become eligible.”
- If **certifications** (e.g., CISSP, PMP) are **explicitly mandatory**:
  - If missing: “Please obtain the required certification before applying.”
  - If optional: “You can still apply now, but getting certified will improve your profile.”
- If **domain experience** is missing:
  - If required: “You're currently not eligible. Gaining domain-specific experience is essential.”
  - If optional: “You can apply, but adding such experience will strengthen your fitment.”

Here is the job description:
${jobDescription}

${resumeLink ? `Here is the resume text: ${resumeText}` : ""}
`.replace(/\s+/g, " ");

      console.log(prompt);

      const res = await getUserAnswerFromAi({ question: prompt });

      console.log(res);
      

      const rawText =
        res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      const parsed = safeParseAiJson(rawText);

      // console.log(parsed);

      if (parsed) {
        setFitmentPercentage(parsed.fitmentPercentage || "");
        setRecommendation(parsed.recommendations || "");
        setFitmentSummary(parsed.summary || "");
        setFitmentDetail(parsed.detail || "");

        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      } else {
        console.error("Unable to parse AI response into JSON");
      }
    } catch (err) {
      console.error("Fitment analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight
      );
      const height = textRef.current.scrollHeight;
      if (height > lineHeight * 10) {
      }
    }
  }, [jobDescription]);

  const size = 120;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "90vh",
        p: 2,
        pt: 0,
      }}
    >
      <Typography
        mb={2}
        sx={{
          fontSize: "26px",
        }}
      >
        Fitment Analysis
      </Typography>

      <Box position={"relative"}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            <FileUpload
              questionFile={resume}
              setQuestionFile={(file) => setResume(file)}
              acceptFormat=".pdf"
              showFileNameOnly={true}
              changeLabel={"Upload Another Resume"}
            />

            {resume && (
              <Box mt={3}>
                <BeyondResumeButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mx: "auto",
                    display: "block",
                    width: "100%",
                    mt: 6,
                  }}
                >
                  {loading ? (
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      color={"white"}
                      gap={2}
                    >
                      Analyzing{" "}
                      <CircularProgress sx={{ color: "white" }} size={18} />
                    </Box>
                  ) : (
                    "Run Fitment Analysis"
                  )}
                </BeyondResumeButton>
              </Box>
            )}
          </form>
        </motion.div>

        <Box ref={resultRef}>
          {fitmentPercentage &&
            (() => {
              const extractPercentage = (text: string): number => {
                const match = text.match(/(\d+(?:\.\d+)?)/);
                return match ? parseFloat(match[1]) : 0;
              };

              const matchPercent = extractPercentage(fitmentPercentage);
              const color =
                matchPercent >= 70
                  ? "green"
                  : matchPercent >= 40
                  ? "orange"
                  : "red";

              return (
                <Box position={"relative"} width={"fit-content"} mt={4}>
                  {/* <Typography  mb={2}>
                    Fitment Percentage
                  </Typography> */}

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ position: "relative", width: "fit-content" }}>
                      <svg width={size} height={size}>
                        <circle
                          stroke="#2A2D3E"
                          fill="transparent"
                          strokeWidth={strokeWidth}
                          r={radius}
                          cx={size / 2}
                          cy={size / 2}
                        />
                        <circle
                          stroke={color}
                          fill="transparent"
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={
                            circumference * (1 - matchPercent / 100)
                          }
                          r={radius}
                          cx={size / 2}
                          cy={size / 2}
                          transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                      </svg>

                      <Typography
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translate(-50%, 0%)",
                          width: size,
                          height: size,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {matchPercent}%
                      </Typography>
                    </div>

                    <Typography>
                      You're {matchPercent}% fit and a{" "}
                     <span style={{fontFamily:'custom-bold', color:color}}> {recommendation} </span> for the job
                    </Typography>

                    {/* {recommendation && (
            <StyledTypography
              sx={{
                display: "-webkit-box",
              }}
              dangerouslySetInnerHTML={{
                __html: recommendation,
              }}
            />
          )} */}
                  </Box>
                </Box>
              );
            })()}

          {fitmentSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* <Typography variant="h5" mt={4}>
                Quick Summary
              </Typography> */}
              <Paper
                elevation={2}
                sx={{
                  mt: 0,
                  borderRadius: 4,
                  background: "transparent",
                  color: "inherit",
                  fontFamily: "montserrat-regular",
                  boxShadow: "none",
                }}
                dangerouslySetInnerHTML={{ __html: fitmentSummary }}
              />

             
            </motion.div>
          )}

          {fitmentDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* <Typography variant="h5" mt={4}>
                Detailed Gap Plan
              </Typography> */}
              <Paper
                elevation={2}
                sx={{
                  py: 1,
                  mt: 2,
                  borderRadius: 4,
                  background: "transparent",
                  color: "inherit",
                  fontFamily: "montserrat-regular",
                  boxShadow: "none",
                }}
                dangerouslySetInnerHTML={{ __html: fitmentDetail }}
              />
            </motion.div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default JobFitmentPage;
