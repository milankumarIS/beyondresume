import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import SkillsForm from "../forms/SkillsForm";
import { getUserId } from "../../../../services/axiosClient";
import {
  searchDataFromTable,
  updateByIdDataInTable,
} from "../../../../services/services";
import { useTheme } from "../../../../components/util/ThemeContext";
import color from "../../../../theme/color";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SkillsSection({ hideSensitive }: any) {
  const [skills, setSkills] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const res = await searchDataFromTable("userPersonalInfo", {
        userId: userId,
      });

      const skillsArray = Array.isArray(res?.data?.data?.skills)
        ? res?.data?.data?.skills
        : [];
      setSkills(skillsArray);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    const parsedSkills = formData.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    try {
      await updateByIdDataInTable(
        "userPersonalInfo",
        getUserId(),
        { skills: parsedSkills },
        "userId"
      );
      setSkills(parsedSkills);
    } catch (err) {
      console.error("Failed to save skills", err);
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  if (!skills.length && !isEditing) {
    return (
      <ProfileSectionCard title="Skills">
        <Stack spacing={2}>
          <Typography>No skills added.</Typography>
          <BeyondResumeButton onClick={() => setIsEditing(true)}>
            Add
          </BeyondResumeButton>
        </Stack>
      </ProfileSectionCard>
    );
  }

  if (isEditing) {
    return (
      <ProfileSectionCard title="Skills">
        <SkillsForm
          defaultValues={{ skills: skills.join(", ") }}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </ProfileSectionCard>
    );
  }

  return (
    <Box position={"relative"} p={3} pr={2}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        }}
        borderRadius={4}
        p={2}
        minWidth={"200px"}
      >
        <Typography sx={{ fontFamily: "custom-bold", mb: 2 }}>
          Skills
        </Typography>

        {!hideSensitive && (
          <FontAwesomeIcon
            style={{
              fontSize: "12px",
              background: color.activeButtonBg,
              padding: "6px",
              borderRadius: "4px",
              color: "white",
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 2,
            }}
            icon={faEdit}
            onClick={() => setIsEditing(true)}
          ></FontAwesomeIcon>
        )}

        <Box flexWrap={"wrap"} display={"flex"} gap={1}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            skills.map((skill: string, idx: number) => (
              <Typography
                sx={{
                  fontSize:'14px',
                  width: "fit-content",
                  px: 2,
                  borderRadius: "44px",
                  py: 0.5,
                  background: "#ebebeb",
                  color: "black",
                  // border: "solid 1px grey",
                }}
                key={idx}
              >
                {" "}
                {skill}
              </Typography>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
