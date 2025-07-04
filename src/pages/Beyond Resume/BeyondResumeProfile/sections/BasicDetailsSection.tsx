import {
  faCake,
  faEnvelope,
  faGlobe,
  faPhone,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getUserName } from "../../../../services/axiosClient";
import color from "../../../../theme/color";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import BasicDetailsForm from "../forms/BasicDetailsForm";
import {
  BeyondResumeButton,
  IconTextRow,
} from "../../../../components/util/CommonStyle";
import { getProfile } from "../../../../services/services";
import { formatDate } from "../../../../components/util/CommonFunctions";

export default function BasicDetailsSection({ data, onSave }: any) {
  const [isEditing, setIsEditing] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    getProfile().then((result: any) => {
      setCurrentUser({ ...result?.data?.data });
      console.log({ ...result?.data?.data });
    });
  }, []);

  if (!currentUser && !isEditing) {
    return (
      <ProfileSectionCard title={"Personal Details"}>
        <Stack spacing={2}>
          <Typography>No data available.</Typography>
          <BeyondResumeButton onClick={() => setIsEditing(true)}>
            Add
          </BeyondResumeButton>
        </Stack>
      </ProfileSectionCard>
    );
  }

  if (isEditing) {
    return (
      <Card
        sx={{
          p: 2,
          minWidth: "300px",
          textAlign: "center",
          borderRadius: "18px",
          boxShadow: "none",
        }}
      >
        <BasicDetailsForm
          defaultValues={data}
          onSave={(formData) => {
            const languagesArray = formData.languages
              ?.split(",")
              .map((lang) => lang.trim())
              .filter((lang) => lang);

            setCurrentUser((prev: any) => ({
              ...prev,
              userPersonalInfo: {
                ...prev.userPersonalInfo,
                about: formData.about,
                languagesKnown: languagesArray,
              },
            }));
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <ProfileSectionCard title="" onEdit={() => setIsEditing(true)}>
      <Stack
        spacing={1}
        sx={{
          width: "300px",
          textAlign: "center",
          pb: 2,
        }}
      >
        {currentUser?.userPersonalInfo?.userImage ? (
          <Avatar
            src={currentUser?.userPersonalInfo?.userImage}
            alt="Avatar"
            sx={{ width: 90, height: 90, mx: "auto", alignSelf: "center" }}
          />
        ) : (
          <Avatar
            alt="Avatar"
            sx={{ width: 90, height: 90, mx: "auto", alignSelf: "center" }}
          >
            BR
          </Avatar>
        )}

        <Typography style={{ marginBottom: "-12px" }} variant="h6">
          {/* {data.name} */}
          {currentUser?.userPersonalInfo?.firstName} {''}
          {currentUser?.userPersonalInfo?.middleName} {''}
          {currentUser?.userPersonalInfo?.lastName}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Montserrat-Regular",
          }}
        >
          {getUserName()}
        </Typography>

        {/* <Divider
          sx={{ border: "solid 1.5px", borderColor: color.newFirstColor }}
        /> */}
        <div
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <FontAwesomeIcon
              style={{
                background: color.newFirstColor,
                color: "white",
                padding: "4px",
                borderRadius: "4px",
                height: "14px",
                width: "14px",
              }}
              icon={faEnvelope}
            />{" "}
            <Typography
              sx={{
                fontSize: "14px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexGrow: 1,
                minWidth: 0,
                //   display:'flex',
                //   alignItems:'center',
                //   gap:0.5
              }}
            >
              {/* {data.email} */}
              {currentUser?.userContact?.userEmail}
            </Typography>
          </Box>

          <IconTextRow
            icon={faPhone}
            text={currentUser?.userContact?.userPhoneNumber}
          />
          <IconTextRow
            icon={faCake}
            text={formatDate(
              currentUser?.userPersonalInfo?.dob || "Unknown DOB"
            )}
          />
          <IconTextRow
            icon={faVenusMars}
            text={currentUser?.userPersonalInfo?.gender?.gender}
          />
          <IconTextRow
            icon={faGlobe}
            text={
              Array.isArray(currentUser?.userPersonalInfo?.languagesKnown)
                ? currentUser.userPersonalInfo.languagesKnown.join(", ")
                : "No data"
            }
          />
        </div>

        {/* <Divider
          sx={{ border: "solid 1.5px", borderColor: color.newFirstColor }}
        /> */}
        <Typography sx={{ textAlign: "left" }}>
          <b>About:</b> <br />{" "}
          {currentUser?.userPersonalInfo?.about || "No data"}
        </Typography>
      </Stack>
    </ProfileSectionCard>
  );
}
