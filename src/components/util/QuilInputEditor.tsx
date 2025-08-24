import { Box, SxProps, Theme, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillInputEditorProps {
  value: any;
  setValue: (value: string) => void;
  placeholder?: string;
  toolbarOptions?: any;
  error?: string;
  sx?: SxProps<Theme>;
}

const QuillInputEditor: React.FC<QuillInputEditorProps> = ({
  value,
  setValue,
  placeholder,
  toolbarOptions,
  error,
  sx
}) => {
  const defaultToolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions || defaultToolbarOptions,
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("35vh");

  return (
    <Box
    className='custom-scrollbar'
      ref={editorRef}
      sx={{
        resize: "vertical",
        overflowY: "scroll",
        height,
        minHeight: "200px",
        borderRadius: "16px",
        // border: "solid 1px #0a5c6b",
        boxShadow: "0px 0px 20px #00000035",
        marginBottom: "20px",
        paddingBottom: "5px",
        ...sx
      }}
    >
      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        onChange={setValue}
        placeholder={placeholder}
        style={{
          borderRadius: "8px",
          height: "calc(100% - 41px)",
        }}
      />
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuillInputEditor;
