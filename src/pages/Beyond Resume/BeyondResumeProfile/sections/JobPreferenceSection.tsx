import { faBuilding, faCloudSun, faLocation, faLocationDot, faLocationPin, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  BeyondResumeButton,
  IconTextRow1,
} from "../../../../components/util/CommonStyle";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import JobPreferenceForm from "../forms/JobPreferenceForm";

export default function JobPreferenceSection({ data = {}, onSave }: any) {
  const [isEditing, setIsEditing] = useState(false);

  if ((!data || Object.keys(data).length === 0) && !isEditing) {
    return (
      <ProfileSectionCard title="Job Preference">
        <Stack spacing={2}>
          <Typography mb={2}>No preferences set.</Typography>
          <BeyondResumeButton onClick={() => setIsEditing(true)}>
            Add
          </BeyondResumeButton>
        </Stack>
      </ProfileSectionCard>
    );
  }

  if (isEditing) {
    return (
      <ProfileSectionCard title="Job Preference">
        <JobPreferenceForm
          defaultValues={data}
          onSave={(formData) => {
            onSave(formData);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard
      title="Job Preference"
      onEdit={() => setIsEditing(true)}
    >
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
        minWidth={"200px"}
      >
        <IconTextRow1
          heading="Location"
          icon={faLocationPin}
          text={data.location}
        />
        <IconTextRow1 heading="Shift" icon={faCloudSun} text={data.shift} />
        <IconTextRow1
          heading="Workplace"
          icon={faBuilding}
          text={data.workplace}
        />
        <IconTextRow1
          heading="Employment Type"
          icon={faUserTie}
          text={data.employmentType}
        />
      </Stack>
    </ProfileSectionCard>
  );
}
