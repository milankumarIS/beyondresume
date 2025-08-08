import {
  faBuilding,
  faCloudSun,
  faEdit,
  faLocationDot,
  faLocationPin,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BeyondResumeButton,
  IconTextRow1,
} from "../../../../components/util/CommonStyle";
import { getUserId } from "../../../../services/axiosClient";
import {
  searchDataFromTable,
  syncDataInTable,
} from "../../../../services/services";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import JobPreferenceForm from "../forms/JobPreferenceForm";
import { useTheme } from "../../../../components/util/ThemeContext";
import color from "../../../../theme/color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function JobPreferenceSection({ hideSensitive }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [jobPreference, setJobPreference] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPreference = async () => {
      try {
        const response = await searchDataFromTable("userJobPreference", {
          userId: getUserId(),
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

  const { theme } = useTheme();

  return (
    <Box position={"relative"} p={3} pr={2}>
      <Stack
        spacing={1}
        style={{
          position: "relative",
          overflow: "hidden",
          background: theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
        }}
        borderRadius={4}
        p={2}
        pt={1}
        minWidth={"250px"}
      >
        {!hideSensitive && (
          <FontAwesomeIcon
            style={{
              fontSize: "12px",
              background: color.activeButtonBg,
              padding: "6px",
              borderRadius: "4px",
              color: "white",
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 2,
            }}
            icon={faEdit}
            onClick={() => setIsEditing(true)}
          ></FontAwesomeIcon>
        )}

        <Typography sx={{ fontFamily: "custom-bold", mb: 4 }}>
          Job preference
        </Typography>

        <IconTextRow1
          // heading="Location"
          icon={faLocationDot}
          text={jobPreference.location}
        />
        <IconTextRow1
          // heading="Employment Type"
          icon={faUserTie}
          text={jobPreference.employmentType}
        />
        <IconTextRow1
          // heading="Workplace"
          icon={faBuilding}
          text={jobPreference.workplace}
        />

        <IconTextRow1
          // heading="Shift"
          icon={faCloudSun}
          text={jobPreference.shift}
        />
      </Stack>
    </Box>
  );
}
