import {
  faBookmark,
  faInfoCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  jobFunctions,
  jobMode,
  JobSeekerScriptLines,
  jobType,
  payroll,
} from "../../components/form/data";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import GradientText, {
  BeyondResumeButton,
  CustomTabs,
  slideLeftVariants,
} from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { useTheme } from "../../components/util/ThemeContext";
import {
  getUserFirstName,
  getUserId,
  getUserRole,
} from "../../services/axiosClient";
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
import JobCard from "./Beyond Resume Components/JobCard";
import BeyondResumeJobDetails from "./BeyondResumeJobDetails";
import React from "react";

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
  const { theme } = useTheme();

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

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = activeJobs.filter(
      (job) =>
        job.jobTitle?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
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
          job.description?.toLowerCase().includes(term) ||
          job.location?.toLowerCase().includes(term)
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

    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [selectedApplicantsCount, setSelectedApplicantsCount] =
      useState<number>(0);

    useEffect(() => {
      if (jobs.length > 0 && !selectedJob) {
        const first = jobs[0];
        setSelectedJob(first);
        setSelectedApplicantsCount(applicantsMap[first.brJobId]?.length || 0);
      }
    }, [jobs]);

    const handleViewMore = (job: any) => {
      const applicantsCount = applicantsMap[job.brJobId]?.length || 0;
      setSelectedJob(job);
      setSelectedApplicantsCount(applicantsCount);
    };

    useEffect(() => {
      const fetchSavedJobs = async () => {
        const userId = getUserId();
        const savedSet = new Set<string>();

        const promises = jobs.map((job) =>
          searchListDataFromTable("brJobApplicant", {
            brJobApplicantStatus: ["REQUESTED"],
            brJobId: job.brJobId,
            createdBy: userId,
          }).then((res) => {
            const hasRequested = res.data.data?.some(
              (a) => a.brJobApplicantStatus === "REQUESTED"
            );
            if (hasRequested) savedSet.add(job.brJobId);
          })
        );

        await Promise.all(promises);
        setSavedJobs(savedSet);
      };

      fetchSavedJobs();
    }, []);

    useEffect(() => {
      const fetchApplicantsMap = async () => {
        setLoadingApplicants(true);
        const map: Record<string, any[]> = {};

        const promises = jobs.map((job) =>
          searchListDataFromTable("brJobApplicant", {
            brJobApplicantStatus: ["CONFIRMED"],
            brJobId: job.brJobId,
          }).then((res) => {
            map[job.brJobId] = res.data.data || [];
          })
        );

        await Promise.all(promises);
        setApplicantsMap(map);
        setLoadingApplicants(false);
      };

      fetchApplicantsMap();
    }, []);

    const handleSaveJob = async (job: any) => {
      const jobId = job?.brJobId;
      const userId = getUserId();
      const isAlreadySaved = savedJobs.has(jobId);

      // setSavingJobId(jobId);

      const payload = {
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
      };

      try {
        await syncByTwoUniqueKeyData(
          "brJobApplicant",
          payload,
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

    const [detailsHeight, setDetailsHeight] = useState<number>(0);
    const detailsWrapperRef = useRef<HTMLDivElement | null>(null);

    // Reliable ResizeObserver on stable wrapper
    useEffect(() => {
      const node = detailsWrapperRef.current;
      if (!node) return;

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDetailsHeight(entry.contentRect.height);
        }
      });

      observer.observe(node);
      return () => observer.disconnect();
    }, []);
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (detailsWrapperRef.current) {
          setDetailsHeight(detailsWrapperRef.current.offsetHeight);
        }
      }, 300);
      return () => clearTimeout(timeout);
    }, [selectedJob]);

    return (
      <Box mt={4} mb={4} display="flex" gap={2} alignItems="flex-start">
        <Box
          className="custom-scrollbar"
          sx={{
            p:1,
            width: "35vw",
            height: detailsHeight || "auto",
            overflow: "auto",
            transition: "height 0.3s ease",
            flexShrink: 0,
          }}
        >
          <Grid container spacing={4}>
            {jobs.map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard
                  job={job}
                  isJobPage={isJobPage}
                  title={title}
                  theme={theme}
                  color={color}
                  savingJobId={savingJobId}
                  savedJobs={savedJobs}
                  applicantsMap={applicantsMap}
                  loadingApplicants={loadingApplicants}
                  getUserRole={getUserRole}
                  handleSaveJob={handleSaveJob}
                  handleViewMore={handleViewMore}
                  setSelectedJobId={setSelectedJobId}
                  setPopupOpen={setPopupOpen}
                  selected={selectedJob?.brJobId === job.brJobId}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* RIGHT BOX */}
        <Box ref={detailsWrapperRef} sx={{ flexGrow: 1 }}>
          <AnimatePresence mode="wait">
            {selectedJob && (
              <motion.div
                key={selectedJob.brJobId}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideLeftVariants}
              >
                <BeyondResumeJobDetails
                  job={selectedJob}
                  applicantsCount={selectedApplicantsCount}
                  onBack={() => setSelectedJob(null)}
                  setPopupOpen={setPopupOpen}
                  setSelectedJobIdC={setSelectedJobId}
                  selectedTab={selectedTab}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    );
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const durationTabs = ["Live", "Draft", "Closed"];
  const jobSections = [
    {
      key: "activeJobs",
      title: "Posted Jobs",
      jobs: activeJobs,
      type: "active",
    },
    {
      key: "pendingJobs",
      title: "Pending Jobs",
      jobs: pendingJobs,
      type: "pending",
    },
    {
      key: "completedJobs",
      title: "Completed Jobs",
      jobs: completedJobs,
      type: "completed",
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const currentSection = jobSections[selectedTab];
  const [tabFilteredJobs, setTabFilteredJobs] = useState<Job[]>([]);

  const filterAndSearchJobs = (jobs: Job[]) => {
    const term = searchTerm.toLowerCase();

    return jobs
      .filter((job) => {
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
      })
      .filter((job) => {
        return job.jobTitle?.toLowerCase().includes(term);
      });
  };

  useEffect(() => {
    if (isJobPage) {
      const filtered = filterAndSearchJobs(currentSection.jobs);
      setTabFilteredJobs(filtered);
    }
  }, [filters, searchTerm, isJobPage, selectedTab]);

  return (
    <Box className="full-screen-div">
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4">Hi</Typography>
        <GradientText text={getUserFirstName()} variant="h4" />
      </Box>

      <Typography
        textAlign={"center"}
        variant="h5"
        sx={{
          fontFamily: "Montserrat-Regular",
        }}
      >
        {getUserRole() === "CAREER SEEKER"
          ? "Here are roles that match your profile!"
          : "Track, edit, and manage your job listings here."}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mb: 4,
            zIndex: 2,
            position: "relative",
            mt: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              width: "300px",
              py: 0,
              ...commonFormTextFieldSx,
            }}
          >
            <TextField
              placeholder="Search"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
              }}
            />
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                color: "#fff",
                background: color.activeButtonBg,
                padding: "6px",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>
        <BeyondResumeJobFilterComponent
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
        />
      </Box>

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

          <Typography variant="h6" sx={{ mb: 2 }}>
            Fetching Jobs
          </Typography>
        </Box>
      ) : (
        <Box px={2} mb={4} position={"relative"}>
          <Box
            sx={{
              position: "absolute",
              right: 10,
              top: 15,
            }}
          >
            {/* {getUserRole() === "CAREER SEEKER" && (
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
            )} */}
          </Box>

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
            ) : isJobPage ? (
              <motion.div
                key={currentSection.key}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box mt={2} mb={2}>
                  <CustomTabs
                    selectedTab={selectedTab}
                    onChange={handleTabChange}
                    durationTabs={durationTabs}
                  />
                </Box>

                {/* {currentSection.jobs.length > 0 ? (
                  <JobsSection
                    title={currentSection.title}
                    jobs={currentSection.jobs}
                    type={currentSection.type}
                  /> */}

                {tabFilteredJobs.length > 0 ? (
                  <JobsSection
                    title={currentSection.title}
                    jobs={tabFilteredJobs}
                  />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mt: 4 }}
                  >
                    No jobs available.
                  </Typography>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={
                  filteredJobs.length > 0
                    ? "recommendedJobs"
                    : "noRecommendedJobs"
                }
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {filteredJobs.length > 0 ? (
                  <JobsSection title="Recommended Jobs" jobs={filteredJobs} />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mt: 8 }}
                  >
                    No recommended jobs found.
                  </Typography>
                )}
              </motion.div>
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
      />

      {avatarStatus !== null &&
        getUserRole() === "CAREER SEEKER" &&
        avatarStatus !== "CLOSED" &&
        open && (
          <div>
            <BeyondResumeAvatar
              open={open}
              scriptLines={JobSeekerScriptLines}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
    </Box>
  );
};

export default BeyondResumeJobs;
