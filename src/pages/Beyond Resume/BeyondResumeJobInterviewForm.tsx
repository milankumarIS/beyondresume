import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import FormTextField from "../../components/form/FormTextField";
import {
  InterviewFormSchemaType,
  interviewFormSchema,
} from "../../components/form/schema";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import {
  commonFormTextFieldSx,
  countTotalQuestions,
} from "../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import { getUserId } from "../../services/axiosClient";
import {
  UploadAuthFile,
  getProfile,
  getUserAnswerFromAiThroughPdf,
  searchDataFromTable,
  syncByTwoUniqueKeyData,
} from "../../services/services";
import InterviewModeModal from "./Beyond Resume Components/BeyondResumeInterviewModeModal";
import FileUpload from "./Beyond Resume Components/FileUpload";

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
  gap: "1rem",
  maxWidth: "600px",
  margin: "auto",
  backgroundColor: "white",
  borderRadius: "1rem",
  padding: "2rem",
  position: "relative",
});

const BeyondResumeJobInterviewForm = () => {
  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InterviewFormSchemaType>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      previousCompany: "",
      yearsExperience: 0,
      linkedIn: "",
    },
  });

  const history = useHistory();
  const { brJobId } = useParams<any>();
  const openSnackBar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [noOfQuestion, setNoOfQuestions] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any>({});
  const [resume, setResume] = useState<File | string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

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

        setValue("fullName", fullName);
        setValue("email", data?.userContact?.userEmail || "");
        setValue("phone", data?.userContact?.userPhoneNumber || "");
        setResume(data?.userPersonalInfo?.resumeFile || "");
      }
    });
  }, [setValue]);

  const onSubmitHandler: SubmitHandler<InterviewFormSchemaType> = async (
    data
  ) => {
    try {
      setLoading(true);

      if (!resume) {
        setResumeError("Resume is required.");
        setLoading(false);
        return;
      } else {
        setResumeError(null);
      }

      let resumeLink: string | null = null;

      if (resume instanceof File) {
        const formData = new FormData();
        formData.append("file", resume);
        const result = await UploadAuthFile(formData);

        resumeLink = result?.data?.data?.location;
        if (!resumeLink)
          throw new Error("Resume upload failed. No link returned.");
      } else if (typeof resume === "string" && resume.length > 0) {
        resumeLink = resume;
      }

      let extractedResumeText: string = "";

      try {
        const prompt1 =
          `Here I'm attaching a job description link. From the linked PDF, extract the text and give the response in plain innerHTML.`.replace(
            /\s+/g,
            " "
          );

        const response = await getUserAnswerFromAiThroughPdf({
          question: prompt1,
          urls: [resumeLink],
        });

        extractedResumeText = response?.data?.data || "";
      } catch (err) {
        console.error("Resume Fetch failed", err);
      }

      const result: any = await searchDataFromTable("brJobs", { brJobId });
      const rawJobData = result?.data?.data || {};

      const cleanedContent = rawJobData?.jobInterviewQuestions
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/<[^>]*>?/gm, "")
        .trim();

      const data1 = JSON.parse(cleanedContent);
      const totalQuestions = countTotalQuestions(data1);
      setNoOfQuestions(totalQuestions);
      setDuration(rawJobData?.interviewDuration);
      setJobs(rawJobData);
      const excludedFields = [
        "createdBy",
        "createdAt",
        "updatedAt",
        "brJobStatus",
        "jobMode",
        "payroll",
        // "percentageList",
        // "interviewDuration",
      ];
      const filteredJobData = Object.keys(rawJobData)
        .filter((key) => !excludedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = rawJobData[key];
          return obj;
        }, {} as Record<string, any>);

      const payload = {
        ...data,
        ...filteredJobData,
        brJobId,
        createdBy: getUserId(),
        brJobApplicantStatus: "APPLIED",
        interviewScore: 0,
        interviewOverview: "",
        questionFile: "",
        numberOfApplicantLimit: 0,
        candidateResume: extractedResumeText,
      };

      console.log(payload);

      const insertResult: any = await syncByTwoUniqueKeyData(
        "brJobApplicant",
        payload,
        "createdBy",
        "brJobId"
      );
      const brJobApplicantId = insertResult?.data?.data?.brJobApplicantId;
      setApplicantId(brJobApplicantId);
      setShowModeModal(true);
    } catch (error: any) {
      openSnackBar(error?.response?.data?.msg || "Something went wrong.");
      console.error(error?.response?.data?.msg);
    }
  };

  const handleModeSelect = (mode: "AI_VIDEO" | "BASIC_EXAM") => {
    if (!applicantId) return;
    setShowModeModal(false);

    const sessionType = "writtenExamSession";

    if (mode === "AI_VIDEO") {
      history.push(`/beyond-resume-readyToJoin/${applicantId}`, {
        duration: duration,
        noOfQuestions: noOfQuestion,
        companyName: jobs?.companyName,
        jobTitle: jobs?.jobTitle,
        examMode: jobs?.examMode,
      });
    } else {
      history.push(
        `/beyond-resume-readyToJoin/${applicantId}?sessionType=${sessionType}`,
        {
          duration: duration,
          noOfQuestions: noOfQuestion,
          companyName: jobs?.companyName,
          jobTitle: jobs?.jobTitle,
          examMode: jobs?.examMode,
        }
      );
    }
  };

  return (
    <>
      <Container
        sx={{ minHeight: "100vh", background: "transparent", color: "inherit" }}
      >
        {/* <BlobAnimation /> */}

        <Form
          onSubmit={handleSubmit(onSubmitHandler)}
          style={{
            display: "flex",
            flexDirection: "column",
            background: "transparent",
            color: "inherit",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              width: "fit-content",
              m: "auto",
              fontFamily: "Custom-Bold",
              color: "inherit",
            }}
          >
            Interview Form
          </Typography>

          <FormTextField
            label="Full Name"
            valueProp="fullName"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
            watch={watch}
            required
          />

          <FormTextField
            label="Email"
            valueProp="email"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
            watch={watch}
            required
          />

          <FormTextField
            label="Phone Number"
            valueProp="phone"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
            watch={watch}
            required
          />
          {/* <FormTextField
            label="Previous Employer / Company Name"
            valueProp="previousCompany"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          /> */}

          <FormTextField
            label="Years of Experience"
            valueProp="yearsExperience"
            errors={errors}
            register={register}
            withValidationClass={false}
            required
            sx={commonFormTextFieldSx}
          />

          {/* <FormTextField
            label="LinkedIn Profile"
            valueProp="linkedIn"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          /> */}

          <FileUpload
            sx={{ px: 0, mx: 2 }}
            questionFile={resume}
            setQuestionFile={(file) => {
              setResume(file);
              setResumeError(null); 
            }}
            acceptFormat=".pdf"
            showFileNameOnly={true}
            uploadLabel={"Upload Resume"}
            changeLabel={"Upload Another Resume"}
          />

          {resumeError && (
            <Typography color="error" sx={{ mt: -1.5, ml: 2 }}>
              {resumeError}
            </Typography>
          )}

          <BeyondResumeButton
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ mt: 2, py: 1.5, fontSize: "1rem", mx: 2 }}
          >
            {loading ? (
              <>
                Creating interview{" "}
                <CircularProgress
                  color="inherit"
                  size={18}
                  style={{ marginLeft: "8px" }}
                />
              </>
            ) : (
              <>
                Submit{" "}
                {/* <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faArrowCircleRight}
                /> */}
              </>
            )}
          </BeyondResumeButton>
        </Form>
      </Container>

      <InterviewModeModal
        rawJobData={jobs}
        open={showModeModal}
        onSelectMode={handleModeSelect}
        noOQuestion={noOfQuestion}
      />
    </>
  );
};

export default BeyondResumeJobInterviewForm;
