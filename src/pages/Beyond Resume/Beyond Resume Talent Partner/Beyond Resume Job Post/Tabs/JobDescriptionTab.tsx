import {
  faChevronCircleRight,
  faCopy,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { copyToClipboard } from "../../../../../components/shared/Clipboard";
import { useSnackbar } from "../../../../../components/shared/SnackbarProvider";
import { normalizeHTMLToText } from "../../../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  CustomToggleButton,
  CustomToggleButtonGroup,
  StyledTypography,
} from "../../../../../components/util/CommonStyle";
import QuillInputEditor from "../../../../../components/util/QuilInputEditor";
import { getUserRole } from "../../../../../services/axiosClient";
import {
  getUserAnswerFromAiThroughPdf,
  searchDataFromTable,
  updateByIdDataInTable,
  UploadAuthFile,
} from "../../../../../services/services";
import color from "../../../../../theme/color";
import FileUpload from "../../../Beyond Resume Components/FileUpload";

interface JobDescriptionTabProps {
  response: string;
  onSave?: (updatedContent: string) => void;
  jobId?: string | null;
  onJobUpdate?: () => void;
  onNext: () => void;
}

const JobDescriptionTab: React.FC<JobDescriptionTabProps> = ({
  response,
  onSave,
  jobId,
  onJobUpdate,
  onNext,
}) => {
  const location = useLocation();
  const isJobPage = location.pathname.startsWith("/beyond-resume-jobs");

  const [generatedJd, setGeneratedJd] = useState(response);
  const [editorContent, setEditorContent] = useState("");
  const [displayContent, setDisplayContent] = useState("");

  useEffect(() => {
    setGeneratedJd(response);
  }, [response]);

  useEffect(() => {
    const cleanedResponse = generatedJd
      .replace(/^```html\s*|\s*```$/g, "")
      .trim();

      // console.log(cleanedResponse);
      

    setEditorContent(cleanedResponse);
    setDisplayContent(cleanedResponse);
  }, [generatedJd]);

  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const history = useHistory();
  const openSnackBar = useSnackbar();

  const [jd, setJd] = useState<File | null>(null);
  const [addJd, setAddJd] = useState(false);
  const [jobStatus, setJobStatus] = useState("");
  const [loading1, setLoading1] = useState(false);

  // Move generateFromFile outside useEffect so you can call it on button click
  const generateFromFile = async () => {
    if (!jd) return;
    setLoading1(true);

    try {
      const formData = new FormData();
      formData.append("file", jd);
      const result = await UploadAuthFile(formData);
      const jdLink = result?.data?.data?.location;
      if (!jdLink) throw new Error("Resume upload failed. No link returned.");

      const prompt =
        `Here I'm attaching a job description link. From the linked PDF, extract the text and give the response in plain innerHTML. 
        Make it look good with by adding HTML Tags`.replace(/\s+/g, " ");

      const res = await getUserAnswerFromAiThroughPdf({
        question: prompt,
        urls: [jdLink],
      });
      const rawText =
        res?.data?.data?.candidates[0]?.content?.parts[0].text || "";
      setGeneratedJd(rawText);

      const cleaned = rawText
        .replace(/^```html\s*|\s*```$/g, "")
        .replace(/<p><br><\/p>/g, "")
        .replace(/<p>\s*<\/p>/g, "")
        .trim();

      updateByIdDataInTable(
        "brJobs",
        jobId,
        { jobDescriptions: cleaned },
        "brJobId"
      );

      setTimeout(() => {
        document
          .getElementById("jdSection")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } catch (err) {
      console.error("JD extraction failed", err);
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    const getStatus = async () => {
      const existingRecords = await searchDataFromTable("brJobs", {
        brJobId: jobId,
      });

      setJobStatus(existingRecords?.data?.data?.brJobStatus);
    };
    getStatus();
  }, []);

  const handleCopy = async () => {
    try {
      const normalizedText = normalizeHTMLToText(displayContent);
      await copyToClipboard(normalizedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      openSnackBar("Job description copied to clipboard!");
    } catch (error) {
      console.error(error);
      openSnackBar("Failed to copy. Please try again.");
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const cleaned = editorContent
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p>\s*<\/p>/g, "");

    setDisplayContent(cleaned);
    setIsEditing(false);
    onSave?.(cleaned);

    updateByIdDataInTable(
      "brJobs",
      jobId,
      { jobDescriptions: cleaned },
      "brJobId"
    )
      .then((result: any) => {
        openSnackBar(result?.data?.msg);
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  return (
    <Box id="responseSection">
      <Dialog
        open={addJd}
        sx={{
          "& .MuiDialog-paper": {
            p: 2,
            px: 5,
            borderRadius: "32px",
            minWidth: "400px",
          },
        }}
        onClose={() => setAddJd(false)}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "custom-bold",
          }}
        >
          Upload JD
        </DialogTitle>

        <DialogContent>
          <FileUpload
            sx={{ my: 2, borderRadius: "32px" }}
            questionFile={jd}
            setQuestionFile={setJd}
            acceptFormat=".pdf"
          />
          {jd && (
            <BeyondResumeButton
              variant="contained"
              color="primary"
              sx={{ mt: 2, borderRadius: "24px" }}
              onClick={async () => {
                setAddJd(false);
                await generateFromFile();
              }}
              fullWidth
            >
              Confirm & Generate JD
            </BeyondResumeButton>
          )}
        </DialogContent>
      </Dialog>

      {loading1 ? (
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
            Fetching Your Job Description From The File...
          </Typography>
        </Box>
      ) : (
        <Box
          id="jdSection"
          pt={2}
          sx={{
            borderRadius: "12px",
            position: "relative",
            display: "flex",
          }}
        >
          <Box pr={4}>
            {!isEditing ? (
              <StyledTypography
                sx={{ mt: { xs: 8, md: 0 } }}
                dangerouslySetInnerHTML={{
                  __html: displayContent,
                }}
              />
            ) : (
              <Box >
                <QuillInputEditor
                  sx={{ minHeight: "920px" }}
                  value={editorContent}
                  setValue={(content: string) => setEditorContent(content)}
                  placeholder="Write your Response here"
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: "column",
              minWidth: "250px",
            }}
          >
            <BeyondResumeButton2
              sx={{ m: 0 }}
              variant="outlined"
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? "Save" : "Edit"}
              {/* <FontAwesomeIcon
                icon={isEditing ? faSave : faEdit}
                style={{ marginLeft: 8 }}
              /> */}
            </BeyondResumeButton2>

            <BeyondResumeButton2 sx={{ m: 0 }} onClick={handleCopy}>
              {isCopied ? "Copied!" : "Copy To Clipboard"}
            </BeyondResumeButton2>

            {addJd ? (
              <BeyondResumeButton
                sx={{ m: 0 }}
                variant="outlined"
                onClick={() => setAddJd((prev) => !prev)}
              >
                Upload Custom JD
              </BeyondResumeButton>
            ) : (
              <BeyondResumeButton2
                sx={{ m: 0 }}
                variant="outlined"
                onClick={() => setAddJd((prev) => !prev)}
              >
                Upload Custom JD
              </BeyondResumeButton2>
            )}

            <BeyondResumeButton sx={{ m: 0 }} onClick={() => onNext()}>
              Confirm JD
            </BeyondResumeButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default JobDescriptionTab;
