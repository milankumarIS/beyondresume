import { Device } from "@capacitor/device";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import FormTextField from "../../components/form/FormTextField";
import FormUserName from "../../components/form/FormUserName";
import { loginInput, loginSchema } from "../../components/form/schema";
import { setCurrentAccessToken, setUserRole } from "../../services/axiosClient";
import {
  invokePreviousDevice,
  invokePreviousLogin,
  login,
} from "../../services/services";
import { useSnackbar } from "../shared/SnackbarProvider";
import LoginPopupModal from "../util/LoginPopupModal";
import RequiredStar from "../util/RequiredStar";
import "./Signup.css";

const Login: React.FC = () => {
  const history = useHistory();
  const [dataForModal, setDataForModal] = useState<any>({});
  const [loginPayload, setLoginPayLoad] = useState<any>({});
  const openSnackBar = useSnackbar();

  const [openWrongPasswordModal, setOpenWrongPasswordModal] = useState(false);
  const [openAlreadyLoggedinModal, setOpenAlreadyLoggedinModal] =
    useState(false);
  const [openDevieInUseModal, setOpenDevieInUseModal] = useState(false);
  const [openAccountRestrictedModal, setOpenAccountRestrictedModal] =
    useState(false);

  const {
    watch,
    getValues,
    register,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<loginInput>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmitHandler: SubmitHandler<loginInput> = async (values: any) => {
    const info = await Device.getInfo();
    values.userLoginDeviceName = info.model || "Unknown Device";
    values.loginMethod =
      info.platform === "ios" || info.platform === "android" ? "MOBILE" : "WEB";
    values.userLoginDeviceIP = 'ip';
    setLoginPayLoad(values);
    login(values)
      .then((result: any) => {
        console.log(result)
        afterLogin(result);
      })
      .catch((error) => {
        // setOpenWrongPasswordModal(true);
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const invokeOnExistUserLogin = () => {
    invokePreviousLogin(loginPayload)
      .then((result: any) => {
        if (result?.data?.data?.accessToken)
          setCurrentAccessToken(result?.data?.data?.accessToken);
        openSnackBar(result?.data?.msg);
        setOpenAlreadyLoggedinModal(false);
        console.log(result)

        afterLogin(result);
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const invokeOnExistDevice = () => {
    let payload = {
      oldDevice: dataForModal,
      newDevice: {
        userLoginDeviceName: loginPayload?.userLoginDeviceName,
        userLoginDeviceType: loginPayload?.loginMethod,
        userLoginDeviceIP: loginPayload?.userLoginDeviceIP,
        userId: dataForModal?.userId,
        userLoginDeviceStatus: "ACTIVE",
      },
    };
    invokePreviousDevice(payload)
      .then((result: any) => {
        if (result?.data?.data?.accessToken)
          setCurrentAccessToken(result?.data?.data?.accessToken);
        openSnackBar(result?.data?.msg);
        setOpenDevieInUseModal(false);
        afterLogin(result);
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const afterLogin = (result: any) => {
    if (result?.data?.status === 701) {
      setOpenAlreadyLoggedinModal(true);
      setDataForModal(result?.data?.data);
    } else if (result?.data?.status === 702) {
      setOpenDevieInUseModal(true);
      setDataForModal(result?.data?.data);
    } else if (result?.data?.status === 703) {
      setOpenWrongPasswordModal(true);
      setDataForModal(result?.data?.data);
    } else if (result?.data?.status === 704) {
      setOpenAccountRestrictedModal(true);
      setDataForModal(result?.data?.data);
    } else {
      if (result?.data?.data?.accessToken)
        setCurrentAccessToken(result?.data?.data?.accessToken);
      openSnackBar(result?.data?.msg);
      if (result?.data?.data?.UserModuleRoles.length > 0) {
        let filteredUserModuleRoles =
          result?.data?.data?.UserModuleRoles?.filter(
            (o: any) => o.isDefault === true
          );
        if (filteredUserModuleRoles.length > 0) {
          setUserRole(
            filteredUserModuleRoles[0]?.moduleRole?.moduleRoleName +
              "_" +
              filteredUserModuleRoles[0]?.moduleRole?.moduleId +
              "_" +
              filteredUserModuleRoles[0]?.moduleRole?.DlModule?.moduleName +
              "_" +
              filteredUserModuleRoles[0]?.moduleRole?.DlModule?.moduleCode
          );
          location.href =
            "/" + filteredUserModuleRoles[0]?.moduleRole?.moduleLandingPage;
        } else {
          location.href = "/home";
        }
      } else {
        location.href = "/category-select";
      }
      // location.href = "/home";
    }
  };

  return (
    <div className="ion-padding1" style={{paddingTop:'16px'}}>
      <form
        // style={{ marginTop: "1rem" }}
        noValidate
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Box className="signup_welcome" >
          <Typography className="signup_welcome">Signin </Typography>
        </Box>

        <Box sx={{ marginTop: "15px" }} className="signup_text">
          <Typography className="signup_text">
            Please Login with your details to continue using our service.
          </Typography>
        </Box>

        <Box sx={{ marginTop: "20px" }} className="signup_div">
          <FormUserName
            label={
              <>
                User Name <RequiredStar />
              </>
            }
            valueProp={"userName"}
            errors={errors}
            register={register}
          />

          <FormTextField
            fieldType={"password"}
            label={
              <>
                Password <RequiredStar />
              </>
            }
            valueProp={"password"}
            errors={errors}
            register={register}
            setError={setError}
            clearErrors={clearErrors}
            watch={watch}
            getValues={getValues}
            required
          />
          <Box
            className="signup_text2"
            sx={{ justifyContent: "flex-end", paddingRight: "20px" }}
          >
            <Typography
              className="signup_login"
              onClick={() => history.push("/forgot-password")}
              // onClick={(logDeviceInfo)}
            >
              Forgot password?
            </Typography>
          </Box>
        </Box>

        <Box className="signup_btns">
          <Button className="signup_btn" type="submit">
            Login
          </Button>
        </Box>

        <Box className="signup_text2">
          <Typography className="signup_text2">
            Don't have an account?
          </Typography>
          <Typography
            className="signup_login"
            onClick={() => history.push("/signup")}
            // onClick={(logDeviceInfo)}
          >
            Sign up
          </Typography>
        </Box>
      </form>

      <LoginPopupModal
        open={openDevieInUseModal}
        onClose={() => setOpenDevieInUseModal(false)}
        action1={() => setOpenDevieInUseModal(false)}
        action2={() => invokeOnExistDevice()}
        message={
          "The account is already in use with below device would you like to switch here!"
        }
        deviceType={dataForModal?.userLoginDeviceType}
        deviceIP={dataForModal?.userLoginDeviceIP}
        deviceName={dataForModal?.userLoginDeviceName}
        actionButtonName1={"Don't Switch"}
        actionButtonName2={"Switch Here"}
      />

      <LoginPopupModal
        open={openAlreadyLoggedinModal}
        onClose={() => setOpenAlreadyLoggedinModal(false)}
        action1={() => setOpenAlreadyLoggedinModal(false)}
        action2={() => invokeOnExistUserLogin()}
        message={
          "You've already logged into another account, Are you sure you want to switch to this one !"
        }
        actionButtonName1={"Don't Switch"}
        actionButtonName2={"Proceed"}
      />

      <LoginPopupModal
        open={openWrongPasswordModal}
        onClose={() => setOpenWrongPasswordModal(false)}
        action1={() => history.push("/signup")}
        action2={() => setOpenWrongPasswordModal(false)}
        message={"You've entered wrong password"}
        attempts={dataForModal}
        actionButtonName1={"Signup"}
        actionButtonName2={"Okay"}
        color={"red"}
      />

      <LoginPopupModal
        open={openAccountRestrictedModal}
        onClose={() => setOpenAccountRestrictedModal(false)}
        action1={() => history.push("/signup")}
        action2={() => setOpenAccountRestrictedModal(false)}
        message={
          "Your account has been restricted due to too many wrong attempts"
        }
        timeToActive={dataForModal}
        actionButtonName1={"Contact US"}
        actionButtonName2={"Okay"}
        color={"red"}
      />
    </div>
  );
};

export default Login;
