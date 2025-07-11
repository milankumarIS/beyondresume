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

import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router";
import {
  BeyondResumeButton,
  BlobAnimation,
} from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import {
  extractCleanFileName,
  safeParseAiJson,
} from "../../../components/util/CommonFunctions";

interface RouteParams {
  jobId: string;
}

const JobFitmentPage: React.FC = () => {
  const location = useLocation<RouteParams>();
  const jobId = location?.state?.jobId;
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<File | string | null>(null);
  const [fitmentSummary, setFitmentSummary] = useState<string>("");
  const [fitmentDetail, setFitmentDetail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [jobsData, setJobsData] = useState<any>([]);
  const [jdLoading, setJdLoading] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    getProfile().then((result: any) => {
      const data = result?.data?.data;
      setCurrentUser(data);
      setResume(data?.userPersonalInfo?.resumeFile || "");
    });
  }, [jobId]);

  useEffect(() => {
    const fetchJD = async () => {
      try {
        setJdLoading(true);
        const result: any = await searchListDataFromTable("brJobs", {
          brJobId: jobId,
        });
        setJobsData(result?.data?.data[0]);
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
        setJdLoading(false);
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
        `Here I'm attaching a job description link. From the linked PDF, extract the text and give the response in plain innerHTML.`.replace(/\s+/g, " ");

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

Important:
•⁠  ⁠Only return the JSON. No commentary, explanation, or markdown backticks.
•⁠  ⁠For Summary HTML use 3 different categories such as green tick for meets fitment, yellow tilde for partial meet and red cross for no fitment. Add colour elements so that overall summary looks good
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

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight
      );
      const height = textRef.current.scrollHeight;
      if (height > lineHeight * 10) {
        setShowToggle(true);
      }
    }
  }, [jobDescription]);

  return (
    <Box
      sx={{
        p: 4,
        background: color.background2,
        position: "relative",
        overflow: "hidden",
        minHeight: "90vh",
        color: "white",
      }}
    >
      {/* <Typography variant="h4"  gutterBottom>
        Fitment Analysis
      </Typography> */}

      <BlobAnimation />

      {jdLoading ? (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="newtons-cradle">
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
          </div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Box position={"relative"}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              color: "white",
              width: "fit-content",
              p: 2,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
              mx: "auto",
            }}
          >
            {jobsData?.jobTitle} Fitment Analysis
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <Typography
                mb={2}
                border={"solid 1px"}
                width={"fit-content"}
                borderRadius={2}
                px={1.5}
                py={0.5}
                fontSize={"14px"}
                sx={{
                  background: color.background2,
                }}
              >
                Job Description:
              </Typography>
              <Box
                sx={{
                  border: "solid 1px white",

                  borderRadius: 4,
                  p: 2,
                  pt: 0,
                  pb: 1,
                  mb: 4,
                  background: color.background2,
                }}
              >
                <Typography
                  ref={textRef}
                  sx={{
                    fontSize: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: expanded ? "unset" : 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  component="div"
                  dangerouslySetInnerHTML={{
                    __html: jobDescription,
                  }}
                />

                {showToggle && (
                  <BeyondResumeButton
                    variant="outlined"
                    size="small"
                    onClick={() => setExpanded((prev) => !prev)}
                    sx={{
                      background: "transparent",
                      borderColor: "white",
                      ml: "auto",
                      display: "flex",
                      gap: 2,
                      width: "fit-content",
                      my: 1,
                      mt: 2,
                      fontSize: "10px",
                    }}
                  >
                    {expanded ? "Show Less" : "Show More"}
                    {!expanded ? (
                      <FontAwesomeIcon icon={faChevronCircleDown} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronCircleUp} />
                    )}
                  </BeyondResumeButton>
                )}
              </Box>
              <Box
                sx={{
                  background: color.background2,
                  border: "solid 1px white",
                  p: 4,
                  borderRadius: "12px",
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  margin: "auto",
                }}
                component="label"
              >
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResume(file); // resume now becomes a File
                    }
                  }}
                />

                {!resume && (
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "white",
                      fontSize: "14px",
                      px: 2,
                    }}
                  >
                    Drag and drop file or click To Upload PDF • Max file size
                    2MB
                  </Typography>
                )}

                {resume && (
                  <Typography
                    sx={{
                      color: "white",
                      p: 1,
                      px: 4,
                      borderRadius: "44px",
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {typeof resume === "string"
                      ? extractCleanFileName(resume)
                      : resume.name}
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{
                    background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
                    color: "white",
                    p: 1,
                    px: 4,
                    borderRadius: "44px",
                  }}
                >
                  Upload Your Resume
                </Typography>
              </Box>

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
                  sx={{ p: 2, py: 1, mt: 2 }}
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
                  sx={{ p: 2, mt: 2 }}
                  dangerouslySetInnerHTML={{ __html: fitmentDetail }}
                />
              </motion.div>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JobFitmentPage;
