import {
  faChevronCircleRight,
  faEnvelope,
  faFileExcel,
  faInfoCircle,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  Grid,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { JSX, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import PaginationControlled from "../../components/shared/Pagination";
import { generateInterviewReportExcel } from "../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import { paginateDataFromTable } from "../../services/services";
import color from "../../theme/color";
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
  const levelTooltips: Record<string, JSX.Element> = {
    complex: (
      <>
        <Typography
          sx={{ fontFamily: "custom-bold" }}
          fontSize={18}
          gutterBottom
        >
          High likelihood of selection
        </Typography>
        <Typography fontSize={13}>
          Candidates at this level have tackled the most challenging problems
          and demonstrated deep domain expertise, leadership qualities, and
          advanced problem-solving abilities.
        </Typography>
      </>
    ),
    advance: (
      <>
        <Typography
          sx={{ fontFamily: "custom-bold" }}
          fontSize={18}
          gutterBottom
        >
          Moderate to high likelihood of selection
        </Typography>
        <Typography fontSize={13}>
          These candidates perform strongly with solid technical knowledge,
          clear communication, and independent thinking.
        </Typography>
      </>
    ),
    intermediate: (
      <>
        <Typography
          sx={{ fontFamily: "custom-bold" }}
          fontSize={18}
          gutterBottom
        >
          Moderate likelihood of selection
        </Typography>
        <Typography fontSize={13}>
          Candidates here show promise but may lack consistency or depth in
          complex problem-solving.
        </Typography>
      </>
    ),
    beginner: (
      <>
        <Typography
          sx={{ fontFamily: "custom-bold" }}
          fontSize={18}
          gutterBottom
        >
          Low likelihood of selection
        </Typography>
        <Typography fontSize={13}>
          Considered for internships, trainee programs, or entry-level
          positions. These candidates are usually early in their career or have
          not yet demonstrated the expected proficiency.
        </Typography>
      </>
    ),
  };

  const tooltipColors: Record<string, string> = {
    complex: "#d0f0e0",
    advance: "#fff5cc",
    intermediate: "#ffe6cc",
    beginner: "#ffe0e0",
  };
  useEffect(() => {
    setLoading(true);

    paginateDataFromTable("brJobApplicant", {
      page: page - 1,
      pageSize: 12,
      data: {
        brJobApplicantStatus: "CONFIRMED",
        brJobId: brJobId,
        filter: "",
        fields: [],
      },
    }).then((result: any) => {
      setTotalCount(result?.data?.data?.count);

      const rows = result?.data?.data?.rows || [];
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
  }, [page, reload]);

  const history = useHistory();

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          mb: 3,
        }}
      >
        <CustomToggleButtonGroup
          exclusive
          sx={{
            background:color.cardBg
          }}
        >
          <CustomToggleButton
            value="yes"
            sx={{
              // background: color.activeButtonBg,
              color: "inherit",
              boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            }}
          >
            Candidate List
          </CustomToggleButton>
        </CustomToggleButtonGroup>
      </Box>
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
            top: 10,
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

      {loading ? (
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
            Processing Data
          </Typography>
        </Box>
      ) : totalCount === 0 ? (
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            No Applicants Yet
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} mt={2} sx={{ minHeight: "70vh" }}>
          {Object.entries(interviewList)
            .filter(([, interviews]) => interviews.length > 0)
            .map(([level, interviews]: [string, any[]]) => (
              <React.Fragment key={level}>
                <Grid item xs={12}>
                  <Tooltip
                    title={
                      <Typography whiteSpace="pre-line" fontSize={13}>
                        {levelTooltips[level]}
                      </Typography>
                    }
                    arrow
                    placement="right"
                    PopperProps={{
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, 10],
                          },
                        },
                      ],
                    }}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: tooltipColors[level],
                          color: "#000",
                          fontSize: "13px",
                          maxWidth: 300,
                          p: 2,
                          borderRadius: 2,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 4,
                        mb: 1,
                        position: "relative",
                        borderRadius: "999px !important",
                        padding: "6px 16px",
                        fontWeight: 600,
                        background: color.activeButtonBg,
                        color: "#fff",
                        boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                        width: "fit-content",
                        cursor: "pointer",
                      }}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)} Level{" "}
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Typography>
                  </Tooltip>
                </Grid>

                {interviews.length > 0 ? (
                  interviews.map((interview, index) => {
                    const score = interview.interviewScore;
                    const { remark, bgcolor } = getRemark(score);

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                        position={"relative"}
                      >
                        <Card
                          sx={{
                            background: color.cardBg,

                            color: "inherit",
                            borderRadius: 3,
                            textAlign: "center",
                            p: 2,
                            py: 3,
                            pb: 3,
                            maxWidth: "300px",
                            minHeight: "250px",
                            position: "relative",
                            m: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              justifyContent: "flex-start",
                              mt: 0,
                              width: "100%",
                            }}
                          >
                            <FontAwesomeIcon
                              style={{
                                height: "32px",
                                width: "32px",
                                background: color.cardBg,
                                padding: "8px",
                                borderRadius: "999px",
                              }}
                              icon={faUser}
                            />

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                fontWeight="bold"
                                noWrap
                                sx={{
                                  fontFamily: "Montserrat-Regular",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flexGrow: 1,
                                  minWidth: 0,
                                  textAlign: "left",
                                }}
                              >
                                {interview?.fullName}
                              </Typography>

                              <Typography
                                variant="caption"
                                display="block"
                                textAlign={"left"}
                              >
                                {formatDateWithSuffix(interview.createdAt)},{" "}
                                {""}
                                {new Date(
                                  interview.createdAt
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </Typography>
                            </div>
                          </Box>

                          <Box sx={{ textAlign: "left", my: 2 }}>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontFamily: "Montserrat-Regular",
                              }}
                              mt={0}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "4px" }}
                                icon={faPhone}
                              ></FontAwesomeIcon>{" "}
                              {interview?.phone}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "14px",
                                fontFamily: "Montserrat-Regular",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flexGrow: 1,
                                minWidth: 0,
                                textAlign: "left",
                              }}
                              mt={0}
                            >
                              <FontAwesomeIcon
                                style={{ marginRight: "4px" }}
                                icon={faEnvelope}
                              ></FontAwesomeIcon>
                              {interview?.email}
                            </Typography>
                          </Box>

                          <Typography textAlign={"left"} mt={1}>
                            Overview:
                          </Typography>
                          <Typography
                            variant="body2"
                            mt={0.4}
                            mb={2}
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              fontFamily: "Montserrat-Regular",
                              fontSize: "12px",
                              textAlign: "left",
                            }}
                          >
                            {interview.interviewOverview}
                          </Typography>

                          <BeyondResumeButton
                            onClick={() =>
                              history.push(
                                `/beyond-resume-interview-overview/${
                                  interview?.brJobApplicantId
                                }?type=${"candidateResult"}`
                              )
                            }
                            sx={{
                              width: "100%",
                              p: 0.5,
                              px: 1.5,
                              background: color.activeButtonBg,
                              ml: "auto",
                              display: "block",
                            }}
                          >
                            See Details
                            <FontAwesomeIcon
                              style={{ marginLeft: "5px" }}
                              icon={faChevronCircleRight}
                            ></FontAwesomeIcon>
                          </BeyondResumeButton>

                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              // border:'solid 1px white',
                              background: bgcolor,
                              color: getTextColor(bgcolor),

                              px: 1,
                              py: 0.5,
                              borderRadius: "0px 0px 0px 8px",
                            }}
                          >
                            <Typography sx={{ color: getTextColor(bgcolor) }}>
                              {score}/100
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      sx={{ position: "relative", color: "white", mt: 1 }}
                    >
                      No interviews found for{" "}
                      {level.charAt(0).toUpperCase() + level.slice(1)} level.
                    </Typography>
                  </Grid>
                )}
              </React.Fragment>
            ))}
        </Grid>
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

function formatDateWithSuffix(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}`;
}

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "#f0f2f7",
  borderRadius: "999px",
  padding: "8px",
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  borderRadius: "999px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "18px",
  textTransform: "none",
  color: "grey",

  "&.Mui-selected": {
    background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
  },
}));

const getTextColor = (bgcolor: string) => {
  if (bgcolor.includes("#4CAF50") || bgcolor.includes("#81C784"))
    return "white"; // Excellent - green
  if (bgcolor.includes("#8BC34A") || bgcolor.includes("#AED581"))
    return "black"; // Great - lime
  if (bgcolor.includes("#FFC107") || bgcolor.includes("#FFD54F"))
    return "black"; // Good - yellow
  if (bgcolor.includes("#FF9800") || bgcolor.includes("#FFB74D"))
    return "white"; // Fair - orange
  if (bgcolor.includes("#F44336") || bgcolor.includes("186, 39, 39"))
    return "white"; // Needs Improvement - red

  return "black"; // Default fallback
};
