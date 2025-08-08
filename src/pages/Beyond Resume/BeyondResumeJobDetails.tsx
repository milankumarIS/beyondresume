import {
  faBriefcase,
  faBuilding,
  faChevronCircleDown,
  faChevronCircleRight,
  faClock,
  faEdit,
  faShareNodes,
  faUserTie,
  faXmarkCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { copyToClipboard } from "../../components/shared/Clipboard";
import { useNewSnackbar } from "../../components/shared/useSnackbar";
import { formatDateJob, timeAgo } from "../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  commonPillStyle,
  GradientFontAwesomeIcon,
  StyledTypography,
} from "../../components/util/CommonStyle";
import CustomSnackbar from "../../components/util/CustomSnackbar";
import { useTheme } from "../../components/util/ThemeContext";
import { getUserRole } from "../../services/axiosClient";
import {
  searchDataFromTable,
  searchListDataFromTable,
} from "../../services/services";
import color from "../../theme/color";
import JobFitmentPage from "./BeyondResumeProfile/JobFitmentAnalysis";
import GeneratedAiQnaResponse from "./GeneratedAiQnaResponse";

type Props = {
  job: any;
  applicantsCount: number;
  selectedTab: any;
  onBack?: () => void;
  setPopupOpen: (open: boolean) => void;
  setSelectedJobIdC: (id: any) => void;
};

