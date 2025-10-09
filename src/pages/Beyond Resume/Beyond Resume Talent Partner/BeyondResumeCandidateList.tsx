import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import PaginationControlled from "../../../components/shared/Pagination";
import {
  CustomToggleButton1,
  CustomToggleButtonGroup1,
  generateInterviewReportExcel,
} from "../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import {
  paginateDataFromTable,
  searchDataFromTable,
} from "../../../services/services";
import color from "../../../theme/color";
import AssessedApplicants from "../Beyond Resume Components/AssessedApplicants";
import MultiRoundApplicantsTabs from "../Beyond Resume Components/MultiRoundApplicantsTabs";
import PendingAssessmentApplicants from "../Beyond Resume Components/PendingAssessmentApplicants";
type LocationState = {
  jobId: string;
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

const BeyondResumeCandidateList = () => {
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<InterviewData[]>([]);

  const [reload, setReload] = useState(false);
  const location = useLocation<LocationState>();
  const brJobId = location?.state?.jobId;
  const [jobData, setJobData] = useState<any>({});


  useEffect(() => {
    setLoading(true);

    searchDataFromTable("brJobs", {
      // brJobApplicantStatus: "CONFIRMED",
      brJobId: brJobId,
    }).then((result: any) => {
      setJobData(result.data.data);
      // console.log(result);
    });

    paginateDataFromTable("brJobApplicant", {
      page: page - 1,
      pageSize: 12,
      data: {
        // brJobApplicantStatus: "CONFIRMED",
        brJobId: brJobId,
        filter: "",
        fields: [],
      },
    }).then((result: any) => {
      setTotalCount(result?.data?.data?.count);

      const rows = result?.data?.data?.rows || [];
      // console.log(rows);
      setData(rows);

      const levelOrder = ["complex", "advance", "intermediate", "beginner"];

      const groupedByLevel: any = {};

      levelOrder.forEach((level) => {
        groupedByLevel[level] = [];
      });

      rows.forEach((item: any) => {
        const level = item.brInterviewLevel || "beginner";
        if (!groupedByLevel[level]) {
          groupedByLevel[level] = [];
        }
        groupedByLevel[level].push(item);
      });

      for (const level in groupedByLevel) {
        groupedByLevel[level].sort((a: any, b: any) => b.score - a.score);
      }

      setInterviewList(groupedByLevel);
      setLoading(false);
    });
  }, [page, reload, brJobId]);

  const history = useHistory();

  const [activeTab, setActiveTab] = useState<
    "SUGGESTED" | "ASSESSED" | "PENDING ASSESSMENT"
  >("ASSESSED");

  type TabKey = "SUGGESTED" | "ASSESSED" | "PENDING ASSESSMENT";

  interface TabConfig {
    key: TabKey;
    label: string;
    color: string;
    count: (
      matchingUsers: any[],
      selectedJob: any,
      statusCountsMap: Record<string, any>
    ) => number;
  }

  const tabs: TabConfig[] = [
    {
      key: "ASSESSED",
      label: "Assessed Candidates",
      color: "#16a34a",
      count: (_, selectedJob, statusCountsMap) =>
        statusCountsMap[selectedJob.brJobId]?.find(
          (s: any) => s.label === "ASSESSED"
        )?.count ?? 0,
    },
    {
      key: "PENDING ASSESSMENT",
      label: "Pending Assessment",
      color: "#f97316",
      count: (_, selectedJob, statusCountsMap) =>
        statusCountsMap[selectedJob.brJobId]?.find(
          (s: any) => s.label === "PENDING ASSESSMENT"
        )?.count ?? 0,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* <Typography
        variant="h5"
        sx={{
          fontFamily: "Custom-Bold",
          width: "fit-content",
          p: 4,
          pb: 2,
          borderRadius: "12px",
          textAlign: "center",
          m: "auto",
          lineHeight: 1,
          textDecoration:'underline'
        }}
      >
        Candidate List
      </Typography> */}

      {data.length > 0 && (
        <BeyondResumeButton
          sx={{
            mt: 4,
            position: "absolute",
            top: { xs: 80, md: 10 },
            right: 30,
            fontSize: "14px",
          }}
          onClick={() => generateInterviewReportExcel(data)}
        >
          Export Report
          <FontAwesomeIcon
            style={{ marginLeft: "8px" }}
            icon={faFileExcel}
          ></FontAwesomeIcon>
        </BeyondResumeButton>
      )}

      {jobData?.roundType === "multiple" ? (
        <MultiRoundApplicantsTabs jobId={brJobId} />
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            justifyContent="center"
            gap={2}
            mb={2}
            p={2}
          >
            {tabs.map(({ key, label, count }) => {
              const isActive = activeTab === key;
              return (
                <Box
                  key={key}
                  onClick={() => setActiveTab(key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    background: isActive ? color.activeButtonBg : "grey",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.8,
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  {label}

                  {/* <span
                                    style={{
                                      background: "rgba(255, 255, 255, 0.2)",
                                      padding: "0px 8px",
                                      paddingBottom: "6px",
                                      borderRadius: "44px",
                                      marginLeft: "6px",
                                      // width:'8px',
                                      height: "16px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {count(
                                      matchingUsers,
                                      selectedJob,
                                      statusCountsMap
                                    )}
                                  </span> */}
                </Box>
              );
            })}
          </Box>

          {activeTab === "PENDING ASSESSMENT" ? (
            <PendingAssessmentApplicants brJobId={brJobId} color={color} />
          ) : (
            <AssessedApplicants brJobId={brJobId} color={color} />
          )}
        </>
      )}

      <Box sx={{ ml: "auto" }}>
        {interviewList.length !== 0 ? (
          <PaginationControlled
            page={page}
            setPage={setPage}
            count={totalCount}
          ></PaginationControlled>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default BeyondResumeCandidateList;
