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
import color from "../../../../theme/color";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import ExperienceForm from "../forms/ExperienceForm";

export default function ExperienceSection() {
  const [data, setData] = useState<any[]>([]);
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAlreadyCurrentlyWorking = data.some((d) => d.current);

  const fetchExperienceData = async () => {
    setLoading(true);
    try {
      const res = await searchListDataFromTable("experience", {
        userId: getUserId(),
      });
      const educationArray = res?.data?.data;

      if (Array.isArray(educationArray)) {
        const mapped = educationArray.map((entry) => ({
          id: entry.experienceId,
          jobTitle: entry.jobTitle,
          employmentType: entry.employmentType,
          noticePeriod: entry.noticePeriod,
          current: entry.isCurrentlyWorking,
          years: entry.duration,
          company: entry.jobProviderName,
        }));
        setData(mapped);
      }
    } catch (err) {
      console.error("Error loading experience data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const handleSave = async (formData: any, index: number | null) => {
    const payload = {
      jobTitle: formData.jobTitle,
      employmentType: formData.employmentType,
      noticePeriod: formData.noticePeriod,
      isCurrentlyWorking: formData.current,
      duration: formData.years,
      jobProviderName: formData.company,
      userId: getUserId(),

      aStartDate: "Tue, 08 Jul 2025 07:22:30 GMT",
      aEndDate: "Tue, 08 Jul 2025 07:22:30 GMT",
      city: "example",
      state: "example",
      country: "example",
      categoryId: 1,
      subCategoryId: 1,
    };

    try {
      if (index !== null && data[index]?.id) {
        await updateByIdDataInTable(
          "experience",
          data[index].id,
          payload,
          "experienceId"
        );
      } else {
        await insertDataInTable("experience", payload);
      }

      await fetchExperienceData();
      setIsEditingIndex(null);
      setFormOpen(false);
    } catch (err) {
      console.error("Error saving experience", err);
    }
  };

  const handleDelete = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this experience?"
    );
    if (!confirmDelete) return;

    try {
      const id = data[index]?.id;
      if (id) {
        await deleteDataFromTable("experience", id, "experienceId");
        await fetchExperienceData();
      }
    } catch (err) {
      console.error("Error deleting experience", err);
    }
  };

  return (
    <ProfileSectionCard title="Work Experience">
      <Stack spacing={2} sx={{ minWidth: "300px" }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {data.length === 0 && !formOpen && (
              <>
                <Typography>No experience added.</Typography>
                <BeyondResumeButton onClick={() => setFormOpen(true)}>
                  Add
                </BeyondResumeButton>
              </>
            )}

            {data.map((exp, index) => (
              <div key={index}>
                {isEditingIndex === index ? (
                  <ExperienceForm
                    defaultValues={exp}
                    onSave={(d) => handleSave(d, index)}
                    onCancel={() => setIsEditingIndex(null)}
                    disableCurrentCheckbox={
                      isAlreadyCurrentlyWorking && !exp.current
                    }
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
                    {exp.current && (
                      <Typography
                        sx={{
                          background: color.background,
                          color: "white",
                          width: "fit-content",
                          borderRadius: "4px 0px 4px 0px",
                          px: 1,
                          py: 0.5,
                          fontSize: "10px",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                      >
                        Currently Working Here
                      </Typography>
                    )}

                    <IconTextRow1
                      heading="Job Title"
                      icon={faUserTie}
                      text={exp.jobTitle}
                    />
                    <IconTextRow1
                      heading="Company Name"
                      icon={faBuilding}
                      text={exp.company}
                    />
                    <IconTextRow1
                      heading="Experience"
                      icon={faCalendar}
                      text={exp.years}
                    />
                    <IconTextRow1
                      heading="Employment Type"
                      icon={faHouseLaptop}
                      text={exp.employmentType}
                    />

                    {exp.noticePeriod && exp.current && (
                      <Typography>
                        <b>* Notice Period:</b> {exp.noticePeriod}
                      </Typography>
                    )}
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
              <ExperienceForm
                onSave={(d) => handleSave(d, null)}
                onCancel={() => setFormOpen(false)}
                disableCurrentCheckbox={isAlreadyCurrentlyWorking}
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
