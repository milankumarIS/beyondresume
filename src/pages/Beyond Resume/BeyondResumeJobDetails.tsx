import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import {
  faBriefcase,
  faBuilding,
  faChevronCircleDown,
  faChevronCircleRight,
  faClock,
  faEdit,
  faShareNodes,
  faUserTie,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { copyToClipboard } from "../../components/shared/Clipboard";
import { useNewSnackbar } from "../../components/shared/useSnackbar";
import {
  encryptPayload,
  formatDateJob,
  timeAgo,
} from "../../components/util/CommonFunctions";
import GradientText, {
  BeyondResumeButton,
  BeyondResumeButton2,
  commonPillStyle,
  GradientFontAwesomeIcon,
  StyledTypography,
} from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import CustomSnackbar from "../../components/util/CustomSnackbar";
import { useIndustry } from "../../components/context/IndustryContext";
import { useTheme } from "../../components/context/ThemeContext";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import JobFitmentPage from "./Beyond Resume Carrer Seeker/Beyond Resume Job Apply/JobFitmentAnalysis";
import JobTimelineStepper from "./Beyond Resume Components/JobTimelineStepper";
import MatchingUserCard from "./Beyond Resume Components/MatchingUserCard";
import { fetchMatchingUsers } from "./Beyond Resume Components/MatchingUsersList";
import GeneratedAiQnaResponse from "./Beyond Resume Talent Partner/Beyond Resume Job Post/GeneratedAiQnaResponse";
import CYS from "../../services/Secret";
type Props = {
  job: any;
  applicantsCount: number;
  selectedTab: any;
  onBack?: () => void;
  setPopupOpen: (open: boolean) => void;
  showJD?: boolean;
  setSelectedJobIdC: (id: any) => void;
};

const BeyondResumeJobDetails = ({
  job: initialJob,
  applicantsCount,
  onBack,
  setPopupOpen,
  selectedTab,
  showJD = true,
  setSelectedJobIdC,
}: Props) => {
  const { theme } = useTheme();
  const history = useHistory();
  const fitmentRef = useRef<HTMLDivElement | null>(null);
  const questionRef = useRef<HTMLDivElement | null>(null);
  const [job, setJob] = useState<any>(initialJob);
  const [rounds, setRounds] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(!initialJob);

  const location = useLocation();
  const { brJobId } = useParams<{ brJobId: string }>();

  const params = new URLSearchParams(location.search);
  const source = params.get("source");

  const [showFullDescription, setShowFullDescription] = useState(true);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState("");
  const [showQuestion, setShowQuestions] = useState(false);
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const myJobsJD = location.pathname.startsWith(
    "/beyond-resume-myjobs-jobdetails"
  );
  const isApplicationJDPage = location.pathname.startsWith(
    "/beyond-resume-applicationJD"
  );
  const [jobUsername, setjobUsername] = useState("");
  const { snackbarProps, showSnackbar } = useNewSnackbar();
  const [popupOpen, setPopupOpen1] = useState(false);
  const { industryName, setIndustryName, setSpaceIndustryName } = useIndustry();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        setLoading(true);
        const appliedResult: any = await searchDataFromTable("brJobApplicant", {
          createdBy: getUserId(),
          brJobId,
        });

        const appliedData = appliedResult?.data?.data;

        if (source === "from-externalLink" && appliedData) {
          setMessage("You have already applied for this job.");
          setLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching job applicant:", error);
        return false;
      }
    };

    const fetchJob = async () => {
      if (!initialJob && brJobId) {
        try {
          setLoading(true);
          const result: any = await searchDataFromTable("brJobs", { brJobId });
          setJob(result?.data?.data);
          const result1: any = await searchListDataFromTable("brJobRounds", {
            brJobId,
          });
          setRounds(result1?.data?.data);
        } catch (error) {
          console.error("Error fetching job by brJobId:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const init = async () => {
      if (!brJobId) return;
      const alreadyApplied = await fetchApplied();
      if (!alreadyApplied) {
        await fetchJob();
      }
    };

    init();
  }, [initialJob, location.search, setSelectedJobIdC, brJobId]);

  useEffect(() => {
    if (job?.jobDescriptions) {
      const cleanedResponse = job.jobDescriptions
        .replace(/```(?:html)?/g, "")
        .trim();
      setDisplayContent(cleanedResponse);
    }

    if (source === "from-externalLink") {
      setSpaceIndustryName(job?.companyName);
    }
  }, [job]);

  const handleApplyJob = () => {
    history.push(`/beyond-resume-JobInterviewForm/${job?.brJobId}`);
  };

  const handleToggleFitment = () => {
    if (!selectedJobId) {
      setSelectedJobId(job.brJobId);
      setShowFullDescription(false);

      setTimeout(() => {
        fitmentRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setSelectedJobId(null);
      setShowFullDescription(true);
    }
  };

  const [matchingUsers, setMatchingUsers] = useState<
    {
      userId: number;
      fullName: string;
      matchPercent: number;
      matchedSkills: string[];
      userImage: string;
    }[]
  >([]);

  useEffect(() => {
    if (!job) return;

    (async () => {
      const { matches, jobUsername } = await fetchMatchingUsers(job);
      setMatchingUsers(matches);
      setjobUsername(jobUsername);
    })();
  }, [job]);

  const handleCopyLink = async () => {
    const payload = {
      ServiceTypeID: 1020,
      userName: jobUsername,
      brJobId: job?.brJobId,
      brJobTitle: job?.jobTitle,
    };

    const base64Payload = btoa(JSON.stringify(payload));
    // const fullLink = `https://indi.skillablers.com/indi-registration?${base64Payload}`;
    // window.location.href = `/beyond-resume-publicjobdetails?${base64Payload}`;

    const fullLink = `https://br.skillablers.com/beyond-resume-publicjobdetails?${base64Payload}`;

    try {
      await copyToClipboard(fullLink);
      showSnackbar("Link Copied To Clipboard", "success");

      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: "Share Job Link",
          text: "Check out this job link:",
          url: fullLink,
          dialogTitle: "Share via",
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Share Job Link",
          text: "Check out this job link:",
          url: fullLink,
        });
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to share link. Please try again.", "error");
    }
  };

  const toggleStatus = async () => {
    try {
      await updateByIdDataInTable(
        "brJobs",
        job.brJobId,
        { brJobStatus: "CLOSED" },
        "brJobId"
      );
      showSnackbar("Job Closed Successfully", "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Failed to update status. Please try again.", "success");
    } finally {
      setPopupOpen1(false);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
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
          Loading
        </Typography>
      </Box>
    );
  }

  if (message) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          You've already applied for the job.
        </Typography>
        <Typography variant="body2">
          Please check your applications{" "}
          <span
            style={{ cursor: "pointer", color: color.activeColor }}
            onClick={() => {
              history.push(`/beyond-resume-interview-list`);
            }}
          >
            here.
          </span>{" "}
        </Typography>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          This job may have been closed.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please contact the recruiter for more details.
        </Typography>
      </Box>
    );
  }

  const canCloseJob =
    (job?.brJobStatus === "ACTIVE" || job?.brJobStatus === "INPROGRESS") &&
    !!job?.endDate &&
    new Date(job?.endDate) >= new Date();

  const token = encryptPayload(job.brJobId, CYS);

  return (
    <Box>
      <Box
        display={myJobsJD ? "flex" : "none"}
        alignItems={"center"}
        justifyContent={"center"}
        mt={2}
        gap={1}
        mb={0.5}
      >
        {industryName?.toLowerCase() === "translab.io" ? (
          <Box
            sx={{
              // background: "white",
              padding: "4px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
      <Box
        p={2}
        m={{ xs: 0, md: brJobId ? 4 : 0 }}
        mt={0}
        sx={{
          boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.05)",
          borderRadius: 4,
        }}
      >
        <>
          <Box px={1} mt={1} position={"relative"}>
            <Box
              sx={{
                p: 2,
                m: -2,
              }}
            >
              <Box display={"flex"} alignItems={"center"} gap={1} mb={0.5}>
                {job?.companyName?.toLowerCase() ===
                "translab.io".toLowerCase() ? (
                  <Box
                    sx={{
                      background: "white",
                      padding: "4px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        width: "50px",
                        // borderRadius: "4px",
                      }}
                      src="/assets/translab.png"
                      alt=""
                    />
                  </Box>
                ) : (
                  <Box>
                    <FontAwesomeIcon
                      icon={faBuilding}
                      style={{
                        fontSize: "16px",
                        background: "white",
                        borderRadius: "4px",
                        padding: "4px",
                        color: color.newbg,
                      }}
                    />
                  </Box>
                )}

                <Typography
                  fontSize={"20px"}
                  sx={{ fontFamily: "montserrat-Regular" }}
                >
                  {job.companyName}
                </Typography>
              </Box>

              <Typography
                mb={0.5}
                sx={{
                  fontSize: "26px",
                  cursor: "pointer",
                  color:
                    theme === "dark" ? color.titleColor : color.titleLightColor,
                }}
              >
                {job.jobTitle}
              </Typography>

              <div>
                <Typography
                  fontSize={"16px"}
                  mt={0}
                  sx={{ fontFamily: "montserrat-regular" }}
                >
                  {job.location} ({job.jobMode})
                </Typography>
              </div>

              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  gap: 1,
                  // flexWrap: "wrap",
                  flexDirection: { xs: "column", md: "row" },
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{ ...commonPillStyle, px: 0, fontSize: "14px" }}
                  >
                    <GradientFontAwesomeIcon size={16} icon={faClock} />{" "}
                    {timeAgo(job.createdAt)}
                  </Typography>
                  <Typography
                    sx={{
                      ...commonPillStyle,
                      pl: { xs: 0, md: 1 },
                      fontSize: "14px",
                    }}
                  >
                    <GradientFontAwesomeIcon size={16} icon={faBriefcase} />{" "}
                    {job.jobType}
                  </Typography>
                </Box>

                {!brJobId && (
                  <Typography
                    sx={{ ...commonPillStyle, px: 0, fontSize: "14px" }}
                  >
                    <GradientFontAwesomeIcon size={16} icon={faUserTie} />{" "}
                    {applicantsCount > 100
                      ? "100+ Applicants"
                      : `${applicantsCount} Applicant${
                          applicantsCount !== 1 ? "s" : ""
                        }`}
                  </Typography>
                )}

                {isJobPage ? (
                  <Box
                    sx={{
                      position: { xs: "static", md: "absolute" },
                      mt: { xs: 2, md: 0 },
                      top: "-30px",
                      right: "0px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {getUserRole() === "TALENT PARTNER" &&
                      job?.brJobStatus === "ACTIVE" &&
                      !!job.endDate &&
                      new Date(job.endDate) >= new Date() && (
                        <BeyondResumeButton2
                          onClick={() => {
                            handleCopyLink();
                          }}
                          sx={{
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          Share Job Link
                          <FontAwesomeIcon
                            style={{ marginLeft: "6px" }}
                            icon={faShareNodes}
                          />
                        </BeyondResumeButton2>
                      )}

                    {canCloseJob && (
                      <BeyondResumeButton2
                        sx={{ fontSize: "12px" }}
                        onClick={() => {
                          setPopupOpen1(true);
                          setSelectedJobIdC(job.brJobId);
                          setPopupOpen(true);
                        }}
                      >
                        Close Job
                        <FontAwesomeIcon
                          style={{ marginLeft: "6px" }}
                          icon={faXmarkCircle}
                        />
                      </BeyondResumeButton2>
                    )}

                    {selectedTab === 1 ||
                    (job?.brJobStatus === "INPROGRESS" &&
                      !!job.endDate &&
                      new Date(job.endDate) >= new Date()) ? (
                      <BeyondResumeButton
                        onClick={() => {
                          history.push(`/beyond-resume-jobedit/${token}`);
                        }}
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "12px" }}
                      >
                        Edit Job
                        <FontAwesomeIcon
                          style={{ marginLeft: "6px" }}
                          icon={faEdit}
                        ></FontAwesomeIcon>
                      </BeyondResumeButton>
                    ) : (
                      <BeyondResumeButton
                        onClick={() => {
                          history.push("/beyond-resume-candidate-list", {
                            jobId: job.brJobId,
                          });
                        }}
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "12px" }}
                      >
                        View Applicants
                        <FontAwesomeIcon
                          style={{ marginLeft: "6px" }}
                          icon={faUserTie}
                        ></FontAwesomeIcon>
                      </BeyondResumeButton>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: { xs: "static", md: "absolute" },
                      top: "-20px",
                      right: "0px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: { xs: 2, md: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {!isApplicationJDPage && (
                        <BeyondResumeButton2
                          sx={{ fontSize: "12px", px: 2 }}
                          onClick={handleToggleFitment}
                        >
                          {selectedJobId
                            ? "Hide Fitment Analysis"
                            : "Get Fitment Analysis"}
                          <FontAwesomeIcon
                            style={{ marginLeft: "6px" }}
                            icon={
                              selectedJobId
                                ? faChevronCircleDown
                                : faChevronCircleRight
                            }
                          />
                        </BeyondResumeButton2>
                      )}

                      <BeyondResumeButton2
                        onClick={() => {
                          handleCopyLink();
                        }}
                        sx={{
                          px: 0,
                          minWidth: "60px",
                        }}
                      >
                        <FontAwesomeIcon
                          style={{ fontSize: "18px" }}
                          icon={faShareNodes}
                        />
                      </BeyondResumeButton2>
                    </Box>
                    {!isApplicationJDPage && (
                      <BeyondResumeButton
                        onClick={handleApplyJob}
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: "12px" }}
                      >
                        Apply For The Job
                        <FontAwesomeIcon
                          style={{ marginLeft: "6px" }}
                          icon={faChevronCircleRight}
                        ></FontAwesomeIcon>
                      </BeyondResumeButton>
                    )}
                  </Box>
                )}
              </Box>

              {isJobPage ? (
                <>
                  <Typography
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      borderRadius: "999px",
                      mt: 2,
                      fontFamily: "montserrat-regular",
                    }}
                  >
                    Posted Date:{" "}
                    <span style={{ fontFamily: "custom-bold" }}>
                      {" "}
                      {formatDateJob(job?.createdAt)}{" "}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      borderRadius: "999px",
                      mt: 1,
                      fontFamily: "montserrat-regular",
                    }}
                  >
                    Closing Date:{" "}
                    <span style={{ fontFamily: "custom-bold" }}>
                      {" "}
                      {formatDateJob(job?.endDate)}{" "}
                    </span>
                  </Typography>

                  {rounds?.length > 0 && (
                    <Typography
                      sx={{
                        textTransform: "none",
                        fontSize: "16px",
                        borderRadius: "999px",
                        mt: 1,
                        fontFamily: "montserrat-regular",
                      }}
                    >
                      Round(s) Of Interview:{" "}
                      <span style={{ fontFamily: "custom-bold" }}>
                        {rounds?.length ?? 0} Rounds
                      </span>
                    </Typography>
                  )}
                </>
              ) : (
                !isApplicationJDPage && (
                  <Typography
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      borderRadius: "999px",
                      mt: 2,
                      fontFamily: "montserrat-regular",
                    }}
                  >
                    Apply Before{" "}
                    <span style={{ fontFamily: "custom-bold" }}>
                      {" "}
                      {formatDateJob(job?.endDate)}{" "}
                    </span>
                  </Typography>
                )
              )}
            </Box>

            {showJD && (
              <>
                <StyledTypography
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: showFullDescription ? "none" : 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: displayContent,
                  }}
                />

                {displayContent && (
                  <Button
                    sx={{
                      mt: 1,
                      ml: "auto",
                      display: "block",
                      fontSize: "12px",
                      px: 2,
                      py: 0.2,
                      textTransform: "none",
                    }}
                    onClick={() => setShowFullDescription((prev) => !prev)}
                  >
                    {showFullDescription ? "Show Less" : "Read More"}
                    <FontAwesomeIcon
                      style={{ marginLeft: "6px" }}
                      icon={
                        showFullDescription
                          ? faChevronCircleDown
                          : faChevronCircleRight
                      }
                    />
                  </Button>
                )}

                {getUserRole() === "TALENT PARTNER" &&
                  job?.examMode !== "Adaptive" && (
                    <BeyondResumeButton2
                      sx={{ mt: 0, mb: 4, fontSize: "12px" }}
                      onClick={() => {
                        setShowQuestions((prev) => {
                          const next = !prev;
                          setTimeout(() => {
                            if (next && questionRef.current) {
                              questionRef.current.scrollIntoView({
                                behavior: "smooth",
                              });
                            }
                          }, 200);
                          return next;
                        });
                      }}
                    >
                      {showQuestion ? "Hide Details" : "Show More details"}

                      <FontAwesomeIcon
                        style={{ marginLeft: "6px" }}
                        icon={
                          showQuestion
                            ? faChevronCircleDown
                            : faChevronCircleRight
                        }
                      />
                    </BeyondResumeButton2>
                  )}

                {showQuestion && rounds?.length === 0 && (
                  <Box ref={questionRef} sx={{ m: -4, mt: 2 }}>
                    <GeneratedAiQnaResponse
                      status={job?.brJobStatus}
                      response={job.jobInterviewQuestions}
                      jobId={job.brJobId}
                    />
                  </Box>
                )}

                {showQuestion && rounds?.length > 0 && (
                  <Box
                    mb={4}
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                    flexWrap={"wrap"}
                  >
                    <JobTimelineStepper job={job} rounds={rounds} />
                  </Box>
                )}

                {showQuestion &&
                  rounds.map((round: any, index: number) => (
                    <Accordion
                      key={round?.roundId}
                      disableGutters
                      sx={{
                        mb: 2,
                        borderRadius: "16px !important",
                        boxShadow: "0px 0px 36px rgba(0, 0, 0, 0.10)",
                        overflow: "hidden",
                        background: "transparent",
                        color: "inherit",
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          color: "inherit",
                          "& .MuiAccordionSummary-expandIconWrapper": {
                            color: "inherit",
                          },
                        }}
                        expandIcon={
                          <FontAwesomeIcon
                            style={{ color: "inherit" }}
                            icon={faChevronCircleDown}
                          />
                        }
                      >
                        <Typography
                          color="inherit"
                          variant="h6"
                          textAlign={"center"}
                          ml={2}
                        >
                          {`Round ${index + 1} - ${round.roundName}`}
                        </Typography>
                      </AccordionSummary>

                      <AccordionDetails
                        sx={{
                          background: "transparent",
                        }}
                      >
                        <Box px={2}>
                          <Typography>Purpose:</Typography>
                          <Typography variant="body2">
                            {round?.purpose}
                          </Typography>
                          <Typography variant="body2">
                            {round?.cutoffType}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 2,
                              mt: 3,
                              mb: -1,
                            }}
                          >
                            {round?.cutoffType && (
                              <div className="capsule">
                                Cutoff Type: {round.cutoffType}
                              </div>
                            )}

                            {round?.cutoffType === "fixed" &&
                              round?.cutoffValue != null && (
                                <div className="capsule">
                                  Cutoff Value: {round.cutoffValue}%
                                </div>
                              )}

                            {round?.cutoffType === "dynamic" && (
                              <>
                                {round?.targetCutoff != null && (
                                  <div className="capsule">
                                    Target Cutoff: {round.targetCutoff}%
                                  </div>
                                )}
                                {round?.flexibility != null && (
                                  <div className="capsule">
                                    Flexibility Range: {round.flexibility}%
                                  </div>
                                )}
                                {round?.minPassCount != null && (
                                  <div className="capsule">
                                    Min Passing Candidate Count:{" "}
                                    {round.minPassCount}
                                  </div>
                                )}
                              </>
                            )}

                            {round?.interviewDuration != null && (
                              <div className="capsule">
                                Interview Duration: {round.interviewDuration}{" "}
                                Minutes
                              </div>
                            )}

                            {round?.roundWindow != null &&
                              round?.roundId !== "round-1" && (
                                <div className="capsule">
                                  Round Window: {round.roundWindow} Days
                                </div>
                              )}
                          </Box>
                        </Box>

                        {round?.examMode !== "Adaptive" && (
                          <GeneratedAiQnaResponse
                            jobId={job.jobId}
                            response={round.jobInterviewQuestions}
                            roundId={round.roundId}
                          />
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                {matchingUsers.length > 0 &&
                  getUserRole() !== "CAREER SEEKER" &&
                  selectedTab === 0 && (
                    <Box mt={2}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "custom-bold",
                          mb: 2,
                        }}
                      >
                        Top Matching Candidates
                      </Typography>
                      {matchingUsers.slice(0, 5).map((user) => (
                        <MatchingUserCard
                          key={user.userId}
                          user={user}
                          color={color}
                          size={60}
                          strokeWidth={4}
                        />
                      ))}
                    </Box>
                  )}
              </>
            )}
            <div style={{ paddingTop: "24px" }} ref={fitmentRef}>
              {selectedJobId && <JobFitmentPage jobId={selectedJobId} />}
            </div>
          </Box>
        </>

        <CustomSnackbar {...snackbarProps} />

        <ConfirmationPopup
          open={popupOpen}
          onClose={() => setPopupOpen1(false)}
          onConfirm={toggleStatus}
          actionText={"close"}
          color={"#5a81fd"}
          warningMessage={`This action can't be undone.`}
          message={"Are you sure you want to close this job?"}
        />
      </Box>
    </Box>
  );
};

export default BeyondResumeJobDetails;
