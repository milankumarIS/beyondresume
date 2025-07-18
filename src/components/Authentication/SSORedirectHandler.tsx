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
import color from "../../theme/color";
import {
  getCountryCode,
  getDeviceIp,
  getRandomNumber,
} from "../util/CommonFunctions";

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
  } = decoded || {};

  useEffect(() => {
    async function fetchCountryCode() {
      const code = await getCountryCode();
      setCountryCode(code);
    }

    fetchCountryCode();
  }, []);

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
    if (!info || !countryCode) return;

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
        contactSource: "SSO",
        userDailyLifeCode: `DL-${countryCode}-${getRandomNumber()}`,
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
  }, [info, countryCode, location, decoded]);

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

      console.log(result);
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

        console.log(personalPayload);

        syncDataInTable("userPersonalInfo", personalPayload, "userId").catch(
          (error) => {
            showSnackbar(
              error?.response?.data?.msg || "Error updating profile",
              "error"
            );
          }
        );

        const payload = {
          moduleRoleId,
          userId,
          isDefault: true,
          displaySequence: moduleRoleId,
          userModuleRoleStatus: "ACTIVE",
        };

        moduleSetter(payload);

        const moduleRole = await searchDataFromTable("moduleRole", {
          moduleRoleId: moduleRoleId,
        });
        const dlModule = await searchDataFromTable("DlModule", {
          moduleId: moduleRole?.data?.data?.moduleId,
        });

        const defaultRole = moduleRole?.data?.data;
        const defaultName = dlModule?.data?.data;

        const roleValue = [
          defaultRole.moduleRoleName,
          defaultRole.moduleId,
          defaultName.moduleName,
          defaultName.moduleCode,
        ].join("_");

        localStorage.setItem("userRole", roleValue);

        setTimeout(() => {
          window.location.href = `/${defaultRole.moduleLandingPage}`;
        }, 100);
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
      sx={{ background: color.background2 }}
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
