import {
  faChevronRight,
  faClock,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import {
  commonFormTextFieldSx,
  shuffleArray,
} from "../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import {
  getUserAnswerFromAi,
  updateByIdDataInTable,
} from "../../services/services";
import { evaluateInterviewResponses } from "./Beyond Resume Components/interviewEvaluator";
import color from "../../theme/color";
import { useTheme } from "../../components/util/ThemeContext";

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

interface SecureExamProps {
  response: string;
  sessionType?: any;
  brJobId?: number;
  brInterviewId?: number;
  interviewDuration?: number;
}

const ExamSessionWritten: React.FC<SecureExamProps> = ({
  response,
  sessionType,
  brJobId,
  brInterviewId,
  interviewDuration,
}) => {
  const [parsedData, setParsedData] = useState<TextContent | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[][]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupOpen1, setPopupOpen1] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    interviewDuration ? interviewDuration * 60 : 30 * 60
  );
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const openSnackBar = useSnackbar();
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    new Set(["0-0"])
  ); // start with first question visited

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  };

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        window.location.href = "/beyond-resume-interviews";
      }
    });

    document.documentElement.requestFullscreen?.();

    return () => {
      unlisten();
      document.exitFullscreen?.();
    };
  }, [history]);

  useEffect(() => {
    const match = response.match(/<pre>\s*([\s\S]*?)\s*<\/pre>/);
    const jsonString = match ? match[1] : null;

    try {
      if (jsonString) {
        const data: TextContent = JSON.parse(jsonString);

        const shuffledCategories = data.categories.map((cat) => ({
          ...cat,
          questions: shuffleArray(cat.questions),
        }));

        const finalData = {
          ...data,
          categories: shuffleArray(shuffledCategories),
        };

        setParsedData(finalData);
        setUserResponses(
          finalData.categories.map((cat) =>
            Array(cat.questions.length).fill("")
          )
        );
      }
    } catch (err) {
      console.error("Failed to parse JSON", err);
    }
  }, [response]);

  useEffect(() => {
    if (!parsedData || loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [parsedData, loading]);

  const moveToNextQuestion = () => {
    const inputValue = inputRef.current?.value || "";

    if (!inputValue.trim()) return; // don't allow move if empty

    const updated = [...userResponses];
    updated[currentCategoryIndex][currentQuestionIndex] = inputValue.trim();
    setUserResponses(updated);

    const key = `${currentCategoryIndex}-${currentQuestionIndex}`;
    const newVisited = new Set(visitedQuestions);
    newVisited.add(key);
    setVisitedQuestions(newVisited);

    const newSkipped = new Set(skippedQuestions);
    newSkipped.delete(key); // in case user answered a skipped question
    setSkippedQuestions(newSkipped);

    goToNext();
  };

  const handleSkip = () => {
    const updated = [...userResponses];
    updated[currentCategoryIndex][currentQuestionIndex] = "";
    setUserResponses(updated);

    const key = `${currentCategoryIndex}-${currentQuestionIndex}`;
    const newVisited = new Set(visitedQuestions);
    const newSkipped = new Set(skippedQuestions);
    newVisited.add(key);
    newSkipped.add(key);

    setVisitedQuestions(newVisited);
    setSkippedQuestions(newSkipped);

    goToNext();
  };

  const goToNext = () => {
    const category = parsedData!.categories[currentCategoryIndex];

    if (currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentCategoryIndex < parsedData!.categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmit();
    }

    setTimeout(() => {
      const nextKey = `${currentCategoryIndex}-${currentQuestionIndex}`;
      if (!visitedQuestions.has(nextKey)) {
        inputRef.current!.value = "";
        setSelectedOption("");
      }
    }, 0);
  };

  const handleQuestionJump = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    if (!visitedQuestions.has(key)) return;

    const updated = [...userResponses];
    const currentInput = inputRef.current?.value || "";
    updated[currentCategoryIndex][currentQuestionIndex] = currentInput.trim();
    setUserResponses(updated);

    setCurrentCategoryIndex(catIdx);
    setCurrentQuestionIndex(qIdx);
    inputRef.current!.value = userResponses[catIdx][qIdx] || "";

    const newVisited = new Set(visitedQuestions);
    newVisited.add(key);
    setVisitedQuestions(newVisited);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    evaluateInterviewResponses({
      parsedData,
      userResponses,
      brJobId,
      brInterviewId,
      sessionType,
      getUserAnswerFromAi,
      updateByIdDataInTable,
      openSnackBar,
      setLoading,
    });
  };
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen)
      (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen)
      (elem as any).msRequestFullscreen();
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const preventPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" ||
      e.key === "F11" ||
      (e.ctrlKey && ["r", "t", "w"].includes(e.key)) ||
      e.metaKey ||
      e.altKey
    ) {
      e.preventDefault();
      alert("Restricted key press detected.");
    }
  };

  useEffect(() => {
    enterFullscreen();

    // document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener("visibilitychange", () => {
    //   if (document.visibilityState === "hidden") {
    //     setTabSwitchCount((prev) => {
    //       const newCount = prev + 1;
    //       alert(`Tab switch detected (${newCount})!`);
    //       if (newCount >= 2) {
    //         alert("Too many tab switches. Ending the exam.");
    //         handleSubmit();
    //       }
    //       return newCount;
    //     });
    //   }
    // });

    // document.addEventListener("fullscreenchange", () => {
    //   if (!document.fullscreenElement) {
    //     alert("Exited fullscreen. Exam will end.");
    //     handleSubmit();
    //   }
    // });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const question =
    parsedData?.categories[currentCategoryIndex].questions[
      currentQuestionIndex
    ];
  const totalQuestions =
    parsedData?.categories.reduce(
      (acc, cat) => acc + cat.questions.length,
      0
    ) || 0;
  const isLastQuestion =
    parsedData &&
    currentCategoryIndex === parsedData.categories.length - 1 &&
    currentQuestionIndex ===
      parsedData.categories[currentCategoryIndex].questions.length - 1;

  const { theme } = useTheme();
  return (
    <Box
      className="full-screen-div"
      p={4}
      sx={{
        minHeight: "100vh",
      }}
      onContextMenu={preventContextMenu}
    >
      <BeyondResumeButton
        variant="outlined"
        onClick={() => setPopupOpen(true)}
        disabled={loading}
        sx={{
          background: "transparent",
          position: "absolute",
          top: 30,
          right: 20,
          fontSize: "12px",
          color: "inherit",
          borderColor: "inherit !important",
        }}
      >
        Exit{" "}
        <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: "10px" }} />
      </BeyondResumeButton>

      {/* <BeyondResumeButton
        variant="outlined"
        sx={{
          background: "transparent",
          borderColor: "white",
          position: "absolute",
          top: 30,
          left: 20,
          fontSize: "12px",
        }}
      >
        <FontAwesomeIcon
          style={{ marginRight: "6px" }}
          icon={faClock}
        ></FontAwesomeIcon>{" "}
        Time left: {formatTime(timeLeft)}s
      </BeyondResumeButton> */}

      <Typography variant="h4" align="center" mt={6}>
        Written Interview
      </Typography>
      <Typography variant="h6" align="center">
        Category:{" "}
        <span style={{ fontFamily: "montserrat-regular" }}>
          {" "}
          {parsedData?.categories[currentCategoryIndex].name}{" "}
        </span>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box mt={4}>
          <Typography
            variant="h5"
            mt={2}
            mb={2}
            fontFamily={"montserrat-regular"}
          >
            <span
              style={{ color: color.newFirstColor, fontFamily: "custom-bold" }}
            >
              Q{currentQuestionIndex + 1}:{" "}
            </span>{" "}
            {question?.question}
          </Typography>

          <Grid container spacing={2} mt={1}>
            {question?.options?.map((option, index) => {
              const [key, value] = Object.entries(option)[0];
              return (
                <Grid item xs={6} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 1,
                      textAlign: "center",
                      cursor: "pointer",
                      border:
                        selectedOption === value
                          ? "2px solid #5a81fd"
                          : "2px solid #ccc",
                      backgroundColor:
                        selectedOption === value ? "#5a81fd" : "#fff",
                      color: selectedOption === value ? "white" : "black",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleOptionClick(value)}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      {key}. {value}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          <TextField
            sx={{
              ...commonFormTextFieldSx,
              mb: 2,
              mt: 1,
              borderRadius: "18px",
              "& .MuiInputBase-input": {
                resize: "vertical",
              },
              "& textarea": {
                resize: "vertical",
              },
            }}
            inputRef={inputRef}
            placeholder="Your Answer"
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            onPaste={preventPaste}
            inputProps={{ autoComplete: "off" }}
          />

          <Box
            mt={2}
            display="flex"
            justifyContent={"space-between"}
            gap={2}
            flexWrap="wrap"
          >
            {/* <BeyondResumeButton
            variant="contained"
            color="error"
            onClick={() => setPopupOpen1(true)}
            sx={{ background: "red" }}
          >
            Submit Exam
          </BeyondResumeButton> */}

            {/* {loading ? (
              <BeyondResumeButton variant="contained">
                Submitting Interview...{" "}
                <CircularProgress
                  color="inherit"
                  size={18}
                  style={{ marginLeft: "8px" }}
                />
              </BeyondResumeButton>
            ) : (
              <BeyondResumeButton
                variant="contained"
                color="error"
                onClick={() => setPopupOpen1(true)}
                sx={{ background: "red" }}
              >
                Submit Exam
              </BeyondResumeButton>
            )} */}
            {parsedData && (
              <BeyondResumeButton
                variant="contained"
                color="success"
                onClick={handleSkip}
                sx={{
                  background: "transparent",
                  border: "solid 1px",
                  color: "inherit",
                  borderColor: "inherit !important",
                }}
              >
                Skip
              </BeyondResumeButton>
            )}
            {parsedData && (
              <BeyondResumeButton
                variant="contained"
                color="success"
                onClick={moveToNextQuestion}
                disabled={loading || !inputRef.current?.value?.trim()}
              >
                {isLastQuestion
                  ? loading
                    ? "Submitting Interview..."
                    : "Submit"
                  : "Next"}
              </BeyondResumeButton>
            )}
          </Box>
        </Box>

        <Box
          mt={-2}
          display="flex"
          flexWrap="wrap"
          justifyContent={"center"}
          alignItems={"center"}
          height={"fit-content"}
          gap={1}
          sx={{
            minWidth: "250px",
            maxWidth: "250px",
            background: theme === "dark" ? "#121721" : color.jobCardBgLight,
            p: 2,
            borderRadius: "12px",
          }}
        >
          <Typography
            width={"100%"}
            mb={0}
            ml={1}
            variant="h6"
            textAlign={"left"}
            fontFamily={"montserrat-regular"}
          >
            Questions
          </Typography>
          {parsedData?.categories.map((cat, catIdx) =>
            cat.questions.map((_, qIdx) => {
              const questionNumber =
                parsedData.categories
                  .slice(0, catIdx)
                  .reduce((acc, c) => acc + c.questions.length, 0) +
                qIdx +
                1;

              const isActive =
                catIdx === currentCategoryIndex &&
                qIdx === currentQuestionIndex;

              const isAnswered =
                (userResponses[catIdx]?.[qIdx] || "").trim() !== "";

              const isSkipped = skippedQuestions.has(`${catIdx}-${qIdx}`);
              const isVisited = visitedQuestions.has(`${catIdx}-${qIdx}`);

              return (
                <Box
                  key={`${catIdx}-${qIdx}`}
                  onClick={() => handleQuestionJump(catIdx, qIdx)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: isActive
                      ? "transparent"
                      : isSkipped
                      ? "transparent"
                      : isAnswered
                      ? color.activeColor
                      : "transparent",
                    color: isAnswered ? "white" : "inherit",
                    pointerEvents: isVisited ? "auto" : "none",
                    opacity: isVisited ? 1 : 0.3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontFamily: "montserrat-regular",
                    border: "solid 1.5px",
                    borderColor:
                      isActive || isAnswered ? color.activeColor : "#717680",
                  }}
                >
                  {questionNumber}
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      <ConfirmationPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onConfirm={() =>
          handleSubmit()
        }
        color="#50bcf6"
        message="Are you sure you want to leave?"
        warningMessage="Exiting now will submit your answers. You won’t be able to return to this interview session."
        yesText="Submit & Exit"
        noText="Stay & Continue"
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
    </Box>
  );
};

export default ExamSessionWritten;
