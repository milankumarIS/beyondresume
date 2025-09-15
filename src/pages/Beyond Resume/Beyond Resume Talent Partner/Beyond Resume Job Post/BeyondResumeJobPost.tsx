import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TalentPartnerScriptLines } from "../../../../components/form/data";
import GradientText from "../../../../components/util/CommonStyle";
import { useIndustry } from "../../../../components/util/IndustryContext";
import { useTheme } from "../../../../components/util/ThemeContext";
import { getUserId, getUserRole } from "../../../../services/axiosClient";
import {
  searchDataFromTable,
  syncDataInTable,
} from "../../../../services/services";
import BeyondResumeAvatar from "../../Beyond Resume Components/BeyondResumeAvatar";
import JobPostStepper from "../../Beyond Resume Components/JobPostStepper";
import GeneratedAiQnaResponse from "./GeneratedAiQnaResponse";
import JobDescriptionTab from "./Tabs/JobDescriptionTab";
import PostJobForm from "./Tabs/PostJobFormTab";
import SmartEvaluationTab from "./Tabs/SmartEvaluationTab";

const BeyondResumeJobPost: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");
  const { industryName } = useIndustry();
  const [jobFormData, setJobFormData] = useState<any | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  // console.log(activeTab);
  // console.log(maxStepReached);

  const [jobId, setJobId] = useState<string | null>(null);
  const [jdResponse, setJdResponse] = useState("");
  const [qnResponse, setQnResponse] = useState("");

  //   console.log(jdResponse);
  //   console.log(qnResponse);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue < maxStepReached) {
      setActiveTab(newValue);
    }
  };

  const goToStep = (step: number) => {
    setActiveTab(step);
    setMaxStepReached(Math.max(maxStepReached, step));
  };

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

  const { theme } = useTheme();

  const steps = [
    "About Job",
    "Job Description",
    "Smart Evaluation",
    "Post Job",
  ];

  return (
    <Box p={{ xs: 0, md: 4 }}>
      <Box className="full-screen-div">
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mb: 2,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {industryName?.toLowerCase() === "translab.io".toLowerCase() ? (
            <img
              style={{
                width: "180px",
                borderRadius: "4px",
              }}
              src="/assets/translab.png"
              alt=""
            />
          ) : (
            <GradientText text={industryName} variant="h4" />
          )}
        </Box>

        <Typography
          textAlign={"center"}
          mb={2}
          variant="h6"
          sx={{
            fontFamily: "Montserrat-Regular",
          }}
        >
          Post your job opening and we’ll connect you with the most qualified
          candidates.
        </Typography>

        <Box>
          <JobPostStepper
            steps={steps}
            activeStep={activeTab}
            theme={theme}
            onStepClick={handleTabChange}
          />

          {activeTab === 0 && (
            <PostJobForm
              jobId={jobId}
              defaultValues={jobFormData}
              onSuccess={(id, jd, formValues) => {
                setJobId(id);
                setJdResponse(jd);
                setJobFormData(formValues);
                goToStep(1);
              }}
            />
          )}

          {activeTab === 1 && jobId && jdResponse && (
            <JobDescriptionTab
              jobId={jobId}
              response={jdResponse}
              onNext={() => goToStep(2)}
            />
          )}
          {activeTab === 2 && jobId && jdResponse && (
            <SmartEvaluationTab
              jobId={jobId}
              response={jdResponse}
              onNext={(qn) => {
                setQnResponse(qn);
                goToStep(3);
              }}
            />
          )}

          {activeTab === 3 && qnResponse && (
            <GeneratedAiQnaResponse jobId={jobId!} response={qnResponse} />
          )}
        </Box>
      </Box>

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

export default BeyondResumeJobPost;
