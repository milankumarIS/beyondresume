import {
  faArrowCircleRight,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useSnackbar } from "../../components/shared/SnackbarProvider";
import { updateByIdDataInTable } from "../../services/services";

interface GeneratedAiQnaResponseProps {
  response: string;
  jobId?: string | null;
  status?: string | null;
}

const GeneratedAiQnaResponse: React.FC<GeneratedAiQnaResponseProps> = ({
  response,
  jobId,
  status,
}) => {
  const location = useLocation();
  const [hasParseError, setHasParseError] = useState(false);

  const isJobPage = location.pathname.startsWith("/beyond-resume-jobdetails/");
  // console.log(status);

  const processedResponse = response
    .replace(/\*\*(.*?)\*\*/g, "")
    .replace(/^```html\s*|\s*```$/g, "")
    .replace(/^```json\s*|\s*```$/g, "")
    .trim()
    .replace(/(?<!\*)\*(?!\*)/g, "<br/>");

  // console.log(processedResponse)

  const [editorContent, setEditorContent] = useState(processedResponse);

  const [displayContent, setDisplayContent] = useState(processedResponse);
  const openSnackBar = useSnackbar();
  const history = useHistory();

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);

  // console.log(editorContent)

  const handleSave = () => {
    try {
      const cleanedContent = editorContent.replace(/<[^>]*>?/gm, "").trim();

      // console.log(cleanedContent)

      const parsed = JSON.parse(cleanedContent);

      // console.log(parsed)

      const formatted = `<pre>${JSON.stringify(parsed, null, 2)}</pre>`;

      // console.log(formatted)

      setDisplayContent(formatted);
      setEditorContent(formatted);

      updateByIdDataInTable(
        "brJobs",
        jobId,
        { jobInterviewQuestions: formatted },
        "brJobId"
      );

      setIsEditing(false);
    } catch (err) {
      openSnackBar("Invalid JSON. Please check the format.");
      console.error("Invalid JSON:", err);
    }
  };

  const handleClick = async () => {
    try {
      updateByIdDataInTable(
        "brJobs",
        jobId,
        {
          brJobStatus: "ACTIVE",
        },
        "brJobId"
      )
        .then((result: any) => {
          openSnackBar(result?.data)?.msg;
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    } catch (error) {
      console.error("Error generating interview questions:", error);
    } finally {
      window.location.href = "/beyond-resume-myjobs";
    }
  };
  return (
    <Box m={4} id="questionSection">
      <Typography
        sx={{
          background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
          width: "fit-content",
          color: "white",
          p: 2,
          mb: 4,
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
        }}
        variant="h6"
      >
        Generated AI Question Answer:
      </Typography>

      <Box
        p={3}
        pt={2}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.16)",
          color: "black",
          position: "relative",
        }}
      >
        {(!isJobPage || (isJobPage && status === "INPROGRESS")) && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              position: "absolute",
              top: 20,
              right: 20,
            }}
          >
            <Button
              variant="outlined"
              onClick={isEditing ? handleSave : handleEdit}
              sx={{
                color: "white",
                textTransform: "none",
                background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                borderRadius: "44px",
              }}
            >
              {isEditing ? "Save" : "Edit"}
              <FontAwesomeIcon
                icon={isEditing ? faSave : faEdit}
                style={{ marginLeft: 8 }}
              />
            </Button>
          </Box>
        )}

        {isEditing ? (
          <Box mt={8}>
            <textarea
              style={{
                width: "100%",
                minHeight: "400px",
                fontFamily: "monospace",
                fontSize: "14px",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="Paste or edit JSON here"
            />
          </Box>
        ) : (
          <HtmlParserExample
            htmlString={displayContent}
            setErrorStatus={setHasParseError}
          />
        )}
      </Box>

      {(!isJobPage || (isJobPage && status === "INPROGRESS")) &&
        !hasParseError && (
          <Button
            onClick={handleClick}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "44px",
              px: 4,
              py: 1,
              mt: 3,
              mx: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: "auto",
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              transition: "all 0.3s",
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                transform: "scale(1.08)",
              },
            }}
          >
            Post Job
            <FontAwesomeIcon
              style={{ marginLeft: "6px" }}
              icon={faArrowCircleRight}
            />
          </Button>
        )}
    </Box>
  );
};

export default GeneratedAiQnaResponse;

interface MCQOption {
  [key: string]: string;
}

interface Question {
  question: string;
  options: MCQOption[];
  answerKey: string;
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

const HtmlParserExample = ({
  htmlString,
  setErrorStatus,
}: {
  htmlString: string;
  setErrorStatus: (hasError: boolean) => void;
}) => {
  let parsedData: TextContent | null = null;

  try {
    const match = htmlString.match(/<pre>\s*([\s\S]*?)\s*<\/pre>/);
    const jsonString = match ? match[1] : null;

    if (jsonString) {
      parsedData = JSON.parse(jsonString);
      setErrorStatus(false); 
    } else {
      setErrorStatus(true);
    }
  } catch (err) {
    console.error("Failed to parse JSON", err);
    setErrorStatus(true); 
  }

  return (
    <div>
      <Typography my={1}>Interview Questions:</Typography>
      {parsedData ? (
        parsedData.categories.map((category, i) => (
          <div key={i}>
            <Typography variant="h5" mb={2}>
              {category.name}
            </Typography>
            {category.questions.map((q, j) => (
              <div key={j} style={{ marginBottom: "2rem" }}>
                <Typography>
                  Q{j + 1}: {q.question}
                </Typography>
                {q.options && q.options.length > 0 && (
                  <ul style={{ padding: 0, margin: "8px", marginLeft: 0 }}>
                    {q.options.map((opt, k) => (
                      <Typography key={k} sx={{ display: "flex", gap: 1 }}>
                        {opt.label}:{" "}
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontFamily: "Montserrat-regular",
                          }}
                        >
                          {opt.text}
                        </Typography>
                      </Typography>
                    ))}
                  </ul>
                )}
                {q?.answerKey && (
                  <Typography sx={{ fontSize: "16px", mt: 0.5 }}>
                    <strong>Answer Key:</strong> {q.answerKey}
                  </Typography>
                )}
                {q?.suggestedAnswer && (
                  <Typography sx={{ fontSize: "16px", mt: 0.5 }}>
                    <strong>Suggested Answer:</strong> {q.suggestedAnswer}
                  </Typography>
                )}
                {q?.sheetName && (
                  <Typography sx={{ fontSize: "16px", mt: 0.5 }}>
                    <strong>Sheet Name:</strong> {q.sheetName}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Error generating interview questions, kindly try again!</p>
      )}
    </div>
  );
};
