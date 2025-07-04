import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Box, Button, Card, CardContent, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { forgotPassword } from "../../services/services";
import color from "../../theme/color";
import FormTextField from "../form/FormTextField";
import { ForgotPasswordInput, forgotPasswordSchema } from "../form/schema";
import { useSnackbar } from "../shared/SnackbarProvider";
import { Heading } from "../util/Heading";
import RequiredStar from "../util/RequiredStar";

const ForgotPassword: React.FC = () => {
  const openSnackBar = useSnackbar();

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmitHandler: SubmitHandler<ForgotPasswordInput> = (values) => {
    forgotPassword(values)
      .then((result: any) => {
        openSnackBar(result?.data?.msg);
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  return (
    <Box className="ion-padding">
      <Card
        sx={{
          display: "flex",
          height: "70vh",
          boxShadow: "none",
          justifyContent: "center",
          width: "100%",
          borderRadius: "20px",
          alignItems: "center",
        }}
      >
        <CardContent sx={{ marginBottom: "20px" }}>
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
            <Heading text={"Forgot Password"}></Heading>
          </Box>
          <form
            style={{ marginTop: "1rem" }}
            noValidate
            onSubmit={handleSubmit(onSubmitHandler)}
          >
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
              <Grid size={12} marginBottom={"1rem"}>
                <Link href="/login" variant="body2">
                  {"Remember password? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
