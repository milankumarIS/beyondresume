import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useHistory } from "react-router";
import BasicDetailsSection from "./sections/BasicDetailsSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import JobPreferenceSection from "./sections/JobPreferenceSection";
import ResumeUploadSection from "./sections/ResumeUploadSection";
import SkillsSection from "./sections/SkillsSection";

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

  const updateSection = async (section: string, data: any) => {
    setProfileData((prev: any) => ({ ...prev, [section]: data }));
  };

  return (
    <Box
      sx={{
        color: "white",
        p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", display: "flex", gap: 16 }}
      >
        <motion.div variants={sectionVariant}>
          <BasicDetailsSection
            data={profileData?.basic}
            onSave={(data) => updateSection("basic", data)}
          />
        </motion.div>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <motion.div variants={sectionVariant}>
            <ExperienceSection />
          </motion.div>

          <motion.div variants={sectionVariant}>
            <EducationSection />
          </motion.div>

          <motion.div variants={sectionVariant}>
            <SkillsSection />
          </motion.div>

          <motion.div variants={sectionVariant}>
            <JobPreferenceSection />
          </motion.div>

          <motion.div variants={sectionVariant}>
            <ResumeUploadSection
              resumeUrl={profileData?.resume}
              onSave={(data) => updateSection("resume", data)}
            />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
