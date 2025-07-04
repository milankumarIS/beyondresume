import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

export default function ResumeUploadForm({
  onSave,
  onCancel,
}: {
  onSave: (file: File) => void;
  onCancel: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) onSave(selectedFile);
  };

  return (
    <Stack spacing={2}>
      <Button variant="outlined" component="label">
        Choose Resume
        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleChange} />
      </Button>
      {selectedFile && (
        <Typography variant="body2">
          Selected: <b>{selectedFile.name}</b>
        </Typography>
      )}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
    </Stack>
  );
}
