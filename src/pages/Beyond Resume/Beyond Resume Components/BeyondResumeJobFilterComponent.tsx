import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import color from "../../../theme/color";

export type Filters = {
  payroll: string[];
  jobType: string[];
  jobTitle: string[];
  jobMode: string[];
};

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filterOptions: Record<keyof Filters, string[]>;
};

const FILTER_KEYS: (keyof Filters)[] = ["payroll", "jobType", "jobMode"];

const FILTER_LABELS: Record<keyof Filters, string> = {
  payroll: "Payroll",
  jobType: "Job Type",
  jobTitle: "Job Title",
  jobMode: "Work Mode",
};

const BeyondResumeJobFilterComponent: React.FC<Props> = ({
  filters,
  setFilters,
  filterOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [tempFilters, setTempFilters] = useState({ ...filters });

  useEffect(() => {
    setFilters(tempFilters);
  }, [tempFilters]);

  const handleSave = () => {
    FILTER_KEYS.forEach((key) =>
      localStorage.setItem(`filter-${key}`, JSON.stringify(tempFilters[key]))
    );
    setOpen(false);
  };

  const appliedCount = FILTER_KEYS.reduce(
    (acc, key) => acc + (filters[key]?.length || 0),
    0
  );

  const handleClearAll = () => {
    const cleared = FILTER_KEYS.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as Filters);
    setTempFilters(cleared);
  };

  return (
    <Box
      position={"relative"}
      display={"flex"}
      alignItems={'center'}
      justifyContent={'center'}
      gap={1}
      flexWrap="wrap"
    >
      {FILTER_KEYS.map((key) => (
        <Box key={key} sx={{ display: "flex", flexDirection: "column" }}>
          <Select
            multiple
            displayEmpty
            value={tempFilters[key]}
            onChange={(e) =>
              setTempFilters((prev) => ({
                ...prev,
                [key]: e.target.value as string[],
              }))
            }
            input={
              <OutlinedInput
                notched={false}
                sx={{
                  ...commonFormTextFieldSx,
                  height: "40px",
                  padding: "6px 8px",
                }}
              />
            }
            renderValue={(selected) => {
              if (!selected.length)
                return (
                  <Typography
                    sx={{ color: "#000", fontSize: "14px", m: "auto" }}
                  >
                    {`Select ${FILTER_LABELS[key]}`}
                  </Typography>
                );

              return (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowX: "auto",
                    gap: 0.5,
                    "&::-webkit-scrollbar": { height: "0px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#ccc",
                      borderRadius: "2px",
                    },
                  }}
                >
                  {(selected as string[]).map((val) => (
                    <Chip
                      key={val}
                      label={val}
                      // onDelete={() =>
                      //   setTempFilters((prev) => ({
                      //     ...prev,
                      //     [key]: prev[key].filter((v) => v !== val),
                      //   }))
                      // }
                      sx={{
                        fontSize: "12px",
                        height: "24px",
                        "& .MuiChip-deleteIcon": {
                          color: color.newFirstColor,
                        },
                      }}
                    />
                  ))}
                </Box>
              );
            }}
            sx={{
              ...commonFormTextFieldSx,
              // height: "40px",
              width: "180px",
              padding: "0px",
              paddingTop: "0px",
              "& .MuiInputBase-input": {
                borderRadius: "999px",
                paddingTop: "10px !important",
                paddingBottom: "8px !important",
              },
            }}
          >
            {filterOptions[key].map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  checked={tempFilters[key].includes(option)}
                  icon={<FontAwesomeIcon icon={faCircle} />}
                  checkedIcon={<FontAwesomeIcon icon={faCircleCheck} />}
                  sx={{
                    color: "transparent",
                    border: "solid 2px",
                    borderColor: color.newFirstColor,
                    padding: 0,
                    margin: "4px",
                    "&.Mui-checked": {
                      color: color.newFirstColor,
                    },
                  }}
                />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      ))}
    </Box>
  );
};

export default BeyondResumeJobFilterComponent;
