import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PaginationControlledProps {
  page: number;
  setPage: (value: number) => void;
  count: number;
}

const PaginationControlled: React.FC<PaginationControlledProps> = ({
  page,
  setPage,
  count,
}) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(count / 10);

  return (
    <Stack spacing={2} sx={{ marginTop: "1rem", alignItems: "center",
      background: "white",
      borderRadius: "52px",py:0.5
     }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        variant="outlined"
        color="primary"
      />
    </Stack>
  );
};

export default PaginationControlled;
