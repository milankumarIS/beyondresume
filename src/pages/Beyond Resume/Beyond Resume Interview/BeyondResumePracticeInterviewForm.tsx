import { Box, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useSnackbar } from "../../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BlobAnimation,
} from "../../../components/util/CommonStyle";
import { getUserId } from "../../../services/axiosClient";
import {
  getProfile,
  insertDataInTable,
  searchListDataFromTable,
} from "../../../services/services";
import BeyondResumeLoader from "../Beyond Resume Components/BeyondResumeLoader";

const Container = styled(Box)({
  //   background: 'linear-gradient(180deg, #50bcf6, #5a81fd)',
  background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
  padding: "2rem",
  color: "black",
  position: "relative",
  overflow: "hidden",
});

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "600px",
  margin: "auto",
  backgroundColor: "white",
  borderRadius: "1rem",
  padding: "2rem",
});

const BeyondResumePracticeInterviewForm = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [userExperience, setUserExperience] = useState("");

  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const { brMockInterviewId } = useParams<any>();
  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  // console.log(jobsData)

  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    getProfile().then((result: any) => {
      const data = result?.data?.data;
      setCurrentUser(data);
      if (data?.userPersonalInfo || data?.userContact) {
        const fullName = [
          data?.userPersonalInfo?.firstName,
          data?.userPersonalInfo?.middleName,
          data?.userPersonalInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        setName(fullName);
        setEmail(data?.userContact?.userEmail || "");
        setPhone(data?.userContact?.userPhoneNumber || "");

        setAbout(data?.userPersonalInfo?.about || "");
      }
    });
  }, []);

  useEffect(() => {
    searchListDataFromTable("brMockInterviews", {
      brMockInterviewId: brMockInterviewId,
    }).then((result: any) => {
      setJobsData(result?.data?.data[0]);
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      duration: jobsData?.interviewDuration,
      jobInterviewQuestions: jobsData?.jobInterviewQuestions,
      createdBy: getUserId(),
      brInterviewStatus: "INPROGRESS",
      name,
      about,
      // userExperience,
    };

    // console.log(payload)

    insertDataInTable("brInterviews", payload)
      .then(async (result: any) => {
        const interviewId = result?.data?.data?.brInterviewId;

        const sessionType = "practiceSession";
        history.push(
          `/beyond-resume-readyToJoin/${interviewId}?sessionType=${sessionType}`
        );
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const isSubmitDisabled = !(
    name.trim() &&
    about.trim() &&
    phone.trim() &&
    email.trim()
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Form
        sx={{ background: "inherit", position: "relative" }}
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            width: "fit-content",
            m: "auto",
            fontFamily: "Custom-Bold",
            borderRadius: "44px",
            mb:-2,
          }}
        >
          Practice Interview Form
        </Typography>
        <Typography
          align="center"
          sx={{
            fontFamily: "montserrat-regular",
          }}
        >
          Please fill out the following details
        </Typography>
        <Box px={4} >
          <TextField
            fullWidth
            required
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ ...commonFormTextFieldSx, mb: 2 }}
          />
          <TextField
            fullWidth
            required
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ ...commonFormTextFieldSx, mb: 2 }}
          />
          <TextField
            fullWidth
            required
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ ...commonFormTextFieldSx, mb: 2 }}
          />

          <TextField
            fullWidth
            required
            label="About"
            variant="outlined"
            multiline
            rows={3}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            sx={{
              ...commonFormTextFieldSx,
              mb: 2,
              borderRadius: "18px",
              "& .MuiInputBase-input": {
                resize: "vertical",
              },
              "& textarea": {
                resize: "vertical",
              },
            }}
          />
          {/* <TextField
            fullWidth
            label="Experience Summary"
            variant="outlined"
            value={userExperience}
            onChange={(e) => setUserExperience(e.target.value)}
            sx={{ ...commonFormTextFieldSx, mb: 2 }}
          /> */}
        </Box>

        <BeyondResumeButton
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isSubmitDisabled}
          sx={{ mx:4,mt:0, py: 1.5, fontSize: "1rem" }}
        >
          Submit
        </BeyondResumeButton>
      </Form>
      <BeyondResumeLoader open={open} progress={progress} />
    </Box>
  );
};

export default BeyondResumePracticeInterviewForm;
