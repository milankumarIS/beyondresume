import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useIndustry } from "../../../components/context/IndustryContext";
import { decryptPayload } from "../../../components/util/CommonFunctions";
import GradientText from "../../../components/util/CommonStyle";
import { getUserRole } from "../../../services/axiosClient";
import CYS from "../../../services/Secret";
import { searchListDataFromTable } from "../../../services/services";
import BeyondResumeInterviewRounds from "./Beyond Resume Job Post/BeyondResumeInterviewRounds";
import GeneratedAiQnaResponse from "./Beyond Resume Job Post/GeneratedAiQnaResponse";
import JobDescriptionResponse from "./Beyond Resume Job Post/JobDescriptionResponse";

const BeyondResumeJobDetails = () => {
  const { token } = useParams<{ token: string }>();
  const data = token ? decryptPayload(token, CYS) : null;

  if (!data) return <div>Invalid or expired token</div>;

  const brJobId = data;

  // console.log(brJobId);

  const [jobsData, setJobsData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState("");

  const fetchJobDetails = async () => {
    setLoading(true);
    const result: any = await searchListDataFromTable("brJobs", {
      brJobId: brJobId,
    });
    setJobsData(result?.data?.data);
    setJobStatus(result?.data?.data[0]?.brJobStatus);
    setLoading(false);
  };

  // console.log(jobsData);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  // console.log(jobsData[0]?.jobInterviewQuestions);
  const { industryName, spaceIndustryName } = useIndustry();

  return (
    <Box p={2} pt={0}>
      {loading ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="newtons-cradle">
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
            <div className="newtons-cradle__dot"></div>
          </div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Loading
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={1}
            mb={4}
          >
            {industryName?.toLowerCase() === "translab.io".toLowerCase() ? (
              <Box
                sx={{
                  // background: "white",
                  padding: "4px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0,
                }}
              >
                <img
                  style={{
                    width: "180px",
                    borderRadius: "4px",
                  }}
                  src="/assets/translab.png"
                  alt=""
                />
              </Box>
            ) : (
              <GradientText text={industryName} variant="h4" />
            )}
          </Box>

          <JobDescriptionResponse
            jobId={jobsData[0]?.brJobId}
            response={jobsData[0]?.jobDescriptions}
            onJobUpdate={() => window.location.reload()}
          />

          {jobsData[0]?.roundType === "multiple" ? (
            <BeyondResumeInterviewRounds
              jobId={jobsData[0]?.jobId}
              jobDescription={jobsData[0]?.jobDescriptions}
              jobFormData={jobsData[0]}
            />
          ) : (
            getUserRole() !== "CAREER SEEKER" &&
            jobsData[0]?.jobInterviewQuestions !== "No Questions Yet!" && (
              <GeneratedAiQnaResponse
                status={jobStatus}
                response={jobsData[0]?.jobInterviewQuestions}
                jobId={jobsData[0]?.brJobId}
                isPost={true}
              />
            )
          )}
        </>
      )}
    </Box>
  );
};

export default BeyondResumeJobDetails;
