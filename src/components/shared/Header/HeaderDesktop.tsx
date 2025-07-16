import { faMoneyBill, faScroll } from "@fortawesome/free-solid-svg-icons";
import { AppBar, Box, Grid, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getUserRole,
  getUserSelectedModuleCode,
  isLoggedIn,
} from "../../../services/axiosClient";
import { ButtonsInHeader } from "./ButtonsInHeader";
import { FooterTabs } from "./FooterTabs";
import "./Header.css";

import {
  faBriefcase,
  faIdCard,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
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

  const moduleRole = getUserSelectedModuleCode();



  const buttonsArray: any[] = [
    {
      title: "My Team",
      url: "/my-team-performance",
      icon: faUserCircle,
      role: "SUPERVISOR,SEEKER",
    },

    {
      title: "List a Job",
      url: "/beyond-resume",
      icon: faScroll,
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
      icon: faScroll,
      role: "CAREER SEEKER",
    },
    {
      title: "My Interviews",
      url: "/beyond-resume-interview-list",
      icon: faScroll,
      role: "CAREER SEEKER",
    },
    {
      title: "My Profile",
      url: "/beyond-resume-candidate-profile",
      icon: faIdCard,
      role: "CAREER SEEKER",
    },
    {
      title: "Plans",
      url: "/beyond-resume-pricing",
      icon: faMoneyBill,
      role: "CAREER SEEKER, TALENT PARTNER",
    },
    // {
    //   title: "Qn Bank",
    //   url: "/beyond-resume-questionBankForm",
    //   icon: faMoneyBill,
    //   role: "TALENT PARTNER",
    // },
  ];

  // if (getUserAge() >= 60)
  //   buttonsArray.splice(1, 0, {
  //     title: "SCD",
  //     url: "/seniorCitizenDashboard",
  //     icon: faHeart,
  //     role: "PATIENT",
  //   });

  return (
    <>
      <Box
        sx={{
          display: {
            xs: "none",
            sm: "flex",
            background: "transparent",
            position: "sticky",
          },
        }}
        className="header"
      >
        <Toolbar
          sx={{
            width: "100%",
            minHeight: { xs: "58px", sm: "58px" },
          }}
          className="toolbar_sm_up"
        >
          <ButtonsInHeader
            buttonsArray={buttonsArray.filter((o: any) =>
              o.role.includes(checkLoginStatus.role)
            )}
            isLogout={checkLoginStatus.status}
            checkLoginStatus={checkLoginStatus}
          />
        </Toolbar>
      </Box>

      {buttonsArray.filter((o: any) => o.role.includes(checkLoginStatus.role))
        .length > 0 ? (
        <AppBar
          position="fixed"
          sx={{
            top: "auto",
            bottom: 0,
            zIndex: 1000001,
            display: { xs: "flex", sm: "none" },
          }}
        >
          <Toolbar sx={{ padding: 0, background: "white" }}>
            <Grid container className="scrollable-footer" sx={{ padding: 0 }}>
              <FooterTabs
                buttonsArray={buttonsArray.filter((o: any) =>
                  o.role.includes(checkLoginStatus.role)
                )}
                isLogout={checkLoginStatus.status}
              />
            </Grid>
          </Toolbar>
        </AppBar>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
