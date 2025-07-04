import React, { useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Modal,
  Box,
  Button,
  Avatar,
} from "@mui/material";

const TableComponent = ({ headings, data, onClick }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    if (onClick) onClick(row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          boxShadow: "none",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              style={{
                color: "#0a5c6b",
                borderTop: "solid 2px",
                borderBottom: "solid 2px",
              }}
            >
              {headings.map((heading, index) => (
                <TableCell key={index} style={{ color: "#0a5c6b", fontSize:'1.1rem' }}>
                  {heading.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(row)}
                style={{ cursor: "pointer", color: "#0a5c6b" }}
              >
                {headings.map((heading, index) => (
                  <TableCell key={index} sx={{color: "#0a5c6b"}}>{row[heading.key] || "N/A"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={!!selectedRow}
        onClose={handleCloseModal}
        aria-labelledby="patient-modal-title"
        aria-describedby="patient-modal-description"
      >
     <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "80%", sm: "60%", md: "40%" },
    bgcolor: "#fff",
    borderRadius: "16px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    flexDirection: { xs: "column", md: "row" },
    gap: 3,
    p: 4, // Add padding inside the card
  }}
>
  {selectedRow && (
    <>
      <Avatar
        style={{ alignSelf: "center" }}
        sx={{
          mr: 2,
          height: "100px",
          width: "100px",
          border: "2px solid #0a5c6b",
          bgcolor: "#0a5c6b",
          fontSize: "2.5rem",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        DL
      </Avatar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#0a5c6b",
        }}
      >
        <Typography sx={{ fontSize: "1.8rem", color: "#0a5c6b", fontWeight: "bold",mb:2 }}>
          All Details
        </Typography>

        {headings.map((heading, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#0a5c6b",
                fontSize: "14px",
              }}
            >
              {heading.label}:{" "}
              <Typography sx={{ fontWeight: "normal" }}>
                {selectedRow[heading.key] || "N/A"}
              </Typography>
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )}
</Box>

      </Modal>
    </>
  );
};

export default TableComponent;