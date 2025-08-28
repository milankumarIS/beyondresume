import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, Grid, TextField, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  jobFunctions,
  jobMode,
  JobSeekerScriptLines,
  jobType,
  payroll,
  STATUS_CONFIG,
} from "../../components/form/data";
import PaginationControlled from "../../components/shared/Pagination";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import GradientText, {
  BeyondResumeButton,
  CustomTabs,
  slideLeftVariants,
} from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { useTheme } from "../../components/util/ThemeContext";
import { useUserData } from "../../components/util/UserDataContext";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  paginateDataFromTable,
  searchDataFromTable,
  searchListDataFromTable,
  syncByTwoUniqueKeyData,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import AssessedApplicants from "./Beyond Resume Components/AssessedApplicants";
import BeyondResumeAvatar from "./Beyond Resume Components/BeyondResumeAvatar";
import BeyondResumeJobFilterComponent from "./Beyond Resume Components/BeyondResumeJobFilterComponent";
import JobCard from "./Beyond Resume Components/JobCard";
import { fetchMatchingUsers } from "./Beyond Resume Components/MatchingUsersList";
import BeyondResumeJobDetails from "./BeyondResumeJobDetails";
import MatchingUserCard from "./Beyond Resume Components/MatchingUserCard";
import { useNewSnackbar } from "../../components/shared/useSnackbar";
import CustomSnackbar from "../../components/util/CustomSnackbar";
import PendingAssessmentApplicants from "./Beyond Resume Components/PendingAssessmentApplicants";
import { useIndustry } from "../../components/util/IndustryContext";

type Job = {
  companyName: any;
  location: any;
  brJobId: string;
  payroll: string;
  jobType: string;
  jobTitle: string;
  jobMode: string;
  endDate?: string;
};

