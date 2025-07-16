import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled, ButtonProps, Button, Avatar, keyframes, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export const BeyondResumeButton = styled((props: ButtonProps) => (
  <Button {...props} />
))(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  color: "white",
  textTransform: "none",
  background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
  borderRadius: "44px",
  height: "fit-content",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  marginTop: "auto",
  marginBottom: "auto",
  transition: "all 0.3s",
  "&:hover": {
    transform: "scale(1.08)",
    borderColor:'transparent'
  },
}));

import { Box } from "@mui/material";

import React from "react";
import color from "../../theme/color";

const gradientId = "blob-gradient";

export const BlobComponent = ({
  top,
  bottom,
  left,
  right,
  width = 250,
  height = 250,
  path,
  className,
  text,
  icon,
  textColor = "#ffffff",
  fontSize = 16
}: {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: number;
  height?: number;
  path: string;
  className?: string;
  text?: string;
  icon?: React.ReactNode;
  textColor?: string;
  fontSize?: number;
}) => (
  <Box
  className="float-both"
    sx={{
      position: "absolute",
      top,
      bottom,
      left,
      right,
      width: `${width}px`,
      height: `${height}px`,
    }}
  >
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <svg
        className={className}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#50bcf6" />
            <stop offset="100%" stopColor="#5a81fd" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          d={path}
          transform="translate(100 100)"
        />
      </svg>

      {(text || icon) && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none", // allows clicks to pass through
          }}
        >
          {icon && <Box sx={{ mb: text ? 0.5 : 0 }}>{icon}</Box>}
          {text && (
            <Box
              component="span"
              sx={{
                color: textColor,
                fontSize,
                fontWeight: "bold",
                fontFamily: "Custom-Bold",
              }}
            >
              {text}
            </Box>
          )}
        </Box>
      )}
    </Box>
  </Box>
);


export const BlobAnimation = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <svg preserveAspectRatio="xMidYMid slice" viewBox="20 35 80 80">
          <defs>
            <style>
              {`
                @keyframes rotate {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .out-top {
                  animation: rotate 20s linear infinite;
                  transform-origin: 13px 25px;
                }
                .in-top {
                  animation: rotate 10s linear infinite;
                  transform-origin: 13px 25px;
                }
                .out-bottom {
                  animation: rotate 25s linear infinite;
                  transform-origin: 84px 97px;
                }
                .in-bottom {
                  animation: rotate 15s linear infinite;
                  transform-origin: 84px 93px;
                }
              `}
            </style>
          </defs>
          <path
            fill="rgba(89, 135, 253, 0.56)"
            className="out-top"
            d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
          />
          <path
            fill="rgba(80, 182, 246, 0.53)"
            className="in-top"
            d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
          />
          {/* <path
            fill="rgba(89, 135, 253, 0.49)"
            className="out-bottom"
            d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4,0.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
          />
          <path
            fill="rgba(80, 182, 246, 0.42)"
            className="in-bottom"
            d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
          /> */}
        </svg>
      </div>
    );
  };
  

  const listeningAnimation = keyframes`
  from {
    opacity: 0.25;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
`;

export const ListeningAvatar = styled(Avatar)(({ theme }) => ({
  margin: "auto",
  padding: "6px",
  position: "relative",
  backgroundColor: "#0da9d9",
  overflow: "visible",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#50bcf6",
    animation: `${listeningAnimation} 1.3s infinite`,
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
}));


export const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "#f0f2f7",
  borderRadius: "20px",
  padding: "4px",
}));

export const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  borderRadius: "20px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "14px",
  textTransform: "none",
  color: "grey",
  "&.Mui-selected": {
    backgroundColor: "#50bcf6 !important",
    color: "#fff",
  },
}));



const iconStyle = {
  background: color.newFirstColor,
  color: "white",
  padding: "4px",
  borderRadius: "4px",
  height: "14px",
  width: "14px",
};

export const IconTextRow = ({ icon, text }: { icon: any; text: string }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <FontAwesomeIcon style={iconStyle} icon={icon} />
    <Typography sx={{ fontSize: "14px" }}>{text}</Typography>
  </Box>
);

export const IconTextRow1 = ({
  icon,
  text,
  heading,
}: {
  icon: any;
  text: string;
  heading: string;
}) => (
  <Box>
    <Box display="flex" alignItems="center" gap={1}>
      <FontAwesomeIcon style={iconStyle} icon={icon} />
      {heading && (
        <Typography>
          {heading} 
        </Typography>
      )}
    </Box>

    <Typography sx={{ fontSize: "14px", mt: 1,
      fontFamily:'Montserrat-Regular'
     }}>{text}</Typography>
  </Box>
);

export const commonPillStyle = {
  borderRadius: "999px",
  background: color.newFirstColor,
  color: "white",
  width: "fit-content",
  px: 1,
  fontFamily: "montserrat-regular",
  fontSize: "12px",
};
