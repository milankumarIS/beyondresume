import {
  faArrowRight,
  faBriefcase,
  faClock,
  faLayerGroup,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import GradientText, {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../components/util/CommonStyle";
import { useTheme } from "../../components/util/ThemeContext";
import {
  getUserId,
  getUserRole
} from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
  syncDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import { useUserData } from "../../components/util/UserDataContext";

const BeyondResumePracticeJobs = () => {
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
   const { userData } = useUserData();

  const fadeVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
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

  const handleViewMore = (job: any) => {
    {
      history.push(
        `/beyond-resume-practiceInterviewForm/${job.brMockInterviewId}`
      );
    }
  };

  const fetchJobs = async () => {
    setLoading(true);

    try {
      const result = await searchListDataFromTable("brMockInterviews", {
        brMockInterviewStatus: "ACTIVE",
      });
      setActiveJobs(result?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [isJobPage]);

  const JobsSection = ({
    title,
    jobs,
    type,
  }: {
    title: string;
    jobs: any[];
    type?: string;
  }) => {
    const { theme } = useTheme();

    return (
      <Box mt={4} mb={4}>
        <Grid container spacing={4}>
          {jobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  borderRadius: "12px",
                  height: "100%",
                  boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
                  border: "solid 1.5px transparent",
                  transition: "all 0.3s",
                  background: "rgba(94, 94, 94, 0.15)",
                  color: "inherit",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.25)",
                    background:
                      theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
                  },
                }}
              >
                <CardContent
                  sx={{ position: "relative" }}
                  style={{
                    paddingBottom: "16px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    color: "inherit",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    {jobKeywordIcons.map((entry) =>
                      job.jobTitle
                        .toLowerCase()
                        .includes(entry.keyword.toLowerCase()) ? (
                        <img
                          src={entry.iconUrl}
                          alt={entry.keyword}
                          style={{
                            width: 20,
                            height: 20,
                            background:
                              theme !== "dark"
                                ? color.jobCardBg
                                : color.jobCardBgLight,
                            padding: "4px",
                            borderRadius: "50%",
                          }}
                        />
                      ) : null
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        cursor: "pointer",
                      }}
                      onClick={() => handleViewMore(job)}
                    >
                      {job.jobTitle}
                    </Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    mb={1}
                    position={"relative"}
                  >
                    <Grid2 container width={"100%"}>
                      <Grid2 size={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="body2"
                          mb={1}
                          sx={{ fontFamily: "montserrat-regular" }}
                        >
                          <FontAwesomeIcon
                            style={{ marginRight: "6px" }}
                            icon={faBriefcase}
                          />{" "}
                          {job.interviewDuration / 2} Questions
                        </Typography>
                        <Typography
                          variant="body2"
                          mb={1}
                          sx={{ fontFamily: "montserrat-regular" }}
                        >
                          <FontAwesomeIcon
                            style={{ marginRight: "6px" }}
                            icon={faClock}
                          />{" "}
                          {job.interviewDuration} Minutes
                        </Typography>
                      </Grid2>

                      <Grid2 size={{ xs: 12, md: 6 }} sx={{ pl: 4 }}>
                        <Typography
                          variant="body2"
                          mb={1}
                          sx={{ fontFamily: "montserrat-regular" }}
                        >
                          <FontAwesomeIcon
                            style={{ marginRight: "6px" }}
                            icon={faUserTie}
                          />{" "}
                          {job.jobLevel} Level
                        </Typography>

                        {job.percentageList && (
                          <Typography
                            variant="body2"
                            mb={1}
                            sx={{ fontFamily: "montserrat-regular" }}
                          >
                            <FontAwesomeIcon
                              style={{ marginRight: "6px" }}
                              icon={faLayerGroup}
                            />
                            {(() => {
                              try {
                                const parsedList = JSON.parse(
                                  job.percentageList
                                );
                                return Array.isArray(parsedList)
                                  ? parsedList.filter((cat) => cat.percent > 0)
                                      .length
                                  : 0;
                              } catch (e) {
                                console.error(
                                  "Invalid JSON in job.percentageList",
                                  e
                                );
                                return 0;
                              }
                            })()}{" "}
                            Categories
                          </Typography>
                        )}
                      </Grid2>
                    </Grid2>

                    <BeyondResumeButton
                      sx={{ maxWidth: "50px" }}
                      onClick={() => handleViewMore(job)}
                    >
                      <IconButton
                        sx={{
                          p: 0,
                          fontSize: "16px",
                          borderRadius: "999px",
                          color: "white",
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowRight} />
                      </IconButton>
                    </BeyondResumeButton>
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
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4">Hi</Typography>
        <GradientText text={userData?.firstName} variant="h4" />
      </Box>

      <Typography
        mt={2}
        textAlign={"center"}
        variant="h6"
        sx={{
          fontFamily: "Montserrat-Regular",
        }}
      >
        Here are some mock interviews we think you’ll find helpful.
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          gap: 2,
        }}
      >
        <Typography
          textAlign={"center"}
          variant="h6"
          sx={{
            fontFamily: "Montserrat-Regular",
          }}
        >
          Want something else?
        </Typography>
        <BeyondResumeButton2
          onClick={() => history.push("/beyond-resume-interviewForm")}
        >
          Create Your Own
        </BeyondResumeButton2>
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
            Fetching Practice Jobs
          </Typography>
        </Box>
      ) : (
        <Box px={2} mb={4} position={"relative"}>
          <AnimatePresence mode="wait">
            <>
              <>
                {activeJobs.length > 0 ? (
                  <motion.div
                    key="practiceJobs"
                    variants={fadeVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <JobsSection title="Practice Pools" jobs={activeJobs} />
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
            </>
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
};

export default BeyondResumePracticeJobs;

const jobKeywordIcons = [
  {
    keyword: "React",
    iconUrl:
      "https://img.icons8.com/?size=100&id=wPohyHO_qO1a&format=png&color=000000",
  },
  {
    keyword: "Java",
    iconUrl:
      "https://img.icons8.com/?size=100&id=13679&format=png&color=000000",
  },
  {
    keyword: "Python",
    iconUrl:
      "https://img.icons8.com/?size=100&id=13441&format=png&color=000000",
  },
  {
    keyword: "JavaScript",
    iconUrl:
      "https://img.icons8.com/?size=100&id=108784&format=png&color=000000",
  },
  {
    keyword: "SQL",
    iconUrl:
      "https://img.icons8.com/?size=100&id=UFXRpPFebwa2&format=png&color=000000",
  },
  {
    keyword: "Machine Learning",
    iconUrl:
      "https://img.icons8.com/?size=100&id=79275&format=png&color=000000",
  },
  {
    keyword: "Angular",
    iconUrl:
      "https://img.icons8.com/?size=100&id=71257&format=png&color=000000",
  },
];
