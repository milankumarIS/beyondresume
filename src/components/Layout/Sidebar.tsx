import {
  faBriefcase,
  faChartSimple,
  faCirclePlus,
  faComments,
  faCrown,
  faHome,
  faUser,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getUserRole, isLoggedIn } from "../../services/axiosClient";
import color from "../../theme/color";
import { GradientFontAwesomeIcon } from "../util/CommonStyle";
import { useTheme } from "../util/ThemeContext";

const navItems = [
  { icon: faHome, label: "Home", path: "/beyond-resume" },
  { icon: faBriefcase, label: "Jobs", path: "/beyond-resume-jobs" },
  { icon: faUser, label: "Profile", path: "/beyond-resume-candidate-profile" },
  { icon: faCrown, label: "Premium", path: "/beyond-resume-pricing" },
];

const buttonsArray: any[] = [
  {
    title: "My Team",
    url: "/my-team-performance",
    icon: faUserCircle,
    role: "SUPERVISOR,SEEKER",
  },

  {
    title: "Post a Job",
    url: "/beyond-resume",
    icon: faCirclePlus,
    role: "TALENT PARTNER",
  },
  {
    title: "My Jobs",
    url: "/beyond-resume-myjobs",
    icon: faBriefcase,
    role: "TALENT PARTNER",
  },
  {
    title: "Jobs",
    url: "/beyond-resume-jobs",
    icon: faBriefcase,
    role: "CAREER SEEKER",
  },
  {
    title: "Practice",
    url: "/beyond-resume-interviews",
    icon: faChartSimple,
    role: "CAREER SEEKER",
  },
  {
    title: "My Interviews",
    url: "/beyond-resume-interview-list",
    icon: faComments,
    role: "CAREER SEEKER",
  },
  // {
  //   title: "My Profile",
  //   url: "/beyond-resume-candidate-profile",
  //   icon: faIdCard,
  //   role: "CAREER SEEKER",
  // },
  {
    title: "Plans",
    url: "/beyond-resume-pricing",
    icon: faCrown,
    role: "CAREER SEEKER, TALENT PARTNER",
  },
  // {
  //   title: "Qn Bank",
  //   url: "/beyond-resume-questionBankForm",
  //   icon: faMoneyBill,
  //   role: "TALENT PARTNER",
  // },
];

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();
  const locationurl = useLocation();
  const collapsedWidth = 60;
  const expandedWidth = 180;
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
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: expanded ? expandedWidth : collapsedWidth,
        background: theme === "dark" ? color.sidebarBg : color.sidebarBg2,

        color: "#fff",
        zIndex: 20,
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          gap: 4,
        }}
      >
        {buttonsArray
          .filter((o: any) => o.role.includes(checkLoginStatus.role))
          .map((item, i) => (
            <Box
              key={i}
              onClick={() => history.push(item.url)}
              className="hovered"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                width: "100%",
                cursor: "pointer",
                color:
                  locationurl.pathname === item.url
                    ? color.newFirstColor
                    : color.iconColor,
                background:
                expanded?
                  locationurl.pathname === item.url
                    ? theme === "dark"
                      ? "#171f2d"
                      : "#b1c4eb"
                    : "transparent": "transparent",
                transition: "all 0.3s ease",
                height: "20px",
                fontSize: "24px",
                "&:hover": {
                  background: theme === "dark" ? "#171f2d" : "#b1c4eb",
                },
              }}
            >
              {locationurl.pathname === item.url ? (
                <GradientFontAwesomeIcon icon={item.icon} />
              ) : (
                <FontAwesomeIcon icon={item.icon} />
              )}
              <div
                style={{
                  overflow: "hidden",
                  transition:
                    "opacity 0.3s ease, max-width 0.3s ease, margin-left 0.3s ease",
                  opacity: expanded ? 1 : 0,
                  maxWidth: expanded ? 200 : 0,
                  marginLeft: expanded ? 12 : 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    color: theme === "dark" ? "white" : "black",
                    fontFamily:
                      locationurl.pathname === item.url
                        ? "custom-bold"
                        : "Montserrat-regular",
                    opacity: locationurl.pathname === item.url ? 1 : 0.7,
                    transition: "all 0.3s ease",
                    ".hovered:hover &": {
                      fontFamily: "custom-bold",
                      opacity: 1,
                    },
                  }}
                >
                  {item.title}
                </Typography>
              </div>
            </Box>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
