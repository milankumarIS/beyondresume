import { useState } from "react";
import { Typography, Stack, Button, Box } from "@mui/material";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import EducationForm from "../forms/EducationForm";
import {
  faUserTie,
  faBuilding,
  faCalendar,
  faHouseLaptop,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  BeyondResumeButton,
  IconTextRow1,
} from "../../../../components/util/CommonStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EducationSection({ data = [], onSave }: any) {
  const [isEditingIndex, setIsEditingIndex] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleSave = (formData: any, index: number | null) => {
    const newData = [...data];
    if (index !== null) newData[index] = formData;
    else newData.push(formData);
    onSave(newData);
    setIsEditingIndex(null);
    setFormOpen(false);
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_: any, i: number) => i !== index);
    onSave(newData);
  };

  return (
    <ProfileSectionCard title="Education">
      <Stack spacing={2}>
        {data.length === 0 && !formOpen && (
          <>
            <Typography>No education added.</Typography>
            <BeyondResumeButton onClick={() => setFormOpen(true)}>
              Add
            </BeyondResumeButton>
          </>
        )}

        {data.map((edu: any, index: number) => (
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
                  text={edu.startMonthYear}
                />
                <IconTextRow1
                  heading="To"
                  icon={faHouseLaptop}
                  text={edu.endMonthYear}
                />

                <Stack
                  sx={{ position: "absolute", top: 0, right: -8 }}
                  direction="row"
                  spacing={1}
                >
                  <Box
                    onClick={() => setIsEditingIndex(index)}
                    sx={{
                      px: 2,
                      minWidth: "0px",
                      cursor: "pointer",
                      color: "white",
                      textTransform: "none",
                      fontSize: "12px",
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <FontAwesomeIcon
                      onClick={() => setIsEditingIndex(index)}
                      style={{
                        fontSize: "12px",
                        background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                        padding: "6px",
                        borderRadius: "4px",
                      }}
                      icon={faEdit}
                    />
                    <FontAwesomeIcon
                      onClick={() => handleDelete(index)}
                      style={{
                        fontSize: "12px",
                        background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                        padding: "6px",
                        borderRadius: "4px",
                      }}
                      icon={faTrash}
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
      </Stack>
    </ProfileSectionCard>
  );
}
