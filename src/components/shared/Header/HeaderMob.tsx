import {
  faBell,
  faEarth,
  faEllipsisVertical,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Grid2, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import {
  getUserAge,
  getUserRole,
  isLoggedIn,
} from "../../../services/axiosClient";
import { handleNavClick } from "../../util/CommonFunctions";
import { useNotifications } from "../../util/NotificationContext";
import "./Header.css";
import MenuHoverItem from "./MenuHoverItem";

const Header: React.FC = () => {
  const { notifications } = useNotifications();
  const history = useHistory();

  const [checkLoginStatus] = useState({
    status: isLoggedIn(),
    role: getUserRole(),
    age: getUserAge(),
  });

  const [buttonColors, setButtonColors] = useState<{ [key: string]: string }>({
    button1: "black",
    button2: "black",
    button3: "black",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const translateElement = document.getElementById(
        "google_translate_element"
      );
      if (
        translateElement &&
        translateElement.style.display === "block" &&
        !translateElement.contains(event.target as Node)
      ) {
        translateElement.style.display = "none";
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const showTranslateElement = (event: React.MouseEvent) => {
    event.stopPropagation();

    const translateElement = document.getElementById(
      "google_translate_element"
    );

    if (translateElement) {
      if (
        translateElement.style.display === "none" ||
        translateElement.style.display === ""
      ) {
        translateElement.style.display = "block";
      } else {
        translateElement.style.display = "none";
        return;
      }

      const languageDropdown = translateElement.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement;
      if (languageDropdown) {
        languageDropdown.focus();

        const event = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
        });
        languageDropdown.dispatchEvent(event);
      }
    }
  };

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: { xs: "flex", sm: "none" },maxWidth:'100%' }} className="header">
        <Toolbar
          sx={{
            width: "100%",
            minHeight: { xs: "58px", sm: "58px" },
            padding: "0px 4px",
            minWidth:'0px'
          }}
          className="toolbar_sm_down"
        >
          <Grid2 container width={"100%"}>
            <Grid2 size={1.6}>
              <img
                className="header_logo"
                src="/assets/skllogo.png"
                // onClick={() =>
                //   handleNavClick(history, setButtonColors, "/home")
                // }
              ></img>
            </Grid2>

            <Grid2 size={checkLoginStatus.status ? 5.6 : 8}></Grid2>

            {/* {checkLoginStatus.status && (
              <>
                <Grid2
                  size={1.2}
                  className="header_icon_col"
                  style={{ marginTop: "5px" }}
                >
                  <Button
                    style={{ color: "#0a5c6b" }}
                    onClick={handleToggle}
                    ref={anchorRef}
                    aria-controls={open ? "jobs-menu" : undefined}
                    aria-haspopup="true"
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      style={{ fontSize: "26px" }}
                    />
                  </Button>


                </Grid2>

                <Grid2
                  size={1.2}
                  className="header_icon_col"
                  style={{ marginTop: "5px", position: "relative" }}
                >
                  <Typography
                    sx={{
                      zIndex: "10000",
                      position: "absolute",
                      top: "5px",
                      right: "7px",
                      backgroundColor: "#0a5c6b",
                      color: "white",
                      borderRadius: "50%",
                      padding: "1.5px 4px",
                      fontSize: "10px",
                    }}
                  >
                    {notifications?.length || 0}
                  </Typography>
                  <FontAwesomeIcon
                    style={{ fontSize: "22px", color: "#0a5c6b" }}
                    icon={faBell}
                    onClick={() =>
                      handleNavClick(history, setButtonColors, "/notification")
                    }
                  ></FontAwesomeIcon>
                </Grid2>
              </>
            )} */}
            {/* <Grid2
              size={1.2}
              className="header_icon_col"
              style={{ marginTop: "5px" }}
            >
              <Button style={{ color: "#0a5c6b" }}>
                <FontAwesomeIcon
                  style={{ fontSize: "24px" }}
                  onClick={showTranslateElement}
                  icon={faEarth}
                ></FontAwesomeIcon>
              </Button>
            </Grid2> */}

            {/* <Grid2
              id="hover-trigger"
              size={1.2}
              className="header_icon_col"
              style={{ marginTop: "5px" }}
            >
              <div
                onClick={handleClick}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  style={{ fontSize: "24px", color: "#0a5c6b" }}
                />
              </div>

              <MenuHoverItem
                isLogout={checkLoginStatus.status}
                anchorEl={anchorEl}
                onClose={handleClose}
              />
            </Grid2> */}
          </Grid2>
        </Toolbar>
      </Box>
    </>
  );
};

export default Header;
