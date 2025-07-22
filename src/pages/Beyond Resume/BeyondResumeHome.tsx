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
  TalentPartnerScriptLines,
} from "../../components/form/data";
import {
  beyondResumeSchema,
  BeyondResumeSchemaType,
} from "../../components/form/schema";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import {
  getUserFirstName,
  getUserId,
  getUserRole,
} from "../../services/axiosClient";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  searchDataFromTable,
  syncDataInTable,
} from "../../services/services";
import BeyondResumeAvatar from "./Beyond Resume Components/BeyondResumeAvatar";
import JobDescriptionResponse from "./JobDescriptionResponse";
import GradientText, {
  BeyondResumeButton,
} from "../../components/util/CommonStyle";

const BeyondResumeHome: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const responseRef = useRef<HTMLDivElement | null>(null);
  const [lastDateOfApply, setLastDateOfApply] = useState("");
  // const [lastDateError, setLastDateError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");

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
    console.log(data);

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
    - Work Mode

    Before About section do not keep and other heading.

    - Use <h3> for each section heading (e.g., About, Job Summary, Responsibilities, Qualifications, Job Type, Location, Work Mode).
    - Use <p> for paragraph text
    - Use <ul><li> for listing responsibilities and qualifications
    - Ensure content includes a company introduction, a summary of the role, a detailed list of responsibilities, qualifications required, job type, location, and work mode.

    The final output should be HTML-formatted and ready to render on a webpage, preserving all tags exactly.
    `;

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
    <Box p={4}>
      <Box
        className="full-screen-div"
        sx={{
          // backgroundImage: "url('/assets/BR bg.png')",
          backgroundSize: "60% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          // pb: 10,
          // minHeight:'100vh'
        }}
      >
        <Box
          sx={{
            pb: 2,
            maxWidth: { xs: "100%", md: "100%" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb:2,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Typography variant="h4">Hi</Typography>
            <GradientText text={getUserFirstName()} variant="h4" />
          </Box>

          <Typography
            textAlign={"center"}
            mb={2}
            variant="h6"
            sx={{
              fontFamily: "Montserrat-Regular",
            }}
          >
           Create a job opening and let us match the right candidates for you.
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "60vw",
              margin: "auto",
            }}
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
                  options={jobFunctions} // e.g., [{ id: 1, name: "Engineer" }]
                  defaultValue={selectedJobTitle}
                  labelProp="name"
                  primeryKey="id"
                  setter={setSelectedJobTitle}
                  sx={{ ...commonFormTextFieldSx }}
                  px={2}
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
                  p:2
                }}
              >
                <BeyondResumeButton
                  type="submit"
                  variant="contained"
                  color="primary"

                  //   disabled={loading}
                >
                  {loading ? (
                    <>
                      Analyzing <CircularProgress color="inherit" style={{marginLeft:'4px'}} size={18} />
                    </>
                  ) : (
                    <>
                      Generate JD{" "}
                      <FontAwesomeIcon
                        style={{ marginLeft: "6px" }}
                        icon={faArrowCircleRight}
                      />
                    </>
                  )}
                </BeyondResumeButton>
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
            scriptLines={TalentPartnerScriptLines}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </Box>
  );
};

export default BeyondResumeHome;
