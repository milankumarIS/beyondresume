import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import color from "../../theme/color";
import { PaginationItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
    <Stack
      spacing={2}
      sx={{
        marginTop: "2rem",
        alignItems: "center",
        background: "white",
        borderRadius: "52px",
        py: 0.5,
        width: "100%",
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        renderItem={(item) => (
          <PaginationItem
            slots={{
              previous: () => (
                <>
                  <FontAwesomeIcon
                    style={{ marginRight: "4px" }}
                    icon={faChevronLeft}
                  />{" "}
                  Previous
                </>
              ),
              next: () => (
                <>
                  Next{" "}
                  <FontAwesomeIcon
                    style={{ marginLeft: "4px" }}
                    icon={faChevronRight}
                  />
                </>
              ),
            }}
            {...item}
          />
        )}
        sx={{
          "& .MuiPaginationItem-root": {
            borderRadius: "50%",
            minWidth: 36,
            height: 36,
            fontWeight: 500,
            color: "#000",
            border: "solid 1.5px",
            borderColor: "#0C83B7",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          },
          "& .MuiPaginationItem-previousNext": {
            borderRadius: "20px",
            padding: "0 12px",
            fontWeight: 500,
          },
          "& .Mui-selected": {
            background: color.activeButtonBg,
            color: "#fff",
            "&:hover": {
              backgroundColor: "#222",
            },
          },
        }}
      />
    </Stack>
  );
};

export default PaginationControlled;
