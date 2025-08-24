import { Box, CircularProgress, FormHelperText, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import BasicDatePicker from "../../../../../components/form/DatePicker";
import FormAutocomplete2 from "../../../../../components/form/FormAutocompleteWithoutFiltering";
import FormSelect from "../../../../../components/form/FormSelect";
import FormTextField from "../../../../../components/form/FormTextField";
import {
  jobFunctions,
  jobMode,
  jobType,
  payroll,
} from "../../../../../components/form/data";
import { commonFormTextFieldSx } from "../../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../../components/util/CommonStyle";
import { getUserId } from "../../../../../services/axiosClient";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  updateByIdDataInTable,
} from "../../../../../services/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { beyondResumeSchema } from "../../../../../components/form/schema";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BeyondResumeSchemaType = {
  jobTitle: string;
  companyName: string;
  skills: string;
  experience: string;
  jobType: string;
  location: string;
  jobMode: string;
  endDate: string;
  payroll: string;
};

interface PostJobFormProps {
  jobId?: string | null;
  defaultValues?: Partial<BeyondResumeSchemaType>;
  onSuccess: (
    id: string,
    jd: string,
    formValues: BeyondResumeSchemaType
  ) => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({
  jobId,
  defaultValues,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BeyondResumeSchemaType>({
    resolver: zodResolver(beyondResumeSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      skills: "",
      experience: "",
      jobType: "",
      location: "",
      jobMode: "",
      endDate: "",
      payroll: "",
      ...defaultValues,
    },
  });
  const [lastDateOfApply, setLastDateOfApply] = useState(
    defaultValues?.endDate || ""
  );
  const [selectedJobTitle, setSelectedJobTitle] = useState(
    defaultValues?.jobTitle || ""
  );

  const [lastDateError, setLastDateError] = useState("");

  useEffect(() => {
    setValue("jobTitle", selectedJobTitle);
    setValue("endDate", lastDateOfApply);
  }, [selectedJobTitle, setValue, lastDateOfApply]);

  // console.log(defaultValues);

  const onSubmitHandler: SubmitHandler<BeyondResumeSchemaType> = async (
    data
  ) => {

    if (!lastDateOfApply) {
      setLastDateError("Application deadline is required");
      return;
    }

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

    Before About section do not keep any other heading.

    - Use <h3> for each section heading (e.g., About, Job Summary, Responsibilities, Qualifications, Job Type, Location, Work Mode).
    - Use <p> for paragraph text
    - Use <ul><li> for listing responsibilities and qualifications
    - Ensure content includes a company introduction, a summary of the role, a detailed list of responsibilities, qualifications required, job type, location, and work mode.

    The final output should be HTML-formatted and ready to render on a webpage, preserving all tags exactly.
    `;

    try {
      setLoading(true);

      let generatedDescription = "";
      try {
        const res = await getUserAnswerFromAi({ question: fullCommand });
        generatedDescription =
          res?.data?.data?.candidates[0]?.content?.parts[0]?.text || "";
      } catch (err) {
        console.error("AI generation failed:", err);
        generatedDescription =
          "<p>No System-generated job description available. Please update manually.</p>";
      }

      const payload = {
        ...data,
        jobDescriptions: generatedDescription,
        jobInterviewQuestions: "No Questions Yet!",
        brJobStatus: "INPROGRESS",
        createdBy: getUserId(),
        endDate: lastDateOfApply,
      };

      // console.log("Payload to be sent:", payload);

      let result;
      if (jobId) {
        result = await updateByIdDataInTable(
          "brJobs",
          jobId,
          payload,
          "brJobId"
        );
      } else {
        result = await insertDataInTable("brJobs", payload);
        jobId = result?.data?.data?.brJobId;
      }

     onSuccess(jobId!, generatedDescription, { ...data, endDate: lastDateOfApply });
    } catch (error: any) {
      console.error("Error creating/updating job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
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
              options={jobFunctions}
              defaultValue={selectedJobTitle}
              labelProp="name"
              primeryKey="id"
              setter={setSelectedJobTitle}
              sx={{ ...commonFormTextFieldSx }}
              px={2}
            />
            {errors["jobTitle"] && errors["jobTitle"].message && (
              <FormHelperText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "red !important",
                  ml: 3,
                }}
                error
              >
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  style={{ marginRight: 4, fontSize: "18px" }}
                />
                {errors["jobTitle"].message}
              </FormHelperText>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <FormTextField
              label="Must-Have Skills"
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
              label="Experience Level"
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
              defaultValue={defaultValues?.jobType || ""}
              label="Employment Type"
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
              defaultValue={defaultValues?.jobMode}
              label="Work Arrangement"
              valueProp="jobMode"
              errors={errors}
              register={register}
              withValidationClass={false}
              sx={commonFormTextFieldSx}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <FormSelect
              defaultValue={defaultValues?.payroll}
              options={payroll}
              label="Payment Structure"
              valueProp="payroll"
              errors={errors}
              register={register}
              withValidationClass={false}
              sx={commonFormTextFieldSx}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 4 }}>
            <FormTextField
              label="Compensation Range"
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
              label="Work Location"
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
              label={"Application Deadline"}
              setDate={setLastDateOfApply}
              minimum={new Date()}
              value={lastDateOfApply}
              sx={commonFormTextFieldSx}
              marginTop={2}
            ></BasicDatePicker>

            {lastDateError && (
              <FormHelperText
                sx={{
                  marginLeft: 3,
                  marginTop: 0.5,
                  display: "flex",
                  alignItems: "center",
                  color: "red !important",
                }}
              >
                {" "}
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  style={{ marginRight: 4, fontSize: "18px" }}
                />
                {lastDateError}
              </FormHelperText>
            )}
          </Grid2>
          <Grid2
            size={{ xs: 12 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              p: 2,
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
                  {jobId ? "Updating" : "Submitting"}{" "}
                  <CircularProgress
                    color="inherit"
                    style={{ marginLeft: "4px" }}
                    size={18}
                  />
                </>
              ) : (
                <>
                  {jobId ? "Update" : "Continue"}{" "}
                  {/* <FontAwesomeIcon
                    style={{ marginLeft: "6px" }}
                    icon={faArrowCircleRight}
                  /> */}
                </>
              )}
            </BeyondResumeButton>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

export default PostJobForm;
