import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { getUserAnswerFromAi } from "../../../services/services";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";


const AIProfileInterview = (open) => {
  if (!open) return null;

  const [step, setStep] = useState<number>(-1);
  const [answers, setAnswers] = useState<{
    [key: string]: { [key: string]: string };
  }>({});
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const current = QUESTIONS[step];

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognitionAPI();

    if (!SpeechRecognitionAPI) return alert("Not supported");

    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    recognition.onerror = console.error;
    recognition.start();
  };

  const handleNext = () => {
    if (userInput.trim()) {
      const autoCaptured = current.captures.reduce((acc, field, index) => {
        acc[field] = index === 0 ? userInput.trim() : "";
        return acc;
      }, {} as Record<string, string>);

      setAnswers((prev) => ({
        ...prev,
        [current.section]: {
          ...(prev[current.section] || {}),
          ...autoCaptured,
        },
      }));
    }

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      setUserInput("");
    } else if (step === QUESTIONS.length - 1) {
      setStep(step + 1);
      handleSubmit();
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [current.section]: {
        ...(prev[current.section] || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const context = Object.entries(answers)
      .flatMap(([sec, obj]) =>
        Object.entries(obj).map(([k, v]) => `${k}: ${v}`)
      )
      .join("\n");

    const res = await getUserAnswerFromAi({
      question: `Build a profile with the following:\n${context} in a proper json format`,
    });

    const finalAIProfile =
      res?.data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    setAiResponse(finalAIProfile);
  };

  useEffect(() => {
    if (step >= 0 && step < QUESTIONS.length) {
      const question = QUESTIONS[step].question;
      speakText(question);
    }
  }, [step]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.21)",
        backdropFilter: "blur(4px)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              width: { xs: "90vw", sm: "600px" },
              maxHeight: "80vh",
              // minHeight: "300px",
              overflowY: "auto",
              p: 4,
              borderRadius: 4,
              background: color.background2,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              boxShadow: "0 8px 32px 0 rgba(11, 14, 48, 0.37)",
            }}
          >
            {step === -1 && (
              <>
                <Typography variant="h4" align="center" mb={2}>
                  Welcome to your AI Profile Builder
                </Typography>
                <Typography align="center" mb={4}>
                  You'll be asked a series of friendly questions to help build
                  your profile.
                </Typography>
                <Box textAlign="center">
                  <BeyondResumeButton
                    variant="contained"
                    onClick={() => setStep(0)}
                  >
                    Start
                  </BeyondResumeButton>
                </Box>
              </>
            )}

            {step >= 0 && step < QUESTIONS.length && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {current.question}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(211, 211, 211, 0.58)",
                    fontSize: "14px",
                  }}
                  gutterBottom
                >
                  ({current.suggestion})
                </Typography>

                <BeyondResumeButton
                  variant="outlined"
                  onClick={startRecording}
                  disabled={isSpeaking}
                  sx={{ m: "auto", display: "block", my: 4, mt: 3 }}
                >
                  Speak your answer
                </BeyondResumeButton>

                <AnimatePresence mode="wait">
                  {userInput && (
                    <motion.div
                      key="textField"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        sx={{
                          ...commonFormTextFieldSx,
                          mb: 3,
                          borderRadius: "12px",
                          transition: "all 0.3s",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* {current.captures.map((field) => (
                  <TextField
                    fullWidth
                    label={field}
                    value={answers?.[current.section]?.[field] || ""}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    sx={{ ...commonFormTextFieldSx, mb: 2 }}
                    key={field}
                  />
                ))} */}

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <BeyondResumeButton
                    variant="contained"
                    onClick={handleNext}
                    disabled={!userInput.trim()}
                  >
                    {step === QUESTIONS.length - 1 ? "Finish" : "Next"}
                  </BeyondResumeButton>
                </Box>
              </Box>
            )}

            {step === QUESTIONS.length && aiResponse && (
              <>
                <Typography variant="h5" mb={2}>
                  Final Profile Preview
                </Typography>
                {aiResponse}

                {/* <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  Generate AI Summary
                </Button> */}
              </>
            )}
          </Paper>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default AIProfileInterview;

const QUESTIONS = [
  {
    section: "Personal & Contact Information",
    question:
      "Tell me a bit about yourself - what should I call you, and how can we stay in touch?",
    captures: ["Name", "Email", "Phone"],
    suggestion: "State your name, email address, and phone number.",
  },
  {
    section: "Personal & Contact Information",
    question:
      "I'd love to know more about your background - where are you originally from, and where do you call home now?",
    captures: ["Location", "Background"],
    suggestion:
      "Mention your birthplace, current residence, and any cultural or personal background you'd like to share.",
  },
  {
    section: "Personal & Contact Information",
    question:
      "What's your story? When did your journey begin, and what has shaped who you are today?",
    captures: ["Date of birth", "Personal background"],
    suggestion:
      "Provide your date of birth and share key moments or influences in your life.",
  },
  {
    section: "Personal & Contact Information",
    question:
      "How would you describe yourself to someone you're meeting for the first time?",
    captures: ["Gender", "Personality traits"],
    suggestion:
      "Include your gender (if you’re comfortable) and a few words about your personality.",
  },
  {
    section: "Personal & Contact Information",
    question:
      "What does your support system look like? Do you have family or close relationships that influence your career decisions?",
    captures: ["Relationship status", "Family influence"],
    suggestion:
      "Describe your relationship status and how your family or close ones affect your career path.",
  },
  {
    section: "Personal & Contact Information",
    question:
      "If someone wanted to connect with you professionally, what's the best way to reach out?",
    captures: ["Preferred communication methods", "Professional contact"],
    suggestion:
      "Share your preferred way of communication (email, phone, LinkedIn, etc.).",
  },

  {
    section: "Professional Background",
    question:
      "What gets you excited to wake up every morning? Tell me about what you're currently working on.",
    captures: ["Current position", "Job satisfaction"],
    suggestion: "Mention your current role and what you enjoy about it.",
  },
  {
    section: "Professional Background",
    question:
      "What's the proudest academic achievement that laid the foundation for where you are today?",
    captures: ["Highest qualification", "Graduation details"],
    suggestion:
      "State your highest qualification and the institution and year of graduation.",
  },
  {
    section: "Professional Background",
    question:
      "If you could design your ideal work situation, what would it look like in terms of environment and commitment?",
    captures: ["Preferred location", "Employment type"],
    suggestion:
      "Describe your ideal job setting and whether you prefer full-time, part-time, or remote work.",
  },
  {
    section: "Professional Background",
    question:
      "What's the most challenging project you've tackled, and how did it change your perspective on your career?",
    captures: ["Experience level", "Project complexity"],
    suggestion:
      "Briefly explain your experience level and a complex project you handled.",
  },
  {
    section: "Professional Background",
    question:
      "How has your educational journey prepared you for the professional world you're in now?",
    captures: ["Academic timeline", "Relevance to career"],
    suggestion: "Outline your education path and how it's helped your career.",
  },
  {
    section: "Professional Background",
    question:
      "When you think about your professional identity, what role or industry feels most like 'home' to you?",
    captures: ["Industry preference", "Professional identity"],
    suggestion:
      "Mention the industry and role where you feel you truly belong.",
  },

  {
    section: "Skills & Expertise",
    question:
      "What comes naturally to you? What skills do people often come to you for help with?",
    captures: ["Core skills", "Expertise areas"],
    suggestion:
      "List your top strengths or skills that people recognize in you.",
  },
  {
    section: "Skills & Expertise",
    question:
      "Tell me about a project you're genuinely proud of - what made it special and what role did you play?",
    captures: ["Project details", "Technical involvement"],
    suggestion:
      "Describe a project you’re proud of and your key contributions to it.",
  },
  {
    section: "Skills & Expertise",
    question:
      "What accomplishments or recognitions have meant the most to you in your journey so far?",
    captures: ["Certifications", "Achievements"],
    suggestion:
      "List important certifications, awards, or accomplishments you've earned.",
  },
  {
    section: "Skills & Expertise",
    question:
      "When you're not working, what activities or interests keep you engaged and energized?",
    captures: ["Hobbies", "Personal interests"],
    suggestion: "Mention hobbies or passions you pursue in your free time.",
  },
  {
    section: "Skills & Expertise",
    question:
      "If you had to teach someone else what you know, what would be your top areas of expertise?",
    captures: ["Technical skills", "Knowledge depth"],
    suggestion:
      "Identify the areas or skills you’re most confident teaching others.",
  },
  {
    section: "Skills & Expertise",
    question:
      "What languages do you speak, and have you found them useful in your professional life?",
    captures: ["Language skills", "Communication abilities"],
    suggestion:
      "List languages you know and how they’ve helped in your work life.",
  },

  {
    section: "Career Preferences",
    question:
      "When you imagine your ideal career path, what industry or field excites you the most?",
    captures: ["Industry type preference"],
    suggestion:
      "Mention the industry or sector you’re most interested in working.",
  },
  {
    section: "Career Preferences",
    question:
      "What type of work energizes you? Do you prefer hands-on technical work, leading teams, or something else entirely?",
    captures: ["Functional area preference"],
    suggestion:
      "Describe the type of tasks or responsibilities you enjoy most.",
  },
  {
    section: "Career Preferences",
    question:
      "What would financial success look like for you in your next role?",
    captures: ["Expected CTC range"],
    suggestion: "State your salary expectations or desired compensation range.",
  },
  {
    section: "Career Preferences",
    question:
      "If I asked you where you see yourself in 2-3 years, what story would you tell me?",
    captures: ["Short-term goals"],
    suggestion:
      "Share your career goals or aspirations for the next couple of years.",
  },
  {
    section: "Career Preferences",
    question:
      "What's your bigger vision? What impact do you want to make in your career over the next decade?",
    captures: ["Long-term goals"],
    suggestion:
      "Talk about your long-term ambitions and how you want to make a difference.",
  },
  {
    section: "Career Preferences",
    question:
      "What matters most to you in a workplace - the culture, the challenges, the growth opportunities, or something else?",
    captures: ["Job preferences", "Work values"],
    suggestion: "Highlight what you value most in a job or workplace.",
  },

  {
    section: "Experience Timeline",
    question:
      "Walk me through your career story - what have been the key chapters so far?",
    captures: ["Complete work history", "Timeline"],
    suggestion: "Summarize your job history with roles and durations.",
  },
  {
    section: "Experience Timeline",
    question:
      "How did your educational journey unfold? What were the milestones that got you to where you are?",
    captures: ["Academic timeline", "Progression"],
    suggestion:
      "List key education stages and how they contributed to your growth.",
  },
  {
    section: "Experience Timeline",
    question:
      "What experiences have contributed most to your professional growth over the years?",
    captures: ["Years of experience", "Key learnings"],
    suggestion: "Mention major learning moments and total experience years.",
  },
  {
    section: "Experience Timeline",
    question:
      "Tell me about any internships or early career experiences that shaped your path.",
    captures: ["Internship details", "Early experience"],
    suggestion:
      "Share any internships or early jobs that were meaningful to your career.",
  },
  {
    section: "Experience Timeline",
    question:
      "What has been your career progression like? How have your roles evolved over time?",
    captures: ["Career advancement", "Role progression"],
    suggestion:
      "Explain how you’ve grown and moved into different roles over time.",
  },
  {
    section: "Experience Timeline",
    question:
      "Looking back at your journey, what experiences taught you the most about yourself and your capabilities?",
    captures: ["Significant experiences", "Self-awareness"],
    suggestion:
      "Describe key experiences that shaped your understanding of yourself.",
  },

  {
    section: "Additional Information",
    question:
      "How do you like to present yourself professionally? Are you comfortable being on camera or do you prefer other ways to showcase your personality?",
    captures: ["Profile picture/video preferences"],
    suggestion:
      "Mention if you prefer video profiles, photos, or other formats for self-presentation.",
  },
  {
    section: "Additional Information",
    question:
      "What would make a job opportunity irresistible to you? What are your non-negotiables?",
    captures: ["Job preferences", "Requirements"],
    suggestion: "List the must-have aspects of your ideal job.",
  },
  {
    section: "Additional Information",
    question:
      "Who in your network would vouch for your work? Have you received feedback that particularly resonates with you?",
    captures: ["Endorsements", "Recommendations"],
    suggestion:
      "Share names or types of people who’d recommend you and any memorable feedback.",
  },
  {
    section: "Additional Information",
    question:
      "How do you stay connected with your professional community? What platforms or methods work best for you?",
    captures: ["Professional networking preferences"],
    suggestion:
      "List networking platforms you use (e.g., LinkedIn) or events you attend.",
  },
  {
    section: "Additional Information",
    question:
      "What unique value do you bring to a team or organization that sets you apart?",
    captures: ["Unique selling points", "Differentiators"],
    suggestion: "Describe what makes you stand out professionally.",
  },
  {
    section: "Additional Information",
    question:
      "If you could give advice to someone starting in your field, what would you tell them based on your experience?",
    captures: ["Industry insights", "Experience depth"],
    suggestion:
      "Share one or two pieces of advice based on your field experience.",
  },
];
