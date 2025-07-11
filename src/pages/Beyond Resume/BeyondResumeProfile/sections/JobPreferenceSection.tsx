import {
  faBuilding,
  faCloudSun,
  faLocationPin,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BeyondResumeButton,
  IconTextRow1,
} from "../../../../components/util/CommonStyle";
import { getUserId } from "../../../../services/axiosClient";
import {
  searchDataFromTable,
  syncDataInTable
} from "../../../../services/services";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import JobPreferenceForm from "../forms/JobPreferenceForm";

export default function JobPreferenceSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [jobPreference, setJobPreference] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPreference = async () => {
      try {
        const response = await searchDataFromTable("userJobPreference", {
           userId: getUserId()
        });

        // console.log(response)

        if (response) {
          const item = response?.data?.data;
          setJobPreference({
            location: item.preferedLocation,
            shift: item.preferedShipt,
            workplace: item.workplace,
            employmentType: item.employmentType,
          });
        }
      } catch (error) {
        console.error("Failed to fetch job preference", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPreference();
  }, []);

  const handleSave = async (formData: any) => {
    const payload = {
      preferedLocation: formData.location,
      employmentType: formData.employmentType,
      workplace: formData.workplace,
      preferedShipt: formData.shift,
      userId: getUserId(),
    };

    try {
      await syncDataInTable("userJobPreference", payload, "userId");

      setJobPreference(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update job preference:", error);
    }
  };

  if (loading) {
    return (
      <ProfileSectionCard title="Job Preference">
        <Typography>Loading...</Typography>
      </ProfileSectionCard>
    );
  }

  if (
    (!jobPreference || Object.keys(jobPreference).length === 0) &&
    !isEditing
  ) {
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
          defaultValues={jobPreference}
          onSave={handleSave}
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
          text={jobPreference.location}
        />
        <IconTextRow1
          heading="Employment Type"
          icon={faUserTie}
          text={jobPreference.employmentType}
        />
        <IconTextRow1
          heading="Workplace"
          icon={faBuilding}
          text={jobPreference.workplace}
        />

        <IconTextRow1
          heading="Shift"
          icon={faCloudSun}
          text={jobPreference.shift}
        />
      </Stack>
    </ProfileSectionCard>
  );
}
