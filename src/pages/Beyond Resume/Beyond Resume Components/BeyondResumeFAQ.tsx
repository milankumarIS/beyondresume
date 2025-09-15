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
import { getUserRole } from "../../../services/axiosClient";

const jobSeekerFaqs = [
  {
    question: "What is Beyond Resume for job seekers?",
    answer:
      "Beyond Resume helps job seekers practice real AI-driven interviews, get instant feedback, and improve their chances of landing jobs.",
  },
  {
    question: "Can I apply for real jobs on Beyond Resume?",
    answer:
      "Yes, you can explore job postings from companies and apply directly through Beyond Resume.",
  },
  {
    question: "What types of interviews can I practice?",
    answer:
      "You can practice AI-driven interviews in two modes: text-based and video-based.",
  },
  {
    question: "How does the AI evaluate my performance?",
    answer:
      "Our AI analyzes your clarity, confidence, communication skills, and job relevance to generate scores and feedback.",
  },
  {
    question: "Is my interview data secure?",
    answer:
      "Yes, all your interview data and responses are kept private and secure, visible only to you and recruiters you apply to.",
  },
  {
    question: "Can I create a custom job description to practice?",
    answer:
      "Yes, you can enter any custom JD, and the AI will generate relevant interview questions for practice.",
  },
  {
    question: "Will I know if I am suitable for a role?",
    answer:
      "Yes, Beyond Resume categorizes your performance to indicate whether you are suitable for the role.",
  },
  {
    question: "Do I get unlimited practice sessions?",
    answer:
      "You can practice as many times as you want, depending on your chosen plan.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes, Beyond Resume provides performance history so you can see how you’re improving across interviews.",
  },
  {
    question: "Is Beyond Resume free for job seekers?",
    answer:
      "We offer both free practice sessions and premium plans with advanced feedback and unlimited interviews.",
  },
];

const recruiterFaqs = [
  {
    question: "What is Beyond Resume for recruiters?",
    answer:
      "Beyond Resume helps recruiters post jobs, generate AI-powered job descriptions, and evaluate candidates using AI-driven interviews.",
  },
  {
    question: "How do I create a job post?",
    answer:
      "Simply provide basic details, and Beyond Resume will generate a polished AI job description instantly.",
  },
  {
    question: "Can Beyond Resume generate interview questions automatically?",
    answer:
      "Yes, based on the job description and evaluation criteria, AI generates structured interview questions for candidates.",
  },
  {
    question: "How does candidate evaluation work?",
    answer:
      "The AI evaluates responses from candidates in both video and text interviews, scoring them against your criteria.",
  },
  {
    question: "Can I customize the evaluation criteria?",
    answer:
      "Yes, you can set your own evaluation parameters, and the AI tailors its scoring to match them.",
  },
  {
    question: "Is it possible to review candidate performance?",
    answer:
      "Yes, recruiters can see AI-generated scores, feedback, and performance reports for every applicant.",
  },
  {
    question: "How does this save my hiring time?",
    answer:
      "Beyond Resume pre-screens candidates using AI, helping you shortlist top talent quickly without manual effort.",
  },
  {
    question: "Can multiple team members collaborate on recruitment?",
    answer:
      "Yes, recruiters can invite their team to view candidates, share notes, and make collaborative decisions.",
  },
  {
    question: "Is Beyond Resume secure for candidate data?",
    answer:
      "Yes, all candidate data is encrypted and securely stored, ensuring compliance with data protection standards.",
  },
  {
    question: "Do recruiters need technical knowledge to use Beyond Resume?",
    answer:
      "Not at all! The platform is designed to be user-friendly, so you can focus on hiring while AI handles the complexity.",
  },
];

const faqList =
  getUserRole() === "CAREER SEEKER" ? jobSeekerFaqs : recruiterFaqs;

const BeyondResumeFAQ = () => {
  return (
    <Box mx="auto" my={5} px={4}>
      <Typography
        sx={{
          fontFamily: "Custom-Bold",
          width: "fit-content",
          p: 2,
          borderRadius: "12px",
          m: "auto",
          textAlign: "center",
          fontSize: { xs: "32px", md: "48px" },
        }}
        fontWeight="bold"
      >
        Frequently Asked Questions
      </Typography>
      {faqList.map((faq, index) => (
        <Accordion
          key={index}
          style={{
            marginTop: "12px",
            boxShadow: "none",
            background: "transparent",
            // background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
            border: `2px solid`,
            borderRadius: "12px",
            padding: "4px",
            position: "relative",
            overflow: "hidden",
            color: "inherit",
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
                minHeight: "0px",
              },
              "& .MuiAccordionSummary-content.Mui-expanded": {
                margin: 0,
                minHeight: "0px",
              },
              "& .MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded": {
                minHeight: "0px",
              },
            }}
            expandIcon={
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={faChevronDown}
              />
            }
          >
            <Typography fontWeight="medium">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              pt: 0,
            }}
          >
            <Typography>{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default BeyondResumeFAQ;
