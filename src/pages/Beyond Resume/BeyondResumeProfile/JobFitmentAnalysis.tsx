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

import { useLocation } from "react-router";
import {
  extractCleanFileName,
  safeParseAiJson,
} from "../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import FileUpload from "../Beyond Resume Components/FileUpload";

interface JobFitmentPageProps {
  jobId: string;
}

const JobFitmentPage: React.FC<JobFitmentPageProps> = ({ jobId }) => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<File | string | null>(null);
  const [fitmentSummary, setFitmentSummary] = useState<string>("");
  const [fitmentDetail, setFitmentDetail] = useState<string>("");
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

      const resumeText = response?.data?.data;

      const prompt = `
You are an AI career fitment evaluator. Given a job description and a resume link, return a JSON object with the following structure only:

{
  "summary": "<short fitment summary in HTML>",
  "detail": "<detailed gap analysis, gap resolution resources, timeline and 30-day action plan, all in HTML>"
}

- The response should be in the exact valid json format only as mentioned above. 

Important:
•⁠  ⁠Only return the JSON. No commentary, explanation, or markdown backticks.
•⁠  ⁠For Summary HTML use 3 different categories such as green tick for meets fitment, dark yellow tilde for partial meet and red cross for no fitment. Add colour elements so that overall summary looks good
•⁠  ⁠For detailed HTML  keep three distinct sections 1. GAPs and its explanations, 2. Gaps and the resources where I can upskill myself 3. My GAP bridging planning with mile stones 
•⁠  ⁠Make sure both "summary" and "detail" fields contain valid HTML (headings, tables, lists) along with Green, Yellow and red colour styles to distinguish between fully fits, partial fit and no fit.
•⁠  ⁠Do not wrap the response in \⁠ \ ⁠\` or include text like "Here's the result:"
•⁠  ⁠Avoid writing any greeting or closing statement.


Here is the job description:
${jobDescription}

${resumeLink ? `Here is the resume Text: ${resumeText}` : ""}
`.replace(/\s+/g, " ");

      const res = await getUserAnswerFromAi({ question: prompt });
      const rawText =
        res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      const parsed = safeParseAiJson(rawText);
      if (parsed) {
        setFitmentSummary(parsed.summary);
        setFitmentDetail(parsed.detail);

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
          {fitmentSummary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography variant="h5" mt={4}>
                Quick Summary
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  mt: 2,
                  borderRadius: 4,
                  background: "transparent",
                  color: "inherit",
                  fontFamily: "montserrat-regular",
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
              <Typography variant="h5" mt={4}>
                Detailed Gap Plan
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  py: 1,
                  mt: 2,
                  borderRadius: 4,
                  background: "transparent",
                  color: "inherit",
                  fontFamily: "montserrat-regular",
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
