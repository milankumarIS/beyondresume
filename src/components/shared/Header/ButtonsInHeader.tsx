import { faEarth } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Grid2 } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { logout, logoutAnyNomous } from "../../../services/services";
import color from "../../../theme/color";
import { handleNavClick } from "../../util/CommonFunctions";
import { BeyondResumeButton } from "../../util/CommonStyle";
import { useNotifications } from "../../util/NotificationContext";

export const ButtonsInHeader = ({ buttonsArray, isLogout }: any) => {
  const locationurl = useLocation();
  const history = useHistory();
  const { notifications } = useNotifications();
  const [buttonColors, setButtonColors] = useState<{ [key: string]: string }>({
    button1: "black",
    button2: "black",
    button3: "black",
  });

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

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
    setOpen(false);
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

  return (
    <>
      <Grid2 container sx={{ p: "2px", width: "100%" }}>
        <Grid2 size={1}>
          <img
            className="header_logo"
            src="/assets/logo.png"
            style={{ color: buttonColors["/home"] }}
            onClick={() => handleNavClick(history, setButtonColors, "/home")}
          ></img>
        </Grid2>

        <Grid2
          className="header_btns_col"
          size={11}
          style={{ paddingRight: "10px" }}
        >
          {/* <Button
            id="header_btns"
            onClick={() => handleNavClick(history, setButtonColors, "/home")}
          >
            Home
          </Button> */}

          {isLogout && (
            <>
              <div className="header_btns">
                {buttonsArray
                  .filter((o: any) => o.title !== "My Orders")
                  .map((o: any, i: number) => (
                    <Box
                      // id="header_btn"
                      key={i}
                      sx={{ position: "relative", display: "inline-block" }}
                    >
                      <Button
                        sx={{ color: color.background2,  
                          textTransform:'none',
                          fontFamily:'Custom-bold'
                         }}
                        // id="header_btns"
                        onClick={() => (location.href = o.url)}
                      >
                        {o.title}
                      </Button>
                    </Box>
                  ))}
              </div>
              {/* <Box
                sx={{
                  minHeight: "48px",
                  marginRight: "-15px",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Button
                  style={{ position: "relative", height: "100%" }}
                  id="header_btns"
                  onClick={handleToggle}
                  ref={anchorRef}
                  // aria-controls={open ? "jobs-menu" : undefined}
                  // aria-haspopup="true"
                >
                  Modules{" "}
                  <FontAwesomeIcon
                    style={{
                      marginLeft: "4px",
                      marginRight: "5px",
                      fontSize: "18px",
                      marginTop: "-4px",
                    }}
                    icon={faCaretDown}
                  />
                </Button>

                <ModuleSelector
                  open={open}
                  anchorRef={anchorRef}
                  handleToggle={handleToggle}
                />
              </Box> */}

              {/* <Button
                id="header_btns"
                onClick={() =>
                  handleNavClick(history, setButtonColors, "/account")
                }
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ fontSize: "20px" }}
                />
              </Button>

              <Box
                sx={{
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                id="header_btns"
              >
                <Typography
                  sx={{
                    zIndex: "10000",
                    position: "absolute",
                    top: "4px",
                    right: "-8px",
                    backgroundColor: "#0a5c6b",
                    color: "white",
                    borderRadius: "50%",
                    padding: "1.5px 4px",
                    fontSize: "8px",
                  }}
                >
                  {notifications?.length || 0}
                </Typography>
                <FontAwesomeIcon
                  icon={faBell}
                  style={{ fontSize: "20px" }}
                  onClick={() =>
                    handleNavClick(history, setButtonColors, "/notification")
                  }
                />
              </Box> */}
            </>
          )}



          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft:'8px',
            }}
          >
            <BeyondResumeButton
              onClick={() => {
                if (isLogout) {
                  logout("login");
                } else {
                  logoutAnyNomous("login");
                }
              }}
            >
              {isLogout ? "Logout" : "Login"}
            </BeyondResumeButton>
          </div>
        </Grid2>
      </Grid2>
    </>
  );
};
