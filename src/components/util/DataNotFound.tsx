import { Stack } from "@mui/material";

export const DataNotFound = () => {
  return (
    <Stack spacing={2} sx={{ marginTop: "1rem", alignItems: "center" }}>
      <img
        style={{
          maxWidth: "100%",
        }}
        src="/assets/datanotfound.jpeg"
        alt="Data Not Found"
      />
    </Stack>
  );
};
