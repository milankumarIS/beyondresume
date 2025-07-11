import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import color from "../../../../theme/color";
import {
  UploadFileInTable,
  searchDataFromTable,
} from "../../../../services/services";
import { getUserId } from "../../../../services/axiosClient";
import { useNewSnackbar } from "../../../../components/shared/useSnackbar";
import CustomSnackbar from "../../../../components/util/CustomSnackbar";

export default function ResumeUploadForm({
  onSave,
  onCancel,
}: {
  onSave: (file: File) => void;
  onCancel: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { snackbarProps, showSnackbar } = useNewSnackbar();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // console.log(selectedFile)

      UploadFileInTable(
        "userPersonalInfo",
        {
          primaryKey: "userId",
          primaryKeyValue: getUserId(),
          fieldToUpload: "resumeFile",
          folderName: `resume/resumeFile`,
        },
        formData
      )
        .then(async () => {
          showSnackbar("File uploaded successfully", "success");
          onSave(selectedFile);
        })
        .catch((error) => {
          showSnackbar(
            "There is an error occurred during the file upload. It may be due to the file size. File size should be less than 50Kb",
            "warning"
          );
        });
    }
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          background: color.background,
          border: "solid 1px white",
          p: 4,
          borderRadius: "12px",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          margin: "auto",
        }}
        component="label"
      >
        <input
          type="file"
          hidden
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />
        {!selectedFile && (
          <Typography
            sx={{
              textAlign: "center",
              color: "white",
              fontSize: "14px",
              px: 2,
            }}
          >
            Drag and drop file or click To Upload PDF • Max file size 2MB
          </Typography>
        )}
        {selectedFile && (
          <Typography
            sx={{
              color: "white",
              p: 1,
              px: 4,
              borderRadius: "44px",
              textAlign: "center",
            }}
          >
            {selectedFile.name}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
            color: "white",
            p: 1,
            px: 4,
            borderRadius: "44px",
          }}
        >
          Upload Your Resume
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} p={1} px={2}>
        <BeyondResumeButton
          onClick={handleUpload}
          disabled={!selectedFile}
          variant="contained"
        >
          Upload
        </BeyondResumeButton>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
      <CustomSnackbar {...snackbarProps} />
    </Stack>
  );
}
