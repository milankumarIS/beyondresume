import {
  Autocomplete,
  Box,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { experienceLevels, jobFunctions, pricingPlans } from "../../../components/form/data";
import { useSnackbar } from "../../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BlobAnimation,
  CustomToggleButton,
  CustomToggleButtonGroup,
} from "../../../components/util/CommonStyle";
import { getUserId } from "../../../services/axiosClient";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  searchDataFromTable,
  searchListDataFromTable,
  updateByIdDataInTable,
  UploadFileInTable,
} from "../../../services/services";
import BeyondResumeLoader from "../Beyond Resume Components/BeyondResumeLoader";
import BeyondResumeUpgradeRequiredModal from "../Beyond Resume Components/BeyondResumeUpgradeRequiredModal";


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

const BeyondResumeInterviewForm = () => {
  const [experience, setExperience] = useState("Fresher");
  const [duration, setDuration] = useState(20);
  const [addJobDescription, setAddJobDescription] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [addResume, setAddResume] = useState(true);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userExperience, setUserExperience] = useState("");
  const [previousCompany, setPreviousCompany] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | undefined>(undefined);

  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   const result: any = searchDataFromTable("brInterviews", {
  //     createdBy: getUserId(),
  //     brInterviewStatus: "CONFIRMED",
  //   });

  //   const planExpired = false;

  //   if (planExpired) {
  //     setShowModal(true);
  //   }
  // }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      const userId = getUserId();

      const [payments, interviews] = await Promise.all([
        searchDataFromTable("brPayments", {
          createdBy: userId,
          brPaymentStatus: "ACTIVE",
        }),
        searchListDataFromTable("brInterviews", {
          createdBy: userId,
          brInterviewStatus: "CONFIRMED",
        }),
      ]);

      const subscription = payments?.data?.data;
      const now = new Date();

      // console.log(subscription);
      // console.log(interviews);

      if (!subscription || new Date(subscription.endDate) < now) {
        setShowModal(true);
        return;
      }

      const planDetails = pricingPlans.find((plan) => plan.title === subscription.planName);

      if (!planDetails) {
        setShowModal(true);
        return;
      }

      const mockFeature = planDetails.features.find((f) =>
        f.label.toLowerCase().includes("mock interview")
      );

      // console.log(mockFeature);

      const allowedMockInterviews = mockFeature
        ? parseInt(mockFeature.label.match(/\d+/)?.[0] || "0")
        : 0;

      // console.log(allowedMockInterviews);

      const usedMockInterviews = interviews?.data?.data?.length || 0;

      // console.log(usedMockInterviews);

      if (usedMockInterviews >= allowedMockInterviews) {
        setShowModal(true);
      }
    };

    checkSubscription();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      experience,
      duration,
      jobDescriptions: addJobDescription ? jobDescription : "",
      interviewQuestionAnswer: [],
      createdBy: getUserId(),
      brInterviewStatus: "INPROGRESS",
      name,
      about,
      userExperience,
      previousCompany,
      selectedJob,
    };

    const proceedWithAIRequest = async (
      interviewId: string,
      resumeLink: string | null
    ) => {
      const hasJobDescription = !!jobDescription;
      const hasResume = !!resumeLink;

      let baseCommand = `
        Please analyze the following ${
          hasResume ? "resume" : "user-provided details"
        }${hasJobDescription ? " and the job description" : ""} 
        and generate a holistic evaluation questionnaire for candidates with ${experience} level experience.
  
        1. Define exactly ${
          duration / 10
        } categories that cover a 360-degree evaluation 
        (e.g., Technical Skills, Behavioral Traits, Logical Thinking, Collaboration & Teamwork, Communication Skills).
        Choose meaningful category names${
          hasJobDescription
            ? " based on the job description"
            : " based on the provided details"
        }.
  
        2. For each category:
          - Generate **at least 5 questions** with varying complexity levels (Low, Moderate, High).
          - Include a **"complexity"** field for each question with values: "Low", "Moderate", or "High".
          - Provide **a suggested answer** or key points to look for.
          - Include a **"qualifyingCriteria"** field for each category explaining how to evaluate if the candidate meets expectations in that area.
  
        3. Ensure the response is in **static JSON format**, wrapped in a single <pre> tag as innerHTML. Use this exact naming convention:
  
        \`\`\`json
        {
          "categories": [
            {
              "name": "CategoryName",
              "qualifyingCriteria": "Short evaluation guideline here",
              "questions": [
                {
                  "question": "Your question text here",
                  "complexity": "Low | Moderate | High",
                  "suggestedAnswer": "Expected or acceptable answer points"
                }
              ]
            }
          ]
        }
        \`\`\`
  
        Do not include any explanation or extra formatting. Return only the innerHTML with JSON inside a single <pre>...</pre> tag.
  
        ${
          hasJobDescription
            ? `Here is the job description:\n${jobDescription}`
            : ""
        }
        ${
          hasResume
            ? `Here is the resume link: ${resumeLink}`
            : `Here are some user-provided details:\nName: ${name}\nAbout: ${about}\nExperience: ${userExperience}\nPrevious Company: ${previousCompany}\nSelected Job:${selectedJob}`
        }
      `.replace(/\s+/g, " ");

      setProgress(0);
      setOpen(true);

      let currentProgress = 0;
      const fakeProgressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 10);
        if (currentProgress >= 90) {
          currentProgress = 90;
          clearInterval(fakeProgressInterval);
        }
        setProgress(currentProgress);
      }, 900);

      // console.log(baseCommand)

      try {
        const res = await getUserAnswerFromAi({ question: baseCommand });
        // console.log(res);
        clearInterval(fakeProgressInterval);
        setProgress(100);

        const generatedDescription =
          res.data.data.candidates[0].content.parts[0].text;

        await updateByIdDataInTable(
          "brInterviews",
          interviewId,
          { jobInterviewQuestions: generatedDescription },
          "brInterviewId"
        );

        setTimeout(() => {
          setOpen(false);
          const sessionType = "practiceSession";
          history.push(
            `/beyond-resume-readyToJoin/${interviewId}?sessionType=${sessionType}`
          );
        }, 300);
      } catch (error) {
        clearInterval(fakeProgressInterval);
        console.error("Error generating interview questions:", error);
        openSnackBar("An error occurred while generating interview questions.");
        setOpen(false);
      }
    };

    insertDataInTable("brInterviews", payload)
      .then(async (result: any) => {
        const interviewId = result?.data?.data?.brInterviewId;

        if (resume) {
          const formData = new FormData();
          formData.append("file", resume);

          UploadFileInTable(
            "brInterviews",
            {
              primaryKey: "brInterviewId",
              primaryKeyValue: interviewId,
              fieldToUpload: "resumeFile",
              folderName: `brlnterviews/resumeFile`,
            },
            formData
          )
            .then(async () => {
              const result1: any = await searchDataFromTable("brInterviews", {
                brInterviewId: interviewId,
              });

              const resumeLink = result1?.data?.data?.resumeFile;
              proceedWithAIRequest(interviewId, resumeLink);
            })
            .catch((error) => {
              openSnackBar(
                "There is an error occurred during the file upload. It may be due to the file size. File size should be less than 50Kb"
              );
            });
        } else {
          proceedWithAIRequest(interviewId, null);
        }
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const isResumeDetailsValid =
    name.trim() &&
    about.trim() &&
    phone.trim() &&
    email.trim() &&
    userExperience.trim() &&
    previousCompany.trim() &&
    selectedJob?.trim();
  const isSubmitDisabled = addResume
    ? !resume || (addJobDescription && !jobDescription.trim())
    : !isResumeDetailsValid || (addJobDescription && !jobDescription.trim());

  return (
    <Container sx={{ minHeight: "100vh" }}>
      <BlobAnimation />

      <Form
        sx={{ background: "white", position: "relative" }}
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            width: "fit-content",
            m: "auto",
            fontFamily: "Custom-Bold",
            background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
            color: "white",
            p: 2,
            px: 4,
            borderRadius: "44px",
            boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
          }}
        >
          Interview Settings
        </Typography>
        {/* <Typography variant="body1" align="center" gutterBottom>
        Select from these options and get your pre-made Job description and practice your quick interview. Or Just click "Custom Interview"
        </Typography> */}

        <Box>
          <Typography gutterBottom align="center">
            What experience level are you interviewing for?
          </Typography>
          <ToggleButtonGroup
            value={experience}
            exclusive
            onChange={(e, newExperience) => {
              if (newExperience !== null) setExperience(newExperience);
            }}
            fullWidth
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mt: 2,
            }}
          >
            {experienceLevels.map((level) => (
              <ToggleButton
                key={level}
                value={level}
                style={{
                  backgroundColor:
                    experience === level ? "#50bcf6" : "#ffffff22",
                  color: experience === level ? "white" : "grey",
                  borderRadius: "999px",
                  border: "1px solid #ccc",
                }}
                sx={{
                  borderRadius: "999px",
                  maxWidth: "fit-content",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  transition: "all 0.3s",
                  "&.Mui-selected": {
                    backgroundColor: "#50bcf6",
                    color: "white",
                    boxShadow: "-2px -2px 10px rgba(0, 0, 0, 0.1) inset",
                    borderRadius: "999px",
                  },
                }}
              >
                {level}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box px={4}>
          <Typography gutterBottom align="center">
            What duration would you prefer for the interview?
          </Typography>
          <Slider
            value={duration}
            onChange={(e, value) => setDuration(value as number)}
            min={20}
            max={60}
            step={5}
            marks={marks.map((mark) => ({
              ...mark,
              label: (
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "12px",
                    backgroundColor:
                      duration === mark.value ? "#50bcf6" : "#ffffff22",
                    color: duration === mark.value ? "white" : "grey",
                  }}
                >
                  {mark.label}
                </span>
              ),
            }))}
            valueLabelDisplay="auto"
            sx={{
              color: "#50bcf6",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography align="center" gutterBottom>
            Resume Preference
          </Typography>
          <CustomToggleButtonGroup
            value={addResume ? "yes" : "no"}
            exclusive
            onChange={(e, val) => val !== null && setAddResume(val === "yes")}
          >
            <CustomToggleButton value="yes">Add Resume File</CustomToggleButton>
            <CustomToggleButton value="no">
              Continue without Resume
            </CustomToggleButton>
          </CustomToggleButtonGroup>
        </Box>

        {addResume ? (
          <Box>
            <Typography gutterBottom mb={1} align="center">
              Upload Resume
            </Typography>
            <Box
              sx={{
                background: "#e7e8ed",
                p: 4,
                borderRadius: "12px",
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                margin: "auto",
              }}
              component="label"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setResume(file);
                  }
                }}
              />
              {!resume && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "grey",
                    fontSize: "14px",
                    px: 2,
                  }}
                >
                  Drag and drop file or click To Upload PDF or DOCX • Max file
                  size 2MB
                </Typography>
              )}
              {resume && (
                <Typography
                  sx={{
                    color: "black",
                    p: 1,
                    px: 4,
                    borderRadius: "44px",
                  }}
                >
                  {resume.name}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{
                  background: "linear-gradient(180deg, #50bcf6, #50bcf6)",
                  color: "white",
                  p: 1,
                  px: 4,
                  borderRadius: "44px",
                }}
              >
                Upload
              </Typography>
            </Box>
          </Box>
        ) : (
          // 👇 Show manual fields if not uploading resume
          <Box px={4} py={2}>
            <Typography align="center" sx={{ mb: 2 }}>
              Please fill out the following details
            </Typography>
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

            <Autocomplete
              options={jobFunctions}
              value={selectedJob}
              onChange={(event, newValue) => setSelectedJob(newValue)}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Job Function"
                  variant="outlined"
                  sx={{ ...commonFormTextFieldSx, mb: 2 }}
                />
              )}
              fullWidth
              disableClearable
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
            <TextField
              fullWidth
              required
              label="Experience Summary"
              variant="outlined"
              value={userExperience}
              onChange={(e) => setUserExperience(e.target.value)}
              sx={{ ...commonFormTextFieldSx, mb: 2 }}
            />
            <TextField
              fullWidth
              required
              label="Previous Employer / Company Name"
              variant="outlined"
              value={previousCompany}
              onChange={(e) => setPreviousCompany(e.target.value)}
              sx={{ ...commonFormTextFieldSx }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography align="center" gutterBottom>
            Job Description Preference
          </Typography>
          <CustomToggleButtonGroup
            value={addJobDescription ? "yes" : "no"}
            exclusive
            onChange={(e, val) =>
              val !== null && setAddJobDescription(val === "yes")
            }
          >
            <CustomToggleButton value="yes">
              Add Job Description
            </CustomToggleButton>
            <CustomToggleButton value="no">
              Continue without JD
            </CustomToggleButton>
          </CustomToggleButtonGroup>
        </Box>

        {addJobDescription && (
          <>
            <TextField
              multiline
              fullWidth
              minRows={4}
              label="Job Description"
              variant="outlined"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              sx={{ ...commonFormTextFieldSx, borderRadius: "12px" }}
            />
          </>
        )}

        <BeyondResumeButton
          type="submit"
          variant="contained"
          color="secondary"
          disabled={isSubmitDisabled}
          sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
        >
          Submit
        </BeyondResumeButton>
      </Form>
      <BeyondResumeLoader open={open} progress={progress} />
      <BeyondResumeUpgradeRequiredModal open={showModal} />
    </Container>
  );
};

export default BeyondResumeInterviewForm;

const marks = [
  { value: 20, label: "20 Mins" },
  //   { value: 30, label: "30 Mins" },
  { value: 40, label: "40 Mins" },
  { value: 60, label: "60 Mins" },
];