const BeyondResumeJobDetails = ({
  job: initialJob,
  applicantsCount,
  onBack,
  setPopupOpen,
  selectedTab,
  setSelectedJobIdC,
}: Props) => {
  const { theme } = useTheme();
  const history = useHistory();
  const fitmentRef = useRef<HTMLDivElement | null>(null);
  const questionRef = useRef<HTMLDivElement | null>(null);
  const [job, setJob] = useState<any>(initialJob);
  const [loading, setLoading] = useState<boolean>(!initialJob);

  const location = useLocation();
  const { brJobId } = useParams<{ brJobId: string }>();

  const [showFullDescription, setShowFullDescription] = useState(
    () => getUserRole() === "CAREER SEEKER"
  );

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState("");
  const [showQuestion, setShowQuestions] = useState(false);
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const [jobUsername, setjobUsername] = useState("");
  const { snackbarProps, showSnackbar } = useNewSnackbar();

  useEffect(() => {
    const fetchJob = async () => {
      if (!initialJob && brJobId) {
        try {
          setLoading(true);
          const result: any = await searchDataFromTable("brJobs", { brJobId });
          setJob(result?.data?.data);
        } catch (error) {
          console.error("Error fetching job by brJobId:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchJob();
  }, [initialJob, location.search, setSelectedJobIdC]);

  useEffect(() => {
    if (job?.jobDescriptions) {
      const cleanedResponse = job.jobDescriptions
        .replace(/```(?:html)?/g, "")
        .trim();
      setDisplayContent(cleanedResponse);
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
    const fetchAndCalculateMatches = async () => {
      try {
        const userRes = await searchListDataFromTable("userPersonalInfo", {});
        const users = userRes?.data?.data || [];

        const jobSkillsArray = Array.isArray(job.skills)
          ? job.skills
          : typeof job.skills === "string"
          ? job.skills.split(",").map((s) => s.trim())
          : [];

        const jobSkills = jobSkillsArray.map((s: string) => s.toLowerCase());

        const matchedUserList = users.map((user: any) => {
          const userSkillsArray = Array.isArray(user.skills)
            ? user.skills
            : typeof user.skills === "string"
            ? user.skills.split(",").map((s: string) => s.trim())
            : [];

          const userSkills = userSkillsArray.map((s: string) =>
            s.toLowerCase()
          );

          const matchedSkills = jobSkills.filter((skill) =>
            userSkills.includes(skill)
          );

          const matchPercent =
            jobSkills.length > 0
              ? Math.round((matchedSkills.length / jobSkills.length) * 100)
              : 0;

          const fullName = [user.firstName, user.middleName, user.lastName]
            .filter(Boolean)
            .join(" ");

          return {
            userId: user.userId,
            fullName,
            matchPercent,
            matchedSkills,
            userImage: user.userImage,
          };
        });

        matchedUserList.sort((a, b) => b.matchPercent - a.matchPercent);

        setMatchingUsers(matchedUserList.filter((u) => u.matchPercent > 0));
      } catch (err) {
        console.error("Error fetching users or matching skills:", err);
      }
    };
    const fetchJobUsername = async () => {
      try {
        const userRes = await searchDataFromTable("user", {
          userId: job?.createdBy,
        });
        const userName = userRes?.data?.data?.userName || [];
        setjobUsername(userName);
      } catch (err) {
        console.error("Error fetching users or matching skills:", err);
      }
    };

    if (job) {
      fetchAndCalculateMatches();
      fetchJobUsername();
    }
  }, [job]);

  const size = 80;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  //   const handleCopyLink = async () => {
  //   try {
  //     await copyToClipboard(referralLink);
  //     setIsCopied(true);
  //     setTimeout(() => setIsCopied(false), 2000);
  //     openSnackBar("Link copied to clipboard!");
  //   } catch (error) {
  //     console.error(error);
  //     openSnackBar("Failed to copy link. Please try again.");
  //   }
  // };

  const handleCopyLink = () => {
    const payload = {
      ServiceTypeID: 1020,
      userName: jobUsername,
      brJobId: job?.brJobId,
    };

    const base64Payload = btoa(JSON.stringify(payload));
    const fullLink = `https://indi.skillablers.com/indi-registration?${base64Payload}`;

    try {
      copyToClipboard(fullLink);
      showSnackbar("Link Copied To Clipboard", "info");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to copy link. Please try again.", "error");
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

  if (!job && brJobId) {
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
          This job may have been closed or the link is broken.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please check the job link or contact the recruiter for more details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      p={2}
      mt={0}
      m={brJobId ? 4 : 0}
      sx={{
        boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.25)",
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
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <Typography sx={{ ...commonPillStyle, px: 0, fontSize: "14px" }}>
                <GradientFontAwesomeIcon size={16} icon={faClock} />{" "}
                {timeAgo(job.createdAt)}
              </Typography>
              <Typography sx={{ ...commonPillStyle, fontSize: "14px" }}>
                <GradientFontAwesomeIcon size={16} icon={faBriefcase} />{" "}
                {job.jobType}
              </Typography>

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
                    position: "absolute",
                    top: "-20px",
                    right: "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {selectedTab !== 2 && (
                    <BeyondResumeButton2
                      sx={{ fontSize: "12px" }}
                      onClick={() => {
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

                  {selectedTab === 1 ? (
                    <BeyondResumeButton
                      onClick={() => {
                        history.push(`/beyond-resume-jobedit/${job.brJobId}`);
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
                    position: "absolute",
                    top: "-20px",
                    right: "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
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
              </>
            ) : (
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
            )}
          </Box>

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

          {getUserRole() !== "CAREER SEEKER" &&
            job?.examMode !== "Adaptive" && (
              <BeyondResumeButton2
                sx={{ mt: 0, fontSize: "12px" }}
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
                {showQuestion
                  ? "Hide Interview Questions"
                  : "Show Interview Questions"}

                <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={
                    showQuestion ? faChevronCircleDown : faChevronCircleRight
                  }
                />
              </BeyondResumeButton2>
            )}

          {showQuestion && (
            <Box ref={questionRef} sx={{ m: -4, mt: 2 }}>
              <GeneratedAiQnaResponse
                status={job.brJobStatus}
                response={job.jobInterviewQuestions}
                jobId={job.brJobId}
              />
            </Box>
          )}

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
                  <Box
                    key={user.userId}
                    sx={{
                      fontSize: "14px",
                      mb: 3,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                      minWidth: "60%",
                      width: "fit-content",
                      background: color.cardBg,
                      borderRadius: 4,
                    }}
                  >
                    <Box display={"flex"} alignItems={"center"} gap={1} mt={2}>
                      <Avatar
                        src={user.userImage}
                        alt="Avatar"
                        sx={{
                          width: 50,
                          height: 50,
                          mx: "auto",
                          alignSelf: "center",
                        }}
                      />
                      <div>
                        <Typography>{user.fullName}</Typography>
                        <Typography fontSize="12px" color="gray">
                          Skills matched: {user.matchedSkills.join(", ")}
                        </Typography>
                      </div>
                    </Box>

                    <Box
                      position={"relative"}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      gap={2}
                    >
                      <svg width={size} height={size}>
                        <circle
                          stroke="#2A2D3E"
                          fill="transparent"
                          strokeWidth={strokeWidth}
                          r={radius}
                          cx={size / 2}
                          cy={size / 2}
                        />
                        <circle
                          stroke={
                            user.matchPercent >= 70
                              ? "green"
                              : user.matchPercent >= 40
                              ? "orange"
                              : "red"
                          }
                          fill="transparent"
                          strokeWidth={strokeWidth}
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={
                            circumference * (1 - user.matchPercent / 100)
                          }
                          r={radius}
                          cx={size / 2}
                          cy={size / 2}
                          transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        />
                      </svg>

                      <Typography
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translate(-50%, 0%)",
                          width: size,
                          height: size,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {user.matchPercent}%
                      </Typography>

                      <BeyondResumeButton2
                        sx={{ fontSize: "10px", px: 2, py: 0.4 }}
                      >
                        See Profile
                      </BeyondResumeButton2>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

          <div style={{ paddingTop: "32px" }} ref={fitmentRef}>
            {selectedJobId && <JobFitmentPage jobId={selectedJobId} />}
          </div>
        </Box>
      </>

      <CustomSnackbar {...snackbarProps} />
    </Box>
  );
};

export default BeyondResumeJobDetails;
