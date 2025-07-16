import {
  faBuilding,
  faCalendar,
  faEdit,
  faHouseLaptop,
  faTrash,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BeyondResumeButton,
  IconTextRow1,
} from "../../../../components/util/CommonStyle";
import { getUserId } from "../../../../services/axiosClient";
import {
  deleteDataFromTable,
  insertDataInTable,
  searchListDataFromTable,
  updateByIdDataInTable,
} from "../../../../services/services";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import EducationForm from "../forms/EducationForm";
import dayjs from "dayjs";
export default function EducationSection() {
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

  return (
    <ProfileSectionCard title="Education">
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
                  <Stack
                    spacing={1}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                    }}
                    borderRadius={4}
                    p={2}
                    pt={3}
                    pb={2.5}
                    minWidth={"250px"}
                  >
                    <IconTextRow1
                      heading="Academy"
                      icon={faUserTie}
                      text={edu.academy}
                    />
                    <IconTextRow1
                      heading="Degree"
                      icon={faBuilding}
                      text={edu.degree}
                    />
                    <IconTextRow1
                      heading="Specialization"
                      icon={faCalendar}
                      text={edu.specialization}
                    />
                    <IconTextRow1
                      heading="From"
                      icon={faHouseLaptop}
                      text={dayjs(edu.startMonthYear).format("MMM YYYY")}
                    />
                    <IconTextRow1
                      heading="To"
                      icon={faHouseLaptop}
                      text={dayjs(edu.endMonthYear).format("MMM YYYY")}
                    />

                    <Stack
                      sx={{ position: "absolute", top: 0, right: -8 }}
                      direction="row"
                      spacing={1}
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
                            fontSize: "12px",
                            background:
                              "linear-gradient(180deg, #50bcf6, #5a81fd)",
                            padding: "6px",
                            borderRadius: "4px",
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDelete(index)}
                          style={{
                            fontSize: "12px",
                            background:
                              "linear-gradient(180deg, #50bcf6, #5a81fd)",
                            padding: "6px",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                )}
              </div>
            ))}

            {formOpen && (
              <EducationForm
                onSave={(d) => handleSave(d, null)}
                onCancel={() => setFormOpen(false)}
              />
            )}

            {!formOpen && data.length > 0 && (
              <BeyondResumeButton onClick={() => setFormOpen(true)}>
                Add More
              </BeyondResumeButton>
            )}
          </>
        )}
      </Stack>
    </ProfileSectionCard>
  );
}
