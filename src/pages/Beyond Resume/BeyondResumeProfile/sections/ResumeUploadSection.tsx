import { useEffect, useState } from "react";
import { Stack, Typography, Button, Link, Box } from "@mui/material";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import ResumeUploadForm from "../forms/ResumeUploadForm";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import { getProfile } from "../../../../services/services";
import { extractCleanFileName } from "../../../../components/util/CommonFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit } from "@fortawesome/free-solid-svg-icons";
import color from "../../../../theme/color";
import { useTheme } from "../../../../components/util/ThemeContext";

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

  const { theme } = useTheme();

  return (
    <Box position={"relative"} p={3} pr={2}>
      <Stack
        spacing={1}
        sx={{
          position: "relative",
          overflow: "hidden",
          background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        }}
        borderRadius={4}
        p={2}
      >
        <Typography sx={{ fontFamily: "custom-bold", mb: 2 }}>
          Resume
        </Typography>

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

        {fileUrl ? (
          <>
            <Typography>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <FontAwesomeIcon icon={faDownload} /> {cleanFileName}
              </Link>
            </Typography>

            {/* <Box
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
          </Box> */}
          </>
        ) : (
          <Typography>No resume uploaded.</Typography>
        )}
      </Stack>
    </Box>
  );
}
