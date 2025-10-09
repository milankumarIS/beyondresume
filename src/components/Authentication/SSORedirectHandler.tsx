import { Device } from "@capacitor/device";
import { Alert as MuiAlert, Snackbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { setCurrentAccessToken } from "../../services/axiosClient";
import {
  login,
  registerMobileProfile,
  searchDataFromTable,
  SSOlogout,
  syncByTwoUniqueKeyData,
  syncDataInTable
} from "../../services/services";
import { getDeviceIp } from "../util/CommonFunctions";
import { useIndustry } from "../context/IndustryContext";

const SSORedirectHandler = () => {
  const location = useLocation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any | null>(null);
  const [ip, setIp] = useState<any | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const queryParams = new URLSearchParams(location.search);
  // const token = queryParams.get("token") || "";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkNBTjI1QTE5NTkwIiwidXNlckVtYWlsIjoiYmhhZ3lhLnNiQHNraWxsYWJsZXJzLmNvbSIsInBhc3N3b3JkIjoiU2tpbGxAMzYwIiwiRmlyc3ROYW1lIjoiQmhhZ3lhICIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IlNhdGh5YSBCIiwidXNlclR5cGUiOiJJbmRpdmlkdWFsIiwiaXNQcm9maWxlQ3JlYXRlZCI6dHJ1ZSwiYnJKb2JJZCI6NjYsImV4cCI6MTcyNTQ3ODYwMCwiaWF0IjoxNzU0OTc1Njc5fQ.zSV0II8UHp3E7R5xY_yXOr9yeCQuzuvvHmjdPcOJL4k";
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IklORFUyM0EwMDA3MiIsInVzZXJFbWFpbCI6ImJoYWd5YS5zYXRoeWExOTk1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmRAU1NPMTIzIiwiRmlyc3ROYW1lIjoiYmhhZ3lhIiwiTWlkZGxlTmFtZSI6IiIsIkxhc3ROYW1lIjoiIiwidXNlclR5cGUiOiJJbmR1c3RyeSIsImlzUHJvZmlsZUNyZWF0ZWQiOmZhbHNlLCJleHAiOjE3MjU0Nzg2MDAsImlhdCI6MTc1MTg3NDM1MX0.7IgPdxcX6IPUXjTa1oj9t5CtqjiyP--S2wBjbwfGUss'

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkNBTjIwQTAwMjc2IiwidXNlckVtYWlsIjoib2ZmaWNpYWxyb2hpdDI3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiU2tpbGxhYmxlcnNAMTIzJCIsIkZpcnN0TmFtZSI6IlJvaGl0ICIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6Ikt1bWFyIiwidXNlclR5cGUiOiJJbmRpdmlkdWFsIiwiaXNQcm9maWxlQ3JlYXRlZCI6dHJ1ZSwiZXhwIjoxNzI1NDc4NjAwLCJpYXQiOjE3NTMxNjAxNTZ9.w6HTfS8hhYBi_kIFqjMkGNdffvGWe8GdVNp-6OSmW4A";
  const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IklORFUyMkEwMDAzMCIsInVzZXJFbWFpbCI6ImppdGhpbi5ra0Bza2lsbGFibGVycy5jb20iLCJwYXNzd29yZCI6InBhc3N3b3JkQFNTTzEyMyIsIkZpcnN0TmFtZSI6ImppdGhpbiIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IiIsInVzZXJUeXBlIjoiSW5kdXN0cnkiLCJpc1Byb2ZpbGVDcmVhdGVkIjpmYWxzZSwiSW5kdXN0cnlOYW1lIjoiRGVtbyBDb21wYW55IiwiZXhwIjoxNzI1NDc4NjAwLCJpYXQiOjE3NTU1MDg1NzV9.loR-cwwtVSts44Qu5lqYP5WOPYWszyeiQ_2uhv40POg";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IklORFUyNUEwMDA4NiIsInVzZXJFbWFpbCI6ImJoYWd5YS5zYkBza2lsbGFibGVycy5jb20iLCJwYXNzd29yZCI6InBhc3N3b3JkQFNTTzEyMyIsIkZpcnN0TmFtZSI6IkJoYWd5YSIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IiIsInVzZXJUeXBlIjoiSW5kdXN0cnkiLCJpc1Byb2ZpbGVDcmVhdGVkIjpmYWxzZSwiSW5kdXN0cnlOYW1lIjoidHJhbnNsYWIuaW8iLCJQcm9maWxlSW1hZ2UiOiJodHRwczovL3VwbG9hZGVyLnNraWxsYWJsZXJzLmNvbS9VcGxvYWRzL0luZHVzdHJ5L0lORFUyNUEwMDA4Ni9Qcm9maWxlL0Z1bGwtbG9nby1pbi1yZWRfMTc1NTc1ODU0NTA0My5qcGciLCJ1c2VyTW9iaWxlIjoiT0RjMk1qQTBNekEyTXc9PSIsImV4cCI6MTcyNTQ3ODYwMCwiaWF0IjoxNzU3NDg0NzUwfQ.wXs1Mw3lCk8QPXv42C9He-WmNS1x_aDKEWo6lXW-wh0";
  const [decoded, setDecoded] = useState<any | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded1: any = jwtDecode(token);
        setDecoded(decoded1);
      } catch (err) {
        // showSnackbar("Invalid token format", "error");
        // history.replace("/login");
      }
    }
  }, [token]);

  // console.log(decoded);

  const {
    userName,
    password,
    userEmail,
    userType,
    FirstName,
    MiddleName,
    LastName,
    isProfileCreated,
    isNewUser,
    brJobId,
    userMobile,
    IndustryName,
    ProfileImage
  } = decoded || {};

  const { industryName, setIndustryName, setSpaceIndustryName, setIndustryLogo } = useIndustry();

  // useEffect(() => {
  //   async function fetchCountryCode() {
  //     // const code = await getCountryCode();
  //     // setCountryCode(code);
  //   }

  //   fetchCountryCode();
  // }, []);

  useEffect(() => {
    async function fetchInfo() {
      const info = await Device.getInfo();
      const ip = await getDeviceIp();
      setIp(ip);
      setInfo(info);
    }

    fetchInfo();
  }, []);

  useEffect(() => {
    // if (!info || !countryCode) return;

    if (!token) {
      // showSnackbar("Token missing in SSO request", "error");
      // console.log("Token missing in SSO request");
      return;
    }

    try {
      if (!userName || !userEmail) {
        // showSnackbar("Invalid SSO payload", "error");
        // console.log("Invalid SSO payload");

        return;
      }

      const payload = {
        userName,
        userEmail,
        userPhoneNumber: userMobile,
        password,
        userStatus: "ACTIVE",
        contactSource: "SIGNUP",
        // userDailyLifeCode: `DL-IND-${getRandomNumber()}`,
        userDailyLifeCode: "DL-IND-123456789123",
      };

      const loginPayload = {
        userName,
        password,
        userLoginDeviceName: info.model,
        loginMethod:
          info.platform === "ios" || info.platform === "android"
            ? "MOBILE"
            : "WEB",
        userLoginDeviceIP: ip,
      };

      // console.log(loginPayload);

      registerMobileProfile(payload)
        .then((res: any) => {
          proceedToLogin(loginPayload);
          // showSnackbar("Signup Successful", "success");
        })
        .catch((err) => {
          proceedToLogin(loginPayload);
          // showSnackbar("Signup via SSO failed", "error");
        });
    } catch (e) {
      console.error("SSO Decode failed", e);
      // showSnackbar("Invalid token format", "error");
    }
  }, [info, location, decoded]);

  const moduleSetter = async (payload: any) => {
    await syncByTwoUniqueKeyData(
      "userModuleRole",
      payload,
      "userId",
      "moduleRoleId"
    );
  };

  const proceedToLogin = async (payload: any) => {
    try {
      const result = await login(payload);
      // showSnackbar("Login Successful", "success");

      // console.log(result);
      if (result?.data?.data?.userLoginSessionToken) {
        setCurrentAccessToken(result.data.data.userLoginSessionToken);

        const userId = result.data.data.userId;
        const moduleRoleId = userType === "Individual" ? 40 : 39;

        const personalPayload = {
          userId: userId,
          firstName: FirstName,
          middleName: MiddleName,
          lastName: LastName,
          userImage:ProfileImage
        };

        // console.log(personalPayload);

        try {
          await syncDataInTable("userPersonalInfo", personalPayload, "userId");

          await syncDataInTable(
            "userContact",
            {
              userId: userId,
              userPhoneNumber: userMobile,
              userEmail
            },
            "userId"
          );
        } catch (error) {
          console.error(error || "Error updating profile", "error");
        }

        const payload = {
          moduleRoleId,
          userId,
          isDefault: true,
          displaySequence: moduleRoleId,
          userModuleRoleStatus: "ACTIVE",
        };

        await moduleSetter(payload);

        const moduleRoleRes = await searchDataFromTable("moduleRole", {
          moduleRoleId: moduleRoleId,
        });

        const dlModuleRes = await searchDataFromTable("DlModule", {
          moduleId: moduleRoleRes?.data?.data?.moduleId,
        });

        const defaultRole = moduleRoleRes?.data?.data;
        const defaultName = dlModuleRes?.data?.data;

        const roleValue = [
          defaultRole.moduleRoleName,
          defaultRole.moduleId,
          defaultName.moduleName,
          defaultName.moduleCode,
        ].join("_");

        localStorage.setItem("userRole", roleValue);
        localStorage.removeItem("spaceIndustryName");

        if (IndustryName) {
          setIndustryName(IndustryName);
          setIndustryLogo(ProfileImage);
        }

        if (brJobId && userType === "Individual") {
          window.location.href = `/beyond-resume-jobdetails/${brJobId}?source=from-externalLink`;
        } else {
          window.location.href = `/${defaultRole.moduleLandingPage}`;
        }
      } else {
        SSOlogout();
        // showSnackbar("Login failed", "error");
      }
    } catch (err) {
      // showSnackbar("SSO login error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      // sx={{ background: color.background2 }}
    >
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="newtons-cradle">
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
        </div>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {loading
            ? "Hang on till we finish setting up your beyond resume account"
            : "Redirecting"}
        </Typography>
      </Box>

      {/* Snackbar Component */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SSORedirectHandler;
