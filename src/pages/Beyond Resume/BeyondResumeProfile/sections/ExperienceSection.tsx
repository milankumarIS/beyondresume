import {
  faBuilding,
  faCalendar,
  faEdit,
  faHouseLaptop,
  faTrash,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  BeyondResumeButton,
  IconTextRow1
} from "../../../../components/util/CommonStyle";
import color from "../../../../theme/color";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import ExperienceForm from "../forms/ExperienceForm";

export default function ExperienceSection({ data = [], onSave }: any) {
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
    <ProfileSectionCard title="Work Experience">
      <Stack spacing={2} sx={{minWidth:'300px'}}>
        {data.length === 0 && !formOpen && (
          <>
            <Typography>No experience added.</Typography>
            <BeyondResumeButton onClick={() => setFormOpen(true)}>
              Add
            </BeyondResumeButton>
          </>
        )}

        {data.map((exp: any, index: number) => (
          <div key={index}>
            {isEditingIndex === index ? (
              <ExperienceForm
                defaultValues={exp}
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

                {exp.noticePeriod && (
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
          <ExperienceForm
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
