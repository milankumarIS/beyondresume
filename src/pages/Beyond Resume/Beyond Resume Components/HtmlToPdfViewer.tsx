import {
  faDownload,
  faFileExport
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
  StyledTypography,
} from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/util/ThemeContext";

interface HtmlToPdfViewerProps {
  htmlText: string;
  heading?: string;
}

const HtmlToPdfViewer: React.FC<HtmlToPdfViewerProps> = ({
  htmlText,
  heading,
}) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const padding = 12;

    const availableWidth = pdfWidth - 2 * padding;
    const availableHeight = (canvas.height * availableWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      padding,
      padding,
      availableWidth,
      availableHeight
    );
    pdf.save("downloaded_profile.pdf");
  };

  const { theme } = useTheme();
  return (
    <Box p={2}>
      <BeyondResumeButton2 onClick={() => setOpen(true)}>
        {" "}
        View {heading}{" "}
        <FontAwesomeIcon style={{ marginLeft: "6px" }} icon={faFileExport} />
      </BeyondResumeButton2>

      {/* <Box
        className="custom-scrollbar"
        onClick={() => setOpen(true)}
        sx={{
          width: 300,
          height: 350,
          overflow: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          cursor: "pointer",
          color: "inherit",
          background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        }}
        dangerouslySetInnerHTML={{ __html: htmlText }}
      /> */}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          className="custom-scrollbar"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            background: "white",
            color: "black",
          }}
        >
          <Typography variant="h5" mb={3} textAlign={"center"}>
            {heading}
          </Typography>

          <StyledTypography
            dangerouslySetInnerHTML={{
              __html: htmlText,
            }}
          />

          <Box
            sx={{ position: "absolute", top: 2, right: 10 }}
            mt={3}
            display="flex"
            justifyContent="flex-end"
          >
            <BeyondResumeButton
              sx={{ fontSize: "12px" }}
              variant="contained"
              onClick={handleDownloadPdf}
            >
              <FontAwesomeIcon
                style={{ marginRight: "4px" }}
                icon={faDownload}
              />{" "}
              Download PDF
            </BeyondResumeButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default HtmlToPdfViewer;
