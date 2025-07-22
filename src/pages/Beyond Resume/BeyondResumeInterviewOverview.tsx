import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { searchListDataFromTable } from "../../services/services";
import BeyondResumeInterviewOverviewQA from "./Beyond Resume Components/BeyondResumeInterviewOverviewQA";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import { generateInterviewReportExcel } from "../../components/util/CommonFunctions";
import color from "../../theme/color";

type Question = {
  isCorrect: boolean;
  userAnswer?: string;
};

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
      // console.log(result?.data?.data[0]);
      setLoading(false);
    });
  }, [type, id]);

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

  const groupedQuestions = data.interviewQuestionAnswer.reduce(
    (acc: Record<string, QuestionItem[]>, curr) => {
      if (!acc[curr.categoryName]) acc[curr.categoryName] = [];
      acc[curr.categoryName].push(curr);
      return acc;
    },
    {}
  );

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

      <BeyondResumeButton
        sx={{
          mt: 4,
          position: "absolute",
          top: 10,
          right: 30,
        }}
        onClick={() => generateInterviewReportExcel(data)}
      >
        Export Report 
        <FontAwesomeIcon
          style={{ marginLeft: "8px" }}
          icon={faFileExcel}
        ></FontAwesomeIcon>
      </BeyondResumeButton>

      {/* <Box >
      {data?.companyName && (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "flex-start",
                mt: 4,
              }}
            >
              <FontAwesomeIcon
                style={{
                  height: "40px",
                  background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                  padding: "6px",
                  borderRadius: "4px",
                  // border: "solid 1px white",
                }}
                icon={faBuilding}
              ></FontAwesomeIcon>
              <div style={{ textAlign: "left" }}>
                <Typography variant="h5" fontWeight="bold">{data?.companyName}</Typography>
                <Typography
                  sx={{
                    fontFamily: "Montserrat-Regular",
                  }}
                  mt={0}
                >
                  {data?.jobTitle}
                </Typography>
              </div>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                // width: "90%",
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Montserrat-Regular",
                  width: "50%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FontAwesomeIcon icon={faLocationDot} />
                {data?.location}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Montserrat-Regular",
                  width: "50%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                <FontAwesomeIcon icon={faBriefcase} />
                {data?.jobType}
              </Typography>
            </Box>
          </>
        )}
      </Box> */}

      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          mt: 4,
          p: type === "candidateResult" ? 2 : 0,
          px: 4,
          flexDirection: type === "candidateResult" ? "row-reverse" : "row",
          justifyContent:
            type === "candidateResult" ? "space-between" : "-moz-initial",
          background:
            type === "candidateResult"
              ? color.cardBg
              : "transparent",
          borderRadius: 4,
          border: type === "candidateResult" ? "solid 1px white" : "none",
        }}
      >
        <Box
          sx={{
            background: bgcolor,
            border: "solid 1px white",
            borderRadius: "999px",
            width: 120,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 35px 2px rgba(0, 0, 0, 0.32)",
          }}
        >
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold">
              {score}
            </Typography>
            <Typography variant="body2">of 100</Typography>
          </Box>
        </Box>
        {type !== "candidateResult" && (
          <Typography color="inherit" variant="h5">{remark}</Typography>
        )}
        {type === "candidateResult" && (
          <Box display={"flex"} flexDirection={"column"}>
            <Typography mb={1} variant="h6">
              Candidate Details
            </Typography>

            <Typography sx={{ fontFamily: "Montserrat-Regular" }}>
              Name: {""}
              {data.fullName}
            </Typography>
            <Typography sx={{ fontFamily: "Montserrat-Regular" }}>
              Phone: {""}
              {data.phone}
            </Typography>
            <Typography sx={{ fontFamily: "Montserrat-Regular" }}>
              E-mail: {""}
              {data.email}
            </Typography>
          </Box>
        )}
      </Box>

      {type === "candidateResult" ? (
        <Box
          sx={{
            background: bgcolor,
            border: "solid 1px white",
            p: 2,
            borderRadius: 4,
            mt: 4,
          }}
        >
          <Typography variant="h6">Overview</Typography>
          <Typography variant="body1" sx={{ fontFamily: "Montserrat-Regular" }}>
            {data.interviewOverview}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            background: color.cardBg,
            border: "solid 1px white",
            p: 2,
            borderRadius: 4,
            mt: 4,
          }}
        >
          <Typography variant="h6">Suggestion</Typography>
          <Typography variant="body1" sx={{ fontFamily: "Montserrat-Regular" }}>
            {data.interviewSuggestion}
          </Typography>
        </Box>
      )}

      <BeyondResumeInterviewOverviewQA groupedQuestions={groupedQuestions} />
    </Box>
  );
};

export default BeyondResumeInterviewOverview;

const getRemark = (score: number) => {
  if (score >= 85)
    return {
      remark: "Excellent",
      comparison: "You scored higher than 90% of the people.",
      bgcolor: "linear-gradient(0deg, #4CAF50, #81C784)",
    };
  if (score >= 70)
    return {
      remark: "Great",
      comparison: "You scored higher than 65% of the people.",
      bgcolor: "linear-gradient(0deg, #8BC34A, #AED581)",
    };
  if (score >= 50)
    return {
      remark: "Good",
      comparison: "You scored higher than 40% of the people.",
      bgcolor: "linear-gradient(0deg, #FFC107, #FFD54F)",
    };
  if (score >= 35)
    return {
      remark: "Fair",
      comparison: "You scored higher than 25% of the people.",
      bgcolor: "linear-gradient(0deg, #FF9800, #FFB74D)",
    };
  return {
    remark: "Needs Improvement",
    comparison: "Keep practicing to improve your score.",
    bgcolor: "linear-gradient(0deg, #F44336,rgb(186, 39, 39))",
  };
};
