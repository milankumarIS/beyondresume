import { Avatar, Box, Button, Card, Grid, Link } from "@mui/material";
import React from "react";

import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { resetPassword } from "../../services/services";
import color from "../../theme/color";
import FormTextField from "../form/FormTextField";
import { ResetPasswordInput, ResetPasswordSchema } from "../form/schema";
import { useSnackbar } from "../shared/SnackbarProvider";
import { Heading } from "../util/Heading";
import RequiredStar from "../util/RequiredStar";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const openSnackBar = useSnackbar();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmitHandler: SubmitHandler<ResetPasswordInput> = (values) => {
    if (queryParams.get("email") !== "") {
      let payload = {
        userEmail: queryParams.get("email"),
        token: queryParams.get("token"),
        password: values.password,
      };
      resetPassword(payload)
        .then((result: any) => {
          openSnackBar(result?.data?.msg);
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    } else {
      openSnackBar("You are not allowed to view this page");
      history.push("/login");
    }
  };

  return (
    <Box className="ion-padding">
      <Card
        sx={{
          display: "flex",
          height: "70vh",
          marginBlock: "10vh",
          justifyContent: "center",
          width: "100%",
          boxShadow: "none",
          borderRadius: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ backgroundColor: color.primery }}>
              <FontAwesomeIcon icon={faLock}></FontAwesomeIcon>
            </Avatar>
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Heading text={"Reset Password"}></Heading>
          </Box>
          <form
            style={{ marginTop: "1rem" }}
            noValidate
            onSubmit={handleSubmit(onSubmitHandler)}
          >
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={color.submit}
            >
              Submit
            </Button>
            <Grid container sx={{ marginTop: "1rem" }}>
              <Grid item xs={12} marginBottom={"1rem"}>
                <Link href="/login" variant="body2">
                  {"Remember password? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Card>
    </Box>
  );
};

export default ResetPassword;
