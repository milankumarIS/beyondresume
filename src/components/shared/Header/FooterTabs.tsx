import { faHome, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { handleNavClick } from "../../util/CommonFunctions";

export const FooterTabs = ({ buttonsArray }: any) => {
  const history = useHistory();
  const activeLocation = useLocation();
  const [buttonColors, setButtonColors] = useState<{ [key: string]: string }>({
    button1: "black",
    button2: "black",
    button3: "black",
  });

  return (
    <>
      <Box className="scrollable-row">
        {/* <Box
          sx={{
            color: activeLocation.pathname === "/home" ? "#0a5c6b" : "black",
          }}
          className="navbarcol"
        >
          <FontAwesomeIcon
            className="navbar_icon"
            style={{ fontSize: "24px" }}
            icon={faHome}
            onClick={() => handleNavClick(history, setButtonColors, "/home")}
          />
          <span style={{ color: "inherit" }} className="navbar_txt">
            Home
          </span>
        </Box> */}

        {buttonsArray
          .filter((o: any) => o.title !== "Notification")
          .map((o: any, i: number) => (
            <Box
              key={i}
              // size="auto"
              className="navbarcol"
              sx={{
                // background:
                //   activeLocation.pathname === o.url ? "#0a5c6b" : "transparent",
                color: activeLocation.pathname === o.url ? "#0a5c6b" : "black",
                // py: 1,
                // borderRadius: "4px",
              }}
            >
              <FontAwesomeIcon
                style={{}}
                className="navbar_icon"
                icon={o.icon}
                onClick={() => (location.href = o.url)}
              />
              <span style={{ color: "inherit" }} className="navbar_txt">
                {o.title}
              </span>
            </Box>
          ))}

        {/* <Box
          className="navbarcol"
          sx={{
            color: activeLocation.pathname === "/home" ? "#0a5c6b" : "black",
          }}
        >
          <FontAwesomeIcon
            style={{
              fontSize: "26px",
              color:
                activeLocation.pathname === "/account" ? "#0a5c6b" : "black",
            }}
            className="navbar_icon"
            icon={faUserCircle}
            onClick={() => handleNavClick(history, setButtonColors, "/account")}
          />
          <span style={{ color: "inherit" }} className="navbar_txt">
            Account
          </span>
        </Box> */}
      </Box>
    </>
  );
};
