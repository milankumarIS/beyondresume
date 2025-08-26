// MatchingUserCard.tsx
import { Avatar, Box, Link, Typography } from "@mui/material";
import React from "react";
import { BeyondResumeButton2 } from "../../../components/util/CommonStyle";
import {
  faChevronCircleRight,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { extractCleanFileName } from "../../../components/util/CommonFunctions";

interface MatchingUserCardProps {
  user: {
    userId: number;
    fullName: string;
    matchPercent: number;
    matchedSkills: string[];
    userImage: string;
    resumeFileUrl?: string;
    about?: string;
  };
  color: { cardBg: string };
  size?: number;
  strokeWidth?: number;
}

const MatchingUserCard: React.FC<MatchingUserCardProps> = ({
  user,
  color,
  size = 80,
  strokeWidth = 20,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const fileUrl = user?.resumeFileUrl;
  const cleanFileName = fileUrl ? extractCleanFileName(fileUrl) : "";

  return (
    <Box
      key={user.userId}
      sx={{
        fontSize: "14px",
        mb: 3,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        minWidth: "60%",
        width: "100%",
        background: color.cardBg,
        borderRadius: 4,
      }}
    >
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          width={"fit-content"}
          gap={1}
          mt={0.5}
        >
          <Avatar
            src={user.userImage}
            alt="Avatar"
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              alignSelf: "center",
            }}
          />
          <div>
            <Typography>{user.fullName}</Typography>
            <Typography fontSize="12px" color="gray">
              Skills matched: {user.matchedSkills.join(", ")}
            </Typography>
          </div>
        </Box>

        {user?.about && (
          <Box p={1} pb={0}>
            <Typography textAlign="left">About:</Typography>

            <Typography
              variant="body2"
              mt={0.4}
              mb={2}
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                fontFamily: "Montserrat-Regular",
                fontSize: "12px",
                textAlign: "left",
              }}
            >
              {user?.about}
            </Typography>
          </Box>
        )}
      </Box>

      <Box minWidth={"200px"} px={2} height={"100%"}>
        <Box position={"relative"} width={"fit-content"} m={"auto"} mb={2}>
          <svg width={size} height={size}>
            <circle
              stroke="#2A2D3E"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            <circle
              stroke={
                user.matchPercent >= 70
                  ? "green"
                  : user.matchPercent >= 40
                  ? "orange"
                  : "red"
              }
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - user.matchPercent / 100)}
              r={radius}
              cx={size / 2}
              cy={size / 2}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>

          <Typography
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, 0%)",
              width: size,
              height: size,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {user.matchPercent}%
          </Typography>
        </Box>

        {/* <Typography>
          <Link
            sx={{ color: "black" }}
            href={fileUrl}
            target="_blank"
            rel="noopener"
            underline="none"
          >
            <FontAwesomeIcon icon={faDownload} /> {cleanFileName}
          </Link>
        </Typography> */}

        {fileUrl && (
          <BeyondResumeButton2
            onClick={() =>
              window.open(fileUrl, "_blank", "noopener,noreferrer")
            }
            sx={{ width: "100%" }}
          >
            View Profile
            <FontAwesomeIcon
              style={{ marginLeft: "5px" }}
              icon={faChevronCircleRight}
            />
          </BeyondResumeButton2>
        )}
      </Box>
    </Box>
  );
};

export default MatchingUserCard;
