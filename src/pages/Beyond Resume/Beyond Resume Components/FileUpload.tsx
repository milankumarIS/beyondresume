import React from "react";
import { Box, Typography, Button, SxProps, Theme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { extractCleanFileName } from "../../../components/util/CommonFunctions";
import color from "../../../theme/color";

interface FileUploadProps {
  questionFile: File | string | null;
  setQuestionFile: (file: File | null) => void;
  fileFormatNote?: string;
  acceptFormat?: string;
  uploadLabel?: string;
  changeLabel?: string;
  textColor?: string;
  sx?: SxProps<Theme>;
  showFileNameOnly?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  questionFile,
  setQuestionFile,
  fileFormatNote,
  acceptFormat = ".xlsx",
  uploadLabel = "Upload",
  changeLabel = "Change File",
  textColor = "grey",
  sx = {},
  showFileNameOnly = true,
}) => {
  const formatLabel = acceptFormat.replace(".", "").toUpperCase();

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: "12px",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        margin: "auto",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.17)",

        ...sx,
      }}
      component="label"
    >
      {!questionFile && (
        <>
          <Typography
            sx={{
              textAlign: "center",
              color: textColor,
              fontSize: "14px",
              px: 2,
              mb: -1,
            }}
          >
            Drag and drop file or click to upload {formatLabel} (Max file size
            2MB)
          </Typography>

          {fileFormatNote && (
            <Typography
              sx={{
                textAlign: "center",
                color: textColor,
                fontSize: "14px",
                px: 2,
              }}
            >
              {fileFormatNote}
            </Typography>
          )}
        </>
      )}

      <input
        type="file"
        accept={acceptFormat}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setQuestionFile(file);
          }
        }}
      />

      {questionFile && (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "44px",
            px: 2,
            py: 1,
            mt: 1,
            position: "relative",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography sx={{ color: "black", mr: 1 }}>
            {typeof questionFile === "string"
              ? showFileNameOnly
                ? extractCleanFileName(questionFile)
                : questionFile
              : questionFile.name}
          </Typography>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setQuestionFile(null);
            }}
            sx={{
              p: 1,
              position: "absolute",
              top: -5,
              right: 0,
              color: "black",
              background: "white",
              borderRadius: "50%",
              minHeight: "16px",
              minWidth: "16px",
              height: "16px",
              width: "16px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{
          background: color.activeButtonBg,
          color: "white",
          p: 1,
          px: 4,
          borderRadius: "44px",
        }}
      >
        {questionFile ? changeLabel : uploadLabel}
      </Typography>
    </Box>
  );
};

export default FileUpload;
