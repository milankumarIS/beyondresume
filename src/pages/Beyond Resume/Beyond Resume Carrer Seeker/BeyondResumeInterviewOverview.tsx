import {
  faDownload,
  faEnvelope,
  faPhone,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  generateInterviewReportExcel,
  getFormattedDateKey,
} from "../../../components/util/CommonFunctions";
import {
  commonPillStyle,
  GradientFontAwesomeIcon,
} from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/util/ThemeContext";
import { searchListDataFromTable } from "../../../services/services";
import color from "../../../theme/color";
import BeyondResumeInterviewOverviewQA from "../Beyond Resume Components/BeyondResumeInterviewOverviewQA";
import HtmlToPdfViewer from "../Beyond Resume Components/HtmlToPdfViewer";

interface QuestionItem {
  categoryName: string;
  question: string;
  suggestedAnswer: string;
  AnswerKey: string;
  userAnswer: string;
  isCorrect?: boolean;
  score?: number;
  options?: { [key: string]: string }[];
}

interface InterviewData {
  interviewScore: number;
  interviewOverview: string;
  interviewSuggestion: string;
  location: string;
  jobType: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  previousCompany: string;
  linkedIn: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
  interviewVideo: string;
  examMode: string;
  generatedResume: string;
  generatedCoverLetter: string;
  interviewQuestionAnswer: QuestionItem[];
}

