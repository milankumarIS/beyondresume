import { useEffect, useState } from "react";
import { Stack, Typography, Button, Link, Box } from "@mui/material";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import ResumeUploadForm from "../forms/ResumeUploadForm";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import { getProfile } from "../../../../services/services";
import { extractCleanFileName } from "../../../../components/util/CommonFunctions";

export default function ResumeUploadSection({
  resumeUrl = "",
  onSave,
}: {
  resumeUrl?: string;
  onSave: (file: File) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>();

  useEffect(() => {
    getProfile().then((result: any) => {
      setCurrentUser({ ...result?.data?.data });
    });
  }, [isEditing]);

  const fileUrl = currentUser?.userPersonalInfo?.resumeFile;
  const cleanFileName = fileUrl ? extractCleanFileName(fileUrl) : "";

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
      {fileUrl ? (
        <>
          <Typography>
            <Link
              href={fileUrl}
              target="_blank"
              rel="noopener"
              underline="none"
            >
              {cleanFileName}
            </Link>
          </Typography>

          <Box
            sx={{
              width: 185,
              height: 240,
              border: "1px solid #ccc",
              overflow: "hidden",
              borderRadius: "8px",
              background:'white',
            }}
          >
            <iframe
              src={fileUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "1px solid #ccc", background:'white', overflow:'hidden' }}
            />
          </Box>
        </>
      ) : (
        <Typography>No resume uploaded.</Typography>
      )}
    </Stack>
  </ProfileSectionCard>
);
}
