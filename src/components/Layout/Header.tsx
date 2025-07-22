import {
  faBell,
  faCircleUser,
  faCloudMoon,
  faCloudSun,
  faGear,
  faMoon,
  faSignOut,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "../util/ThemeContext";
import ConfirmationPopup from "../util/ConfirmationPopup";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [popupOpen1, setPopupOpen1] = useState(false);

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
      }}
    >
      <img
        style={{ height: "40px" }}
        src={
          theme === "dark" ? "/assets/skllogo2.png" : "/assets/skllogolight.png"
        }
        // onClick={() => handleNavClick(history, setButtonColors, "/home")}
      ></img>

      <Box p={1} fontSize={"20px"}>
        <FontAwesomeIcon
          icon={theme === "dark" ? faCloudSun : faCloudMoon}
          style={{ marginRight: 24, cursor: "pointer" }}
          onClick={toggleTheme}
          title="Toggle Theme"
        />
        <FontAwesomeIcon
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            setPopupOpen1(true);
          }}
          icon={faSignOut}
        />
      </Box>

      <ConfirmationPopup
        open={popupOpen1}
        onClose={() => setPopupOpen1(false)}
        onConfirm={() => {
          localStorage.clear();
          window.close();
        }}
        color="#50bcf6"
        message="Are you sure you want to log out?"
        warningMessage="This will end your session in Beyond Resume and redirect you back to Skillablers."
      />
    </div>
  );
};

export default Header;
