import {
  faBriefcase,
  faBuilding,
  faChevronCircleDown,
  faChevronCircleRight,
  faClock,
  faHourglass,
  faLocationDot,
  faLocationPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PaginationControlled from "../../../components/shared/Pagination";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  commonPillStyle,
  GradientFontAwesomeIcon,
  StyledTypography,
} from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/util/ThemeContext";
import { getUserId, getUserRole } from "../../../services/axiosClient";
import {
  paginateDataFromTable,
  searchListDataFromTable,
} from "../../../services/services";
import color from "../../../theme/color";
import InterviewModeModal from "../Beyond Resume Components/BeyondResumeInterviewModeModal";
import { countTotalQuestions } from "../../../components/util/CommonFunctions";

const BeyondResumeApplications = () => {
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPractice, setIsPractice] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reload, setReload] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [noOfQuestion, setNoOfQuestions] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [searchedSavedJobs, setSearchedSavedJobs] = useState<any[]>([]);

  const sortByNewest = (jobs: any[]) =>
    jobs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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
            filter: "",
            fields: [],
          },
        });

        setTotalCount(result?.data?.data?.count);

        const sortedList = result?.data?.data?.rows?.sort((a: any, b: any) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        const grouped = sortedList.reduce((acc: any, item: any) => {
          const dateKey = getFormattedDateKey(item.updatedAt);
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(item);
          return acc;
        }, {});

        setInterviewList(grouped);
        // console.log(grouped);

        setLoading(false);

        const now = new Date();
        const createdBy = getUserId();

        const [jobResult, confirmedJobs, appliedJobs, userSavedJobs] =
          await Promise.all([
            searchListDataFromTable("brJobs", { brJobStatus: "ACTIVE" }),
            searchListDataFromTable("brJobApplicant", {
              createdBy,
              brJobApplicantStatus: "CONFIRMED",
            }),
            searchListDataFromTable("brJobApplicant", {
              createdBy,
              brJobApplicantStatus: "APPLIED",
            }),
            searchListDataFromTable("brJobApplicant", {
              createdBy,
              brJobApplicantStatus: "REQUESTED",
            }),
          ]);

        const allActiveJobs = jobResult?.data?.data.filter(
          (job) => !job.endDate || new Date(job.endDate) > now
        );

        const appliedJobIds = new Set([
          ...(confirmedJobs?.data?.data || []).map((app) => app.brJobId),
          ...(appliedJobs?.data?.data || []).map((app) => app.brJobId),
        ]);

        const jobsNotYetApplied = allActiveJobs.filter(
          (job) => !appliedJobIds.has(job.brJobId)
        );

        const sortedActive = sortByNewest(jobsNotYetApplied);

        const savedJobIds = new Set(
          (userSavedJobs?.data?.data || []).map((job) => job.brJobId)
        );

        const savedJobsFromFiltered = sortedActive.filter((job) =>
          savedJobIds.has(job.brJobId)
        );

        setSavedJobs(savedJobsFromFiltered);
        setSearchedSavedJobs(savedJobsFromFiltered);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [isPractice, page, reload]);

  const history = useHistory();
  const { theme } = useTheme();

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const handleStartAssessment = (job: any) => {
    setSelectedJob(job);
    setApplicantId(job?.brJobApplicantId || null);

    // clean and count questions
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
      <Typography variant="h6">Upcoming Interviews</Typography>

      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 3,
          color: "inherit",
        }}
      >
        <CustomToggleButtonGroup
          value={isPractice ? "yes" : "no"}
          exclusive
          onChange={() => setIsPractice((prev) => !prev)}
        >
          <CustomToggleButton value="no">Pending Assessment</CustomToggleButton>
        </CustomToggleButtonGroup>
      </Box> */}

      {loading ? (
        // Loader
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
        // Pending Assessment: No Data
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
                {/* <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 4,
                      mb: 1,
                      borderRadius: "999px !important",
                      padding: "6px 16px",
                      fontWeight: 600,
                      background: color.activeButtonBg,
                      color: "#fff",
                      boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                      width: "fit-content",
                    }}
                  >
                    {date}
                  </Typography>
                </Grid> */}

                {interviews.map((interview, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index}>
                    <JobCard
                      job={interview}
                      theme={theme}
                      onStartAssessment={handleStartAssessment}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            )
          )}
        </Grid>
      )}

      <Box sx={{ maxWidth: "100%", ml: "auto" }}>
        {!isPractice && Object.keys(interviewList).length >= 10 ? (
          <PaginationControlled
            page={page}
            setPage={setPage}
            count={totalCount}
          />
        ) : null}
      </Box>

      <Box sx={{ position: "relative", zIndex: 10000 }}>
        <InterviewModeModal
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
  onStartAssessment: (job: any) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, theme, onStartAssessment }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const history = useHistory();

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s",
        background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        color: "inherit",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        style={{
          paddingBottom: "16px",
          borderRadius: "12px",
          overflow: "hidden",
          minHeight: "0px",
        }}
      >
        <Box display={"flex"} gap={2} mb={2}>
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
            <Typography
              fontSize={"14px"}
              mt={-0.5}
              mb={1}
              sx={{ fontFamily: "montserrat-regular" }}
            >
              {job.companyName}
            </Typography>
            <Typography
              fontSize={"14px"}
              mt={-0.5}
              mb={1}
              sx={{ fontFamily: "montserrat-regular" }}
            >
              {job.location}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                ml: -1,
                // paddingLeft: "60px",
              }}
            >
              <Typography sx={commonPillStyle}>
                <GradientFontAwesomeIcon size={14} icon={faHourglass} />{" "}
                {job.interviewDuration} Mins Duration
              </Typography>
              <Typography sx={commonPillStyle}>
                <GradientFontAwesomeIcon size={14} icon={faBriefcase} />{" "}
                {job.jobType}
              </Typography>
            </Box>

            {/* <Typography fontSize={"14px"} mt={-0.5}>
              {job.location}
            </Typography> */}
          </div>
        </Box>

        <Box
          sx={{
            display: "flex",
            // flexDirection:'column',
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
            <BeyondResumeButton
              sx={{ fontSize: "12px" }}
              onClick={() => onStartAssessment(job)}
            >
              Start Assessment
              <FontAwesomeIcon
                style={{ marginLeft: "8px" }}
                icon={faChevronCircleRight}
              />
            </BeyondResumeButton>
          </div>
        </Box>

        {/* Description */}
        {/* <StyledTypography
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: showFullDescription ? "none" : 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mt:-2,
            fontSize:'14px'
          }}
          dangerouslySetInnerHTML={{
            __html: job.jobDescriptions?.replace(/```(?:html)?/g, "").trim(),
          }}
        /> */}

        {/* <Button
          sx={{
            mt: 1,
            mr: "auto",
            display: "block",
            fontSize: "12px",
            px: 0,
            py: 0.2,
            textTransform: "none",
          }}
          onClick={() => setShowFullDescription((prev) => !prev)}
        >
          {showFullDescription ? "Show Less" : "Read More"}
          <FontAwesomeIcon
            style={{ marginLeft: "6px" }}
            icon={
              showFullDescription ? faChevronCircleDown : faChevronCircleRight
            }
          />
        </Button> */}
      </CardContent>
    </Card>
  );
};

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  backgroundColor: "rgba(94, 94, 94, 0.15)",
  borderRadius: "999px",
  padding: "8px",
}));

const CustomToggleButton = styled(ToggleButton)(() => ({
  border: "none",
  borderRadius: "999px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "18px",
  textTransform: "none",
  color: "grey",
  "&.Mui-selected": {
    background: color.activeButtonBg,
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
  },
}));

const getFormattedDateKey = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${suffix} ${month}`;
};
