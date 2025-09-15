import React, { useEffect, useState } from "react";
import { Drawer, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useLocation } from "react-router-dom";
import { useTheme } from "../util/ThemeContext";
import { buttonsArray } from "./Sidebar"; // reuse same array
import color from "../../theme/color";
import { getUserRole, isLoggedIn } from "../../services/axiosClient";

const SidebarMenuDrawer: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const history = useHistory();
  const locationurl = useLocation();
  const { theme } = useTheme();

  const [checkLoginStatus, setCheckLoginStatus] = useState({
    status: isLoggedIn(),
    role: getUserRole(),
  });

  useEffect(() => {
    setCheckLoginStatus({
      status: isLoggedIn(),
      role: getUserRole(),
    });
  }, [getUserRole()]);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 240,
          background: theme === "dark" ? color.sidebarBg : color.sidebarBg2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "16px 8px",
        }}
      >
        <Box mb={2}>
          <img
            style={{
              height: "40px",
              width: "100px",
              margin: "auto",
              display: "block",
            }}
            src={
              theme === "dark"
                ? "/assets/skllogo2.png"
                : "/assets/skllogolight.png"
            }
          ></img>
        </Box>

        {buttonsArray
          .filter(
            (o: any) =>
              checkLoginStatus.status && o.role.includes(checkLoginStatus.role)
          )
          .map((item, i) => (
            <Box
              key={i}
              onClick={() => {
                history.push(item.url);
                onClose();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px",
                cursor: "pointer",
                color:
                  locationurl.pathname === item.url
                    ? color.newFirstColor
                    : color.iconColor,
                "&:hover": {
                  background: theme === "dark" ? "#171f2d" : "#b1c4eb",
                },
              }}
            >
              <FontAwesomeIcon icon={item.icon} />
              <Typography
                sx={{
                  marginLeft: 2,
                  fontSize: 14,
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
      </Box>
    </Drawer>
  );
};

export default SidebarMenuDrawer;
