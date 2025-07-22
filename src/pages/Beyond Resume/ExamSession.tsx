import {
  faChevronRight,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, CircularProgress, Grid2, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import {
  getUserAnswerFromAi,
  updateByIdDataInTable,
} from "../../services/services";
import ExamSessionVideoCamBox from "./Beyond Resume Components/ExamSessionVideoCamBox";
import { evaluateInterviewResponses } from "./Beyond Resume Components/interviewEvaluator";
import { speakWithElevenLabs } from "../../components/util/CommonFunctions";
interface MCQOption {
  [key: string]: string;
}

interface Question {
  question: string;
  options: MCQOption[];
  AnswerKey: string;
  complexity: string;
  suggestedAnswer: string;
  sheetName: string;
}

interface Category {
  name: string;
  questions: Question[];
}

interface TextContent {
  categories: Category[];
}

interface ExamSessionProps {
  response: string;
  sessionType?: any;
  videoStatus: boolean;
  micStatus: boolean;
  brJobId?: number;
  brInterviewId?: number;
}

const ExamSession: React.FC<ExamSessionProps> = ({
  response,
  videoStatus,
  micStatus,
  sessionType,
  brJobId,
  brInterviewId,
}) => {
  const [parsedData, setParsedData] = useState<TextContent | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[][]>([]);
  const [conversation, setConversation] = useState<
    { speaker: string; text: string }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionSpoken, setQuestionSpoken] = useState(false);
  const [introSpoken, setIntroSpoken] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const history = useHistory();
  const recognitionRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const openSnackBar = useSnackbar();
  const [popupOpen1, setPopupOpen1] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        window.location.href = "/beyond-resume-interviews";
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);

  // console.log(brJobId)
  // console.log(brInterviewId)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  useEffect(() => {
    const match = response.match(/<pre>\s*([\s\S]*?)\s*<\/pre>/);
    const jsonString = match ? match[1] : null;

    try {
      if (jsonString) {
        const data: TextContent = JSON.parse(jsonString);
        setParsedData(data);
        setUserResponses(
          data.categories.map((cat) => Array(cat.questions.length).fill(""))
        );
      }
    } catch (err) {
      console.error("Failed to parse JSON", err);
    }
  }, [response]);

  const [categoryIntroSpoken, setCategoryIntroSpoken] = useState(false);

  useEffect(() => {
    if (parsedData && !introSpoken) {
      (async () => {
        await speakText(
          "Welcome to your virtual interview session. Let's begin with the first category."
        );
        setIntroSpoken(true);
        speakCurrentQuestion();
      })();
    }
  }, [parsedData]);

  useEffect(() => {
    if (parsedData && introSpoken && !questionSpoken && !isSpeaking) {
      speakCurrentQuestion();
    }
  }, [currentCategoryIndex, currentQuestionIndex]);

  const speakCurrentQuestion = async () => {
    const category = parsedData!.categories[currentCategoryIndex];
    const question = category.questions[currentQuestionIndex];

    if (!categoryIntroSpoken) {
      await speakText(`Now starting category ${category.name}`);
      setCategoryIntroSpoken(true);
    }

    await speakText(`${question.question}`);

    if (Array.isArray(question.options) && question.options.length > 0) {
      for (const optionObj of question.options) {
        const [key, value] = Object.entries(optionObj)[0];
        await speakText(`${key}. ${value}`);
      }
    }
    setQuestionSpoken(true);
  };

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsSpeaking(true);
      setConversation((prev) => [...prev, { speaker: "AI", text }]);
      // await speakWithElevenLabs(text);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (e) => {
        console.error("Speech synthesis error:", e);
        setIsSpeaking(false);
        resolve();
      };

      speechSynthesis.cancel();

      speechSynthesis.speak(utterance);
    });
  };

  const startRecording = async () => {
    try {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        console.error("Speech Recognition API not supported in this browser.");
        alert("Speech Recognition is not supported in this browser.");
        return;
      }

      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setConversation((prev) => [
          ...prev,
          { speaker: "You", text: transcript },
        ]);

        const updated = [...userResponses];
        updated[currentCategoryIndex][currentQuestionIndex] = transcript;
        setUserResponses(updated);

        recognition.stop();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        recognition.stop();
      };

      recognition.start();
    } catch (error) {
      console.error("Speech recognition failed:", error);
    }
  };

  const moveToNextQuestion = async () => {
    const updated = [...userResponses];

    if (!updated[currentCategoryIndex][currentQuestionIndex]) {
      updated[currentCategoryIndex][currentQuestionIndex] = "";
    }

    setUserResponses(updated);

    const category = parsedData!.categories[currentCategoryIndex];

    if (currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentCategoryIndex < parsedData!.categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      setCategoryIntroSpoken(false);
    } else {
      await handleSubmit();
      return;
    }

    setQuestionSpoken(false);
  };

  const skipQuestion = () => {
    const updated = [...userResponses];
    updated[currentCategoryIndex][currentQuestionIndex] = "Skipped";
    setUserResponses(updated);
    moveToNextQuestion();
  };

  const handleSubmit = async () => {
    evaluateInterviewResponses({
      parsedData,
      userResponses,
      brJobId,
      brInterviewId,
      sessionType,
      getUserAnswerFromAi,
      updateByIdDataInTable,
      openSnackBar,
      speakText,
      setLoading,
    });
  };

  return (
    <Box className="full-screen-div" p={4}>
      <BeyondResumeButton
        variant="outlined"
        onClick={() => setPopupOpen(true)}
        disabled={isSpeaking || isRecording}
        sx={{
          color: "inherit",
          background: "transparent",
          position: "absolute",
          top: 30,
          right: 20,
          fontSize: "12px",
        }}
      >
        Exit{" "}
        <FontAwesomeIcon
          style={{ marginLeft: "10px" }}
          icon={faChevronRight}
        ></FontAwesomeIcon>
      </BeyondResumeButton>

      <Typography
        variant="h4"
        gutterBottom
        align="center"
        mt={{ xs: 6, md: 0 }}
      >
        Virtual Interview Session
      </Typography>

      <Grid2
        container
        mt={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={4}
        sx={{
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        <ExamSessionVideoCamBox
          isSpeaking={isSpeaking}
          isRecording={isRecording}
          micStatus={micStatus}
          videoStatus={videoStatus}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            background: "#1e272e",
            p: 2,
            borderRadius: 2,
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          <Typography my={2} align="center" variant="h5">
            Transcript
          </Typography>
          {conversation.map((entry, index) => {
            const isAI = entry.speaker === "AI";
            return (
              <Box
                key={index}
                display="flex"
                justifyContent={isAI ? "flex-start" : "flex-end"}
                mb={1}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isAI ? "#2d3436" : "#50bcf6",
                    color: "white",
                    boxShadow: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontWeight: "bold", mb: 0.5 }}
                  >
                    {entry.speaker}
                  </Typography>
                  <Typography variant="body2">{entry.text}</Typography>
                </Box>
              </Box>
            );
          })}
          <div ref={bottomRef} />
        </Box>
      </Grid2>

      <Box
        mt={4}
        display="flex"
        gap={2}
        justifyContent={"center"}
        flexWrap={"wrap"}
      >
        <BeyondResumeButton
          variant="contained"
          color="primary"
          disabled={isSpeaking || isRecording || !questionSpoken}
          onClick={startRecording}
        >
          Start Answering
        </BeyondResumeButton>

        {parsedData && (
          <BeyondResumeButton
            variant="contained"
            color="success"
            disabled={isSpeaking || isRecording}
            onClick={moveToNextQuestion}
          >
            {currentCategoryIndex === parsedData!.categories.length - 1 &&
            currentQuestionIndex ===
              parsedData!.categories[currentCategoryIndex].questions.length - 1
              ? "Submit"
              : "Next Question"}
          </BeyondResumeButton>
        )}

        <BeyondResumeButton
          variant="outlined"
          disabled={isSpeaking || isRecording}
          onClick={skipQuestion}
          sx={{ background: "transparent", color: "inherit" }}
        >
          Skip{" "}
          <FontAwesomeIcon
            style={{ marginLeft: "10px" }}
            icon={faChevronRight}
          ></FontAwesomeIcon>
        </BeyondResumeButton>

        <ConfirmationPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          onConfirm={async () => {
            await handleSubmit();
          }}
          color={"#50bcf6"}
          message="Are you sure you want to leave?"
          warningMessage="Exiting now will submit your answers. You won’t be able to return to this interview session."
          yesText="Submit & Exit"
          noText="Stay & Continue"
          icon={
            <FontAwesomeIcon
              color={"#50bcf6"}
              fontSize={"68px"}
              style={{ marginTop: "16px", marginBottom: "-8px" }}
              icon={faInfoCircle}
            />
          }
        />

        <ConfirmationPopup
          open={popupOpen1}
          onClose={() => setPopupOpen1(false)}
          onConfirm={() => {
            setPopupOpen1(false);
            handleSubmit();
          }}
          color="#50bcf6"
          message="Do you want to submit your exam?"
          warningMessage="This will submit your responses. You cannot return to the exam."
          icon={
            <FontAwesomeIcon
              color="#50bcf6"
              fontSize="68px"
              style={{ marginTop: "16px", marginBottom: "-8px" }}
              icon={faInfoCircle}
            />
          }
        />

        {/* {loading ? (
          <BeyondResumeButton variant="contained" style={{ color: "white" }}>
            Submitting Interview...{" "}
            <CircularProgress
              size={18}
              color="inherit"
              style={{ marginLeft: "8px" }}
            />
          </BeyondResumeButton>
        ) : (
          <BeyondResumeButton
            variant="contained"
            color="error"
            onClick={() => setPopupOpen1(true)}
            disabled={isSpeaking || isRecording}
          >
            Submit Interview
          </BeyondResumeButton>
        )} */}
      </Box>
    </Box>
  );
};

export default ExamSession;
