import {
  faChevronRight,
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
import {
  BeyondResumeButton,
  TimerDisplay,
} from "../../components/util/CommonStyle";
import ConfirmationPopup from "../../components/util/ConfirmationPopup";
import { useTheme } from "../../components/util/ThemeContext";
import {
  getUserAnswerFromAi,
  updateByIdDataInTable,
} from "../../services/services";
import color from "../../theme/color";
import BeyondResumeLoader from "./Beyond Resume Components/BeyondResumeLoader";
import ExamSessionVideoCamBox from "./Beyond Resume Components/ExamSessionVideoCamBox";
import { evaluateInterviewResponses } from "./Beyond Resume Components/interviewEvaluator";

const ExamSessionWritten: React.FC<SecureExamProps> = ({
  response,
  sessionType,
  brJobId,
  brInterviewId,
  interviewDuration,
  isAdaptive,
  jobsData,
  roundData
}) => {
  const [parsedData, setParsedData] = useState<TextContent | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<string[][]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupOpen1, setPopupOpen1] = useState(false);
  const [popupOpen2, setPopupOpen2] = useState(false);

  const [timeLeft, setTimeLeft] = useState(() =>
    interviewDuration ? interviewDuration * 60 : 30 * 60
  );

  let maxQuestions = 0;
  if (typeof interviewDuration === "number") {
    maxQuestions = interviewDuration / 2;
  }

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
  );
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [adaptiveProgression, setAdaptiveProgression] = useState<
    { catIdx: number; qIdx: number }[]
  >([]);

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    if (inputRef.current) {
      inputRef.current.value = value;
    }
  };

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      if (action === "POP") {
        window.location.href = "/beyond-resume";
      }
    });

    document.documentElement.requestFullscreen?.();

    return () => {
      unlisten();
      document.exitFullscreen?.();
    };
  }, [history]);

  const [proctoringError, setProctoringError] = useState<string | null>(null);
  const [proctoringInitialized, setProctoringInitialized] =
    useState<boolean>(false);
  const [wrongStreak, setWrongStreak] = useState(0);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!proctoringInitialized) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 1;
        });
      }, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [proctoringInitialized]);

  useEffect(() => {
    if (proctoringInitialized) {
      setProgress(100);
    }
  }, [proctoringInitialized]);

  const [violationCounts, setViolationCounts] = useState({
    noFace: 0,
    multiFace: 0,
    mobile: 0,
  });

  const [violationTimers, setViolationTimers] = useState<{
    [key: string]: number;
  }>({
    noFace: 0,
    multiFace: 0,
    mobile: 0,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (proctoringError) {
      const type = proctoringError.includes("No face")
        ? "noFace"
        : proctoringError.includes("Multiple")
        ? "multiFace"
        : proctoringError.includes("Mobile")
        ? "mobile"
        : null;

      if (type) {
        setViolationCounts((prev) => ({
          ...prev,
          [type]: prev[type] + 1,
        }));

        interval = setInterval(() => {
          setViolationTimers((prev) => ({
            ...prev,
            [type]: prev[type] + 1,
          }));
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [proctoringError]);

  useEffect(() => {
    const { noFace, multiFace, mobile } = violationCounts;
    const {
      noFace: nfTime,
      multiFace: mfTime,
      mobile: mbTime,
    } = violationTimers;

    if (
      noFace >= 5 ||
      nfTime >= 120 ||
      multiFace >= 5 ||
      mfTime >= 120 ||
      mobile >= 3 ||
      mbTime >= 120
    ) {
      setPopupOpen2(true);
    }
  }, [violationCounts, violationTimers]);

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

  const { theme } = useTheme();

  useEffect(() => {
    if (popupOpen2) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [popupOpen2]);

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

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          alert(`Tab switch detected!`);
          setPopupOpen2(true);

          return newCount;
        });
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        alert("Exited fullscreen. Exam will end.");
        setPopupOpen2(true);
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const levels = ["Beginner", "Intermediate", "Advance", "Complex"];

  const [beginnerQuestions, setBeginnerQuestions] = useState<
    { question: any; catIdx: number; qIdx: number }[]
  >([]);
  const [intermediateQuestions, setIntermediateQuestions] = useState<
    { question: any; catIdx: number; qIdx: number }[]
  >([]);
  const [advancedQuestions, setAdvancedQuestions] = useState<
    { question: any; catIdx: number; qIdx: number }[]
  >([]);
  const [complexQuestions, setComplexQuestions] = useState<
    { question: any; catIdx: number; qIdx: number }[]
  >([]);

  const getRandomUnvisitedQuestion = (
    questionArray,
    visitedSet: Set<string>
  ) => {
    const unvisited = questionArray.filter(
      (q) => !visitedSet.has(`${q.catIdx}-${q.qIdx}`)
    );
    if (unvisited.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * unvisited.length);
    return unvisited[randomIndex];
  };

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

        if (isAdaptive) {
          type LevelQuestion = {
            question: Question;
            catIdx: number;
            qIdx: number;
          };

          const beginner: LevelQuestion[] = [];
          const intermediate: LevelQuestion[] = [];
          const advance: LevelQuestion[] = [];
          const complex: LevelQuestion[] = [];

          finalData.categories.forEach((cat, catIdx) => {
            cat.questions.forEach((q, qIdx) => {
              const entry = { question: q, catIdx, qIdx };
              const level = q.complexity?.toLowerCase();

              switch (level) {
                case "beginner":
                  beginner.push(entry);
                  break;
                case "intermediate":
                  intermediate.push(entry);
                  break;
                case "advance":
                  advance.push(entry);
                  break;
                case "complex":
                  complex.push(entry);
                  break;
              }
            });
          });

          setBeginnerQuestions(beginner);
          setIntermediateQuestions(intermediate);
          setAdvancedQuestions(advance);
          setComplexQuestions(complex);

          const firstQ = getRandomUnvisitedQuestion(beginner, visitedQuestions);

          if (firstQ) {
            setCurrentCategoryIndex(firstQ.catIdx);
            setCurrentQuestionIndex(firstQ.qIdx);
            setAdaptiveProgression([
              { catIdx: firstQ.catIdx, qIdx: firstQ.qIdx },
            ]);
            setVisitedQuestions(new Set([`${firstQ.catIdx}-${firstQ.qIdx}`]));

            setCurrentLevel("Beginner");
          }
        }
      }
    } catch (err) {
      console.error("Failed to parse JSON", err);
    }
  }, [response, isAdaptive]);

  const getNextLevel = (level) => {
    const idx = levels.indexOf(level);
    return idx < levels.length - 1 ? levels[idx + 1] : level;
  };

  const getPreviousLevel = (level) => {
    const idx = levels.indexOf(level);
    return idx > 0 ? levels[idx - 1] : level;
  };

  const getNextAdaptiveQuestion = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return getRandomUnvisitedQuestion(beginnerQuestions, visitedQuestions);
      case "intermediate":
        return getRandomUnvisitedQuestion(
          intermediateQuestions,
          visitedQuestions
        );
      case "advance":
        return getRandomUnvisitedQuestion(advancedQuestions, visitedQuestions);
      case "complex":
        return getRandomUnvisitedQuestion(complexQuestions, visitedQuestions);
      default:
        return null;
    }
  };

  const moveToNextQuestion = async () => {
    if (!parsedData) return null;
    const inputValue = inputRef.current?.value || "";
    if (!inputValue.trim()) return;

    const key = `${currentCategoryIndex}-${currentQuestionIndex}`;
    const updated = [...userResponses];
    updated[currentCategoryIndex][currentQuestionIndex] = inputValue.trim();
    setUserResponses(updated);

    setVisitedQuestions((prev) => new Set(prev).add(key));
    setSkippedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });

    if (inputRef.current) inputRef.current.value = "";
    setSelectedOption("");

    if (isAdaptive) {
      const currentQuestion =
        parsedData.categories[currentCategoryIndex].questions[
          currentQuestionIndex
        ];

      const safeQuestion =
        currentQuestion?.question?.replace(/"/g, '\\"') || "";
      const safeAnswer = inputValue.trim().replace(/"/g, '\\"');

      const evalPrompt = `
You are an AI evaluator. Evaluate the candidate's answer strictly and return ONLY a valid JSON response with the following structure:

{
  "isCorrect": true | false,
}

Question:
"${safeQuestion}"

Candidate's Answer:
"${safeAnswer}"

Rules:
- Respond ONLY with a valid JSON object.
- Do NOT include any text, explanation, or markdown.
- "isCorrect" should reflect whether the answer is accurate or not.

Return only:
{"isCorrect": true | false}
    `.trim();

      try {
        const res = await getUserAnswerFromAi({ question: evalPrompt });
        const raw =
          res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const jsonMatch = raw.match(/{[\s\S]*?}/);
        if (!jsonMatch) throw new Error("No valid JSON found in AI response");

        const cleanJson = JSON.parse(jsonMatch[0]);
        const { isCorrect, score } = cleanJson;

        if (isCorrect) {
          const nextStreak = correctStreak + 1;
          setCorrectStreak(nextStreak);

          if (nextStreak === 3 && currentLevel !== "Complex") {
            setCorrectStreak(0);
            const nextLevel = getNextLevel(currentLevel);
            setCurrentLevel(nextLevel);
          } else if (currentLevel === "Complex") {
            setWrongStreak?.(0);
          }
        } else {
          if (currentLevel === "Complex") {
            const newWrongStreak = (wrongStreak ?? 0) + 1;
            setWrongStreak?.(newWrongStreak);

            if (newWrongStreak >= 2) {
              setCorrectStreak(0);
              setWrongStreak(0);
              const prevLevel = getPreviousLevel(currentLevel);
              setCurrentLevel(prevLevel);
            }
          } else {
            setCorrectStreak(0);
            const prevLevel = getPreviousLevel(currentLevel);
            setCurrentLevel(prevLevel);
          }
        }

        // console.log(currentLevel);
        // console.log(correctStreak);

        const nextQuestion = getNextAdaptiveQuestion(currentLevel);
        const totalQuestionsAnswered = adaptiveProgression.length;

        // console.log(nextQuestion);

        if (totalQuestionsAnswered >= maxQuestions || !nextQuestion) {
          handleSubmit();
        } else {
          const { catIdx, qIdx } = nextQuestion;
          setCurrentCategoryIndex(catIdx);
          setCurrentQuestionIndex(qIdx);

          setAdaptiveProgression((prev) => [...prev, { catIdx, qIdx }]);
          setVisitedQuestions((prev) => new Set(prev).add(`${catIdx}-${qIdx}`));
        }
      } catch (err) {
        console.error("Adaptive evaluation failed:", err);
      }
    } else {
      goToNext();
    }
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

    if (isAdaptive) {
      if (!interviewDuration) {
        return;
      }
      const maxQuestions = interviewDuration / 2;
      if (adaptiveProgression.length >= maxQuestions) {
        handleSubmit();
        return;
      }

      moveToNextQuestion();
    } else {
      if (currentQuestionIndex < category.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (currentCategoryIndex < parsedData!.categories.length - 1) {
        setCurrentCategoryIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        handleSubmit();
      }
    }
  };

  const handleQuestionJump = (catIdx, qIdx) => {
    if (isAdaptive) return;

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

  const getAskedParsedData = () => {
    if (!parsedData || !adaptiveProgression.length) return parsedData;

    const askedCategories: Category[] = parsedData.categories.map((cat) => ({
      ...cat,
      questions: [],
    }));

    adaptiveProgression.forEach(({ catIdx, qIdx }) => {
      const question = parsedData.categories[catIdx].questions[qIdx];
      if (question) {
        askedCategories[catIdx].questions.push(question);
      }
    });

    return {
      ...parsedData,
      categories: askedCategories,
    };
  };

  const getAdaptiveUserResponses = (
    adaptiveProgression: { catIdx: number; qIdx: number }[],
    allResponses: string[][]
  ): string[][] => {
    const result: string[][] = [];
    const tracker: Record<number, number> = {};

    adaptiveProgression.forEach(({ catIdx, qIdx }) => {
      if (!result[catIdx]) {
        result[catIdx] = [];
        tracker[catIdx] = 0;
      }

      const userAnswer = allResponses[catIdx]?.[qIdx] || "";

      result[catIdx][tracker[catIdx]] = userAnswer;
      tracker[catIdx] += 1;
    });

    return result;
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const filteredParsedData = isAdaptive ? getAskedParsedData() : parsedData;
    const finalUserResponses = isAdaptive
      ? getAdaptiveUserResponses(adaptiveProgression, userResponses)
      : userResponses;

    evaluateInterviewResponses({
      parsedData: filteredParsedData,
      userResponses: finalUserResponses,
      brJobId,
      brInterviewId,
      sessionType,
      getUserAnswerFromAi,
      updateByIdDataInTable,
      openSnackBar,
      setLoading,
      jobsData,
      roundData
    });
  };

  const question =
    parsedData?.categories[currentCategoryIndex].questions[
      currentQuestionIndex
    ];

  const isLastQuestion =
    parsedData &&
    currentCategoryIndex === parsedData.categories.length - 1 &&
    currentQuestionIndex ===
      parsedData.categories[currentCategoryIndex].questions.length - 1;

  return (
    <Box
      className="full-screen-div"
      p={4}
      sx={{
        minHeight: "100vh",
        position: "relative",
      }}
      onContextMenu={preventContextMenu}
    >
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
      >
        <ExamSessionVideoCamBox
          onProctoringError={setProctoringError}
          onProctoringReady={(ready) => setProctoringInitialized(ready)}
        />
      </Box>

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

      {proctoringError && (
        <Typography
          align="center"
          sx={{ color: "#ff5252", mt: 2, fontSize: "14px" }}
        >
          {proctoringError}
        </Typography>
      )}

      <Typography variant="h4" align="center" mt={6}>
        Written Interview
      </Typography>
      {!isAdaptive && (
        <Typography variant="h6" align="center">
          Category(C):{" "}
          <span style={{ fontFamily: "montserrat-regular" }}>
            {" "}
            {parsedData?.categories[currentCategoryIndex].name}{" "}
          </span>
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
        <Box mt={2} sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            mt={2}
            mb={2}
            fontFamily={"montserrat-regular"}
          >
            <span
              style={{ color: color.newFirstColor, fontFamily: "custom-bold" }}
            >
              {isAdaptive
                ? `Q${adaptiveProgression.length}`
                : `C${currentCategoryIndex + 1}-Q${currentQuestionIndex + 1}`}
              :{" "}
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
            justifyContent={isAdaptive ? "flex-end" : "space-between"}
            gap={2}
            flexWrap="wrap"
          >
            {parsedData && !isAdaptive && !isLastQuestion && (
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
                {loading ? (
                  <>
                      Submitting Interview
                    <CircularProgress
                      color="inherit"
                      style={{ marginLeft: "4px" }}
                      size={18}
                    />
                  </>
                ) : (
                  <>
                    {isLastQuestion ||
                     (isAdaptive && adaptiveProgression.length === maxQuestions)
                      ? "Submit"
                      : "Next"}
                  </>
                )}
              </BeyondResumeButton>
            )}
          </Box>
        </Box>

        <Box
          mt={2}
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
          <TimerDisplay totalSeconds={timeLeft} />
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
          {isAdaptive
            ? [...Array(maxQuestions)].map((_, index) => {
                const { catIdx, qIdx } = adaptiveProgression[index] || {};
                const key = `${catIdx}-${qIdx}`;
                const isActive =
                  catIdx === currentCategoryIndex &&
                  qIdx === currentQuestionIndex;
                const isAnswered =
                  catIdx !== undefined &&
                  qIdx !== undefined &&
                  (userResponses[catIdx]?.[qIdx] || "").trim() !== "";

                return (
                  <Box
                    // key={key}
                    onClick={() => handleQuestionJump(catIdx, qIdx)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: isActive
                        ? "transparent"
                        : isAnswered
                        ? color.activeColor
                        : "transparent",
                      color: isActive
                        ? color.activeColor
                        : isAnswered
                        ? "white"
                        : "inherit",
                      opacity: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "default",
                      fontWeight: "bold",
                      fontFamily: "montserrat-regular",
                      border: "solid 1.5px",
                      borderColor:
                        isActive || isAnswered ? color.activeColor : "#717680",
                    }}
                  >
                    {index + 1}
                  </Box>
                );
              })
            : parsedData?.categories.map((cat, catIdx) =>
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
                        color: isActive
                          ? color.activeColor
                          : isAnswered
                          ? "white"
                          : "inherit",
                        pointerEvents: isVisited ? "auto" : "none",
                        opacity: isVisited || isActive ? 1 : 0.3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontFamily: "montserrat-regular",
                        border: "solid 1.5px",
                        borderColor:
                          isActive || isAnswered
                            ? color.activeColor
                            : "#717680",
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
        onConfirm={async () => {
          setPopupOpen(false);
          handleSubmit();
        }}
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

      <ConfirmationPopup
        open={popupOpen2}
        onClose={() => setPopupOpen2(false)}
        onConfirm={() => {
          setPopupOpen2(false);
          handleSubmit();
        }}
        disableOutsideClose={true}
        color="#f65050ff"
        message="Unusual activity has been detected."
        warningMessage="Your responses will now be submitted, and you will not be able to re-enter the exam."
        yesText="Okay"
        noText="No"
        noButton={false}
        icon={
          <FontAwesomeIcon
            color="#f65050ff"
            fontSize="68px"
            style={{ marginTop: "16px", marginBottom: "-8px" }}
            icon={faInfoCircle}
          />
        }
      />
      <BeyondResumeLoader open={!proctoringInitialized} progress={progress} />
    </Box>
  );
};

export default ExamSessionWritten;

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
  isAdaptive?: boolean;
  jobsData?: any;
  roundData?: any;
}
