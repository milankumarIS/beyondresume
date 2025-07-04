import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import color from "../../theme/color";

interface FileUploadModalProps {
  open: boolean;
  handleClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  handleClose,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [tabValue, setTabValue] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles: any) => setFiles([...files, ...acceptedFiles]),
  });

  const handleDelete = (fileToDelete: File) => {
    setFiles(files.filter((file) => file !== fileToDelete));
  };

  const handleDeleteAll = () => setFiles([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography
          variant="h6"
          sx={{
            color: color.textColor,
            background: color.secondColor,
            p: 2,
            m: -4,
            mb: 1,
            pl: 4,
          }}
        >
          Choose File
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: color.borderColor,
            },
          }}
        >
          <Tab
            style={{
              color: color.textColor,
              textTransform: "none",
              fontWeight: "bold",
            }}
            label="My Desktop"
          />
          <Tab
            style={{
              color: color.textColor,
              textTransform: "none",
              fontWeight: "bold",
            }}
            label="Google Drive"
          />
        </Tabs>

        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: color.borderColor,
            padding: 2,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          <input {...getInputProps()} />
          <Typography
            style={{
              color: color.textColor,
            }}
          >
            Drag here or click to choose file
          </Typography>
        </Box>

        {files.length > 0 && (
          <Box mt={0}>
            {files.map((file, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
              >
                <Typography
                  sx={{
                    color: "black",
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {file.name}
                </Typography>
                <IconButton onClick={() => handleDelete(file)}>
                  <FontAwesomeIcon icon={faTrash} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Box
          display="flex"
          justifyContent="flex-end"
          sx={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            gap: "10px",
            borderTop: "solid 2px",
            borderColor: color.borderColor,
            padding: 2,
            marginLeft: -4,
            marginRight: -4,
            // paddingBottom: 0,
          }}
          mt={2}
        >
          {files.length > 1 && (
            <Button
              // id="button"
              style={{
                borderColor: "red",
                color: "red",
              }}
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          )}

          <Button
            style={{ margin: 0 }}
            id={files.length > 0 ? "button" : "disabled-button"}
            variant="contained"
            color="primary"
          >
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Styles
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  minHeight: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  pt: 3,
  pb: 12,
  //   pr: 4,
};

export default FileUploadModal;
