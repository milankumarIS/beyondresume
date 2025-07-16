import {
  faArrowRight,
  faBookmark,
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
import {
  BeyondResumeButton,
  commonPillStyle,
} from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
  syncByTwoUniqueKeyData,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import BeyondResumeAvatar from "./Beyond Resume Components/BeyondResumeAvatar";
import BeyondResumeJobFilterComponent from "./Beyond Resume Components/BeyondResumeJobFilterComponent";
import { AnimatePresence, motion } from "framer-motion";

type Job = {
  brJobId: string;
  payroll: string;
  jobType: string;
  jobTitle: string;
  jobMode: string;
  endDate?: string;
};

const BeyondResumeJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
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
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const fadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

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
    setLoading(true);
    const now = new Date();
    const createdBy = getUserId();

    try {
      if (isJobPage) {
        const [activeResult, pendingResult] = await Promise.all([
          searchListDataFromTable("brJobs", { createdBy }),
          searchListDataFromTable("brJobs", {
            brJobStatus: "INPROGRESS",
            createdBy,
          }),
        ]);

        const allJobs = activeResult?.data?.data || [];

        const activeJobs = allJobs.filter(
          (job) =>
            job.brJobStatus === "ACTIVE" &&
            (!job.endDate || new Date(job.endDate) > now)
        );

        const expiredJobs = allJobs.filter(
          (job) =>
            (job.brJobStatus === "ACTIVE" &&
              job.endDate &&
              new Date(job.endDate) <= now) ||
            job.brJobStatus === "CLOSED"
        );

        setActiveJobs(sortByNewest(activeJobs));
        setPendingJobs(sortByNewest(pendingResult?.data?.data || []));
        setCompletedJobs(sortByNewest(expiredJobs));
      } else if (isPracticePage) {
        const result = await searchListDataFromTable("brMockInterviews", {
          brMockInterviewStatus: "ACTIVE",
        });
        setActiveJobs(result?.data?.data || []);
      } else {
        const [result, userAppliedJobs, userSavedJobs] = await Promise.all([
          searchListDataFromTable("brJobs", { brJobStatus: "ACTIVE" }),
          searchListDataFromTable("brJobApplicant", {
            createdBy,
            brJobApplicantStatus: "CONFIRMED",
          }),
          searchListDataFromTable("brJobApplicant", {
            createdBy,
            brJobApplicantStatus: "REQUESTED",
          }),
        ]);

        const allActiveJobs = result?.data?.data || [];

        const activeJobs = allActiveJobs.filter(
          (job) => !job.endDate || new Date(job.endDate) > now
        );

        const appliedJobIds = new Set(
          (userAppliedJobs?.data?.data || []).map((app) => app.brJobId)
        );

        const jobsNotYetApplied = activeJobs.filter(
          (job) => !appliedJobIds.has(job.brJobId)
        );

        const sortedActive = sortByNewest(jobsNotYetApplied);
        setActiveJobs(sortedActive);

        const filtered = applyFilters(sortedActive);
        setFilteredJobs(filtered);

        setSavedJobs(userSavedJobs?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [isJobPage, showSavedJobs]);

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
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
    useEffect(() => {
      const fetchApplicants = async () => {
        setLoadingApplicants(true);
        const map: Record<string, any[]> = {};
        const savedJobSet = new Set<string>();

        const promises = jobs.map((job) =>
          searchListDataFromTable("brJobApplicant", {
            brJobApplicantStatus: ["CONFIRMED", "REQUESTED"],
            brJobId: job.brJobId,
          }).then((applicants) => {
            const data = applicants.data.data;
            map[job.brJobId] = data.filter(
              (a) => a.brJobApplicantStatus === "CONFIRMED"
            );
            if (data.some((a) => a.brJobApplicantStatus === "REQUESTED")) {
              savedJobSet.add(job.brJobId);
            }
          })
        );

        await Promise.all(promises);

        setApplicantsMap(map);
        setSavedJobs(savedJobSet);
        setLoadingApplicants(false);
      };

      fetchApplicants();
    }, [jobs]);

    const handleSaveJob = async (job: any) => {
      const jobId = job?.brJobId;
      const userId = getUserId();
      const isAlreadySaved = savedJobs.has(jobId);

      setSavingJobId(jobId);

      try {
        await syncByTwoUniqueKeyData(
          "brJobApplicant",
          {
            brJobId: jobId,
            createdBy: userId,
            brJobApplicantStatus: isAlreadySaved ? "INACTIVE" : "REQUESTED",
            fullName: "",
            email: "",
            phone: "",
            companyName: job.companyName,
            jobTitle: job.jobTitle,
            experience: job.experience,
            jobType: job.jobType,
            skills: job.skills,
            location: job.location,
            compensation: job.compensation,
            jobDescriptions: job.jobDescriptions,
            jobInterviewQuestions: job.jobInterviewQuestions,
          },
          "createdBy",
          "brJobId"
        );

        setSavedJobs((prev) => {
          const updated = new Set(prev);
          if (isAlreadySaved) {
            updated.delete(jobId);
          } else {
            updated.add(jobId);
          }
          return updated;
        });
      } catch (error) {
        console.error("Error toggling save job status", error);
      } finally {
        setSavingJobId(null);
      }
    };

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

                  {!isPracticePage && getUserRole() === "CAREER SEEKER" && (
                    <IconButton
                      onClick={() => handleSaveJob(job)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "white",
                        borderRadius: "50%",
                        zIndex: 1,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
                      }}
                    >
                      {savingJobId === job.brJobId ? (
                        <CircularProgress size={18} />
                      ) : savedJobs.has(job.brJobId) ? (
                        <FontAwesomeIcon
                          icon={faBookmark}
                          color={color.newFirstColor}
                        />
                      ) : (
                        <FontAwesomeIcon icon={faBookmark} color="#ccc" />
                      )}
                    </IconButton>
                  )}

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
                                      <AnimatePresence mode="wait">
                                        <motion.span
                                          key={
                                            applicantsMap[job.brJobId]
                                              ?.length || 0
                                          }
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 5 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {(() => {
                                            const count =
                                              applicantsMap[job.brJobId]
                                                ?.length || 0;
                                            return count > 100
                                              ? "100+ Applicants"
                                              : `${count} Applicant${
                                                  count !== 1 ? "s" : ""
                                                }`;
                                          })()}
                                        </motion.span>
                                      </AnimatePresence>
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
        <Box px={2} mb={4} position={"relative"}>
          {!isPracticePage && (
            <Box
              sx={{
                position: "absolute",
                right: 10,
                top: 15,
              }}
            >
              {getUserRole() === "CAREER SEEKER" && (
                <BeyondResumeButton
                  sx={{
                    px: 1,
                    mr: 1,
                    background: showSavedJobs ? color.background : "grey",
                    border: "none",
                  }}
                  variant="outlined"
                  onClick={() => setShowSavedJobs((prev) => !prev)}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "2px" }}
                    icon={faBookmark}
                  ></FontAwesomeIcon>{" "}
                </BeyondResumeButton>
              )}

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

          <AnimatePresence mode="wait">
            {showSavedJobs ? (
              <motion.div
                key="savedJobs"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <JobsSection title="Saved Jobs" jobs={savedJobs} />
              </motion.div>
            ) : (
              <>
                {isJobPage ? (
                  <>
                    {activeJobs.length > 0 && (
                      <motion.div
                        key="activeJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <JobsSection
                          title="Posted Jobs"
                          jobs={activeJobs}
                          type="active"
                        />
                      </motion.div>
                    )}

                    {pendingJobs.length > 0 && (
                      <motion.div
                        key="pendingJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <JobsSection title="Pending Jobs" jobs={pendingJobs} />
                      </motion.div>
                    )}

                    {completedJobs.length > 0 && (
                      <motion.div
                        key="completedJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <JobsSection
                          title="Completed Jobs"
                          jobs={completedJobs}
                        />
                      </motion.div>
                    )}

                    {pendingJobs.length === 0 &&
                      activeJobs.length === 0 &&
                      completedJobs.length === 0 && (
                        <motion.div
                          key="noJobs"
                          variants={fadeVariant}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Typography
                            variant="body1"
                            sx={{ textAlign: "center", mt: 4 }}
                          >
                            No jobs available.
                          </Typography>
                        </motion.div>
                      )}
                  </>
                ) : isPracticePage ? (
                  <>
                    {filteredJobs.length > 0 ? (
                      <motion.div
                        key="practiceJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <JobsSection
                          title="Practice Pools"
                          jobs={filteredJobs}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="noPracticeJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center", mt: 8 }}
                        >
                          No practice jobs yet.
                        </Typography>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    {filteredJobs.length > 0 ? (
                      <motion.div
                        key="recommendedJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <JobsSection
                          title="Recommended Jobs"
                          jobs={filteredJobs}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="noRecommendedJobs"
                        variants={fadeVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center", mt: 8 }}
                        >
                          No recommended jobs found.
                        </Typography>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}
          </AnimatePresence>
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
