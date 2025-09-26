import {
  faArrowsRotate,
  faBriefcase,
  faBuilding,
  faCheckCircle,
  faChevronCircleRight,
  faHourglass1,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme as useTheme1,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PaginationControlled from "../../../components/shared/Pagination";
import {
  countTotalQuestions,
  formatRoundTS,
  getFormattedDateKey,
  getFormattedDateKey1,
} from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  commonPillStyle,
  GradientFontAwesomeIcon,
} from "../../../components/util/CommonStyle";
// import { useTheme } from "../../../components/util/ThemeContext";
import { getUserId, getUserRole } from "../../../services/axiosClient";
import {
  paginateDataFromTable,
  searchListDataFromTable,
} from "../../../services/services";
import color from "../../../theme/color";
import InterviewModeModal from "../Beyond Resume Components/BeyondResumeInterviewModeModal";
import { useTheme } from "../../../components/util/ThemeContext";

const BeyondResumeApplications = () => {
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [interviewListCount, setInterviewListCount] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModeModal, setShowModeModal] = useState(false);
  const [noOfQuestion, setNoOfQuestions] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [roundData, setRoundData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const params = {
        createdBy: getUserId(),
        brJobApplicantStatus: "APPLIED",
      };

      try {
        const result: any = await paginateDataFromTable("brJobApplicant", {
          page: page - 1,
          pageSize: 10,
          data: {
            ...params,
            // fieldName: "endDate",
            // fieldValue: new Date().toISOString(),
            filter: "",
            fields: [],
          },
        });

        setTotalCount(result?.data?.data?.count);

        const sortedList = result?.data?.data?.rows?.sort(
          (a: any, b: any) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        const applicantsWithRoundStatus = await Promise.all(
          sortedList.map(async (applicant: any) => {
            const { brJobApplicantId, roundType } = applicant;

            const roundDataRes: any = await searchListDataFromTable(
              "brJobRounds",
              {
                brJobId: applicant.brJobId,
              }
            );

            const rounds = roundDataRes?.data?.data || [];

            if (roundType === "multiple") {
              const roundRes: any = await searchListDataFromTable(
                "brJobApplicantRounds",
                { brJobApplicantId }
              );

              const roundData: any[] = roundRes?.data?.data || [];

              let statusLabel = "";
              let action: "START_NEXT" | "PENDING" | "FAIL" | "PASS" =
                "PENDING";
              let currentRound: any = null;

              const jobEndDate = new Date(applicant.endDate);
              let publishDate = new Date(jobEndDate);

              if (!roundData.length) {
                statusLabel = `Eligible to start ${rounds[0]?.roundName}`;
                action = "START_NEXT";
                currentRound = rounds[0];
              } else {
                for (let i = 0; i < rounds?.length; i++) {
                  const round = rounds[i];
                  const applicantRound = roundData.find(
                    (r: any) => r.roundId === round.roundId
                  );

                  if (!applicantRound) {
                    if (
                      rounds
                        .slice(0, i)
                        .every((r) =>
                          roundData.some(
                            (rs: any) =>
                              rs.roundId === r.roundId &&
                              rs.roundStatus === "PASS"
                          )
                        )
                    ) {
                      statusLabel = `Eligible to start ${round.roundName}`;
                      action = "START_NEXT";
                      currentRound = round;
                    }
                    break;
                  }

                  if (applicantRound.roundStatus === "PENDING") {
                    const totalWindowDays = rounds
                      .slice(0, i + 1)
                      .reduce((sum, r) => sum + (r.roundWindow || 0), 0);

                    publishDate.setDate(
                      publishDate.getDate() + totalWindowDays
                    );

                    statusLabel = `${formatRoundTS(
                      round.roundId
                    )} result will be published on ${getFormattedDateKey1(
                      publishDate
                    )}.`;
                    action = "PENDING";
                    currentRound = round;

                    break;
                  }

                  if (applicantRound.roundStatus === "FAIL") {
                    statusLabel = "Status rejected";
                    action = "FAIL";
                    currentRound = null;
                    break;
                  }

                  if (
                    i === rounds.length - 1 &&
                    applicantRound.roundStatus === "PASS"
                  ) {
                    statusLabel = "All rounds completed";
                    action = "PASS";
                    currentRound = null;
                  }
                }
              }

              const timeline = rounds?.map((round, idx) => {
                const applicantRound = roundData.find(
                  (r: any) => r.roundId === round.roundId
                );

                const totalDays = rounds
                  .slice(0, idx + 1)
                  .reduce((acc, r) => acc + (r.roundWindow || 0), 0);

                let endDate: Date | null = new Date(publishDate);
                endDate.setDate(endDate.getDate() + totalDays);

                const isExpired = endDate < new Date();

                if (!applicantRound) {
                  return {
                    roundNumber: idx + 1,
                    roundId: round.roundId,
                    roundName: round.roundName,
                    status: isExpired ? "EXPIRED" : "Not started",
                    date: idx === 0 ? publishDate : null,
                    endDate,
                    score: null,
                  };
                }

                return {
                  roundNumber: idx + 1,
                  roundId: round.roundId,
                  roundName: round.roundName,
                  window: round.roundWindow,
                  status: applicantRound.roundStatus,
                  date: idx === 0 ? publishDate : applicantRound.updatedAt,
                  endDate,
                  score: applicantRound.interviewScore || null,
                };
              });

              return {
                ...applicant,
                isMultiRound: true,
                roundData,
                statusLabel,
                action,
                publishDate,
                roundsCount: rounds.length,
                currentRound,
                timeline,
              };
            } else {
              return {
                ...applicant,
                isMultiRound: false,
                statusLabel: "Single round assessment",
                action: "START_NEXT",
                roundsCount: 1,
                currentRound: null,
                timeline: [],
              };
            }
          })
        );

        setInterviewListCount(applicantsWithRoundStatus);

        const grouped = applicantsWithRoundStatus.reduce(
          (acc: any, item: any) => {
            const dateKey = getFormattedDateKey(item.updatedAt);
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);
            return acc;
          },
          {}
        );

        setInterviewList(grouped);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const history = useHistory();
  const { theme } = useTheme();

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const handleStartAssessment = (job: any) => {
    setSelectedJob(job);
    setApplicantId(job?.brJobApplicantId || null);

    if (job?.jobInterviewQuestions) {
      const cleanedContent = job.jobInterviewQuestions
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/<[^>]*>?/gm, "")
        .trim();

      try {
        const parsed = JSON.parse(cleanedContent);
        const totalQuestions = countTotalQuestions(parsed);
        setNoOfQuestions(totalQuestions);
      } catch (e) {
        console.error("Error parsing interview questions:", e);
        setNoOfQuestions(null);
      }
    }

    setDuration(job?.interviewDuration || null);
    setShowModeModal(true);
  };

  const handleModeSelect = (mode: "AI_VIDEO" | "BASIC_EXAM") => {
    if (!applicantId) return;
    setShowModeModal(false);

    const sessionType = "writtenExamSession";

    if (mode === "AI_VIDEO") {
      history.push(`/beyond-resume-readyToJoin/${applicantId}`, {
        duration: duration,
        noOfQuestions: noOfQuestion,
        companyName: selectedJob?.companyName,
        jobTitle: selectedJob?.jobTitle,
        examMode: selectedJob?.examMode,
        roundName: selectedJob?.currentRound?.roundName,
        roundId: selectedJob?.currentRound?.roundId,
      });
    } else {
      history.push(
        `/beyond-resume-readyToJoin/${applicantId}?sessionType=${sessionType}`,
        {
          duration: duration,
          noOfQuestions: noOfQuestion,
          companyName: selectedJob?.companyName,
          jobTitle: selectedJob?.jobTitle,
          examMode: selectedJob?.examMode,
          roundName: selectedJob?.currentRound?.roundName,
          roundId: selectedJob?.currentRound?.roundId,
        }
      );
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
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
            Loading your jobs
          </Typography>
        </Box>
      ) : Object.keys(interviewList).length === 0 ? (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "inherit",
          }}
        >
          <Typography variant="h6" color="inherit">
            No Pending Assessments
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1} mt={2}>
          {Object.entries(interviewList).map(
            ([date, interviews]: [string, any[]]) => (
              <React.Fragment key={date}>
                {interviews.map((interview, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index}>
                    <JobCard
                      job={interview}
                      theme={theme}
                      onStartAssessment={handleStartAssessment}
                      roundsCount={interview.roundsCount}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            )
          )}
        </Grid>
      )}

      <Box sx={{ maxWidth: "100%", ml: "auto" }}>
        {interviewListCount.length !== 0 && (
          <PaginationControlled
            page={page}
            setPage={setPage}
            count={totalCount}
          />
        )}
      </Box>

      <Box sx={{ position: "relative", zIndex: 10000 }}>
        <InterviewModeModal
          roundName={selectedJob?.currentRound?.roundName}
          roundId={selectedJob?.currentRound?.roundId}
          rawJobData={selectedJob}
          open={showModeModal}
          onSelectMode={handleModeSelect}
          noOQuestion={noOfQuestion}
          disableOutsideClick={false}
          onClose={() => setShowModeModal(false)}
        />
      </Box>
    </Box>
  );
};

