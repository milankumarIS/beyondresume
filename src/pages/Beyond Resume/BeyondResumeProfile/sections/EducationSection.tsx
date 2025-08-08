import {
  faBuildingColumns,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import { useTheme } from "../../../../components/util/ThemeContext";
import { getUserId } from "../../../../services/axiosClient";
import {
  deleteDataFromTable,
  insertDataInTable,
  searchListDataFromTable,
  updateByIdDataInTable,
} from "../../../../services/services";
import color from "../../../../theme/color";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import EducationForm from "../forms/EducationForm";
export default function EducationSection({ hideSensitive }: any) {
  const [data, setData] = useState<any[]>([]);
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEducationData = async () => {
    setLoading(true);
    try {
      const res = await searchListDataFromTable("userEducation", {
        userId: getUserId(),
      });

      const educationArray = res?.data?.data;

      if (Array.isArray(educationArray)) {
        const mapped = educationArray.map((entry) => ({
          id: entry.userEducationId,
          academy: entry.academyName,
          degree: entry.degreeName,
          specialization: entry.specialization,
          startMonthYear: entry.startDate,
          endMonthYear: entry.endDate,
        }));

        setData(mapped);
      }
    } catch (err) {
      console.error("Error loading education data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  const handleSave = async (formData: any, index: number | null) => {
    const payload = {
      academyName: formData.academy,
      degreeName: formData.degree,
      specialization: formData.specialization,
      startDate: formData.startMonthYear,
      endDate: formData.endMonthYear,
      userId: getUserId(),
    };

    try {
      if (index !== null && data[index]?.id) {
        await updateByIdDataInTable(
          "userEducation",
          data[index].id,
          payload,
          "userEducationId"
        );
      } else {
        await insertDataInTable("userEducation", payload);
      }
      await fetchEducationData();
      setIsEditingIndex(null);
      setFormOpen(false);
    } catch (err) {
      console.error("Error saving education entry", err);
    }
  };

  const handleDelete = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this education?"
    );
    if (!confirmDelete) return;

    try {
      const id = data[index]?.id;
      if (id) {
        await deleteDataFromTable("userEducation", id, "userEducationId");
        await fetchEducationData();
      }
    } catch (err) {
      console.error("Error deleting education entry", err);
    }
  };

  const { theme } = useTheme();

  return (
    <ProfileSectionCard title="Education">
      {!formOpen && data.length > 0 && !hideSensitive && (
        <BeyondResumeButton
          sx={{
            position: "absolute",
            top: 5,
            right: 20,
            fontSize: "12px",
            fontFamily: "custom-bold",
          }}
          onClick={() => setFormOpen(true)}
        >
          <FontAwesomeIcon style={{ marginRight: "4px" }} icon={faPlus} />
          Add New
        </BeyondResumeButton>
      )}

      <Stack spacing={2}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {data.length === 0 && !formOpen && (
              <>
                <Typography>No education added.</Typography>
                <BeyondResumeButton onClick={() => setFormOpen(true)}>
                  Add
                </BeyondResumeButton>
              </>
            )}

            {data.map((edu, index) => (
              <div key={index}>
                {isEditingIndex === index ? (
                  <EducationForm
                    defaultValues={edu}
                    onSave={(d) => handleSave(d, index)}
                    onCancel={() => setIsEditingIndex(null)}
                  />
                ) : (
                  <>
                    <Stack
                      flexDirection={"row"}
                      spacing={1}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={1}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                        border: "solid 1px rgba(90, 128, 253, 0.32)",
                      }}
                      borderRadius={4}
                      p={2}
                      minWidth={"250px"}
                    >
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Box
                          sx={{
                            background: "#ebebeb",
                            padding: "6px",
                            borderRadius: "8px",
                            color: "#5b5e66",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faBuildingColumns}
                            style={{
                              fontSize: "30px",
                              color: color.newbg,
                            }}
                          />
                        </Box>

                        <Box>
                          <Box>
                            <Typography
                              sx={{
                                color:
                                  theme === "dark"
                                    ? color.titleColor
                                    : color.titleLightColor,
                              }}
                            >
                              {edu.degree} ({edu.specialization})
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "montserrat-Regular",
                                fontSize: "14px",
                              }}
                            >
                              {edu.academy}
                            </Typography>
                            {/* <Typography
                          sx={{
                            fontFamily: "montserrat-Regular",
                            fontSize: "14px",
                          }}
                        >
                          {edu.specialization}
                        </Typography> */}

                            <Typography
                              sx={{
                                fontFamily: "montserrat-Regular",
                                fontSize: "14px",
                              }}
                            >
                              {dayjs(edu.startMonthYear).format("MMM YYYY")} -{" "}
                              {""}
                              {dayjs(edu.endMonthYear).format("MMM YYYY")}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {!hideSensitive && (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            //  alignSelf:'flex-end',
                            display: "block",
                            ml: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              minWidth: "0px",
                              cursor: "pointer",
                              color: "white",
                              fontSize: "12px",
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              onClick={() => setIsEditingIndex(index)}
                              style={{
                                fontSize: "14px",
                                background: color.activeButtonBg,
                                padding: "10px",
                                borderRadius: "6px",
                              }}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={() => handleDelete(index)}
                              style={{
                                fontSize: "14px",
                                background: color.activeButtonBg,
                                padding: "10px",
                                borderRadius: "6px",
                              }}
                            />
                          </Box>
                        </Stack>
                      )}
                    </Stack>
                  </>
                )}
              </div>
            ))}

            {formOpen && (
              <EducationForm
                onSave={(d) => handleSave(d, null)}
                onCancel={() => setFormOpen(false)}
              />
            )}
          </>
        )}
      </Stack>
    </ProfileSectionCard>
  );
}