const BeyondResumeJobs = () => {
  const { industryName, spaceIndustryName } = useIndustry();

  const [searchTerm, setSearchTerm] = useState("");

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [searchedSavedJobs, setSearchedSavedJobs] = useState<any[]>([]);

  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);

  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [seekerJobs, setSeekerJobs] = useState<any[]>([]);
  const { userData } = useUserData();

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
  const { snackbarProps, showSnackbar } = useNewSnackbar();

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

  const sortByNewest = (jobs: any[]) =>
    jobs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [jobPreference, setJobPreference] = useState<{
    location?: string;
    workplace?: string;
    employmentType?: string;
    shift?: string;
  }>({});
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [showRecommendedJobs, setShowRecommendedJobs] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = getUserId();

      try {
        const skillRes = await searchDataFromTable("userPersonalInfo", {
          userId,
        });
        const skillsArray = Array.isArray(skillRes?.data?.data?.skills)
          ? skillRes.data.data.skills.map((s: string) => s.toLowerCase())
          : [];
        setUserSkills(skillsArray);

        const prefRes = await searchDataFromTable("userJobPreference", {
          userId,
        });
        const item = prefRes?.data?.data;
        setJobPreference({
          location: item?.preferedLocation?.toLowerCase(),
          shift: item?.preferedShipt?.toLowerCase(),
          workplace: item?.workplace?.toLowerCase(),
          employmentType: item?.employmentType?.toLowerCase(),
        });
      } catch (error) {
        console.error("Failed to fetch user profile info", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userSkills.length) return;

    const matched: any[] = [];
    const unmatched: any[] = [];

    seekerJobs.forEach((job) => {
      const jobSkillsArray = Array.isArray(job.skills)
        ? job.skills
        : typeof job.skills === "string"
        ? job.skills.split(",").map((s) => s.trim())
        : [];

      const jobSkills = jobSkillsArray.map((s: string) => s.toLowerCase());

      const skillMatched = jobSkills.some((skill: string) =>
        userSkills.includes(skill)
      );

      if (skillMatched) {
        matched.push(job);
      } else {
        unmatched.push(job);
      }
    });

    setRecommendedJobs(matched);
  }, [userSkills, seekerJobs]);

  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [totalCount1, setTotalCount1] = useState(0);
  const [totalCount2, setTotalCount2] = useState(0);
  const [totalCount3, setTotalCount3] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    const now = new Date();
    const createdBy = getUserId();

    try {
      if (isJobPage) {
        const [activeResult, pendingResult, closedResult] = await Promise.all([
          paginateDataFromTable("brJobs", {
            page: page1 - 1,
            pageSize: 10,
            data: {
              brJobStatus: "ACTIVE",
              createdBy,
              fieldName: "endDate",
              fieldValue: new Date().toISOString(),
              filter: "",
              fields: [],
            },
          }),
          paginateDataFromTable("brJobs", {
            page: page2 - 1,
            pageSize: 10,
            data: {
              brJobStatus: "INPROGRESS",
              createdBy,
              filter: "",
              fields: [],
            },
          }),
          paginateDataFromTable("brJobs", {
            page: page3 - 1,
            pageSize: 10,
            data: {
              brJobStatus: "CLOSED",
              fieldName: "endDate",
              fieldValue: new Date().toISOString(),
              createdBy,
              filter: "",
              fields: [],
            },
          }),
        ]);

        // console.log(activeResult);
        // console.log(pendingResult);
        // console.log(closedResult);

        setTotalCount1(activeResult?.data?.data?.count);
        setTotalCount2(pendingResult?.data?.data?.count);
        setTotalCount3(closedResult?.data?.data?.count);

        const allActiveJobs = activeResult?.data?.data?.rows || [];
        const allPendingJobs = pendingResult?.data?.data?.rows || [];
        const allExpiredJobs = closedResult?.data?.data?.rows || [];

        setActiveJobs(sortByNewest(allActiveJobs));
        setPendingJobs(sortByNewest(allPendingJobs));
        setCompletedJobs(sortByNewest(allExpiredJobs));
      } else {
        const [result, confirmedJobs, appliedJobs, userSavedJobs] =
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

        const allActiveJobs = result?.data?.data.filter(
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
        // setActiveJobs(sortedActive);

        const filtered = applyFilters(sortedActive);
        setFilteredJobs(filtered);
        setSeekerJobs(filtered);
        console.log(filtered);

        const savedJobIds = new Set(
          (userSavedJobs?.data?.data || []).map((job) => job.brJobId)
        );

        const savedJobsFromFiltered = filtered.filter((job) =>
          savedJobIds.has(job.brJobId)
        );

        setSavedJobs(savedJobsFromFiltered);
        setSearchedSavedJobs(savedJobsFromFiltered);
        // setSavedJobs(userSavedJobs?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    setSearchTerm(spaceIndustryName ?? "");
  }, [isJobPage, showSavedJobs, page1, page2, page3]);

  const toggleStatus = async () => {
    try {
      await updateByIdDataInTable(
        "brJobs",
        selectedJobId,
        { brJobStatus: "CLOSED" },
        "brJobId"
      );
      showSnackbar("Job Deleted Successfully", "success");

      await fetchJobs();
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Failed to update status. Please try again.", "success");
    } finally {
      setPopupOpen(false);
    }
  };

  const effectiveTerm = (
    searchTerm?.trim() ||
    spaceIndustryName ||
    ""
  ).toLowerCase();

  // useEffect(() => {
  //   if (!isJobPage) {
  //     const term = searchTerm.toLowerCase();
  //     if (term === "") {
  //       setSeekerJobs(filteredJobs);
  //       setSearchedSavedJobs(savedJobs);
  //     } else {
  //       const results = filteredJobs.filter(
  //         (job) =>
  //           job.jobTitle?.toLowerCase().includes(term) ||
  //           job.description?.toLowerCase().includes(term) ||
  //           job.location?.toLowerCase().includes(term) ||
  //           job.companyName?.toLowerCase().includes(term)
  //       );
  //       const results1 = savedJobs.filter(
  //         (job) =>
  //           job.jobTitle?.toLowerCase().includes(term) ||
  //           job.description?.toLowerCase().includes(term) ||
  //           job.location?.toLowerCase().includes(term) ||
  //           job.companyName?.toLowerCase().includes(term)
  //       );
  //       setSeekerJobs(results);
  //       setSearchedSavedJobs(results1);
  //     }
  //   }
  // }, [searchTerm, spaceIndustryName]);

  useEffect(() => {
    if (isJobPage) return;

    const matches = (job: any) => {
      const t = effectiveTerm;
      if (!t) return true;
      const fields = [
        job.jobTitle,
        job.description,
        job.location,
        job.companyName,
      ];
      return fields.some((f) => f?.toLowerCase?.().includes(t));
    };

    setSeekerJobs(filteredJobs.filter(matches));
    setSearchedSavedJobs(savedJobs.filter(matches));
  }, [effectiveTerm, isJobPage, filteredJobs, savedJobs]);

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
    const [statusCountsMap, setStatusCountsMap] = useState<
      Record<string, { label: string; count: number; color: string }[]>
    >({});
    const [savedJobsSet, setSavedJobsSet] = useState<Set<string>>(new Set());
    const [loadingApplicants, setLoadingApplicants] = useState<boolean>(true);
    const [selectedJob, setSelectedJob] = useState<any | null>(null);
    const [selectedApplicantsCount, setSelectedApplicantsCount] =
      useState<number>(0);
    const [matchingUsers, setMatchingUsers] = useState<
      {
        userId: number;
        fullName: string;
        matchPercent: number;
        matchedSkills: string[];
        userImage: string;
        jobId: string;
        resumeFileUrl?: string;
        about?: string;
      }[]
    >([]);

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
        setSavedJobsSet(savedSet);
      };

      fetchSavedJobs();
    }, []);

    useEffect(() => {
      (async () => {
        const allMatches: {
          userId: number;
          fullName: string;
          matchPercent: number;
          matchedSkills: string[];
          userImage: string;
          jobId: string;
          resumeFileUrl?: string;
          about?: string;
        }[] = [];

        for (const job of jobs) {
          const { matches } = await fetchMatchingUsers(job);

          allMatches.push(
            ...matches.map((m) => ({
              ...m,
              jobId: job.brJobId,
            }))
          );
        }

        setMatchingUsers(allMatches);

        const fetchApplicantsMap = async () => {
          setLoadingApplicants(true);
          const map: Record<string, any[]> = {};
          const statusMap: Record<
            string,
            { label: string; count: number; color: string }[]
          > = {};

          const promises = jobs.map(async (job) => {
            const res = await searchListDataFromTable("brJobApplicant", {
              brJobId: job.brJobId,
            });

            const applicants = res.data.data || [];
            map[job.brJobId] = applicants;

            const counts: Record<string, number> = {};

            counts["APPLIED"] = applicants.length;
            counts["PENDING ASSESSMENT"] = applicants.filter(
              (a) => a.brJobApplicantStatus === "APPLIED"
            ).length;
            counts["ASSESSED"] = applicants.filter(
              (a) => a.brJobApplicantStatus === "CONFIRMED"
            ).length;

            counts["SUGGESTED"] = allMatches.filter(
              (m) => m.jobId === job.brJobId
            ).length;

            statusMap[job.brJobId] = STATUS_CONFIG.map((status) => ({
              ...status,
              count: counts[status.label] ?? 0,
            }));
          });

          await Promise.all(promises);
          setApplicantsMap(map);
          setStatusCountsMap(statusMap);
          setLoadingApplicants(false);
        };

        await fetchApplicantsMap();
      })();
    }, []);

    const handleSaveJob = async (job: any) => {
      const jobId = job?.brJobId;
      const userId = getUserId();
      const isAlreadySaved = savedJobsSet.has(jobId);

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

        setSavedJobsSet((prev) => {
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

    const [activeTab, setActiveTab] = useState<
      "SUGGESTED" | "ASSESSED" | "PENDING ASSESSMENT"
    >("ASSESSED");

    return (
      <Box mb={4} mt={2} display="flex" gap={2} alignItems="flex-start">
        <Box
          className="custom-scrollbar"
          sx={{
            p: 1,
            mt: getUserRole() === "TALENT PARTNER" ? 10 : 2,
            width: jobs.length > 0 ? "35vw" : "100%",
            height: detailsHeight || "auto",
            minHeight: "100vh",
            overflow: "auto",
            transition: "height 0.3s ease",
            flexShrink: 0,
            borderRadius: 4,
          }}
        >
          {title === "Recommended Jobs" && showRecommendedJobs && (
            <>
              {showRecommendedJobs && jobs.length > 0 ? (
                <Typography
                  sx={{
                    fontFamily: "montserrat-regular",
                    fontSize: "14px",
                    mb: 1,
                  }}
                >
                  We found {jobs.length} job{jobs.length > 1 ? "s" : ""} based
                  on your profile.
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontFamily: "montserrat-regular",
                    fontSize: "16px",
                    mb: 1,
                    hyphens: "auto",
                    textAlign: "center",
                  }}
                >
                  Looks like we don’t have a perfect match for your profile just
                  yet. Don’t worry great matches start with a sharp profile!.
                  <br />
                  Update your profile to unlock tailored recommendations.
                  {/* <br/> Your
                  next opportunity could just be one click away */}
                </Typography>
              )}
            </>
          )}

          <Grid sx={{ minHeight: "30px" }} container spacing={4}>
            {jobs.map((job, index) => (
              <Grid item xs={12} key={index}>
                <JobCard
                  job={job}
                  isJobPage={isJobPage}
                  title={title}
                  theme={theme}
                  color={color}
                  savingJobId={savingJobId}
                  savedJobs={savedJobsSet}
                  applicantsMap={applicantsMap}
                  statusCounts={statusCountsMap[job.brJobId] || []}
                  loadingApplicants={loadingApplicants}
                  getUserRole={getUserRole}
                  handleSaveJob={handleSaveJob}
                  handleViewMore={handleViewMore}
                  setSelectedJobId={setSelectedJobId}
                  setPopupOpen={setPopupOpen}
                  selected={selectedJob?.brJobId === job.brJobId}
                  showStatus={false}
                  // showStatus={title !== "Pending Jobs"}
                />
              </Grid>
            ))}

            {jobs.length > 0 && getUserRole() === "TALENT PARTNER" && (
              <Box sx={{ width: "100%" }}>
                {title === "Posted Jobs" ? (
                  <PaginationControlled
                    page={page1}
                    setPage={setPage1}
                    count={totalCount1}
                  ></PaginationControlled>
                ) : title === "Pending Jobs" ? (
                  <PaginationControlled
                    page={page2}
                    setPage={setPage2}
                    count={totalCount2}
                  ></PaginationControlled>
                ) : (
                  <PaginationControlled
                    page={page3}
                    setPage={setPage3}
                    count={totalCount3}
                  ></PaginationControlled>
                )}
              </Box>
            )}
          </Grid>

          {title === "Recommended Jobs" && showRecommendedJobs && (
            <BeyondResumeButton
              sx={{ mt: 2, width: "90%", mx: "auto", display: "block" }}
              onClick={() => {
                setRecommendedJobs(seekerJobs);
                setShowRecommendedJobs(false);
              }}
            >
              Explore All Jobs
            </BeyondResumeButton>
          )}
        </Box>

        {jobs.length > 0 && (
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
                    showJD={
                      title === "Posted Jobs" || title === "Completed Jobs"
                        ? false
                        : true
                    }
                  />

                  {isJobPage &&
                  (title === "Posted Jobs" || title === "Completed Jobs") ? (
                    <Box>
                      <Box
                        display="flex"
                        alignItems={"center"}
                        width={"100%"}
                        justifyContent={"center"}
                        gap={2}
                        mb={2}
                        p={2}
                      >
                        <div
                          onClick={() => setActiveTab("SUGGESTED")}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background:
                              activeTab === "SUGGESTED" ? "#16a34a" : "grey",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              marginRight: "6px",
                            }}
                          >
                            {
                              matchingUsers.filter(
                                (m) => m.jobId === selectedJob.brJobId
                              ).length
                            }
                          </span>
                          Suggested Matches
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background:
                              activeTab === "ASSESSED" ? "#16a34a" : "grey",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveTab("ASSESSED")}
                        >
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              marginRight: "6px",
                            }}
                          >
                            {statusCountsMap[selectedJob.brJobId]?.find(
                              (s) => s.label === "ASSESSED"
                            )?.count ?? 0}
                          </span>
                          Assessed Candidates
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background:
                              activeTab === "PENDING ASSESSMENT"
                                ? "#f97316"
                                : "grey",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                          onClick={() => setActiveTab("PENDING ASSESSMENT")}
                        >
                          <span
                            style={{
                              background: "rgba(255, 255, 255, 0.2)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              marginRight: "6px",
                            }}
                          >
                            {statusCountsMap[selectedJob.brJobId]?.find(
                              (s) => s.label === "PENDING ASSESSMENT"
                            )?.count ?? 0}
                          </span>
                          Pending Assement
                        </div>
                      </Box>

                      {activeTab === "SUGGESTED" ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          {matchingUsers.filter(
                            (m) => m.jobId === selectedJob.brJobId
                          ).length > 0 ? (
                            matchingUsers
                              .filter((m) => m.jobId === selectedJob.brJobId)
                              .map((applicant, idx) => (
                                <MatchingUserCard
                                  key={idx}
                                  user={applicant}
                                  color={color}
                                />
                              ))
                          ) : (
                            <Typography width={"100%"} textAlign={"center"}>
                              No suggested candidates found.
                            </Typography>
                          )}
                        </Box>
                      ) : activeTab === "PENDING ASSESSMENT" ? (
                        <PendingAssessmentApplicants
                          brJobId={selectedJob.brJobId}
                          color={color}
                        />
                      ) : (
                        <AssessedApplicants
                          brJobId={selectedJob.brJobId}
                          color={color}
                        />
                      )}
                    </Box>
                  ) : (
                    <></>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        )}
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

  // console.log(searchTerm);

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
        return (
          job?.jobTitle?.toLowerCase().includes(term) ||
          job?.location?.toLowerCase().includes(term) ||
          job?.companyName?.toLowerCase().includes(term)
        );
      });
  };

  useEffect(() => {
    const filtered = filterAndSearchJobs(currentSection.jobs);

    setTabFilteredJobs(filtered);
  }, [filters, searchTerm, selectedTab, currentSection.jobs]);

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
        {getUserRole() === "CAREER SEEKER" ? (
          <>
            <Typography variant="h4">Hi</Typography>
            <GradientText text={userData?.firstName} variant="h4" />
          </>
        ) : (
          <>
            <Box display={"flex"} alignItems={"center"} gap={1} mb={0.5}>
              {industryName === "translab.io" ? (
                <Box
                  sx={{
                    // background: "white",
                    padding: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <img
                    style={{
                      width: "180px",
                      // borderRadius: "4px",
                    }}
                    src="/assets/translab.png"
                    alt=""
                  />
                </Box>
              ) : (
                <GradientText text={industryName} variant="h4" />
              )}
            </Box>
          </>
        )}
      </Box>

      <Typography
        textAlign={"center"}
        variant="h5"
        sx={{
          fontFamily: "Montserrat-Regular",
        }}
      >
        {getUserRole() === "CAREER SEEKER"
          ? "Let’s find your perfect fit!"
          : "Manage every open role in one place"}
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
              placeholder="Search jobs by title or company"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // onKeyPress={(e) => {
              //   if (e.key === "Enter") handleSearch();
              // }}
              sx={{
                "& .MuiInputBase-input": {
                  borderRadius: "12px",
                  paddingTop: "8px !important",
                  paddingBottom: "8px !important",
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

        {getUserRole() === "CAREER SEEKER" && (
          <BeyondResumeButton
            sx={{
              px: 3,
              py: 1,
              borderRadius: "12px",
              background: showSavedJobs ? color.activeButtonBg : "white",
              color: showSavedJobs ? "white" : "black",
              // boxShadow: "0px 0px 10px rgba(90, 128, 253, 0.49)",
              ml: 1,
              textTransform: "none",
              fontSize: "14px",
              fontFamily: "custom-regular",
              border: "none",
              "&:hover": {
                transform: "scale(1)",
              },
            }}
            variant="outlined"
            onClick={() => setShowSavedJobs((prev) => !prev)}
          >
            {" "}
            Saved Jobs
            {/* <FontAwesomeIcon
              style={{ marginLeft: "4px" }}
              icon={faBookmark}
            ></FontAwesomeIcon>{" "} */}
          </BeyondResumeButton>
        )}
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
          <AnimatePresence mode="wait">
            {showSavedJobs ? (
              <motion.div
                key="savedJobs"
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {searchedSavedJobs.length > 0 ? (
                  <JobsSection title="Saved Jobs" jobs={searchedSavedJobs} />
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mt: 4 }}
                  >
                    No saved jobs yet!
                  </Typography>
                )}
              </motion.div>
            ) : isJobPage ? (
              <motion.div
                key={currentSection.key}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ position: "relative" }}
              >
                <Box
                  mt={2}
                  mb={2}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "7%",
                    // background:color.jobCardBg,
                    // borderRadius: "32px",
                    zIndex: 1000,
                  }}
                >
                  {tabFilteredJobs.length > 0 && (
                    <CustomTabs
                      selectedTab={selectedTab}
                      onChange={handleTabChange}
                      durationTabs={durationTabs}
                    />
                  )}
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
                  seekerJobs.length > 0
                    ? "recommendedJobs"
                    : "noRecommendedJobs"
                }
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {seekerJobs.length > 0 ? (
                  <JobsSection
                    title="Recommended Jobs"
                    jobs={showRecommendedJobs ? recommendedJobs : seekerJobs}
                  />
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

      <CustomSnackbar {...snackbarProps} />

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