export default BeyondResumeApplications;

interface JobCardProps {
  job: any;
  theme: string;
  roundsCount: number;
  onStartAssessment: (job: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  theme,
  onStartAssessment,
  roundsCount,
}) => {
  const history = useHistory();

  // console.log(job);
  const theme1 = useTheme1();
  const isMobile = useMediaQuery(theme1.breakpoints.down("sm"));
  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: "12px",
        boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s",
        background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        color: "inherit",
        "&:hover": {
          transform: "scale(1.02)",
        },
        opacity:
          !job.isMultiRound && new Date(job.endDate) < new Date() ? 0.6 : 1,
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
          flexWrap: "wrap",
          minWidth: 0,
        }}
        style={{
          paddingBottom: "16px",
          borderRadius: "12px",
          overflow: "hidden",
          minHeight: "0px",
        }}
      >
        <Box display={"flex"} mr={"auto"} gap={2} mb={2}>
          <Box>
            <FontAwesomeIcon
              icon={faBuilding}
              style={{
                fontSize: "44px",
                background: "white",
                borderRadius: "8px",
                padding: "12px",
                color: color.newbg,
              }}
            />
          </Box>
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
                  theme === "dark" ? color.titleColor : color.titleLightColor,
                pr: 3,
                position: "relative",
                zIndex: 10,
                "&:hover": {
                  textDecoration:
                    getUserRole() === "TALENT PARTNER" ? "underline" : "none",
                },
              }}
            >
              {job.jobTitle}
            </Typography>
            <Typography fontSize={"14px"} mt={-0.5} mb={1}>
              {job.companyName}
            </Typography>
            <Typography fontSize={"14px"} mt={-0.5} mb={1}>
              {job.location}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", ml: -1 }}>
              {job.roundType === "multiple" ? (
                <Typography sx={commonPillStyle}>
                  <GradientFontAwesomeIcon size={14} icon={faArrowsRotate} /> No
                  of Rounds : {roundsCount}
                </Typography>
              ) : (
                <Typography sx={commonPillStyle}>
                  <GradientFontAwesomeIcon size={14} icon={faHourglass1} />{" "}
                  {job.interviewDuration} Mins Duration
                </Typography>
              )}
              <Typography sx={commonPillStyle}>
                <GradientFontAwesomeIcon size={14} icon={faBriefcase} />{" "}
                {job.jobType}
              </Typography>
            </Box>
            {!job.isMultiRound && new Date(job.endDate) < new Date() && (
              <Typography variant="body2" mt={1} color="red">
                Job expired – you can no longer start this assessment
              </Typography>
            )}
          </div>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            flexGrow: 1,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <BeyondResumeButton2
              sx={{ fontSize: "12px" }}
              onClick={() => {
                history.push(`/beyond-resume-applicationJD/${job.brJobId}`);
              }}
            >
              Review JD
              <FontAwesomeIcon
                style={{ marginLeft: "8px" }}
                icon={faChevronCircleRight}
              />
            </BeyondResumeButton2>

            {job.action === "START_NEXT" && (
              <BeyondResumeButton
                sx={{ fontSize: "12px" }}
                onClick={() => onStartAssessment(job)}
                disabled={
                  job.isMultiRound
                    ? job.timeline.some(
                        (round: any) => round.status === "EXPIRED"
                      )
                    : new Date(job.endDate) < new Date()
                }
              >
                {job.isMultiRound ? "Start Next Round" : "Start Assessment"}
                <FontAwesomeIcon
                  style={{ marginLeft: "8px" }}
                  icon={faChevronCircleRight}
                />
              </BeyondResumeButton>
            )}
          </div>
        </Box>

        {job.isMultiRound && job.timeline && (
          <Box
            p={2}
            my={1}
            width={{ xs: "auto", md: "100%" }}
            sx={{
              background: "#ffffff5f",
              borderRadius: { xs: "4px", md: "12px" },
            }}
          >
            <Stepper
              orientation={isMobile ? "vertical" : "horizontal"}
              alternativeLabel={!isMobile}
            >
              {job.timeline
                .filter((round: any, idx: number, arr: any[]) => {
                  const currentIdx = arr.findIndex(
                    (r: any) => r.status !== "PASS"
                  );
                  return round.status === "PASS" || idx === currentIdx;
                })
                .map((round: any, idx: number) => (
                  <Step
                    key={round.roundNumber}
                    active
                    sx={{
                      "& .MuiStepConnector-line": {
                        borderColor: "green",
                        borderWidth: 2,
                        ml: 0.4,
                      },
                      "& .MuiStepLabel-label": {
                        color:
                          theme === "dark"
                            ? "white"
                           
                            : "#000000a8",
                      },
                    }}
                    // active={round.status === "PENDING"}
                    // completed={round.status === "PASS"}
                  >
                    <StepLabel
                      sx={{ cursor: "pointer", color: "inherit" }}
                      onClick={() => {
                        if (
                          round.status === "PASS" ||
                          round.status === "FAIL"
                        ) {
                          history.push(
                            `/beyond-resume-interview-overview/${job?.brJobApplicantId}-${round?.roundId}?type=multiround`
                          );
                        }
                      }}
                      StepIconComponent={() => (
                        <CustomStepIcon status={round.status} />
                      )}
                    >
                      <Typography color="inherit" variant="body2">
                        {`Round ${round.roundNumber}: ${round.roundName}`}
                      </Typography>
                    </StepLabel>
                    <StepContent
                      sx={{
                        border: "none",
                        textAlign: { xs: "left", md: "center" },
                        mt: { xs: -1, md: 0 },
                      }}
                    >
                      {round.status === "PASS" && (
                        <Typography variant="caption" color="green">
                          Passed {getFormattedDateKey1(round.date)}
                        </Typography>
                      )}
                      {round.status === "FAIL" && (
                        <Typography variant="caption" color="red">
                          Failed (
                          {job.publishDate
                            ? getFormattedDateKey1(job.publishDate)
                            : "TBD"}
                          )
                        </Typography>
                      )}
                      {round.status === "PENDING" && (
                        <Typography variant="caption" color="orange">
                          Result pending – will be published on{" "}
                          {job.publishDate
                            ? getFormattedDateKey1(job.publishDate)
                            : "TBD"}
                        </Typography>
                      )}
                      {round.status === "Not started" && (
                        <Typography variant="caption" color="green">
                          You can finish the interview before {""}
                          {getFormattedDateKey1(round.endDate)}
                        </Typography>
                      )}
                      {round.status === "EXPIRED" && (
                        <Typography variant="caption" color="red">
                          Job expired – you can no longer start this round.
                        </Typography>
                      )}
                    </StepContent>
                  </Step>
                ))}
            </Stepper>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const CustomStepIcon = (props: any) => {
  const { status } = props;

  if (status === "PASS") {
    return (
      <FontAwesomeIcon
        icon={faCheckCircle}
        style={{ color: "green", fontSize: "24px" }}
      />
    );
  }
  if (status === "FAIL") {
    return (
      <FontAwesomeIcon
        icon={faXmarkCircle}
        style={{ color: "red", fontSize: "24px" }}
      />
    );
  }
  if (status === "PENDING") {
    return (
      <FontAwesomeIcon
        icon={faHourglass1}
        style={{ color: "orange", fontSize: "24px" }}
      />
    );
  }
  if (status === "EXPIRED") {
    return (
      <FontAwesomeIcon
        icon={faHourglass1}
        style={{ color: "red", fontSize: "24px" }}
      />
    );
  }
  return (
    <FontAwesomeIcon
      icon={faHourglass1}
      style={{ color: "green", fontSize: "24px" }}
    />
  );
};
