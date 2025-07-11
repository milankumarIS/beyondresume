import {
  Box,
  Button,
  CardMedia,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicDatePicker from "../../components/form/DatePicker";
import FormAutocomplete2 from "../../components/form/FormAutocompleteWithoutFiltering";
import FormSelect from "../../components/form/FormSelect";
import FormTextField from "../../components/form/FormTextField";
import {
  jobFunctions,
  jobMode,
  jobType,
  payroll,
} from "../../components/form/data";
import {
  beyondResumeSchema,
  BeyondResumeSchemaType,
} from "../../components/form/schema";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import { getUserId, getUserRole } from "../../services/axiosClient";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  searchDataFromTable,
  syncDataInTable,
} from "../../services/services";
import BeyondResumeAvatar from "./Beyond Resume Components/BeyondResumeAvatar";
import JobDescriptionResponse from "./JobDescriptionResponse";

const BeyondResumeHome: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const responseRef = useRef<HTMLDivElement | null>(null);
  const [lastDateOfApply, setLastDateOfApply] = useState("");
  // const [lastDateError, setLastDateError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");

  const scriptLines = [
    "Welcome, visionary! I’m your AI Talent Guide from Beyond Resume. Tired of sifting through endless resumes on LinkedIn or Naukri? Let me show you how we revolutionize hiring—saving you time while finding perfect-fit candidates.",
    "Imagine describing a role in plain English—say, ‘Need a data scientist with Python and leadership skills’—and poof! Our AI crafts a full job description and tailored interview questions. Or upload your own. Either way, your job goes live in 30 seconds. No more template headaches!",
    "Here’s the game-changer: Candidates choose how they’re assessed. Traditional hour-long written tests? Or an interactive AI voice interview that feels like a live chat? You get the same rich insights either way. Watch as candidates solve real problems—not just polish resumes.",
    "See every applicant at a glance. Filter by ‘shortlisted,’ ‘rejected,’ or ‘needs review.’ Love a candidate? Shortlist them instantly. Best part? Grab a cumulative report—one PDF with every applicant’s skills, scores, and interview highlights. No more juggling spreadsheets!",
    "Picture this: 70% less screening time, 50% deeper candidate insights, and zero ‘resume fluff.’ Our AI even flags hidden gems you might miss. Ready to hire smarter, not harder? Click ‘Post a Job’ now—or explore your dashboard. Let’s build your dream team together!",
  ];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BeyondResumeSchemaType>({
    resolver: zodResolver(beyondResumeSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      experience: "",
      jobMode: "",
      jobType: "",
      skills: "",
      location: "",
      compensation: "",
      payroll: "",
    },
  });

  const openSnackBar = useSnackbar();
  const [jobid, setJobid] = useState<string | null>(null);

  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  useEffect(() => {
    const getAvatarStatus = async () => {
      try {
        const getStatus = await searchDataFromTable("userAvatar", {
          userId: getUserId(),
        });
        const status = getStatus?.data?.data?.avatarStatus;
        setAvatarStatus(status || "");
        if (status !== "CLOSED" || !status) {
          setOpen(true);
        }
      } catch (err) {
        console.error("Error fetching avatar status:", err);
        setAvatarStatus("");
      }
    };

    const saveBrPayment = async () => {
      const userId = getUserId();

      const existingRecords = await searchDataFromTable("brPayments", {
        createdBy: userId,
      });

      if (existingRecords?.data?.data) {
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const payload = {
        planName: "Free",
        createdBy: userId,
        duration: "1 Month",
        price: 0,
        role: getUserRole(),
        brPaymentStatus: "ACTIVE",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      try {
        await syncDataInTable("brPayments", payload, "createdBy");
        console.log("New record saved.");
      } catch (error) {
        console.error("Error saving record:", error);
      }
    };

    saveBrPayment();
    getAvatarStatus();
  }, []);

  useEffect(() => {
    setValue("jobTitle", selectedJobTitle);
  }, [selectedJobTitle, setValue]);

  const onSubmitHandler: SubmitHandler<BeyondResumeSchemaType> = async (
    data
  ) => {
    // if (!lastDateOfApply) {
    //   setLastDateError("Last Date is required");
    //   return;
    // } else {
    //   setLastDateError(null);
    // }
    const fullCommand = `Generate a professional job description for the role of ${data.jobTitle} at ${data.companyName}. 
    The ideal candidate should have expertise in ${data.skills} with ${data.experience} years of experience. 
    This is a ${data.jobType}. 
    The job is based in ${data.location}, with a ${data.jobMode} work arrangement.
    
    Please format the response using plain innerHTML and include the following sections:
    - About ${data.companyName}
    - Job Summary
    - Responsibilities
    - Qualifications
    - Job Type
    - Location
    - Work Mode`;

    try {
      setLoading(true);
      setResponse("");

      const res = await getUserAnswerFromAi({ question: fullCommand });

      const generatedDescription =
        res.data.data.candidates[0].content.parts[0].text;
      setResponse(generatedDescription);

      setTimeout(() => {
        document
          .getElementById("responseSection")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      const payload = {
        ...data,
        jobDescriptions: generatedDescription,
        jobInterviewQuestions: "No Questions Yet!",
        brJobStatus: "INPROGRESS",
        createdBy: getUserId(),
        endDate: lastDateOfApply,
      };

      const result = await insertDataInTable("brJobs", payload);
      setJobid(result?.data?.data?.brJobId);
    } catch (error: any) {
      console.error(
        "Error generating job description or inserting data:",
        error
      );
      openSnackBar(error?.response?.data?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        className="full-screen-div"
        sx={{
          backgroundImage: "url('/assets/BR bg.png')",
          backgroundSize: "60% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          // pb: 10,
          // minHeight:'100vh'
        }}
      >
        <CardMedia
          component="img"
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "50%",
            width: "auto",
          }}
          image="/assets/Object.png"
        />

        <Box
          sx={{
            // position: "absolute",
            // top: "1%",
            ml: "6%",
            padding: 4,
            pb: 2,
            maxWidth: { xs: "100%", md: "50vw" },
          }}
        >
          <Typography
            sx={{
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              color: "white",
              width: "fit-content",
              p: 2,
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            }}
            variant="h5"
            mb={2.5}
          >
            Beyond Resume
          </Typography>
          <Typography
            mb={2}
            variant="h5"
            align="left"
            gutterBottom
            color="black"
          >
            Go Beyond Resumes. Discover Real Talent.
          </Typography>
          <Typography
            mb={2}
            align="left"
            gutterBottom
            sx={{ fontSize: "14px", color: "#a2a2a2" }}
          >
            Beyond Resume helps you discover the right talent faster through
            AI-led interviews eliminating the guesswork and saving time on
            traditional hiring methods.
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  label="Company Name"
                  placeholder="Eg. Xyz Pvt. Ltd."
                  valueProp="companyName"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                {/* <FormTextField
                  label="Job Title"
                  valueProp="jobTitle"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                /> */}

                <FormAutocomplete2
                  label="Job Title"
                  options={jobFunctions}
                  defaultValue={selectedJobTitle}
                  labelProp=""
                  primeryKey=""
                  setter={setSelectedJobTitle}
                  sx={{ ...commonFormTextFieldSx }}
                  px={2}
                  search={""}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormTextField
                  label="Required Skills"
                  valueProp="skills"
                  placeholder="Eg. React, Node.js"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormTextField
                  label="Required Experience"
                  valueProp="experience"
                  errors={errors}
                  placeholder="Eg. 3+ years"
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormSelect
                  options={jobType}
                  label="Job Type"
                  valueProp="jobType"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  options={jobMode}
                  label="Work Mode"
                  valueProp="jobMode"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormSelect
                  options={payroll}
                  label="Payroll Type"
                  valueProp="payroll"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormTextField
                  label="Compensation"
                  valueProp="compensation"
                  placeholder="Eg. ₹8-12 LPA"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                />
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 4 }}>
                <FormTextField
                  label="Job Location"
                  valueProp="location"
                  errors={errors}
                  register={register}
                  withValidationClass={false}
                  sx={commonFormTextFieldSx}
                  placeholder="Eg. Bengaluru"
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <BasicDatePicker
                  label={"Deadline"}
                  setDate={setLastDateOfApply}
                  minimum={new Date()}
                  value={lastDateOfApply}
                  sx={commonFormTextFieldSx}
                  marginTop={1}
                ></BasicDatePicker>
                {/* {lastDateError && (
                  <FormHelperText sx={{ marginLeft: 1, marginTop: 0.5 }}>
                    {lastDateError}
                  </FormHelperText>
                )} */}
              </Grid2>
              <Grid2
                size={{ xs: 12 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "44px",
                    px: 4,
                    py: 1,
                    mt: 3,
                    mx: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                    transition: "all 0.3s",
                    textTransform: "none",
                    fontSize: "16px",
                    "&:hover": {
                      transform: "scale(1.08)",
                    },
                  }}
                  //   disabled={loading}
                >
                  {loading ? (
                    <>
                      Analyzing <CircularProgress color="inherit" size={18} />
                    </>
                  ) : (
                    <>
                      Submit{" "}
                      <FontAwesomeIcon
                        style={{ marginLeft: "6px" }}
                        icon={faArrowCircleRight}
                      />
                    </>
                  )}
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Box>
      </Box>
      {response && <JobDescriptionResponse jobId={jobid} response={response} />}

      {avatarStatus !== null && avatarStatus !== "CLOSED" && open && (
        <div>
          <BeyondResumeAvatar
            open={open}
            scriptLines={scriptLines}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </Box>
  );
};

export default BeyondResumeHome;
