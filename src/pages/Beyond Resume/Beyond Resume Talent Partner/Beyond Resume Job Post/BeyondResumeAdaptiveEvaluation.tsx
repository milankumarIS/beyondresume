import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import MultipleSelectWithAutoComplete from "../../../../components/form/MultiSelectAutocomplete";
import { useSnackbar } from "../../../../components/shared/SnackbarProvider";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import {
  getRandomQuestions,
  searchDataFromTable,
  searchListGroupDataFromTableWithInclude,
} from "../../../../services/services";
import color from "../../../../theme/color";

interface GeneratedAiQnaResponseProps {
  jobId?: string | null;
  duration?: number | null;
  onPostJob?: (payload: any) => void;
}

const BeyondResumeAdaptiveEvaluation: React.FC<GeneratedAiQnaResponseProps> = ({
  jobId,
  duration,
  onPostJob,
}) => {
  const location = useLocation();
  const isJobPage = location.pathname.startsWith("/beyond-resume-myjobs");
  const openSnackBar = useSnackbar();
  const history = useHistory();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillResponses, setSkillResponses] = useState<string[]>([]);
  const [formattedQuestions, setFormattedQuestions] = useState<any>(null);
  const [hasParseError, setHasParseError] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGetJob = async () => {
      try {
        const res = await searchDataFromTable("brJobs", {
          brJobId: jobId,
        });
        const jobSkills = res?.data?.skills || "";
      } catch (err) {
        console.error("Error fetching job data", err);
      }
    };

    const handleFetchDBSkills = () => {
      searchListGroupDataFromTableWithInclude("brQuestionSets", {
        data: {
          brQuestionSetStatus: "ACTIVE",
          group: ["category"],
        },
      }).then((result: any) => {
        const res = result.data.data;
        setSkillResponses(res.map((cat) => cat.category));
      });
    };

    handleGetJob();
    handleFetchDBSkills();
  }, [jobId]);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const response = await getRandomQuestions({
        category: selectedSkills.join(","),
      });
      const data = response?.data?.data || [];

      

      const formatted = {
        categories: [
          {
            name: "Adaptive Evaluation",
            questions: data.map((q: any) => ({
              question: q.question,
              complexity: q.complexity,
              suggestedAnswer: q.suggestedAnswer,
            })),
          },
        ],
      };

      setFormattedQuestions(formatted);
      setQuestionsGenerated(true);

      const formattedString = `<pre>${JSON.stringify(
        formatted,
        null,
        2
      )}</pre>`;

      const payload = {
        jobInterviewQuestions: formattedString,
        interviewDuration: duration,
        examMode: "Adaptive",
      };      

      if (onPostJob) {
        onPostJob({
          jobId,
          payload,
        });
      }
      setLoading(false);
    } catch (err: any) {
      console.error("Error generating questions", err);
    }
  };

  return (
    <Box m={4} id="questionSection">
      <Typography mb={2} variant="h5">
        Adaptive Evaluation Overview
      </Typography>

      <Typography mb={2} sx={{ fontFamily: "montserrat-regular" }}>
        This evaluation adapts dynamically based on the candidate's performance,
        offering a balanced yet challenging interview experience. The system
        selects questions aligned with the job’s key competencies and adjusts
        difficulty in real-time as the candidate progresses.
      </Typography>

      <Box
        sx={{
          maxWidth: "400px",
          display: "block",
          margin: "auto",
          background: color.cardBg,
          p: 4,
          borderRadius: 4,
        }}
      >
        <MultipleSelectWithAutoComplete
          label="Select Skills"
          valueProp="skills"
          labelProp="name"
          options={skillResponses}
          selected={selectedSkills}
          onChange={(newSkills) => {
            setSelectedSkills(newSkills);
            setQuestionsGenerated(false);
            setFormattedQuestions(null);
          }}
        />

        {questionsGenerated && (
          <Box
            mt={2}
            sx={{
              background: "white",
              borderRadius: 3,
              p: 2,
            }}
          >
            <FontAwesomeIcon
              style={{
                color: "green",
                width: "42px",
                height: "42px",
                margin: "auto",
                display: "block",
              }}
              icon={faCheckCircle}
            />
            <Typography
              mt={1}
              textAlign="center"
              color="green"
              sx={{
                fontFamily: "montserrat-regular",
                fontSize: "14px",
              }}
            >
              Adaptive interview questions have been successfully generated. You
              can now proceed further.
            </Typography>
          </Box>
        )}

        {!questionsGenerated && selectedSkills.length > 0 && (
          <Box mt={3} display="flex" justifyContent="center">
            {!loading ? (
              <BeyondResumeButton
                onClick={handleGenerateQuestions}
                variant="contained"
                color="primary"
              >
                Generate Questions
              </BeyondResumeButton>
            ) : (
              <>
                <BeyondResumeButton variant="contained">
                  Analyzing...{" "}
                  <CircularProgress
                    color="inherit"
                    style={{ marginLeft: "4px" }}
                    size={18}
                  />
                </BeyondResumeButton>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BeyondResumeAdaptiveEvaluation;
