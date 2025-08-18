// MatchingUserCard.tsx
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { BeyondResumeButton2 } from "../../../components/util/CommonStyle";

interface MatchingUserCardProps {
  user: {
    userId: number;
    fullName: string;
    matchPercent: number;
    matchedSkills: string[];
    userImage: string;
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
        width: "fit-content",
        background: color.cardBg,
        borderRadius: 4,
      }}
    >
      <Box display={"flex"} alignItems={"center"} gap={1} mt={0.5} >
        <Avatar
          src={user.userImage}
          alt="Avatar"
          sx={{
            width: 70,
            height: 70,
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

      <Box
        position={"relative"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={2}
      >
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

        {/* <BeyondResumeButton2 sx={{ fontSize: "10px", px: 2, py: 0.4 }}>
          See Profile
        </BeyondResumeButton2> */}
      </Box>
    </Box>
  );
};

export default MatchingUserCard;
