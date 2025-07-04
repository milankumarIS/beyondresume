import {
  faBriefcase,
  faChevronCircleRight,
  faClock,
  faFilter,
  faInfoCircle,
  faLayerGroup,
  faLocationDot,
  faPen,
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
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import BeyondResumeJobFilterComponent from "./Beyond Resume Components/BeyondResumeJobFilterComponent";
import { BeyondResumeButton } from "../../components/util/CommonStyle";

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
  type Filters = {
    payroll: string[];
    jobType: string[];
    jobTitle: string[];
    jobMode: string[];
  };

  useEffect(() => {
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
                  borderRadius: 2,
                  height: "100%",
                  boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.1)",
                  border: "solid 1.5px transparent",
                  transition: "all 0.3s",

                  "&:hover": {
                    border: "solid 1.5px",
                    borderColor: color.newFirstColor,
                  },
                }}
              >
                <CardContent
                  sx={{ position: "relative" }}
                  style={{
                    paddingBottom: "16px",
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
                      mt={2}
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

                    <Button
                      onClick={() => {
                        setSelectedJobId(job.brJobId);
                        setPopupOpen(true);
                      }}
                      sx={{
                        background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                        px: 2,
                        borderRadius: "6px 0px 6px 0px",
                        position: "absolute",

                        ml: -2,
                        mt: -7,
                        minWidth: "0px",
                        cursor: "pointer",
                        color: "white",
                        textTransform: "none",
                        fontSize: "12px",
                      }}
                    >
                      <Typography mt={1} fontSize={"12px"}>
                        {" "}
                        {timeAgo(job.createdAt)}{" "}
                      </Typography>
                    </Button>

                    {!isPracticePage && title !== "Completed Jobs" && (
                      <Button
                        onClick={() => {
                          setSelectedJobId(job.brJobId);
                          setPopupOpen(true);
                        }}
                        sx={{
                          background:
                            "linear-gradient(180deg, #50bcf6, #5a81fd)",
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
                    <Grid2 container>
                      <Grid2 size={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          <FontAwesomeIcon icon={faBriefcase} />{" "}
                          {job.companyName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <FontAwesomeIcon icon={faClock} />{" "}
                          {formatDateJob(job?.endDate)}
                        </Typography>
                      </Grid2>

                      <Grid2 size={{ xs: 12, md: 6 }} sx={{ pl: 4 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                                         sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          <FontAwesomeIcon icon={faUserTie} /> {job.jobType}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                                         sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          <FontAwesomeIcon icon={faLocationDot} /> {job.jobMode}
                        </Typography>
                      </Grid2>
                    </Grid2>
                  )}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    {!isPracticePage && (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        color="#50bcf6"
                      >
                        {/* <FontAwesomeIcon icon={faLocationDot} />
                      <Typography variant="caption">{job.location}</Typography> */}
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    p: 0.5,
                                    fontSize: "13px",
                                  }}
                                >
                                  <CircularProgress size={16} /> Loading
                                  applicants...
                                </Typography>
                              ) : (
                                applicantsMap[job.brJobId]?.length > 0 && (
                                  <Typography
                                    color="text.secondary"
                                    variant="body2"
                                    mb={1}
                                    sx={{
                                      transition: "all 0.6s ease",
                                      borderRadius: "4px",
                                      p: 0.5,
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faUserTie} />{" "}
                                    {(() => {
                                      const count =
                                        applicantsMap[job.brJobId]?.length || 0;
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
                            <Typography
                              color="text.secondary"
                              variant="body2"
                              mb={0}
                              sx={{
                                transition: "all 0.6s ease",
                                borderRadius: "4px",
                                p: 0.5,
                              }}
                            >
                              <FontAwesomeIcon icon={faUserTie} /> 0
                              Applicant(s)
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                    <Button
                      size="small"
                      // variant="contained"
                      onClick={() => handleViewMore(job)}
                      sx={{
                        background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                        // color: color.newFirstColor,
                        color: "white",
                        textTransform: "none",
                        // border: "solid 1px",
                        px: 2,
                        py: 1,
                        borderRadius: "999px",
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        alignItems: "center",
                        width: isPracticePage ? "100%" : "auto",
                      }}
                    >
                      {isPracticePage ? "Proceed To Practice" : "View more"}{" "}
                      <FontAwesomeIcon
                        style={{ marginTop: "2px" }}
                        icon={faChevronCircleRight}
                      />
                    </Button>
                  </Box>
                </CardContent>
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
                sx={{ position: "absolute", right: 30 }}
              >
                <FontAwesomeIcon
                  style={{ marginRight: "4px" }}
                  icon={faPen}
                ></FontAwesomeIcon>{" "}
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
    </Box>
  );
};

export default BeyondResumeJobs;
