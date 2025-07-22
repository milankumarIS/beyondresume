import { Device } from "@capacitor/device";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import FormTextField from "../../components/form/FormTextField";
import { RegisterInput, registerSchema } from "../../components/form/schema";
import {
  calculateAge,
  getRandomNumber,
} from "../../components/util/CommonFunctions";
import {
  registerMobileProfile,
  registerProfile,
} from "../../services/services";
import SignupUserName from "../form/SignupUserName";
import { useSnackbar } from "../shared/SnackbarProvider";
import RequiredStar from "../util/RequiredStar";
import "./Signup.css";

const Signup: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const captchaRef: any = useRef(null);
  const [dob, setDob] = useState(new Date("2000-01-01"));
  const openSnackBar = useSnackbar();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
    getValues,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: true,
    },
  });

  const [mQuery, setMQuery] = useState<any>({
    matches: false,
  });

  useEffect(() => {
    Device.getInfo().then((info: any) => {
      setMQuery({ matches: info.platform !== "web" ? false : true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue("age", calculateAge(dob));
  }, [dob]);

  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountryCode() {
      // const code = await getCountryCode();
      // setCountryCode(code);
    }

    fetchCountryCode();
  }, []);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values: any) => {
    console.log(values);
    delete values.passwordConfirm;
    delete values.terms;
    values.dob = dob;
    values.userStatus = "ACTIVE";
    values.contactSource = "SIGNUP";
    values.userDailyLifeCode = `DL`;
    if (queryParams.get("myRefferalCode")) {
      values.supervisorCode = queryParams.get("myRefferalCode");
    }
    if (parseInt(values.age) >= 18) {
      delete values.age;
      if (mQuery && !mQuery.matches) {
        registerMobileProfile(values)
          .then((result: any) => {
            afterRegistration(result);
          })
          .catch((error: { response: { data: { msg: string } } }) => {
            openSnackBar(error?.response?.data?.msg);
          });
      } else {
        values.token = captchaRef?.current?.getValue() || "h";
        if (values.token) {
          registerProfile(values)
            .then((result: any) => {
              afterRegistration(result);
            })
            .catch((error: { response: { data: { msg: string } } }) => {
              openSnackBar(error?.response?.data?.msg);
            });
        } else {
          openSnackBar("please verify you are not a robot");
        }
      }
    } else {
      openSnackBar("You are not eligiable to sign up minimum age is 18");
    }
  };

  const afterRegistration = (result: any) => {
    openSnackBar(result?.data?.msg);
    // history.push("/login");
  };

  return (
    <Box className="ion-padding1" mt={2}>
      <form
        // style={{ marginTop: "1rem" }}
        noValidate
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Box className="signup_welcome">
          <Typography className="signup_welcome">Sign Up </Typography>
        </Box>

        <Box sx={{ marginTop: "15px" }} className="signup_text">
          <Typography className="signup_text">
            Please signup with your details to continue using our service.
          </Typography>
        </Box>

        <Box sx={{ marginTop: "10px" }} className="signup_div">
          <SignupUserName
            label={
              <>
                User Name <RequiredStar />
              </>
            }
            valueProp={"userName"}
            errors={errors}
            register={register}
            watch={watch}
            getValues={getValues}
          />

          <FormTextField
            label={
              <>
                Email <RequiredStar />
              </>
            }
            valueProp={"userEmail"}
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
            watch={watch}
            getValues={getValues}
          />
          <FormTextField
            fieldType={"password"}
            label={
              <>
                Confirm Password <RequiredStar />
              </>
            }
            valueProp={"passwordConfirm"}
            errors={errors}
            register={register}
            watch={watch}
            getValues={getValues}
          />
          {/* <BasicDatePicker
            label={"DOB"}
            setDate={setDob}
            value={dob}
          ></BasicDatePicker> */}
        </Box>

        <Box id="signup_terms" className="signup_terms">

        </Box>

        {mQuery && mQuery.matches ? (
          <Box id="signup_terms" className="signup_terms">
            <ReCAPTCHA
              style={{ marginBottom: "1rem" }}
              sitekey={"6LcnJGYpAAAAANl7EPQZw8fDIMvdMgYO_Nn2ek2k"}
              ref={captchaRef}
            />
          </Box>
        ) : (
          <></>
        )}

        <Box className="signup_btns">
          <Button className="signup_btn" type="submit">
            Sign up
          </Button>
        </Box>
      </form>

      <Box className="signup_text2">
        <Typography className="signup_text2">
          Already have an account?
        </Typography>
        <Typography
          className="signup_login"
          onClick={() => history.push("/login")}
          // onClick={(logDeviceInfo)}
        >
          Log in
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
