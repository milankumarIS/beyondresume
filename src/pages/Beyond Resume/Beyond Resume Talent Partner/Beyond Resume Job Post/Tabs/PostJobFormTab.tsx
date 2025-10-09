import { faInfoCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, FormHelperText, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import BasicDatePicker from "../../../../../components/form/DatePicker";
import FormAutocomplete2 from "../../../../../components/form/FormAutocompleteWithoutFiltering";
import FormSelect from "../../../../../components/form/FormSelect";
import FormTextField from "../../../../../components/form/FormTextField";
import { jobMode, jobType, payroll } from "../../../../../components/form/data";
import { beyondResumeSchema } from "../../../../../components/form/schema";
import { commonFormTextFieldSx } from "../../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../../components/util/CommonStyle";
import ConfirmationPopup from "../../../../../components/util/ConfirmationPopup";
import { getUserId } from "../../../../../services/axiosClient";
import {
  getUserAnswerFromAi,
  insertDataInTable,
  searchDataFromTable,
  searchListDataFromTable,
  updateByIdDataInTable,
} from "../../../../../services/services";

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
  const [jobFunctions, setJobFunctions] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const history = useHistory();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
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

  useEffect(() => {
    const fetchJobFunctions = async () => {
      try {
        const res: any = await searchListDataFromTable("brJobFunction", {
          jobFunctionStatus: "ACTIVE",
        });

        const resData = res?.data?.data || [];
        setJobFunctions(resData);
      } catch (error) {
        console.error("Error fetching job functions:", error);
      }
    };

    const checkCompanyData = async () => {
      const res = await searchDataFromTable("companyInfo", {
        createdBy: getUserId(),
      });

      const prevData = res?.data?.data || {};

      if (!prevData?.industryName || prevData.industryName.length === 0) {
        setPopupOpen(true);
      }

      setCompanyData(prevData);

      reset((formValues) => ({
        ...formValues,
        companyName: prevData?.industryName || "",
      }));
    };

    fetchJobFunctions();
    checkCompanyData();
  }, [reset]);

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
    setValue("companyName", companyData?.industryName);
  }, [selectedJobTitle, setValue, lastDateOfApply]);

  // console.log(defaultValues);

  const onSubmitHandler: SubmitHandler<BeyondResumeSchemaType> = async (
    data
  ) => {
    if (!lastDateOfApply) {
      setLastDateError("Application deadline is required");
      return;
    }

    const fullCommand = `Generate a professional job description for the role of ${
      data.jobTitle
    } at ${data.companyName}.

${data.companyName} is a ${companyData?.industryType} company classified as ${
      companyData?.industryClassification
    } under the ${
      companyData?.industryCategory
    } category. It was established in ${
      companyData?.establishedYear || "N/A"
    } and is headquartered in ${companyData?.headquarters?.city}, ${
      companyData?.headquarters?.state
    }, ${companyData?.headquarters?.country}. 

Company description: ${
      companyData?.description || "No additional company description provided."
    }
Contact: Email - ${companyData?.companyContactEmail || "N/A"}, Phone - ${
      companyData?.companyContactPhone || "N/A"
    }

The ideal candidate should have expertise in ${data.skills} with ${
      data.experience
    } years of experience. 
This is a ${data.jobType} role based in ${data.location}, with a ${
      data.jobMode
    } work arrangement.

Consider the following context while writing:
- Product Based Companies:
    - MNC/GCC/Innovation Labs (e.g., Meta, Apple, Netflix, Google, Microsoft, Nvidia, Amazon) require top-tier talent (>95% intelligence level)
    - Product Startups (e.g., OpenAI, ChatGPT, Perplexity, Xai) require high-level talent (90-95% intelligence level)
- Service Based Companies:
    - MNC/GCC/Services (e.g., Accenture, Infosys, TCS, Wipro, SAP Labs, IBM, Deloitte) require good-level talent (80-90% intelligence level)
    - Startups (e.g., iGate, Aptive) require above-average talent (70-80% intelligence level)
    - Mid-sized service companies (e.g., ServiceNow, HCL, Tech Mahindra) require average-level talent (60-75% intelligence level)

Please format the response using plain innerHTML and include the following sections:
- About ${data.companyName}
- Job Summary
- Responsibilities
- Qualifications
- Job Type
- Location
- Work Mode

Guidelines:
- Use <h3> for each section heading (About, Job Summary, Responsibilities, Qualifications, Job Type, Location, Work Mode)
- Use <p> for paragraph text
- Use <ul><li> for listing responsibilities and qualifications
- Ensure content includes a company introduction, a summary of the role, a detailed list of responsibilities, qualifications required, job type, location, and work mode.
- Before the About section, do not include any other headings.

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

      onSuccess(jobId!, generatedDescription, {
        ...data,
        endDate: lastDateOfApply,
      });
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
          // maxWidth: "60vw",
          maxWidth: "800px",

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
              readonly
              watch={watch}
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
              labelProp="jobFunctionName"
              primeryKey="brJobFunctionId"
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
            <ConfirmationPopup
        disableOutsideClose
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={async () => {
          location.href = `/beyond-resume-company-profile-form`;
        }}
        color="#50bcf6"
        message="Your company profile is incomplete"
        warningMessage="Please complete filling up your company details to continue."
        yesText="Fill Profile"
        noButton={false}
        icon={
          <FontAwesomeIcon
            color="#0b8bb8"
            fontSize="68px"
            style={{ marginTop: "16px", marginBottom: "-8px" }}
            icon={faInfoCircle}
          />
        }
      />
    </Box>
  );
};

export default PostJobForm;
