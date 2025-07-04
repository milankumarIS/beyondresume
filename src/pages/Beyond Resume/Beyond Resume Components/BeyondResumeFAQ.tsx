import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const faqList = [
  {
    question: "What is this platform used for?",
    answer:
      "Our platform helps companies post jobs with AI-generated descriptions and interview questions, and allows candidates to apply and attend AI-evaluated written or voice-based interviews.",
  },
  {
    question: "How does the AI generate job descriptions and questions?",
    answer:
      "The AI analyzes your input (such as job title, skills, and requirements) and generates a complete JD along with relevant, role-specific interview questions. You can modify them before publishing.",
  },
  {
    question: "What interview formats are supported?",
    answer:
      "We support two formats: Web-based written interviews and Voice-based interviews. Candidates can answer in real-time, and AI will score them automatically.",
  },
  {
    question: "Can candidates practice interviews?",
    answer:
      "Yes, candidates can take mock interviews using their resume or a selected job description. They’ll get AI-generated questions and performance analytics based on their answers.",
  },
  {
    question: "How is the interview scored?",
    answer:
      "The AI evaluates answers using natural language understanding, assessing factors like relevance, accuracy, communication, and completeness. Scores are instantly available.",
  },
  {
    question: "Is the platform free to use?",
    answer:
      "Yes, basic usage is free. Advanced features like multiple job posts, voice interviews, and in-depth analytics are available via affordable subscription plans.",
  },
  {
    question: "Can I trust AI to evaluate candidates?",
    answer:
      "Yes. Our AI models are trained to fairly assess language, logic, and relevance. For transparency, both candidates and recruiters can view scoring breakdowns.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We follow industry best practices and compliance standards to keep your data safe. Resume data, interview content, and analytics are encrypted and private.",
  },
];

const BeyondResumeFAQ = () => {
  return (
    <Box mx="auto" my={5} px={4}>
      <Typography 
        variant="h3"
        sx={{
          fontFamily: "Custom-Bold",
          color: "black",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
        }}
        fontWeight="bold">
        Frequently Asked Questions
      </Typography>
      {faqList.map((faq, index) => (
        <Accordion
          key={index}
          style={{
            marginTop: "12px",
            boxShadow: "none",
            background:'transparent',
            // background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
            border: `2px solid black`,
            borderRadius: "12px",
            color: "white",
            padding: "4px",
            position: "relative",
            overflow: "hidden",
          }}
          sx={{
            "&.MuiAccordion-root::before": {
              content: '""',
              height: "0px",
            },
          }}
          elevation={1}
        >
          <AccordionSummary
            sx={{
              "& .MuiAccordionSummary-content": {
                margin: 0,
                minHeight:'0px'

              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0,
                minHeight:'0px'
              },
              "& .MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded": {
                minHeight: 0,

              },
            }}
            expandIcon={
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={faChevronDown}
              />
            }
          >
            <Typography fontWeight="medium" color="black">
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BeyondResumeFAQ;
