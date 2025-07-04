import { useState } from "react";
import { Stack, Typography, Button, Link } from "@mui/material";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import ResumeUploadForm from "../forms/ResumeUploadForm";


export default function ResumeUploadSection({
  resumeUrl = "",
  onSave,
}: {
  resumeUrl?: string;
  onSave: (file: File) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!resumeUrl && !isEditing) {
    return (
      <ProfileSectionCard title="Resume">
        <Typography>No resume uploaded.</Typography>
        <Button onClick={() => setIsEditing(true)}>Upload</Button>
      </ProfileSectionCard>
    );
  }

  if (isEditing) {
    return (
      <ProfileSectionCard title="Resume">
        <ResumeUploadForm
          onSave={(file) => {
            onSave(file);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Resume" onEdit={() => setIsEditing(true)}>
      <Stack spacing={1}>
        <Typography>
          <b>File:</b>{" "}
          <Link href={resumeUrl} target="_blank" rel="noopener">
            {resumeUrl.split("/").pop()}
          </Link>
        </Typography>
      </Stack>
    </ProfileSectionCard>
  );
}
