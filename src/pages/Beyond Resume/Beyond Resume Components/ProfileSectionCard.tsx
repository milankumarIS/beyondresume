import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";
import color from "../../../theme/color";

interface Props {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
}

export default function ProfileSectionCard({ title, children, onEdit }: Props) {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        background: "white",
        color: "black",
        borderRadius: "14px",
        height: "fit-content",
        boxShadow: "none",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">{title}</Typography>
        {onEdit && (
          <FontAwesomeIcon
            style={{
              fontSize: "12px",
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              padding: "6px",
              borderRadius: "4px",
              color:'white'
            }}
            icon={faEdit}
            onClick={onEdit}
          ></FontAwesomeIcon>
        )}
      </Box>
      {children}
    </Paper>
  );
}
