import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { setCurrentAccessToken } from "../../services/axiosClient";
import {
  login,
  registerMobileProfile,
  searchDataFromTable,
  syncByTwoUniqueKeyData,
  syncDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import { useSnackbar } from "../shared/SnackbarProvider";
import {
  getCountryCode,
  getDeviceIp,
  getRandomNumber,
} from "../util/CommonFunctions";
import { Device } from "@capacitor/device";

const SSORedirectHandler = () => {
  const location = useLocation();
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any | null>(null);
  const [ip, setIp] = useState<any | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  //   const token = queryParams.get("token");
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NTE2MDg1NjcsImV4cCI6MTc4MzE0NDU2NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJOYW1lIjoiSm9oZGUzMiIsInBhc3N3b3JkIjoiUm9zZHF3d2V0QDEyMyIsInVzZXJFbWFpbCI6Impya2pud3dzYm9ja2V0QGV4YW1wbGUuY29tIiwidXNlclR5cGUiOiJJbmRpdmlkdWFsIiwiRmlyc3ROYW1lIjoiSm9obnMiLCJMYXN0TmFtZSI6IkpyIiwiTWlkZGxlTmFtZSI6IkxvcGV6In0.yVRDlznJYBZmgIYcR5ioRxCgGNGZSIsRX65z_Yik4cU";

  const decoded: any = jwtDecode(token);
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
  } = decoded;
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
      openSnackBar("Token missing in SSO request");
      history.replace("/login");
      return;
    }

    try {
      if (!userName || !userEmail) {
        openSnackBar("Invalid SSO payload");
        history.replace("/login");
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

      console.log(payload);
      registerMobileProfile(payload)
        .then((res: any) => {
          console.log(res);
          proceedToLogin(loginPayload);

          moduleSetter({
            moduleRoleId: userType === "Individual" ? 40 : 39,
            userId: res?.data?.data?.userId,
            isDefault: true,
            displaySequence: userType === "Individual" ? 40 : 39,
            userModuleRoleStatus: "ACTIVE",
          });
        })
        .catch((err) => {
          proceedToLogin(loginPayload);
          openSnackBar("Signup via SSO failed");
          history.replace("/signup");
        });
    } catch (e) {
      console.error("SSO Decode failed", e);
      openSnackBar("Invalid token format");
      history.replace("/login");
    }
  }, [info, countryCode, location]);

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

      if (result?.data?.data?.userLoginSessionToken) {
        const userId = result.data.data.userId;
        const moduleRoleId = userType === "Individual" ? 40 : 39;

        payload = {
          userId: userId,
          firstName: FirstName,
          middleName: MiddleName,
          lastName: LastName,
        };
        console.log(payload);

        syncDataInTable("userPersonalInfo", payload, "userId").catch(
          (error) => {
            openSnackBar(error?.response?.data?.msg);
          }
        );

        moduleSetter({
          moduleRoleId,
          userId,
          isDefault: true,
          displaySequence: moduleRoleId,
          userModuleRoleStatus: "ACTIVE",
        });

        setCurrentAccessToken(result.data.data.userLoginSessionToken);

        const userModuleRole = await searchDataFromTable("userModuleRole", {
          userId,
        });
        const moduleRole = await searchDataFromTable("moduleRole", {
          moduleRoleId: userModuleRole?.data?.data?.moduleRoleId,
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
        console.log("Login failed");
        history.replace("/login");
      }
    } catch (err) {
      openSnackBar("SSO login error");
      history.replace("/login");
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
      sx={{
        background: color.background2,
      }}
    >
      {loading ? (
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
            Hang on till we finish setting up your beyond resume account
          </Typography>
        </Box>
      ) : (
        <div>Redirecting...</div>
      )}
    </Box>
  );
};

export default SSORedirectHandler;
