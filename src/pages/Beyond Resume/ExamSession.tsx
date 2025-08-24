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
import color from "../../theme/color";
import ExamSessionVideoCamBox, {
  ExamSessionVideoCamBoxHandle,
} from "./Beyond Resume Components/ExamSessionVideoCamBox";
import { evaluateInterviewResponses } from "./Beyond Resume Components/interviewEvaluator";
import BeyondResumeLoader from "./Beyond Resume Components/BeyondResumeLoader";

const ExamSession: React.FC<ExamSessionProps> = ({
  response,
  sessionType,
  brJobId,
  brInterviewId,
  isAdaptive,
  interviewDuration,
  jobsData,
}) => {
  const [parsedData, setParsedData] = useState<TextContent | null>(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // console.log(parsedData);
  // console.log(currentCategoryIndex);
  // console.log(currentQuestionIndex);
  // console.log(parsedData!.categories.length - 1);
  // console.log(parsedData!.categories[currentCategoryIndex].questions
  //                     .length -
  //                     1);

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
  const [popupOpen2, setPopupOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proctoringError, setProctoringError] = useState<string | null>(null);
  const [userLatestResponse, setUserLatestResponse] = useState<string | null>(
    null
  );
  const [proctoringInitialized, setProctoringInitialized] =
    useState<boolean>(false);
  let maxQuestions = 0;
  if (typeof interviewDuration === "number") {
    maxQuestions = interviewDuration / 2;
  }
  const [wrongStreak, setWrongStreak] = useState(0);

  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [adaptiveProgression, setAdaptiveProgression] = useState<
    { catIdx: number; qIdx: number }[]
  >([]);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(
    new Set(["0-0"])
  );
  const videoCamRef = useRef<ExamSessionVideoCamBoxHandle>(null);

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
    const stopSpeech = () => {
      speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", stopSpeech);
    window.addEventListener("popstate", stopSpeech);

    return () => {
      stopSpeech();
      window.removeEventListener("beforeunload", stopSpeech);
      window.removeEventListener("popstate", stopSpeech);
    };
  }, []);

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

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if ((elem as any).webkitRequestFullscreen)
      (elem as any).webkitRequestFullscreen();
    else if ((elem as any).msRequestFullscreen)
      (elem as any).msRequestFullscreen();
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
        alert(`Tab switch detected!`);
        setPopupOpen2(true);
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

  // console.log(brJobId)
  // console.log(brInterviewId)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

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
        setParsedData(data);
        // console.log(data);

        setUserResponses(
          data.categories.map((cat) => Array(cat.questions.length).fill(""))
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

          data.categories.forEach((cat, catIdx) => {
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

  const [categoryIntroSpoken, setCategoryIntroSpoken] = useState(false);

  useEffect(() => {
    if (parsedData && !introSpoken && proctoringInitialized) {
      (async () => {
        {
          isAdaptive
            ? await speakText(
                "Welcome to your virtual interview session. Let's begin with the interview."
              )
            : await speakText(
                "Welcome to your virtual interview session. Let's begin with the first category."
              );
        }

        setIntroSpoken(true);
        speakCurrentQuestion();
      })();
    }
  }, [parsedData, proctoringInitialized]);

  useEffect(() => {
    if (
      parsedData &&
      introSpoken &&
      !questionSpoken &&
      !isSpeaking &&
      proctoringInitialized
    ) {
      speakCurrentQuestion();
    }
  }, [currentCategoryIndex, currentQuestionIndex, proctoringInitialized]);

  const speakCurrentQuestion = async () => {
    const category = parsedData!.categories[currentCategoryIndex];
    const question = category.questions[currentQuestionIndex];

    if (!categoryIntroSpoken) {
      {
        !isAdaptive &&
          (await speakText(`Now starting category ${category.name}`));
      }
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

      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalTranscript = "";

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + " ";
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setUserLatestResponse(finalTranscript.trim());

        if (finalTranscript.trim() !== "") {
          setConversation((prev) => [
            ...prev,
            { speaker: "You", text: finalTranscript.trim() },
          ]);

          const updated = [...userResponses];
          updated[currentCategoryIndex][currentQuestionIndex] =
            finalTranscript.trim();
          setUserResponses(updated);

          recognition.stop();
        }
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
    setQuestionSpoken(false);

    if (!parsedData) return null;

    const updated = [...userResponses];

    if (!updated[currentCategoryIndex][currentQuestionIndex]) {
      updated[currentCategoryIndex][currentQuestionIndex] = "";
    }

    setUserResponses(updated);

    if (isAdaptive) {
      const currentQuestion =
        parsedData.categories[currentCategoryIndex].questions[
          currentQuestionIndex
        ];

      const safeQuestion =
        currentQuestion?.question?.replace(/"/g, '\\"') || "";

      const evalPrompt = `
  You are an AI evaluator. Evaluate the candidate's answer strictly and return ONLY a valid JSON response with the following structure:
  
  {
    "isCorrect": true | false,
  }
  
  Question:
  "${safeQuestion}"
  
  Candidate's Answer:
  "${userLatestResponse}"
  
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

          // console.log(qIdx);

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

  const goToNext = async () => {
    setQuestionSpoken(false);

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
        setCategoryIntroSpoken(false);
      } else {
        await handleSubmit();
        return;
      }
    }
  };

  const skipQuestion = () => {
    const updated = [...userResponses];
    updated[currentCategoryIndex][currentQuestionIndex] = "Skipped";
    setUserResponses(updated);
    moveToNextQuestion();
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
  
  const handleSubmit = async () => {
    setLoading(true);
    


    // let videoLink: string = "";

    try {
      // if (videoCamRef.current) {
      //   try {
      //     const videoBlob = await videoCamRef.current.stopAndGetRecording();

      //     if (videoBlob) {
      //       const formData = new FormData();
      //       const videoFile = new File([videoBlob], "video.webm", {
      //         type: "video/webm",
      //       });

      //       formData.append("file", videoFile);
      //       const result = await UploadAuthFile(formData);
      //       // console.log(result);

      //       videoLink = result?.data?.data?.location || "";
      //       console.log(videoLink);
      //     }
      //   } catch (videoUploadError) {
      //     console.warn("Video upload failed:", videoUploadError);
      //   }
      // }

      const filteredParsedData = isAdaptive ? getAskedParsedData() : parsedData;
      const finalUserResponses = isAdaptive
        ? getAdaptiveUserResponses(adaptiveProgression, userResponses)
        : userResponses;

      await evaluateInterviewResponses({
        parsedData: filteredParsedData,
        userResponses: finalUserResponses,
        brJobId,
        brInterviewId,
        sessionType,
        getUserAnswerFromAi,
        updateByIdDataInTable,
        openSnackBar,
        setLoading,
        redirectToSuccess: true,
        jobsData,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="full-screen-div" p={4}>
      <BeyondResumeButton
        variant="outlined"
        onClick={() => setPopupOpen(true)}
        disabled={isSpeaking || isRecording || loading}
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

      {proctoringError && (
        <Typography
          align="center"
          sx={{ color: "#ff5252", mt: 2, fontSize: "14px" }}
        >
          {proctoringError}
        </Typography>
      )}

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
          ref={videoCamRef}
          isSpeaking={isSpeaking}
          isRecording={isRecording}
          onProctoringError={setProctoringError}
          onProctoringReady={(ready) => setProctoringInitialized(ready)}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 300,
            background: color.cardBg,
            p: 2,
            borderRadius: 2,
            maxHeight: 350,
            overflowY: "auto",
          }}
          className="custom-scrollbar"
        >
          <Typography my={2} mt={0} align="left" variant="h5">
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
                    // boxShadow: '0px 0px 10px',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontWeight: "bold",
                      // fontFamily: "montserrat-regular",
                      mb: 0.5,
                    }}
                  >
                    {entry.speaker}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "montserrat-regular",
                    }}
                    variant="body2"
                  >
                    {entry.text}
                  </Typography>
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
          disabled={isSpeaking || isRecording || !questionSpoken || loading}
          onClick={startRecording}
        >
          Start Answering
        </BeyondResumeButton>

        {parsedData && (
          <>
            {loading ? (
              <BeyondResumeButton>
                Submitting Interview
                <CircularProgress
                  color="inherit"
                  style={{ marginLeft: "4px" }}
                  size={18}
                />
              </BeyondResumeButton>
            ) : (
              <BeyondResumeButton
                variant="contained"
                color="success"
                disabled={isSpeaking || isRecording || loading}
                onClick={moveToNextQuestion}
              >
                {(currentCategoryIndex === parsedData.categories.length - 1 &&
                  currentQuestionIndex ===
                    parsedData.categories[currentCategoryIndex].questions
                      .length -
                      1) ||
                (isAdaptive && adaptiveProgression.length === maxQuestions)
                  ? "Submit"
                  : "Next Question"}
              </BeyondResumeButton>
            )}
          </>
        )}

        {!isAdaptive && (
          <BeyondResumeButton
            variant="outlined"
            disabled={isSpeaking || isRecording || loading}
            onClick={skipQuestion}
            sx={{ background: "transparent", color: "inherit" }}
          >
            Skip{" "}
            <FontAwesomeIcon
              style={{ marginLeft: "10px" }}
              icon={faChevronRight}
            ></FontAwesomeIcon>
          </BeyondResumeButton>
        )}

        {/* <BeyondResumeButton
          variant="outlined"
          onClick={handleSubmit}
          sx={{ background: "transparent", color: "inherit" }}
        >
          Submit{" "}
          <FontAwesomeIcon
            style={{ marginLeft: "10px" }}
            icon={faChevronRight}
          ></FontAwesomeIcon>
        </BeyondResumeButton> */}

        <ConfirmationPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          onConfirm={async () => {
            setPopupOpen(false);
            await handleSubmit();
          }}
          color={"#50bcf6"}
          message="Are you sure you want to leave?"
          warningMessage="Exiting now will submit your answers. You won’t be able to return to this interview session."
          yesText="Submit & Exit"
          noText="Stay & Continue"
          icon={
            <FontAwesomeIcon
              color={"#0b8bb8"}
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
      </Box>
      <BeyondResumeLoader open={!proctoringInitialized} progress={progress} />
    </Box>
  );
};

export default ExamSession;

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
  brJobId?: number;
  brInterviewId?: number;
  interviewDuration?: number;
  isAdaptive?: boolean;
  jobsData?: any;
}
