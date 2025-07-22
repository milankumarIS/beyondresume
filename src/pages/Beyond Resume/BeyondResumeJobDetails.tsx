import {
  faBriefcase,
  faBuilding,
  faChevronCircleDown,
  faChevronCircleRight,
  faClock,
  faEdit,
  faUserTie,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { formatDateJob, timeAgo } from "../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  commonPillStyle,
  GradientFontAwesomeIcon,
  StyledTypography,
} from "../../components/util/CommonStyle";
import { useTheme } from "../../components/util/ThemeContext";
import color from "../../theme/color";
import JobFitmentPage from "./BeyondResumeProfile/JobFitmentAnalysis";
import { getUserRole } from "../../services/axiosClient";
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
  job,
  applicantsCount,
  onBack,
  setPopupOpen,
  selectedTab,
  setSelectedJobIdC,
}: Props) => {
  const { theme } = useTheme();
  const history = useHistory();
  const fitmentRef = useRef<HTMLDivElement | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState("");
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");

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

  return (
    <Box
      p={2}
      mt={0}
      sx={{
        boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.25)",
        borderRadius: 4,
      }}
    >
      {!job ? (
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
      ) : (
        <>
          <Box px={1} mt={1} position={"relative"}>
            <Box
              sx={{
                p: 2,
                m: -2,
              }}
            >
              {isJobPage ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: "36px",
                    right: "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
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
                    top: "116px",
                    right: "0px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <BeyondResumeButton2
                    sx={{ fontSize: "12px" }}
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
                  display: "-webkit-box",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
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
                }}
              >
                <Typography
                  sx={{ ...commonPillStyle, px: 0, fontSize: "14px" }}
                >
                  <GradientFontAwesomeIcon size={16} icon={faClock} />{" "}
                  {timeAgo(job.createdAt)}
                </Typography>
                <Typography sx={{ ...commonPillStyle, fontSize: "14px" }}>
                  <GradientFontAwesomeIcon size={16} icon={faBriefcase} />{" "}
                  {job.jobType}
                </Typography>
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
            {getUserRole() !== "CAREER SEEKER" && (
              <Box sx={{ m: -4, mt: 2 }}>
                <GeneratedAiQnaResponse
                  status={job.brJobStatus}
                  response={job.jobInterviewQuestions}
                  jobId={job.brJobId}
                />
              </Box>
            )}
            <div style={{ paddingTop: "32px" }} ref={fitmentRef}>
              {selectedJobId && <JobFitmentPage jobId={selectedJobId} />}
            </div>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BeyondResumeJobDetails;
