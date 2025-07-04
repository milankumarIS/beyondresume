import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
interface LoginPopupModalProps {
  open: boolean;
  onClose: () => void;
  action1?: () => void;
  action2?: () => void;
  message: string;
  attempts?: string;
  timeToActive?: string;
  deviceType?: string;
  deviceName?: string;
  deviceIP?: string;
  color?: string;
  actionButtonName1?: string;
  actionButtonName2?: string;
}

const LoginPopupModal: React.FC<LoginPopupModalProps> = ({
  open,
  onClose,
  action1,
  action2,
  message,
  attempts,
  timeToActive,
  deviceType,
  deviceName,
  deviceIP,
  color,
  actionButtonName1,
  actionButtonName2,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ pt: 3, alignSelf: "center" }}>
        <Button
          style={{
            marginLeft: "10px",
            background: "white",
            color: color ? color : "#0a5c6b",
            height: "64px",
            minWidth: "34px",
            padding: "6px",
            borderRadius: "50%",
          }}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            style={{ fontSize: "84px" }}
          ></FontAwesomeIcon>
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <DialogContentText
          sx={{
            textAlign: "center",
            color: "black",
            fontWeight: "bold",
            mb: 0,
            fontSize: "16px",
            minWidth: "250px",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </DialogContentText>

        {attempts && (
          <DialogContentText
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: color,
              fontSize: "12px",
            }}
          >
            {attempts} attempt(s) remaining
          </DialogContentText>
        )}
        {timeToActive && (
          <DialogContentText
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: color,
              fontSize: "12px",
            }}
          >
            It will be unlocked after {timeToActive} hour(s)
          </DialogContentText>
        )}

        {(deviceType === "WEB" || deviceType === "MOBILE") && (
          <DialogContentText
            sx={{
              textAlign: "center",
              background: "#f5f5f5",
              border: "solid 1px grey",
              borderRadius: "6px",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              color: "black",
              fontSize: "14px",
              alignItems: "center",
              gap: 5,
              p: 2,
              mt: 1,
            }}
          >
            <Box
              component="img"
              src={`/assets/${deviceType?.toLowerCase()}.png`}
              sx={{
                width: "100px",
                height: "100px",
                p: 2,
                border: "solid 1px grey",
                borderRadius: "12px",
                objectFit: "contain",
              }}
            ></Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                justifyContent: "space-around",
                height: "100%",
                gap: "5px",
              }}
            >
              <Typography className="capsule">
                Device Type:
                <Typography sx={{ fontFamily: "Custom-Bold" }}>
                  {" "}
                  {deviceType}
                </Typography>
              </Typography>
              <Typography className="capsule">
                Device Name:
                <Typography sx={{ fontFamily: "Custom-Bold" }}>
                  {" "}
                  {deviceName}
                </Typography>
              </Typography>
              <Typography className="capsule">
                Device IP:
                <Typography sx={{ fontFamily: "Custom-Bold" }}>
                  {" "}
                  {deviceIP}
                </Typography>
              </Typography>
            </Box>
          </DialogContentText>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, mt: 0, alignSelf: "flex-end" }}>
        <Button
          onClick={action1 ? action1 : close}
          id="button"
          style={{
            background: "transparent",
            fontWeight: "bold",
            color: "black",
            textTransform: "none",
          }}
        >
          {actionButtonName1 ? actionButtonName1 : "Close"}
        </Button>
        <Button onClick={action2} id="button">
          {actionButtonName2 ? actionButtonName2 : "Action"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPopupModal;
