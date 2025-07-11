import {
  faArrowRight,
  faBriefcase,
  faClock,
  faInfoCircle,
  faLayerGroup,
  faMoneyBill1Wave,
  faSearch,
  faUserTie,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Grid2,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  jobFunctions,
  jobMode,
  jobType,
  payroll,
} from "../../components/form/data";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import {
  commonFormTextFieldSx,
  formatDateJob,
  timeAgo,
} from "../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import BeyondResumeAvatar from "./Beyond Resume Components/BeyondResumeAvatar";
import BeyondResumeJobFilterComponent from "./Beyond Resume Components/BeyondResumeJobFilterComponent";

type Job = {
  brJobId: string;
  payroll: string;
  jobType: string;
  jobTitle: string;
  jobMode: string;
  endDate?: string;
  // add any other fields you use
};

const BeyondResumeJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const isPracticePage = location.pathname.startsWith(
    "/beyond-resume-practicePools"
  );
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");

  const scriptLines = [
    "Hey future superstar! I’m your Career Coach from Beyond Resume. Forget LinkedIn’s resume spam—we help you land roles by showing your skills, not just stating them. Ready for a job hunt that actually works? Let’s go!",
    "Say, ‘Find me remote marketing jobs,’ and boom! Our AI scans thousands of openings instantly. No more typing filters. See a match? Click ‘Apply’—and here’s where magic happens",
    "Option 1: Traditional written assessment.",
    "Option 2 (our favorite!): An AI-powered voice interview. Chat naturally for an hour—no cameras, no nerves. Our AI adapts to your answers, making it feel like practice with a mentor!",
    "Post-interview, get instant feedback: ‘Your Python skills shined, but practice cloud concepts—here’s a free module!’ Plus, use our ‘Fitment Analyzer’ to test your match for any job. Low fit? We’ll suggest skills to learn",
    "Try preloaded tests for top companies (yes, Google’s included!). Or build custom practice drills—like ‘5 data questions + 2 leadership scenarios.’ Nail weaknesses before the real deal!",
    "No more ‘apply and pray.’ We turn interviews into growth moments. Ready to stand out? Click ‘Find Jobs’ and use your voice—or test your fitment for that dream role right now. Your next career leap starts today!",
  ];

  type Filters = {
    payroll: string[];
    jobType: string[];
    jobTitle: string[];
    jobMode: string[];
  };

  useEffect(() => {
    const getAvatarStatus = async () => {
      try {
        const getStatus = await searchDataFromTable("userAvatar", {
          userId: getUserId(),
        });
        const status = getStatus?.data?.data?.avatarStatus;
        setAvatarStatus(status || "");
        if (status !== "CLOSED" || !status) {
          setOpen(true);
        }
      } catch (err) {
        console.error("Error fetching avatar status:", err);
        setAvatarStatus("");
      }
    };

    const saveBrPayment = async () => {
      const userId = getUserId();

      const existingRecords = await searchDataFromTable("brPayments", {
        createdBy: userId,
      });

      if (existingRecords?.data?.data) {
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const payload = {
        planName: "Free",
        createdBy: userId,
        duration: "1 Month",
        price: 0,
        role: getUserRole(),
        brPaymentStatus: "ACTIVE",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      try {
        await syncDataInTable("brPayments", payload, "createdBy");
        console.log("New record saved.");
      } catch (error) {
        console.error("Error saving record:", error);
      }
    };

    saveBrPayment();
    getAvatarStatus();
  }, []);

  const getInitialFilters = (): Filters => ({
    payroll: JSON.parse(localStorage.getItem("filter-payroll") || "[]"),
    jobType: JSON.parse(localStorage.getItem("filter-jobType") || "[]"),
    jobTitle: JSON.parse(localStorage.getItem("filter-jobTitle") || "[]"),
    jobMode: JSON.parse(localStorage.getItem("filter-jobMode") || "[]"),
  });

  const [filters, setFilters] = useState<Filters>(getInitialFilters);

  useEffect(() => {
    Object.entries(filters).forEach(([key, value]) => {
      localStorage.setItem(`filter-${key}`, JSON.stringify(value));
    });
  }, [filters]);

  const filterOptions = {
    payroll: payroll,
    jobType: jobType,
    jobTitle: jobFunctions,
    jobMode: jobMode,
  };

  const applyFilters = (jobs: Job[]): Job[] => {
    return jobs.filter((job) => {
      const matchesPayroll =
        filters.payroll.length === 0 || filters.payroll.includes(job.payroll);
      const matchesType =
        filters.jobType.length === 0 || filters.jobType.includes(job.jobType);
      const matchesTitle =
        filters.jobTitle.length === 0 ||
        filters.jobTitle.includes(job.jobTitle);
      const matchesMode =
        filters.jobMode.length === 0 || filters.jobMode.includes(job.jobMode);

      return matchesPayroll && matchesType && matchesTitle && matchesMode;
    });
  };

  const handleViewMore = (job: any) => {
    {
      isPracticePage
        ? history.push(
            `/beyond-resume-practiceInterviewForm/${job.brMockInterviewId}`
          )
        : history.push(`/beyond-resume-jobdetails/${job.brJobId}`);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = activeJobs.filter(
      (job) =>
        job.jobTitle?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term)
    );
    setFilteredJobs(results);
  };

  const sortByNewest = (jobs: any[]) =>
    jobs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const fetchJobs = async () => {
    const now = new Date();

    if (isJobPage) {
      const createdBy = getUserId();
      const [activeResult, pendingResult] = await Promise.all([
        searchListDataFromTable("brJobs", {
          createdBy,
        }),
        searchListDataFromTable("brJobs", {
          brJobStatus: "INPROGRESS",
          createdBy,
        }),
      ]);

      setLoading(false);

      const allActiveJobs = activeResult?.data?.data.filter((job) => {
        return job.brJobStatus === "ACTIVE";
      });

      // console.log(allActiveJobs)
      // console.log(pendingResult?.data?.data)

      const expiredJobs = activeResult?.data?.data.filter((job) => {
        return (
          (job.endDate &&
            new Date(job.endDate) <= now &&
            job.brJobStatus === "ACTIVE") ||
          job.brJobStatus === "CLOSED"
        );
      });

      const nonExpiredJobs = allActiveJobs.filter((job) => {
        return !job.endDate || new Date(job.endDate) > now;
      });

      const sortedActive = sortByNewest(nonExpiredJobs);
      const sortedPending = sortByNewest(pendingResult?.data?.data || []);
      const sortedCompleted = sortByNewest(expiredJobs);

      setActiveJobs(sortedActive);
      setPendingJobs(sortedPending);
      setCompletedJobs(sortedCompleted);
    } else if (isPracticePage) {
      const result = await searchListDataFromTable("brMockInterviews", {
        brMockInterviewStatus: "ACTIVE",
      });
      // console.log(result);
      setLoading(false);
      setActiveJobs(result?.data?.data);
    } else {
      const result = await searchListDataFromTable("brJobs", {
        brJobStatus: "ACTIVE",
      });

      const userAppliedJobs = await searchListDataFromTable("brJobApplicant", {
        createdBy: getUserId(),
        brJobApplicantStatus: "CONFIRMED",
      });

      setLoading(false);

      const activeJobs = (result?.data?.data || []).filter((job) => {
        if (!job.endDate) return true;
        return new Date(job.endDate) > now;
      });

      const appliedJobIds = new Set(
        (userAppliedJobs?.data?.data || []).map((app) => app.brJobId)
      );

      // console.log(appliedJobIds)

      const jobsNotYetApplied = activeJobs.filter(
        (job) => !appliedJobIds.has(job.brJobId)
      );

      const sortedActive = sortByNewest(jobsNotYetApplied);
      setActiveJobs(sortedActive);
      // console.log(sortedActive);

      const filtered = applyFilters(sortedActive);
      setFilteredJobs(filtered);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [isJobPage]);

  useEffect(() => {
    if (!isJobPage) {
      const filtered = applyFilters(activeJobs);
      setFilteredJobs(filtered);
    }
  }, [filters, activeJobs]);

  const toggleStatus = async () => {
    try {
      await updateByIdDataInTable(
        "brJobs",
        selectedJobId,
        { brJobStatus: "CLOSED" },
        "brJobId"
      );

      openSnackBar(`Job Deleted Successfully`);
      await fetchJobs();
    } catch (error) {
      console.error("Error updating status:", error);
      openSnackBar("Failed to update status. Please try again.");
    } finally {
      setPopupOpen(false);
    }
  };

  useEffect(() => {
    if (!isJobPage) {
      const term = searchTerm.toLowerCase();
      const results = activeJobs.filter(
        (job) =>
          job.jobTitle?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term)
      );
      setFilteredJobs(results);
    }
  }, [searchTerm, activeJobs, isJobPage]);

  const JobsSection = ({
    title,
    jobs,
    type,
  }: {
    title: string;
    jobs: any[];
    type?: string;
  }) => {
    const [applicantsMap, setApplicantsMap] = useState<Record<string, any[]>>(
      {}
    );
    const [loadingApplicants, setLoadingApplicants] = useState<boolean>(false);

    useEffect(() => {
      const fetchApplicants = async () => {
        setLoadingApplicants(true);
        const map: Record<string, any[]> = {};
        const jobIds: string[] = [];

        const promises = jobs.map((job) =>
          searchListDataFromTable("brJobApplicant", {
            brJobApplicantStatus: "CONFIRMED",
            brJobId: job.brJobId,
          }).then((applicants) => {
            const newApplicants = applicants.data.data;
            map[job.brJobId] = newApplicants;

            if (newApplicants.length > 0) {
              jobIds.push(job.brJobId);
            }
          })
        );

        await Promise.all(promises);

        setApplicantsMap(map);
        setLoadingApplicants(false);
      };

      fetchApplicants();
    }, [jobs]);

    return (
      <Box mt={4} mb={4}>
        <Typography
          variant="h6"
          mb={4}
          sx={{
            background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
            boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            width: "fit-content",
            color: "white",
            p: 2,
            borderRadius: "12px",
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={4}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "12px",
                  height: "100%",
                  boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
                  border: "solid 1.5px transparent",
                  transition: "all 0.3s",
                  background: "rgba(94, 94, 94, 0.15)",

                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.25)",
                  // border: "solid 1.5px",
                  // borderColor:color.newFirstColor

                  },
                }}
              >
                <CardContent
                  sx={{ position: "relative" }}
                  style={{
                    paddingBottom: "16px",
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                    position={"relative"}
                  >
                    <Typography
                      mt={isPracticePage ? 0 : 2}
                      variant="h6"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {job.jobTitle}
                    </Typography>

                    {!isPracticePage && (
                      <Button
                        onClick={() => {
                          setSelectedJobId(job.brJobId);
                          setPopupOpen(true);
                        }}
                        sx={{
                          background: color.newFirstColor,
                          px: 2,
                          borderRadius: "6px 0px 6px 0px",
                          position: "absolute",

                          ml: -2,
                          mt: -6.5,
                          minWidth: "0px",
                          cursor: "pointer",
                          color: "white",
                          textTransform: "none",
                          fontSize: "12px",
                        }}
                      >
                        <Typography fontSize={"12px"}>
                          {" "}
                          {timeAgo(job.createdAt)}{" "}
                        </Typography>
                      </Button>
                    )}

                    {isJobPage && title !== "Completed Jobs" && (
                      <Button
                        onClick={() => {
                          setSelectedJobId(job.brJobId);
                          setPopupOpen(true);
                        }}
                        sx={{
                          background: color.newFirstColor,
                          px: 2,
                          borderRadius: "0px 0px 0px 6px",
                          mr: -2,
                          mt: -7,
                          minWidth: "0px",
                          cursor: "pointer",
                          color: "white",
                          textTransform: "none",
                          fontSize: "12px",
                        }}
                      >
                        <FontAwesomeIcon
                          style={{ fontSize: "12px" }}
                          icon={faXmarkCircle}
                        />
                      </Button>
                    )}
                  </Box>

                  <Typography fontSize={"14px"} mt={-1} mb={1}>
                    {job.companyName}
                  </Typography>

                  <Typography
                    fontSize={"14px"}
                    mt={-1}
                    mb={2}
                    sx={{ fontFamily: "montserrat-regular" }}
                  >
                    {job.location}
                  </Typography>

                  {isPracticePage ? (
                    <Grid2 container>
                      <Grid2 size={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <FontAwesomeIcon icon={faBriefcase} />{" "}
                          {job.interviewDuration / 2} Questions
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <FontAwesomeIcon icon={faClock} />{" "}
                          {job.interviewDuration} Minutes
                        </Typography>
                      </Grid2>

                      <Grid2 size={{ xs: 12, md: 6 }} sx={{ pl: 4 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <FontAwesomeIcon icon={faUserTie} /> {job.jobLevel}{" "}
                          Level
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <FontAwesomeIcon icon={faLayerGroup} />{" "}
                          {
                            job.percentageList?.filter((cat) => cat.percent > 0)
                              .length
                          }{" "}
                          Categories
                        </Typography>
                      </Grid2>
                    </Grid2>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Typography sx={commonPillStyle}>
                        <FontAwesomeIcon icon={faUserTie} /> {job.jobType}
                      </Typography>

                      <Typography sx={commonPillStyle}>
                        <FontAwesomeIcon icon={faBriefcase} /> {job.jobMode}
                      </Typography>
                      {/* <Typography sx={commonPillStyle}>
                        <FontAwesomeIcon icon={faClock} /> {job.experience}
                      </Typography> */}
                      <Typography sx={commonPillStyle}>
                        <FontAwesomeIcon icon={faMoneyBill1Wave} />{" "}
                        {job.payroll}
                      </Typography>

                      {!isPracticePage && (
                        <Box display="flex" alignItems="center" gap={1}>
                          {applicantsMap[job.brJobId]?.length > 0 ? (
                            <Grid2
                              size={{ xs: 12, md: 6 }}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "flex-start",
                              }}
                            >
                              <>
                                {loadingApplicants ? (
                                  <Typography sx={commonPillStyle}>
                                    <CircularProgress size={16} /> Loading
                                    applicants...
                                  </Typography>
                                ) : (
                                  applicantsMap[job.brJobId]?.length > 0 && (
                                    <Typography sx={commonPillStyle}>
                                      <FontAwesomeIcon icon={faUserTie} />{" "}
                                      {(() => {
                                        const count =
                                          applicantsMap[job.brJobId]?.length ||
                                          0;
                                        return count > 100
                                          ? "100+ Applicants"
                                          : `${count} Applicant${
                                              count !== 1 ? "s" : ""
                                            }`;
                                      })()}
                                    </Typography>
                                  )
                                )}
                              </>
                            </Grid2>
                          ) : (
                            <>
                              <Typography sx={commonPillStyle}>
                                <FontAwesomeIcon icon={faUserTie} /> 0
                                Applicant(s)
                              </Typography>
                            </>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
                <Box
                  display="flex"
                  justifyContent={isPracticePage ? "flex-end" : "space-between"}
                  alignItems="center"
                  p={1}
                  px={2}
                  color={"white"}
                >
                  {!isPracticePage && (
                    <Typography
                      sx={{
                        color: "black",
                        textTransform: "none",
                        fontSize: "14px",
                        // border: "solid 1px",
                        borderRadius: "999px",
                        // px: 2,
                        py: 0.5,
                        fontFamily: "custom-regular",
                      }}
                    >
                      Valid till {formatDateJob(job?.endDate)}
                    </Typography>
                  )}
                  <BeyondResumeButton
                    onClick={() => handleViewMore(job)}
                    sx={{
                      background: "white",
                      color: color.newFirstColor,
                      textTransform: "none",
                      fontSize: "14px",
                      // border: "solid 1px",
                      boxShadow: "0px 0px 20px rgba(6, 15, 19, 0.07)",
                      borderRadius: "999px",
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    {isPracticePage ? "Proceed To Practice" : "Explore"}{" "}
                    <IconButton
                      sx={{
                        p: 0,
                        ml: 1,
                        fontSize: "16px",
                        borderRadius: "999px",
                        color: color.newFirstColor,
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowRight} />
                    </IconButton>
                  </BeyondResumeButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box className="full-screen-div">
      <Box
        sx={{
          height: { xs: "250px", sm: "350px" },
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
          boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
          m: -2,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            position: "absolute",
            bottom: 0,
            left: "2%",
            height: { xs: "50%", sm: "90%" },
            opacity: { xs: 0.6, md: 1 },
            width: "auto",
          }}
          image="/assets/Vector Smart Object1.png"
        />
        <CardMedia
          component="img"
          sx={{
            position: "absolute",
            bottom: 0,
            right: "0",
            height: { xs: "50%", sm: "90%" },
            opacity: { xs: 0.6, md: 1 },
            width: "auto",
          }}
          image="/assets/Vector Smart Object2.png"
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "50%" },
          }}
        >
          <Typography
            align="center"
            fontWeight={600}
            mb={4}
            sx={{
              fontSize: { xs: "16px", md: "24px" },
              m: "auto",
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              color: "white",
              width: "fit-content",
              p: 2,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            }}
          >
            {isJobPage ? "Your Posted Jobs" : "Find your next job"}
          </Typography>
          <Typography
            align="center"
            mt={2}
            sx={{ fontSize: "14px", color: "white" }}
          >
            {isJobPage
              ? "Beyond Resume helps you discover the right talent faster through AI-led interviews eliminating the guesswork and saving time on traditional hiring methods."
              : "Beyond Resume helps you stand out with AI-led interviews, matching you to the right jobs faster. No more relying on just your resume."}
          </Typography>
        </Box>
      </Box>

      {!isJobPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            zIndex: 2,
            position: "relative",
            mt: -3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#fff",
              px: 2,
              width: "300px",
              ...commonFormTextFieldSx,
            }}
          >
            <FontAwesomeIcon icon={faSearch} style={{ color: "#888" }} />
            <TextField
              placeholder="Find jobs"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </Box>

          <Button
            variant="contained"
            sx={{
              px: 4,
              color: "white",
              textTransform: "none",
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              borderRadius: "44px",
              height: "fit-content",
              py: 1,
              my: "auto",
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: "40vh",
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

          <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
            Fetching Jobs
          </Typography>
        </Box>
      ) : (
        <Box px={2} mb={4}>
          {!isPracticePage && (
            <Box sx={{ mb: 2 }}>
              <BeyondResumeJobFilterComponent
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
              />
            </Box>
          )}
          {isPracticePage && (
            <Box sx={{ mb: 2 }}>
              <BeyondResumeButton
                onClick={() => history.push("/beyond-resume-interviewForm")}
                sx={{
                  position: "absolute",
                  right: 30,
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      boxShadow: "0 0 0 0 rgba(0, 123, 255, 0.7)",
                    },
                    "70%": {
                      transform: "scale(1.05)",
                      boxShadow: "0 0 0 10px rgba(0, 123, 255, 0)",
                    },
                    "100%": {
                      transform: "scale(1)",
                      boxShadow: "0 0 0 0 rgba(0, 123, 255, 0)",
                    },
                  },
                }}
              >
                <FontAwesomeIcon
                  style={{ marginRight: "4px" }}
                  icon={faBriefcase}
                />
                Create Custom Interview
              </BeyondResumeButton>
            </Box>
          )}

          {isJobPage ? (
            <>
              {activeJobs.length > 0 ? (
                <JobsSection
                  title="Posted Jobs"
                  jobs={activeJobs}
                  type="active"
                />
              ) : null}

              {pendingJobs.length > 0 ? (
                <JobsSection title="Pending Jobs" jobs={pendingJobs} />
              ) : null}

              {completedJobs.length > 0 ? (
                <JobsSection title="Completed Jobs" jobs={completedJobs} />
              ) : null}

              {pendingJobs.length === 0 &&
                activeJobs.length === 0 &&
                completedJobs.length === 0 && (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mt: 4 }}
                  >
                    No jobs available.
                  </Typography>
                )}
            </>
          ) : isPracticePage ? (
            <>
              {filteredJobs.length > 0 ? (
                <JobsSection title="Practice Pools" jobs={filteredJobs} />
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 8 }}>
                  No practice jobs yet.
                </Typography>
              )}
            </>
          ) : (
            <>
              {filteredJobs.length > 0 ? (
                <JobsSection title="Recommended Jobs" jobs={filteredJobs} />
              ) : (
                <Typography variant="body1" sx={{ textAlign: "center", mt: 8 }}>
                  No recommended jobs found.
                </Typography>
              )}
            </>
          )}
        </Box>
      )}

      <ConfirmationPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={toggleStatus}
        actionText={"close"}
        color={"#5a81fd"}
        warningMessage={`This action can't be undone.`}
        message={"Are you sure you want to close this job?"}
        icon={
          <FontAwesomeIcon
            color={"#5a81fd"}
            fontSize={"68px"}
            style={{ marginTop: "16px", marginBottom: "-8px" }}
            icon={faInfoCircle}
          />
        }
      />

      {avatarStatus !== null &&
        !isPracticePage &&
        getUserRole() === "CAREER SEEKER" &&
        avatarStatus !== "CLOSED" &&
        open && (
          <div>
            <BeyondResumeAvatar
              open={open}
              scriptLines={scriptLines}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
    </Box>
  );
};

export default BeyondResumeJobs;

const commonPillStyle = {
  borderRadius: "999px",
  background: color.newFirstColor,
  color: "white",
  width: "fit-content",
  px: 1,
  fontFamily: "montserrat-regular",
  fontSize: "12px",
};
