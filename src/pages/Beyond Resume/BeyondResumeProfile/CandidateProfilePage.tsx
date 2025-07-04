import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import BasicDetailsSection from "./sections/BasicDetailsSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import JobPreferenceSection from "./sections/JobPreferenceSection";
import SkillsSection from "./sections/SkillsSection";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { useHistory } from "react-router";
import AIProfileInterview from "./AIProfileInterview";

export default function CandidateProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const history = useHistory();
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/candidate-profile");
      const data = await res.json();
      setProfileData(data);
    };
    fetchData();
  }, []);

  const updateSection = async (section: string, data: any) => {
    console.log(data);
    // await fetch(`/api/candidate-profile/${section}`, {
    //   method: "PATCH",
    //   body: JSON.stringify(data),
    //   headers: { "Content-Type": "application/json" },
    // });
    setProfileData((prev: any) => ({ ...prev, [section]: data }));
  };

  return (
    <Box
      sx={{
        background: "#eaebef",
        color: "white",
        p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* <BlobAnimation /> */}

      <BeyondResumeButton sx={{ mb: 2 }} onClick={() => setModalOpen(true)}>
        AI Interview
      </BeyondResumeButton>

      <Box sx={{ position: "relative", display: "flex", gap: 2 }}>
        {/* <Typography variant="h4" gutterBottom>Candidate Profile</Typography> */}

        <BasicDetailsSection
          data={profileData?.basic}
          onSave={(data) => updateSection("basic", data)}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <ExperienceSection
            data={profileData?.experiences}
            onSave={(data) => updateSection("experiences", data)}
          />

          <EducationSection
            data={profileData?.education}
            onSave={(data) => updateSection("education", data)}
          />

          <SkillsSection
            data={profileData?.skills}
            onSave={(data) => updateSection("skills", data)}
          />

          <JobPreferenceSection
            data={profileData?.jobPreferences}
            onSave={(data) => updateSection("jobPreferences", data)}
          />

          {modalOpen && <AIProfileInterview open={modalOpen} />}
          {/* <ResumeUploadSection
            resumeUrl={profileData?.resume}
            onSave={(data) => updateSection("resume", data)}
          /> */}
        </Box>
      </Box>
    </Box>
  );
}
