import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  ListItemText,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faFilter,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
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

const FILTER_KEYS: (keyof Filters)[] = [
  "payroll",
  "jobType",
  "jobTitle",
  "jobMode",
];

const FILTER_LABELS: Record<keyof Filters, string> = {
  payroll: "Payroll",
  jobType: "Job Type",
  jobTitle: "Job Title",
  jobMode: "Job Mode",
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
    <>
      <BeyondResumeButton
        sx={{
          px: 1,
          background: appliedCount > 0 ? color.background : "grey",
          py: 1,
          height:'32px',
          border:'none'
        }}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon
          style={{ marginRight: "2px" }}
          icon={faFilter}
        ></FontAwesomeIcon>{" "}
        {appliedCount > 0 && `(${appliedCount})`}
      </BeyondResumeButton>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: { xs: "90%", md: 500 },
            maxHeight: "70vh",
            bgcolor: "background.paper",
            transform: "translate(-50%, -50%)",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box position={"relative"}>
            <Typography
              variant="h6"
              mb={2}
              sx={{
                background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                width: "fit-content",
                color: "white",
                p: 2,
                borderRadius: "12px",
                m: "auto",
              }}
            >
              Job Filters
            </Typography>

            <Tabs
              value={tab}
              onChange={(_, newVal) => setTab(newVal)}
              variant="scrollable"
              allowScrollButtonsMobile
              centered
              sx={{
                mt: 4,
                mb: 4,
                "& .MuiTab-root": {
                  color: "white",
                  background: "#2d3436",
                  borderRadius: "999px",
                  marginRight: "8px",
                  paddingX: "16px",
                  textTransform: "none",
                  border: "1px solid #ffffff44",
                },
                "& .Mui-selected": {
                  background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                  color: "white !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {FILTER_KEYS.map((key) => (
                <Tab
                  key={key}
                  label={`${FILTER_LABELS[key]} (${filters[key]?.length || 0})`}
                />
              ))}
            </Tabs>

            {FILTER_KEYS.map((key, index) => (
              <div key={key} hidden={tab !== index}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  options={filterOptions[key]}
                  value={tempFilters[key]}
                  onChange={(_, newValue) =>
                    setTempFilters((prev) => ({ ...prev, [key]: newValue }))
                  }
                  getOptionLabel={(option) => option}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
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
                        checked={selected}
                      />
                      <ListItemText primary={option} />
                    </li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        // key={option}
                        label={option}
                        {...getTagProps({ index })}
                        sx={{
                          "& .MuiChip-deleteIcon": {
                            color: color.newFirstColor,
                            "&:hover": {
                              color: color.newFirstColor,
                            },
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      sx={commonFormTextFieldSx}
                      {...params}
                      label={`Search ${FILTER_LABELS[key]}`}
                    />
                  )}
                />

                {/* <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Selected {key}:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {tempFilters[key].map((item: string) => (
                    <Box
                      key={item}
                      sx={{
                        px: 1,
                        py: 0.5,
                        bgcolor: "#e0e0e0",
                        borderRadius: 1,
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box> */}
              </div>
            ))}

            <Box textAlign="right" mt={3}>
              <Button
                sx={{
                  color: "black",
                  position: "absolute",
                  top: -20,
                  right: -35,
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <FontAwesomeIcon
                  style={{ fontSize: "18px" }}
                  icon={faXmarkCircle}
                ></FontAwesomeIcon>
              </Button>
              <BeyondResumeButton
                sx={{ textTransform: "none", mr: 1 }}
                onClick={handleClearAll}
              >
                Clear Filters
              </BeyondResumeButton>
              <BeyondResumeButton variant="contained" onClick={handleSave}>
                Save
              </BeyondResumeButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BeyondResumeJobFilterComponent;
