import { zodResolver } from "@hookform/resolvers/zod";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import FormTextField from "../../components/form/FormTextField";
import {
  InterviewFormSchemaType,
  interviewFormSchema,
} from "../../components/form/schema";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BlobAnimation,
} from "../../components/util/CommonStyle";
import { getUserId } from "../../services/axiosClient";
import {
  getProfile,
  insertDataInTable,
  searchDataFromTable,
  syncByTwoUniqueKeyData,
  syncDataInTable,
} from "../../services/services";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import InterviewModeModal from "./Beyond Resume Components/BeyondResumeInterviewModeModal";

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
  const [applicantId, setApplicantId] = useState<string | null>(null);

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
      }
    });
  }, [setValue]);

  const onSubmitHandler: SubmitHandler<InterviewFormSchemaType> = async (
    data
  ) => {
    try {
      setLoading(true);

      const result: any = await searchDataFromTable("brJobs", { brJobId });
      const rawJobData = result?.data?.data || {};

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
      };

      // console.log(payload)

      const insertResult: any = await syncByTwoUniqueKeyData(
        "brJobApplicant",
        payload,
        'createdBy',
        'brJobId'
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
    if (mode === "AI_VIDEO") {
      history.push(`/beyond-resume-readyToJoin/${applicantId}`);
    } else {
      history.push(`/beyond-resume-jobInterviewSession-written/${applicantId}`);
    }
  };

  return (
    <>
      <Container sx={{ minHeight: "100vh" }}>
        <BlobAnimation />

        <Form
          onSubmit={handleSubmit(onSubmitHandler)}
          style={{ display: "flex", flexDirection: "column" }}
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
          <FormTextField
            label="Previous Employer / Company Name"
            valueProp="previousCompany"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          />

          <FormTextField
            label="Years of Experience"
            valueProp="yearsExperience"
            errors={errors}
            register={register}
            withValidationClass={false}
            required
            sx={commonFormTextFieldSx}
          />

          <FormTextField
            label="LinkedIn Profile"
            valueProp="linkedIn"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          />

          <BeyondResumeButton
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ mt: 2, py: 1.5, fontSize: "1rem" }}
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
                <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faArrowCircleRight}
                />
              </>
            )}
          </BeyondResumeButton>
        </Form>
      </Container>

      <InterviewModeModal
        open={showModeModal}
        onSelectMode={handleModeSelect}
      />
    </>
  );
};

export default BeyondResumeJobInterviewForm;
