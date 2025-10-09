import {
  faChevronCircleDown,
  faEdit,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNewSnackbar } from "../../../../components/shared/useSnackbar";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  CutoffInfo,
} from "../../../../components/util/CommonStyle";
import CustomSnackbar from "../../../../components/util/CustomSnackbar";
import {
  getUserAnswerFromAi,
  insertBulkDataInTable,
  searchDataFromTable,
  updateByIdDataInTable,
} from "../../../../services/services";
import color from "../../../../theme/color";
import JobTimelineStepper from "../../Beyond Resume Components/JobTimelineStepper";
import GeneratedAiQnaResponse from "./GeneratedAiQnaResponse";
import SmartEvaluationTab from "./Tabs/SmartEvaluationTab";
import { getUserId } from "../../../../services/axiosClient";

interface Round {
  roundId: string;
  roundName: string;
  purpose: string;
  roundWindow: number;
  cutoffType?: "fixed" | "dynamic";
  cutoffValue?: number;
  targetCutoff?: number;
  flexibility?: number;
  minPassCount?: number;
  examMode?: string;
  jobInterviewQuestions?: any[];
  interviewDuration?: number;
  percentageList?: {
    name: string;
    percent: number;
    estimatedQuestions: number;
  }[];
}

export default function BeyondResumeInterviewRounds({
  jobId,
  jobDescription,
  jobFormData,
}: {
  jobId: string;
  jobDescription: string;
  jobFormData?: any;
}) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [jobData, SetJobData] = useState<any>({});
  const [qnResponses, setQnResponses] = useState<{ [roundId: string]: any }>(
    {}
  );
