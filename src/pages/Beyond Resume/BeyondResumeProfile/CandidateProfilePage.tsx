import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import GradientText, {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../../components/util/CommonStyle";
import { useUserData } from "../../../components/util/UserDataContext";
import BasicDetailsSection from "./sections/BasicDetailsSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import JobPreferenceSection from "./sections/JobPreferenceSection";
import ResumeUploadSection from "./sections/ResumeUploadSection";
import SkillsSection from "./sections/SkillsSection";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTheme } from "../../../components/util/ThemeContext";
import color from "../../../theme/color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function CandidateProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const history = useHistory();
  const profileRef = useRef<HTMLDivElement>(null);
  const [hideSensitive, setHideSensitive] = useState(false);
  const { theme } = useTheme();

  const updateSection = async (section: string, data: any) => {
    setProfileData((prev: any) => ({ ...prev, [section]: data }));
  };
  const { userData } = useUserData();

  const generatePDF = async () => {
    setHideSensitive(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (profileRef.current) {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: theme === "dark" ? color.newbg : "white",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      // pdf.save("resume.pdf");

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    }

    setHideSensitive(false);
  };

  return (
    <Box
      sx={{
        p: 4,
        px: { xs: 1, md: 6 },
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* <BeyondResumeButton2
        sx={{
          position: "absolute",
          top: "3.5%",
          right: "5%",
          textTransform: "none",
          fontSize: "10px",
          zIndex: 2,
        }}
        onClick={generatePDF}
      >
        <FontAwesomeIcon style={{ marginRight: "4px" }} icon={faDownload} />{" "}
        Download BR Profile
      </BeyondResumeButton2> */}

      <motion.div
        ref={profileRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          gap: 16,
          padding: hideSensitive ? "16px" : 0,
          paddingTop: hideSensitive ? "32px" : 0,
        }}
      >
        {hideSensitive && (
          <img
            style={{
              height: "34px",
              position: "absolute",
              top: "30px",
              left: "40px",
            }}
            src={
              theme === "dark"
                ? "/assets/skllogo2.png"
                : "/assets/skllogolight.png"
            }
          ></img>
        )}

        <motion.div variants={sectionVariant}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {hideSensitive ? (
              <>
                <Typography
                  sx={{
                    background: color.activeButtonBg,
                    color: "white",
                    fontFamily: "custom-bold",
                    px: 1,
                    borderRadius: 2,
                  }}
                  variant="h4"
                >{`${userData?.firstName}'s`}</Typography>
                <Typography variant="h4">Profile</Typography>
              </>
            ) : (
              <>
                <Typography variant="h4">Hi</Typography>
                <GradientText text={`${userData?.firstName}`} variant="h4" />
              </>
            )}
          </Box>

          {!hideSensitive && (
            <Typography
              textAlign={"center"}
              mb={2}
              variant="h6"
              sx={{
                fontFamily: "Montserrat-Regular",
              }}
            >
              Keep your profile updated for better results
            </Typography>
          )}
        </motion.div>
        <motion.div variants={sectionVariant}>
          <BasicDetailsSection
            data={profileData?.basic}
            onSave={(data) => updateSection("basic", data)}
            hideSensitive={hideSensitive}
          />
        </motion.div>

        <Box
          flexDirection={{ xs: "column", md: "row" }}
          sx={{ display: "flex", width: "100%" }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <motion.div variants={sectionVariant}>
              <ExperienceSection hideSensitive={hideSensitive} />
            </motion.div>

            <motion.div style={{ marginTop: "12px" }} variants={sectionVariant}>
              <EducationSection hideSensitive={hideSensitive} />
            </motion.div>
          </Box>

          <Box>
            <motion.div variants={sectionVariant}>
              <JobPreferenceSection hideSensitive={hideSensitive} />
            </motion.div>

            <motion.div variants={sectionVariant}>
              <SkillsSection hideSensitive={hideSensitive} />
            </motion.div>

            {!hideSensitive && (
              <motion.div variants={sectionVariant}>
                <ResumeUploadSection
                  resumeUrl={profileData?.resume}
                  onSave={(data) => updateSection("resume", data)}
                />
              </motion.div>
            )}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
