import {
  faBriefcase,
  faBuilding,
  faChevronCircleRight,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useNewSnackbar } from "../../components/shared/useSnackbar";
import { formatDateJob, timeAgo } from "../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  commonPillStyle,
  GradientFontAwesomeIcon,
  StyledTypography,
} from "../../components/util/CommonStyle";
import CustomSnackbar from "../../components/util/CustomSnackbar";
import { useIndustry } from "../../components/context/IndustryContext";
import { useTheme } from "../../components/context/ThemeContext";
import { searchOpenListDataFromTable } from "../../services/services";
import color from "../../theme/color";

const BeyondResumePublicJobDetails = () => {
  const { theme } = useTheme();
  const history = useHistory();
  const [job, setJob] = useState<any>();
  const [loading, setLoading] = useState<boolean>();

  const location = useLocation();

  const base64Payload = location.search.substring(1);

  let decodedData: {
    ServiceTypeID: number;
    userName: string;
    brJobId: string;
  } | null = null;

  try {
    const jsonString = atob(base64Payload);
    decodedData = JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid or missing payload:", error);
  }

  const brJobId = decodedData?.brJobId;

  const params = new URLSearchParams(location.search);
  const source = params.get("source");

  const [showFullDescription, setShowFullDescription] = useState(true);

  const [displayContent, setDisplayContent] = useState("");
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const [jobUsername, setjobUsername] = useState("");
  const { snackbarProps, showSnackbar } = useNewSnackbar();
  const { industryName, setIndustryName, setSpaceIndustryName } = useIndustry();

  useEffect(() => {
    const fetchJob = async () => {
      if (brJobId) {
        try {
          setLoading(true);
          const result: any = await searchOpenListDataFromTable("brJobs", {
            brJobId,
          });
          setJob(result?.data?.data[0]);
          //   console.log(result);
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
  }, [location.search, brJobId]);

  useEffect(() => {
    if (job?.jobDescriptions) {
      const cleanedResponse = job.jobDescriptions
        .replace(/```(?:html)?/g, "")
        .trim();
      setDisplayContent(cleanedResponse);
    }
  }, [job]);

  const handleApplyJob = () => {
    window.open(
      `https://indi.skillablers.com/indi-registration?${base64Payload}`,
      "_blank"
    );
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

  if (!job && !brJobId) {
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
      m={{ xs: 0, md: brJobId ? 4 : 0 }}
      sx={{
        boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.15)",
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
            <Box display={"flex"} alignItems={"center"} gap={2} mb={0.5}>
              {job?.companyName?.toLowerCase() ===
              "translab.io".toLowerCase() ? (
                <Box
                  sx={{
                    padding: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    style={{
                      width: "120px",
                      //   borderRadius: "4px",
                    }}
                    src="/assets/translab.png"
                    alt=""
                  />
                  <div>
                    <Typography
                      mb={0.5}
                      sx={{
                        fontSize: "24px",
                        cursor: "pointer",
                        color:
                          theme === "dark"
                            ? color.titleColor
                            : color.titleLightColor,
                      }}
                    >
                      {job?.jobTitle}
                    </Typography>

                    <div>
                      <Typography
                        fontSize={"16px"}
                        mt={0}
                        sx={{ fontFamily: "montserrat-regular" }}
                      >
                        {job?.location} ({job?.jobMode})
                      </Typography>
                    </div>
                  </div>
                </Box>
              ) : (
                <Box display={"flex"} flexDirection={"column"}>
                  <Box display={"flex"} gap={1} alignItems={"center"}>
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
                    <Typography
                      fontSize={"20px"}
                      sx={{ fontFamily: "montserrat-Regular" }}
                    >
                      {job?.companyName}
                    </Typography>
                  </Box>
                  <div>
                    <Typography
                      mb={0.5}
                      mt={1}
                      sx={{
                        fontSize: "24px",
                        cursor: "pointer",
                        color:
                          theme === "dark"
                            ? color.titleColor
                            : color.titleLightColor,
                      }}
                    >
                      {job?.jobTitle}
                    </Typography>

                    <div>
                      <Typography
                        fontSize={"16px"}
                        mt={0}
                        sx={{ fontFamily: "montserrat-regular" }}
                      >
                        {job?.location} ({job?.jobMode})
                      </Typography>
                    </div>
                  </div>
                </Box>
              )}
              {/* 
              <Typography
                fontSize={"20px"}
                sx={{ fontFamily: "montserrat-Regular" }}
              >
                {job?.companyName}
              </Typography> */}
            </Box>
            {job?.companyName?.toLowerCase() ===
              "translab.io".toLowerCase() && (
              <div>
                <Typography
                  mb={0.5}
                  sx={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color:
                      theme === "dark"
                        ? color.titleColor
                        : color.titleLightColor,
                  }}
                >
                  {job?.jobTitle}
                </Typography>

                <div>
                  <Typography
                    fontSize={"16px"}
                    mt={0}
                    sx={{ fontFamily: "montserrat-regular" }}
                  >
                    {job?.location} ({job?.jobMode})
                  </Typography>
                </div>
              </div>
            )}
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
                {timeAgo(job?.createdAt)}
              </Typography>
              <Typography sx={{ ...commonPillStyle, fontSize: "14px" }}>
                <GradientFontAwesomeIcon size={16} icon={faBriefcase} />{" "}
                {job?.jobType}
              </Typography>

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
            </Box>
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
          </Box>

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

            {/* {displayContent && (
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
            )} */}
          </>
        </Box>
      </>

      <CustomSnackbar {...snackbarProps} />
    </Box>
  );
};

export default BeyondResumePublicJobDetails;
