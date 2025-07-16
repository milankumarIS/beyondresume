import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import SkillsForm from "../forms/SkillsForm";
import { getUserId } from "../../../../services/axiosClient";
import {
  searchDataFromTable,
  updateByIdDataInTable,
} from "../../../../services/services";

export default function SkillsSection() {
  const [skills, setSkills] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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
    <ProfileSectionCard title="Skills" onEdit={() => setIsEditing(true)}>
      <Stack
        spacing={1}
        style={{
          position: "relative",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
        }}
        borderRadius={4}
        p={2}
        pt={3}
        pb={2.5}
        minWidth={"200px"}
      >
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          skills.map((skill: string, idx: number) => (
            <Typography key={idx}>• {skill}</Typography>
          ))
        )}
      </Stack>
    </ProfileSectionCard>
  );
}