// console.log(qnResponses);

  const [mode, setMode] = useState<"setup" | "confirm">("setup");
  const [loading, setLoading] = useState(false);
  const { snackbarProps, showSnackbar } = useNewSnackbar();

  const [companyData, setCompanyData] = useState<any>({});

  useEffect(() => {
    const checkCompanyData = async () => {
      const res = await searchDataFromTable("companyInfo", {
        createdBy: getUserId(),
      });

      const prevData = res?.data?.data || {};

      setCompanyData(prevData);
    };

    checkCompanyData();
  }, []);

  useEffect(() => {
    const payload = {
      endDate: jobFormData?.endDate,
      rounds: rounds,
    };
    SetJobData(payload);
  }, [mode]);

  

  const fetchAiRounds = async () => {
    setLoading(true);
const fullCommand = `Generate a set of automated interview rounds for the following job description. The rounds should be tailored based on the company's industry type, classification, and intelligence level expectations.

Company Context:
- Name: ${jobFormData.companyName}
- Industry Type: ${companyData?.industryType}   // Product Based / Service Based
- Industry Classification: ${companyData?.industryClassification} // MNC, Startup, Mid-sized
- Company Category Context:
  1. Product Based
     a. MNC/GCC/Innovation Labs (Meta, Apple, Netflix, Google, Microsoft, Nvidia, Amazon, etc.) – top-level intelligence required (>95%)
     b. Product Startups (OpenAI, ChatGPT, Perplexity, Xai, etc.) – high intelligence required (90–95%)
  2. Service Based
     a. MNC/GCC/Services (Accenture, Infosys, TCS, Wipro, SAP Labs, Kyndril, IBM, Capgemini, Deloitte, etc.) – good intelligence required (80–90%)
     b. Startups (iGate, Aptive, etc.) – above-average intelligence required (70–80%)
     c. Mid-sized Service Companies (ServiceNow, HCL, Tech Mahindra, etc.) – average intelligence required (60–75%)

Candidate Profile:
- Experience Required: ${jobFormData?.experience} years

Guidelines:
1. Suggest an appropriate number of fully online interview rounds based on the candidate’s experience and the company Category context.
2. Each round should evaluate skills aligned with the company's expected intelligence level and the job description.
3. Early rounds should screen core skills; later rounds should assess advanced problem-solving, decision-making, and role-specific scenarios.
4.  if it is product based deep understanding of data structures, algorithms, design patterns and other such skill be must
5. Specify cutoff strategy for each round:
   - If 'cutoffType' is "fixed", provide 'cutoffValue'.
   - If 'cutoffType' is "dynamic", provide 'targetCutoff', 'flexibility', and 'minPassCount'.
6. Ensure fairness and appropriate difficulty to allow sufficient candidate progression.
7. Round names and purposes must allow automated question generation and evaluation.

Output Format (JSON array):
[
  {
    "roundName": "string",
    "purpose": "string",
    "cutoffType": "fixed" | "dynamic",
    "cutoffValue": number,            // required if cutoffType = fixed
    "targetCutoff": number,           // required if cutoffType = dynamic
    "flexibility": number,            // required if cutoffType = dynamic
    "minPassCount": number             // required if cutoffType = dynamic
  }
]

Job Description:
${jobDescription}`;

    const aiRes = await getUserAnswerFromAi({ question: fullCommand });
    const rawText =
      aiRes?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    try {
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedText);

      const withIds = parsed.map((r: any, i: number) => ({
        roundId: `round-${i + 1}`,
        roundName: r.roundName,
        purpose: r.purpose,
        roundWindow: i === 0 ? 0 : 7,
      }));
      setRounds(withIds);
      setLoading(false);
    } catch (err) {
      console.error("AI rounds parse error", err);
    }
  };

  const isRoundComplete = (round: Round) => {
    if (
      !round.roundName.trim() ||
      !round.purpose.trim() ||
      round.roundWindow < 0
    ) {
      return false;
    }

    if (round.cutoffType === "fixed") {
      return round.cutoffValue !== undefined && round.cutoffValue > 0;
    }

    if (round.cutoffType === "dynamic") {
      return (
        round.targetCutoff !== undefined &&
        round.flexibility !== undefined &&
        round.minPassCount !== undefined &&
        round.targetCutoff > 0 &&
        round.flexibility >= 0 &&
        round.minPassCount > 0
      );
    }

    return false;
  };

  const deleteRound = (roundId: string) => {
    setRounds((prev) => prev.filter((r) => r.roundId !== roundId));
  };

  const addManualRound = (afterRoundId: string) => {
    setLoading(false);
    if (rounds.length === 0) {
      setRounds([
        {
          roundId: "round-1",
          roundName: "",
          purpose: "",
          roundWindow: 0,
          cutoffType: undefined,
        },
      ]);
      return;
    }

    const lastRound = rounds.find((r) => r.roundId === afterRoundId);
    if (!lastRound || !isRoundComplete(lastRound)) {
      alert("Please fill all fields of this round before adding a new one.");
      return;
    }

    setRounds((prev) => [
      ...prev,
      {
        roundId: `round-${prev.length + 1}`,
        roundName: "",
        purpose: "",
        roundWindow: 7,
        cutoffType: undefined,
      },
    ]);
  };

  const confirmRounds = async () => {
    for (const round of rounds) {
      if (!isRoundComplete(round)) {
        alert(
          "Please fill in all fields for each round and ensure no negative values."
        );
        return;
      }
    }
    setMode("confirm");
  };

  const handleSaveRound = async (roundId: string, payload: any) => {
    // console.log(payload);

    setQnResponses((prev) => ({
      ...prev,
      [roundId]: payload?.jobInterviewQuestions,
    }));

    const updatedRounds = rounds.map((r) =>
      r.roundId === roundId ? { ...r, ...payload } : r
    );
    setRounds(updatedRounds);

    // await updateByIdDataInTable(
    //   "brJobs",
    //   jobId,
    //   { rounds: updatedRounds },
    //   "brJobId"
    // );
  };

  const [open, setOpen] = useState(false);

  const validateRoundsForPosting = (rounds: Round[]) => {
    const incompleteRounds: string[] = [];

    rounds.forEach((round, index) => {
      const roundLabel = `Round ${index + 1}`;

      if (
        !round.jobInterviewQuestions ||
        round.jobInterviewQuestions.length === 0
      ) {
        incompleteRounds.push(`${roundLabel}`);
        return;
      }

      // if (
      //   !round.percentageList ||
      //   round.percentageList.length === 0 ||
      //   !round.percentageList.every(
      //     (p: any) => p.name && p.percent > 0 && p.estimatedQuestions > 0
      //   )
      // ) {
      //   incompleteRounds.push(`${roundLabel} (Invalid percentage list)`);
      // }
    });

    return incompleteRounds;
  };

  const handlePostJob = async () => {
    const incompleteRounds = validateRoundsForPosting(rounds);

    if (incompleteRounds.length > 0) {
      showSnackbar(
        `Interview questions setup is pending for:\n\n${incompleteRounds.join(
          ", "
        )}`,
        "error"
      );
      return;
    }
    try {
      const commonData = {
        brJobId: jobId,
        brJobRoundStatus: "ACTIVE",
      };

      const payload = rounds.map((round) => ({
        ...round,
        ...commonData,
      }));

      await insertBulkDataInTable("brJobRounds", payload);

      await updateByIdDataInTable(
        "brJobs",
        jobId,
        { brJobStatus: "ACTIVE", roundType: "multiple" },
        "brJobId"
      );
      window.location.href = "/beyond-resume-myjobs";
    } catch (err) {
      console.error("Error posting job:", err);
    }
  };
  return (
    <Box mt={6}>
      {mode === "setup" ? (
        <>
          <Typography textAlign={"center"} variant="h6" gutterBottom>
            Setup Interview Rounds
          </Typography>

          <Typography
            gutterBottom
            align="center"
            fontWeight="bold"
            mb={4}
            fontFamily={"montserrat-regular"}
          >
            Define the interview process for this job. You can let AI suggest
            optimized rounds based on the role, or manually create your own.
          </Typography>

          <Box
            my={2}
            mb={4}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <BeyondResumeButton variant="outlined" onClick={fetchAiRounds}>
              Generate Rounds with AI
            </BeyondResumeButton>

            <BeyondResumeButton
              disabled={rounds.length > 0}
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => addManualRound("round-0")}
            >
              Add Round Manually
            </BeyondResumeButton>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: "70vh",
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
                Hang on till we craft the interview rounds based upon the job
                description
              </Typography>
            </Box>
          ) : (
            <>
              <BeyondResumeButton
                sx={{ ml: "auto", display: "flex", mb: 2 }}
                variant="outlined"
                onClick={() => setOpen(true)}
              >
                <FontAwesomeIcon
                  style={{ marginRight: "4px", marginTop: "-4px" }}
                  icon={faInfoCircle}
                ></FontAwesomeIcon>{" "}
                How Rounds Work
              </BeyondResumeButton>

              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>
                  <Typography sx={{ textDecoration: "underline" }} variant="h6">
                    Cutoff Settings Guide
                  </Typography>
                </DialogTitle>
                <DialogContent dividers>{CutoffInfo()}</DialogContent>
                <DialogActions>
                  <BeyondResumeButton onClick={() => setOpen(false)}>
                    Close
                  </BeyondResumeButton>
                </DialogActions>
              </Dialog>

              {rounds.map((round, index) => (
                <Box
                  key={round.roundId}
                  mb={2}
                  p={2}
                  borderRadius={4}
                  sx={{
                    boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <TextField
                    fullWidth
                    label={`Round ${index + 1}`}
                    placeholder={`Enter Round Name`}
                    value={round.roundName}
                    onChange={(e) =>
                      setRounds((prev) =>
                        prev.map((r) =>
                          r.roundId === round.roundId
                            ? { ...r, roundName: e.target.value }
                            : r
                        )
                      )
                    }
                    sx={{ ...commonFormTextFieldSx, mb: 1 }}
                  />

                  <TextField
                    multiline
                    rows={2.5}
                    fullWidth
                    label="Purpose"
                    placeholder={`Enter Round Purpose`}
                    value={round.purpose}
                    onChange={(e) =>
                      setRounds((prev) =>
                        prev.map((r) =>
                          r.roundId === round.roundId
                            ? { ...r, purpose: e.target.value }
                            : r
                        )
                      )
                    }
                    sx={{
                      ...commonFormTextFieldSx,
                      mb: 1,
                      "& .MuiInputBase-input": { resize: "vertical", mt: 2 },
                      "& textarea": { resize: "vertical" },
                    }}
                  />

                  <Box mt={0}>
                    <TextField
                      select
                      fullWidth
                      label="Cutoff Type"
                      value={round.cutoffType || ""}
                      onChange={(e) =>
                        setRounds((prev) =>
                          prev.map((r) =>
                            r.roundId === round.roundId
                              ? {
                                  ...r,
                                  cutoffType: e.target.value as
                                    | "fixed"
                                    | "dynamic",
                                }
                              : r
                          )
                        )
                      }
                      sx={{ ...commonFormTextFieldSx, mb: 2 }}
                    >
                      {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                      <MenuItem value="fixed">Fixed</MenuItem>
                      <MenuItem value="dynamic">Dynamic</MenuItem>
                    </TextField>

                    {round.cutoffType === "fixed" && (
                      <TextField
                        type="number"
                        fullWidth
                        label="Cutoff %"
                        value={round.cutoffValue ?? ""}
                        onChange={(e) =>
                          setRounds((prev) =>
                            prev.map((r) =>
                              r.roundId === round.roundId
                                ? { ...r, cutoffValue: Number(e.target.value) }
                                : r
                            )
                          )
                        }
                        sx={{ ...commonFormTextFieldSx, mb: 2 }}
                      />
                    )}

                    {round.cutoffType === "dynamic" && (
                      <>
                        <TextField
                          type="number"
                          fullWidth
                          label="Target Cutoff %"
                          value={round.targetCutoff ?? ""}
                          onChange={(e) =>
                            setRounds((prev) =>
                              prev.map((r) =>
                                r.roundId === round.roundId
                                  ? {
                                      ...r,
                                      targetCutoff: Number(e.target.value),
                                    }
                                  : r
                              )
                            )
                          }
                          sx={{ ...commonFormTextFieldSx, mb: 2 }}
                        />
                        <TextField
                          type="number"
                          fullWidth
                          label="Allowed Flexibility %"
                          value={round.flexibility ?? ""}
                          onChange={(e) =>
                            setRounds((prev) =>
                              prev.map((r) =>
                                r.roundId === round.roundId
                                  ? {
                                      ...r,
                                      flexibility: Number(e.target.value),
                                    }
                                  : r
                              )
                            )
                          }
                          sx={{ ...commonFormTextFieldSx, mb: 2 }}
                        />
                        <TextField
                          type="number"
                          fullWidth
                          label="Minimum Pass Count"
                          value={round.minPassCount ?? ""}
                          onChange={(e) =>
                            setRounds((prev) =>
                              prev.map((r) =>
                                r.roundId === round.roundId
                                  ? {
                                      ...r,
                                      minPassCount: Number(e.target.value),
                                    }
                                  : r
                              )
                            )
                          }
                          sx={{ ...commonFormTextFieldSx, mb: 2 }}
                        />
                      </>
                    )}
                  </Box>

                  {index !== 0 && (
                    <TextField
                      type="number"
                      fullWidth
                      label="Round Window (Days)"
                      value={round.roundWindow}
                      onChange={(e) =>
                        setRounds((prev) =>
                          prev.map((r) =>
                            r.roundId === round.roundId
                              ? { ...r, roundWindow: Number(e.target.value) }
                              : r
                          )
                        )
                      }
                      sx={{ ...commonFormTextFieldSx, mb: 1 }}
                    />
                  )}

                  {rounds.length - 1 === index && (
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <BeyondResumeButton
                        variant="outlined"
                        onClick={() => deleteRound(round.roundId)}
                        disabled={rounds.length === 1}
                      >
                        Delete
                      </BeyondResumeButton>

                      <BeyondResumeButton
                        variant="outlined"
                        onClick={() => addManualRound(round.roundId)}
                      >
                        Add Next Round
                      </BeyondResumeButton>
                    </Box>
                  )}
                </Box>
              ))}
            </>
          )}

          {rounds.length > 0 && !loading && (
            <BeyondResumeButton
              sx={{ mx: "auto", display: "flex", mt: 4 }}
              variant="contained"
              onClick={confirmRounds}
            >
              Confirm & Proceed to Question Setup
            </BeyondResumeButton>
          )}
        </>
      ) : (
        <>
          {jobData && <JobTimelineStepper job={jobData} rounds={rounds} />}

          <BeyondResumeButton
            sx={{ mt: 2, ml: "auto", display: "flex" }}
            variant="contained"
            onClick={() => setMode("setup")}
          >
            <FontAwesomeIcon
              style={{ marginRight: "4px", marginTop: "-4px" }}
              icon={faEdit}
            ></FontAwesomeIcon>{" "}
            Edit Rounds
          </BeyondResumeButton>

          <Typography textAlign={"center"} ml={1} variant="h6" gutterBottom>
            Setup Interview Questions:
          </Typography>

          <Typography
            gutterBottom
            align="center"
            fontWeight="bold"
            mb={4}
            fontFamily={"montserrat-regular"}
          >
            To proceed further you need to setup interview questions for each
            round.
          </Typography>

          <Box>
            {rounds.map((round, index) => (
              <Accordion
                key={round.roundId}
                disableGutters
                sx={{
                  mb: 2,
                  borderRadius: "16px !important",
                  boxShadow: "0px 0px 36px rgba(0, 0, 0, 0.10)",
                  overflow: "hidden",
                  background: "transparent",
                  color: "inherit",
                }}
              >
                <AccordionSummary
                  sx={{
                    color: "inherit",
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      color: "inherit",
                    },
                  }}
                  expandIcon={
                    <FontAwesomeIcon
                      style={{ color: "inherit" }}
                      icon={faChevronCircleDown}
                    />
                  }
                >
                  <Typography
                    color="inherit"
                    variant="body1"
                    textAlign={"center"}
                  >
                    {`Round ${index + 1} - ${round.roundName}`}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    p: 2,
                    background: "transparent",
                  }}
                >
                  <SmartEvaluationTab
                    jobId={jobId}
                    response={jobDescription}
                    onSave={(payload: any) =>
                      handleSaveRound(round.roundId, payload)
                    }
                    roundData={round}
                  />

                  {qnResponses[round.roundId] &&
                    round?.examMode !== "Adaptive" && (
                      <GeneratedAiQnaResponse
                        jobId={jobId}
                        response={qnResponses[round.roundId]}
                        roundId={round.roundId}
                      />
                    )}
                </AccordionDetails>
              </Accordion>
            ))}

            <BeyondResumeButton
              sx={{
                mt: 3,
                mx: "auto",
                display: "flex",
                background:
                  validateRoundsForPosting(rounds).length > 0
                    ? "grey"
                    : color.activeButtonBg,
              }}
              variant="contained"
              color="primary"
              onClick={handlePostJob}
            >
              Post Job
            </BeyondResumeButton>
          </Box>
        </>
      )}
      <CustomSnackbar {...snackbarProps} />
    </Box>
  );
}