const BeyondResumeInterviewOverview = () => {
  const [data, setData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  useEffect(() => {
    const tableName = type === "practice" ? "brInterviews" : "brJobApplicant";
    const params =
      type === "practice" ? { brInterviewId: id } : { brJobApplicantId: id };

    searchListDataFromTable(tableName, params).then((result: any) => {
      setData(result?.data?.data[0]);
      console.log(result?.data?.data[0]);
      setLoading(false);
    });
  }, [type, id]);

  // console.log(data);

  if (loading || !data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          // background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        }}
      >
        <div className="newtons-cradle">
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
        </div>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Processing your Result
        </Typography>
      </Box>
    );
  }

  const score = data.interviewScore;
  const { remark, bgcolor } = getRemark(score);

  // console.log(Array.isArray(data.interviewQuestionAnswer), data.interviewQuestionAnswer);

  const parsedAnswers =
    typeof data.interviewQuestionAnswer === "string"
      ? JSON.parse(data.interviewQuestionAnswer)
      : data.interviewQuestionAnswer;

  const groupedQuestions = (
    Array.isArray(parsedAnswers) ? parsedAnswers : []
  ).reduce((acc: Record<string, QuestionItem[]>, curr) => {
    if (!acc[curr.categoryName]) acc[curr.categoryName] = [];
    acc[curr.categoryName].push(curr);
    return acc;
  }, {});

  const size = 140;
  const progress = score / 100;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        p: 4,
        // background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Typography
        sx={{
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          position: "relative",
          m: "auto",
          mb: 2,
        }}
        variant="h4"
      >
        Interview Summary
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          mt: 4,
          p: type === "candidateResult" ? 2 : 0,
          px: 0,
          flexDirection:
            type === "candidateResult" ? "row-reverse" : "row-reverse",
          justifyContent:
            type === "candidateResult" ? "space-between" : "-moz-initial",
          // background: type === "candidateResult" ? color.cardBg : "transparent",
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            width={"300px"}
            textAlign={"left"}
            sx={{
              borderRadius: 4,
              p: 2,
              background:
                theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
            }}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{
                color:
                  theme === "dark" ? color.titleColor : color.titleLightColor,
              }}
            >
              Interview Score
            </Typography>

            <Box
              sx={{
                m: "auto",
                mt: 2,
                position: "relative",
                width: size,
                height: size,
              }}
            >
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
                  stroke={bgcolor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
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
                  left: 0,
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
                {score}%
              </Typography>
            </Box>

            <Typography
              my={2}
              textAlign={"center"}
              onClick={() => generateInterviewReportExcel(data)}
              sx={{
                color:
                  theme === "dark" ? color.titleColor : color.titleLightColor,
                cursor: "pointer",
              }}
            >
              Download Report
              <FontAwesomeIcon
                style={{ marginLeft: "4px" }}
                icon={faDownload}
              ></FontAwesomeIcon>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            background:
              theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
            p: 2,
            borderRadius: 4,
          }}
        >
          {type !== "practice" && (
            <>
              {type === "candidateResult" ? (
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  sx={{
                    background:
                      theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
                    borderRadius: 4,
                    width: "fit-content",
                    mb: 1,
                  }}
                >
                  <Typography
                    mb={0.8}
                    variant="h5"
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      cursor: "pointer",
                      color:
                        theme === "dark"
                          ? color.titleColor
                          : color.titleLightColor,
                      pr: 3,
                    }}
                  >
                    <GradientFontAwesomeIcon size={18} icon={faUserTie} />{" "}
                    {data.fullName}
                  </Typography>

                  <Box display={"flex"} gap={1}>
                    <Typography
                      sx={{ ...commonPillStyle, pl: 0, fontSize: "14px" }}
                    >
                      <GradientFontAwesomeIcon size={14} icon={faEnvelope} />{" "}
                      {data.email}
                    </Typography>
                    <Typography
                      sx={{ ...commonPillStyle, pl: 0, fontSize: "14px" }}
                    >
                      <GradientFontAwesomeIcon size={14} icon={faPhone} />{" "}
                      {data.phone}
                    </Typography>
                  </Box>

                  {/* 
              <Typography
                fontSize={"14px"}
                mt={-0.5}
                sx={{ fontFamily: "Custom-Regular" }}
              >
                {data.email} <br />
                {data.phone}
              </Typography> */}
                </Box>
              ) : (
                <div>
                  <Typography
                    mb={0.5}
                    variant="h6"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      cursor: "pointer",
                      color:
                        theme === "dark"
                          ? color.titleColor
                          : color.titleLightColor,
                      pr: 3,
                    }}
                  >
                    {data.jobTitle} ({data.jobType})
                  </Typography>

                  <Typography
                    fontSize={"16px"}
                    mt={-0.5}
                    mb={0.5}
                    sx={{ fontFamily: "Custom-Regular" }}
                  >
                    {data.companyName}, {""}
                    {data.location}
                  </Typography>
                </div>
              )}
        

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography sx={{ ...commonPillStyle, pl: 0, fontSize: "14px" }}>
              Applied (on) {""}
              {getFormattedDateKey(data.createdAt)}
            </Typography>
          </Box>

              </>
          )}

          {/* {type !== "candidateResult" && (
          <Typography color="inherit" variant="h5">
            {remark}
          </Typography>
        )} */}

          {type === "candidateResult" ? (
            <Box
              sx={{
                background: bgcolor,
                // border: "solid 1px white",
                p: 2,
                borderRadius: 4,
                color: getTextColor(bgcolor),
                mt: 2,
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.38)",
              }}
            >
              <Typography fontSize={"16px"} variant="h6">
                Overview
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: "Montserrat-Regular" }}
              >
                {data.interviewOverview}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                border: "solid 1px",
                p: 2,
                py: 1,
                borderRadius: 4,
              }}
            >
              <Typography fontSize={"18px"} variant="h6">
                {" "}
                {remark}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: "Montserrat-Regular" }}
              >
                {data.interviewSuggestion}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <BeyondResumeInterviewOverviewQA
        examMode={data?.examMode}
        groupedQuestions={groupedQuestions}
      />

      {type === "candidateResult" && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-around",
            mt: 4,
            overflowX:'hidden'
          }}
        >
          <HtmlToPdfViewer
            heading={`${data.fullName}'s Resume`}
            htmlText={data?.generatedResume}
          />

          <HtmlToPdfViewer
            heading={`${data.fullName}'s Cover Letter`}
            htmlText={data?.generatedCoverLetter}
          />
        </Box>
      )}

      {data.interviewVideo && (
        <Box p={2}>
          <Typography variant="h6" mb={2}>
            Interview Video
          </Typography>
          <video
            controls
            autoPlay={false}
            style={{
              borderRadius: 8,
              width: "100%",
              maxWidth: "600px",
              aspectRatio: "16 / 9",
            }}
          >
            <source src={data.interviewVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
    </Box>
  );
};

export default BeyondResumeInterviewOverview;

const getRemark = (score: number) => {
  if (score >= 85)
    return {
      remark: "Excellent",
      comparison: "You scored higher than 90% of the people.",
      bgcolor: "#4CAF50",
    };
  if (score >= 70)
    return {
      remark: "Great",
      comparison: "You scored higher than 65% of the people.",
      bgcolor: "#8BC34A",
    };
  if (score >= 50)
    return {
      remark: "Good",
      comparison: "You scored higher than 40% of the people.",
      bgcolor: "#FFC107",
    };
  if (score >= 35)
    return {
      remark: "Fair",
      comparison: "You scored higher than 25% of the people.",
      bgcolor: "#FF9800",
    };
  return {
    remark: "Needs Improvement",
    comparison: "Keep practicing to improve your score.",
    bgcolor: "#F44336",
  };
};

const getTextColor = (bgcolor: string) => {
  switch (bgcolor) {
    case "#4CAF50": // Excellent (green - dark)
    case "#FF9800": // Fair (orange - dark)
    case "#F44336": // Needs Improvement (red - dark)
      return "white";

    case "#8BC34A": // Great (lime - medium)
    case "#FFC107": // Good (yellow - light)
      return "black";

    default:
      return "black";
  }
};
