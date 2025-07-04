import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import SkillsForm from "../forms/SkillsForm";

export default function SkillsSection({ data = [], onSave }: any) {
  const [isEditing, setIsEditing] = useState(false);

  if (!data.length && !isEditing) {
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
          defaultValues={{ skills: data.join(", ") }}
          onSave={(formData) => {
            const parsedSkills = formData.skills
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
            onSave(parsedSkills);
            setIsEditing(false);
          }}
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
        {data.map((skill: string, idx: number) => (
          <Typography key={idx}>• {skill}</Typography>
        ))}
      </Stack>
    </ProfileSectionCard>
  );
}
