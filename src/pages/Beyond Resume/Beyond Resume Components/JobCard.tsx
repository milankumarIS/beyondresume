import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faBriefcase,
  faBuilding,
  faClock,
  faUser,
  faUserTie,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { timeAgo } from "../../../components/util/CommonFunctions";
import {
  commonPillStyle,
  GradientFontAwesomeIcon,
} from "../../../components/util/CommonStyle";
import color from "../../../theme/color";

interface JobCardProps {
  job: any;
  isJobPage: boolean;
  title: string;
  theme: string;
  color: any;
  savingJobId: any;
  savedJobs: Set<string>;
  applicantsMap: Record<string, any[]>;
  loadingApplicants: boolean;
  getUserRole: () => string;
  handleSaveJob: (job: any) => void;
  handleViewMore: (job: any) => void;
  setSelectedJobId?: (id: any) => void;
  setPopupOpen?: (open: boolean) => void;
  selected?: boolean;
}

const JobCard = ({
  job,
  isJobPage,
  title,
  theme,
  savingJobId,
  savedJobs,
  applicantsMap,
  loadingApplicants,
  getUserRole,
  handleSaveJob,
  handleViewMore,
  selected,
  setSelectedJobId,
  setPopupOpen,
}: JobCardProps) => {
  const applicantCount = applicantsMap[job.brJobId]?.length || 0;

  return (
    <Card
      onClick={() => handleViewMore(job)}
      sx={{
        borderRadius: "12px",
        height: "100%",
        boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
        border: "solid 1.5px transparent",
        transition: "all 0.3s",
        background: selected
          ? theme === "dark"
            ? color.jobCardBg
            : color.jobCardBgLight
          : "rgba(94, 94, 94, 0.15)",
        color: "inherit",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 2px 36px rgba(0, 0, 0, 0.25)",
          background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        },
      }}
    >
      <CardContent
        sx={{ position: "relative" }}
        style={{
          paddingBottom: "16px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {getUserRole() === "CAREER SEEKER" && (
          <IconButton
            onClick={() => handleSaveJob(job)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0)",
            }}
          >
            {savingJobId === job.brJobId ? (
              <CircularProgress size={18} />
            ) : savedJobs.has(job.brJobId) ? (
              <FontAwesomeIcon
                icon={faBookmark}
                color={color.titleLightColor}
              />
            ) : (
              <FontAwesomeIcon icon={faBookmark} color="#ccc" />
            )}
          </IconButton>
        )}

        {/* {isJobPage && title !== "Completed Jobs" && (
          <Button
            onClick={() => {
              setSelectedJobId(job.brJobId);
              setPopupOpen(true);
            }}
            sx={{
              background: color.newFirstColor,
              px: 2,
              borderRadius: "0px 0px 0px 6px",
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 1,
              minWidth: "0px",
              cursor: "pointer",
              textTransform: "none",
              fontSize: "12px",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "12px", color: "white" }}
              icon={faXmarkCircle}
            />
          </Button>
        )} */}

        <Box display={"flex"} alignItems={"center"} gap={2} mb={2}>
          <Box>
            <FontAwesomeIcon
              icon={faBuilding}
              style={{
                fontSize: "44px",
                background: "white",
                borderRadius: "8px",
                padding: "12px",
                color: color.newbg,
              }}
            />
          </Box>

          <div>
            <Typography
              mb={0.5}
              variant="h6"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                cursor: "pointer",
                color:
                  theme === "dark" ? color.titleColor : color.titleLightColor,
              }}
              onClick={() => handleViewMore(job)}
            >
              {job.jobTitle}
            </Typography>

            <Typography
              fontSize={"16px"}
              mt={-0.5}
              mb={1}
              sx={{ fontFamily: "Custom-Regular" }}
            >
              {job.companyName}
            </Typography>

            <Typography
              fontSize={"14px"}
              mt={-0.5}
              sx={{ fontFamily: "montserrat-regular" }}
            >
              {job.location} ({job.jobMode})
            </Typography>
          </div>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            paddingLeft: "60px",
          }}
        >
          <Typography sx={commonPillStyle}>
            <GradientFontAwesomeIcon size={14} icon={faClock} />{" "}
            {timeAgo(job.createdAt)}
          </Typography>
          <Typography sx={commonPillStyle}>
            <GradientFontAwesomeIcon size={14} icon={faBriefcase} />{" "}
            {job.jobType}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {applicantCount > 0 ? (
              <Grid2
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                {loadingApplicants ? (
                  <Typography sx={commonPillStyle}>
                    <CircularProgress size={16} /> Loading applicants...
                  </Typography>
                ) : (
                  <Typography sx={commonPillStyle}>
                    <GradientFontAwesomeIcon size={14} icon={faUserTie} />{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={applicantCount}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {applicantCount > 100
                          ? "100+ Applicants"
                          : `${applicantCount} Applicant${
                              applicantCount !== 1 ? "s" : ""
                            }`}
                      </motion.span>
                    </AnimatePresence>
                  </Typography>
                )}
              </Grid2>
            ) : (
              <Typography sx={commonPillStyle}>
                <GradientFontAwesomeIcon size={14} icon={faUser} /> 0
                Applicant(s)
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
