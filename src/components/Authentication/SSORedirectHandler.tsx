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
  syncDataInTable,
} from "../../services/services";
import { getDeviceIp } from "../util/CommonFunctions";

const SSORedirectHandler = () => {
  const location = useLocation();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any | null>(null);
  const [ip, setIp] = useState<any | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const queryParams = new URLSearchParams(location.search);
  // const token = queryParams.get("token") || "";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkNBTjE4QTAwMTE1IiwidXNlckVtYWlsIjoiaml0aGluLmtrQGhvdG1haWwuY29tIiwicGFzc3dvcmQiOiJUaGVlcmFtQDM2MCIsIkZpcnN0TmFtZSI6IkppdGhpbiIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6IktLIiwidXNlclR5cGUiOiJJbmRpdmlkdWFsIiwiaXNQcm9maWxlQ3JlYXRlZCI6ZmFsc2UsImV4cCI6MTcyNTQ3ODYwMCwiaWF0IjoxNzUxODY3Mjc1fQ.FcqiKMCdyEyZUJDur4haE9ADyWljR7jeBDvx4AuF9f8";
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IklORFUyM0EwMDA3MiIsInVzZXJFbWFpbCI6ImJoYWd5YS5zYXRoeWExOTk1QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoicGFzc3dvcmRAU1NPMTIzIiwiRmlyc3ROYW1lIjoiYmhhZ3lhIiwiTWlkZGxlTmFtZSI6IiIsIkxhc3ROYW1lIjoiIiwidXNlclR5cGUiOiJJbmR1c3RyeSIsImlzUHJvZmlsZUNyZWF0ZWQiOmZhbHNlLCJleHAiOjE3MjU0Nzg2MDAsImlhdCI6MTc1MTg3NDM1MX0.7IgPdxcX6IPUXjTa1oj9t5CtqjiyP--S2wBjbwfGUss'
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInVzZXJOYW1lIjoiQ0FOMjVBMTk1OTAiLCJwYXNzd29yZCI6IiQyYSQxMCRkZzgxTU1FZ0t5clIyYlFQVDA3VXBPbFFwUzQySzFENXQySXFJdW9jTnN1VFdmRDE1ZkdZRyIsInVzZXJUeXBlIjpudWxsLCJ1c2VyVHlwZUltYWdlIjpudWxsLCJ1c2VyRGFpbHlMaWZlQ29kZSI6IkRMLUlORC0xMjM0NTY3ODkxMjMiLCJzdXBlcnZpc29yQ29kZSI6bnVsbCwiZmlyc3RSaWRlRGF0ZSI6bnVsbCwidXNlclN0YXR1cyI6IkFDVElWRSIsImNyZWF0ZWRBdCI6IjIwMjUtMDgtMDRUMDk6NDY6MjYuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDgtMDRUMDk6NDY6MjYuMDAwWiIsInVzZXJDb250YWN0Ijp7InVzZXJDb250YWN0SWQiOjgsInVzZXJFbWFpbCI6ImJoYWd5YS5zYkBza2lsbGFibGVycy5jb20iLCJ1c2VyUGhvbmVOdW1iZXIiOm51bGwsImNvbnRhY3RTb3VyY2UiOiJTSUdOVVAiLCJjb250YWN0VHlwZSI6bnVsbCwidXNlcklkIjo4LCJ1c2VyQ29udGFjdFN0YXR1cyI6IkFDVElWRSIsImNyZWF0ZWRBdCI6IjIwMjUtMDgtMDRUMDk6NDY6MjYuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDgtMDRUMDk6NDY6MjYuMDAwWiJ9LCJ1c2VyUGVyc29uYWxJbmZvIjp7InVzZXJQZXJzb25hbEluZm9JZCI6OCwiZmlyc3ROYW1lIjpudWxsLCJtaWRkbGVOYW1lIjpudWxsLCJsYXN0TmFtZSI6bnVsbCwicmVzdW1lRmlsZSI6bnVsbCwidXNlckltYWdlIjpudWxsLCJuYXRpb25hbElkIjpudWxsLCJnZW5kZXJJZCI6bnVsbCwiZG9iIjpudWxsLCJhZ2UiOm51bGwsInVzZXJJZCI6OCwiYWJvdXQiOm51bGwsInVzZXJQZXJzb25hbEluZm9TdGF0dXMiOiJBQ1RJVkUiLCJjcmVhdGVkQXQiOiIyMDI1LTA4LTA0VDA5OjQ2OjI2LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDI1LTA4LTA0VDA5OjQ2OjI2LjAwMFoiLCJnZW5kZXIiOm51bGx9LCJsb2dpbk1ldGhvZCI6IldFQiIsInZlcnNpb24iOjEsImlhdCI6MTc1NDMwMDc4NywiZXhwIjoxNzU0Mzg3MTg3fQ.1t95AtOtzH1XI_oByYL1-39viCjDo0p2pFUeoL1cOHY'

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkNBTjIwQTAwMjc2IiwidXNlckVtYWlsIjoib2ZmaWNpYWxyb2hpdDI3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiU2tpbGxhYmxlcnNAMTIzJCIsIkZpcnN0TmFtZSI6IlJvaGl0ICIsIk1pZGRsZU5hbWUiOiIiLCJMYXN0TmFtZSI6Ikt1bWFyIiwidXNlclR5cGUiOiJJbmRpdmlkdWFsIiwiaXNQcm9maWxlQ3JlYXRlZCI6dHJ1ZSwiZXhwIjoxNzI1NDc4NjAwLCJpYXQiOjE3NTMxNjAxNTZ9.w6HTfS8hhYBi_kIFqjMkGNdffvGWe8GdVNp-6OSmW4A";
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
  } = decoded || {};

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
      showSnackbar("Login Successful", "success");

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
        };

        // console.log(personalPayload);

        try {
          await syncDataInTable("userPersonalInfo", personalPayload, "userId");
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

        if (brJobId && userType === "Individual") {
          window.location.href = `/beyond-resume-jobdetails/${brJobId}`;
        }

        window.location.href = `/${defaultRole.moduleLandingPage}`;
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
