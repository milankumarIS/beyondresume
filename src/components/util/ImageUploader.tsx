import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  maxSize?: number;
  placeholderText?: string;
  width?: number | string;
  height?: number | string;
  initialImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  maxSize = 50,
  placeholderText = "Add Image",
  width = 200,
  height = 150,
  initialImage,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (initialImage) {
      setAvatarPreview(initialImage);
    }
  }, [initialImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024) {
        setImageError(`Image size should not exceed ${maxSize}KB.`);
        return;
      }
      setImageError(null);
      setAvatarPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  const clearImage = () => {
    setAvatarPreview(null);
    setImageError(null);
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {avatarPreview ? (
        <Box
          sx={{
            position: "relative",
            width,
            height,
          }}
        >
          <Box
            component="img"
            src={avatarPreview}
            alt="Preview"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 2,
            }}
          />
          <FontAwesomeIcon
            icon={faXmarkCircle}
            onClick={clearImage}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              fontSize: 24,
              color: "grey",
              cursor: "pointer",
            }}
          />
        </Box>
      ) : (
        <label htmlFor="file-upload">
          <Box
            sx={{
              width,
              height,
              border: `2px dotted black`,
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            <Typography
              sx={{
                color: "grey",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {placeholderText}
            </Typography>
          </Box>
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        id="file-upload"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      {imageError && (
        <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
          {imageError}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;
