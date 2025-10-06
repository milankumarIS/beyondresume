import {
  faBuilding,
  faCloudMoon,
  faCloudSun,
  faHamburger,
  faSignOut,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { getUserRole } from "../../services/axiosClient";
import { GradientFontAwesomeIcon } from "../util/CommonStyle";
import ConfirmationPopup from "../util/ConfirmationPopup";
import { useTheme } from "../util/ThemeContext";
import SidebarMenuDrawer from "./SidebarMenuDrawer";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [popupOpen1, setPopupOpen1] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const isPublicPage = location.pathname.startsWith(
    "/beyond-resume-publicjobdetails"
  );

  const isOnProfilePage =
    location.pathname === "/beyond-resume-candidate-profile" ||
    location.pathname === "/beyond-resume-company-profile";

  const handleClick = () => {
    if (isOnProfilePage) {
      history.goBack();
    } else {
      getUserRole() === "CAREER SEEKER"
        ? history.push("/beyond-resume-candidate-profile")
        : history.push("/beyond-resume-company-profile");
    }
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      style={{
        height: "60px",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      <img
        style={{ height: "40px" }}
        src={
          theme === "dark" ? "/assets/skllogo2.png" : "/assets/skllogolight.png"
        }
        // onClick={() => handleNavClick(history, setButtonColors, "/home")}
      ></img>

      <Box
        p={1}
        fontSize={"20px"}
        display={"flex"}
        alignItems={"center"}
        gap={2.5}
      >
        <FontAwesomeIcon
          icon={theme === "dark" ? faCloudSun : faCloudMoon}
          style={{ cursor: "pointer" }}
          onClick={toggleTheme}
          title="Toggle Theme"
        />
        {getUserRole() === "TALENT PARTNER" &&
        <FontAwesomeIcon
          title="Company Profile"
          style={{
            cursor: "pointer",
            // marginRight: 24,
          }}
          onClick={() => history.push("/beyond-resume-company-profile")}
          icon={faBuilding}
        />}
        {!isPublicPage && (
          <>
            {getUserRole() === "CAREER SEEKER" ? (
              <Box style={{ cursor: "pointer" }} onClick={handleClick}>
                {isOnProfilePage ? (
                  <GradientFontAwesomeIcon size={20} icon={faUserCircle} />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} />
                )}
              </Box>
            ) : (
              <></>
              // <Box style={{ cursor: "pointer" }}
              // onClick={handleClick}
              // >
              //   {isOnProfilePage ? (
              //     <GradientFontAwesomeIcon size={20} icon={faBuilding} />
              //   ) : (
              //     <FontAwesomeIcon icon={faBuilding} />
              //   )}
              // </Box>
            )}

            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { xs: "block", md: "none" }, color: "inherit" }}
            >
              <FontAwesomeIcon icon={faHamburger} />
            </IconButton>

            <SidebarMenuDrawer
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />

            <FontAwesomeIcon
              title="Sign out"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setPopupOpen1(true);
              }}
              icon={faSignOut}
            />
          </>
        )}
      </Box>

      <ConfirmationPopup
        open={popupOpen1}
        onClose={() => setPopupOpen1(false)}
        onConfirm={() => {
          localStorage.clear();
          window.close();
          setPopupOpen1(false);
          setTimeout(() => {
            if (!window.closed) {
              window.location.href = "https://indi.skillablers.com/indi-login";
            }
          }, 100);
        }}
        color="#50bcf6"
        message="Are you sure you want to log out?"
        warningMessage="This will end your session in Beyond Resume and redirect you back to Skillablers."
      />
    </div>
  );
};

export default Header;
