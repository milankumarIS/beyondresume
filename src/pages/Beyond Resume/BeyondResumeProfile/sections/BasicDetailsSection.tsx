import {
  faCake,
  faEdit,
  faEnvelope,
  faGlobe,
  faPhone,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Card, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { genderArray1 } from "../../../../components/form/data";
import { formatDate } from "../../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  IconTextRow,
} from "../../../../components/util/CommonStyle";
import { getUserName } from "../../../../services/axiosClient";
import { getProfile } from "../../../../services/services";
import color from "../../../../theme/color";
import ProfileSectionCard from "../../Beyond Resume Components/ProfileSectionCard";
import BasicDetailsForm from "../forms/BasicDetailsForm";
import { useTheme } from "../../../../components/util/ThemeContext";

export default function BasicDetailsSection({
  data,
  onSave,
  hideSensitive,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState<any>();
  useEffect(() => {
    getProfile().then((result: any) => {
      setCurrentUser({ ...result?.data?.data });
    });
  }, [isEditing]);
  // console.log(currentUser);

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
          background:'transparent',
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

            const selectedGender = genderArray1.find(
              (g) => g.value === formData.gender
            );

            setCurrentUser((prev: any) => ({
              ...prev,
              userPersonalInfo: {
                ...prev?.userPersonalInfo,
                about: formData.about,
                dob: formData.dob,
                userPhoneNumber: formData.phone,
                languagesKnown: languagesArray,
                gender: {
                  ...prev?.userPersonalInfo?.gender,
                  gender: selectedGender?.label,
                  genderId: Number(selectedGender?.value),
                },
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
    <Box>
      <Stack
        spacing={1}
        flexDirection={"row"}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          p: 2,
          pl: 0,
          pt: 0,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          p={2}
          pr={4}
          width={'100%'}
        >
          <Box
            sx={{ display: "flex", mb: 2, width: "100%" }}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={2}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
            >
              {currentUser?.userPersonalInfo?.userImage ? (
                <Avatar
                  src={currentUser?.userPersonalInfo?.userImage}
                  alt="Avatar"
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    alignSelf: "center",
                  }}
                />
              ) : (
                <Avatar
                  alt="Avatar"
                  sx={{
                    width: 90,
                    height: 90,
                    mx: "auto",
                    alignSelf: "center",
                  }}
                >
                  {currentUser?.userPersonalInfo?.firstName?.[0]}
                </Avatar>
              )}

              <div>
                <Typography
                  style={{ marginBottom: "1px", fontFamily: "custom-bold" }}
                  variant="h5"
                >
                  {currentUser?.userPersonalInfo?.firstName ||
                  currentUser?.userPersonalInfo?.middleName ||
                  currentUser?.userPersonalInfo?.lastName ? (
                    <>
                      {currentUser?.userPersonalInfo?.firstName || ""}{" "}
                      {currentUser?.userPersonalInfo?.middleName || ""}{" "}
                      {currentUser?.userPersonalInfo?.lastName || ""}
                    </>
                  ) : (
                    "No name"
                  )}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  {getUserName()}
                </Typography>
              </div>
            </Box>

            {!hideSensitive && (
              <BeyondResumeButton
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit Profile{" "}
                <FontAwesomeIcon style={{ marginLeft: "8px" }} icon={faEdit} />
              </BeyondResumeButton>
            )}
          </Box>

          <div style={{ width: "100%", flexGrow: 1 }}>
            <Typography sx={{ fontFamily: "custom-bold" }}>About Me</Typography>
            {/* <Divider sx={{ border: "solid 1px grey", my: 1, opacity: 0.4 }} /> */}

            <Typography
              sx={{ textAlign: "left", fontFamily: "montserrat-regular" }}
            >
              {currentUser?.userPersonalInfo?.about || "No data"}
            </Typography>
          </div>
        </Box>

        <Box
          sx={{
            minWidth: "250px",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            borderRadius: "12px",
            padding: 2,
            background:
              theme === "dark" ? color.jobCardBg : color.jobCardBgLight,
          }}
        >
          <Typography sx={{ fontFamily: "custom-bold", mb: 1 }}>
            Contact & Other Details
          </Typography>

          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Box
              sx={{
                background: "#ebebeb",
                padding: "2px",
                height: "18px",
                width: "18px",
                borderRadius: "4px",
                color: "#5b5e66",
                display: "flex",
                alignItems: "center",
                justifyContent:'center'
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} />{" "}
            </Box>

            <Typography
              sx={{
                fontSize: "14px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "montserrat-regular",
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              {currentUser?.userContact?.userEmail}
            </Typography>
          </Box>

          <IconTextRow
            hideSensitive={hideSensitive}
            icon={faPhone}
            text={currentUser?.userContact?.userPhoneNumber || "No data"}
          />

          <IconTextRow
            hideSensitive={hideSensitive}
            icon={faCake}
            text={
              currentUser?.userPersonalInfo?.dob
                ? formatDate(currentUser.userPersonalInfo.dob)
                : "No data"
            }
          />

          <IconTextRow
            hideSensitive={hideSensitive}
            icon={faVenusMars}
            text={currentUser?.userPersonalInfo?.gender?.gender || "No data"}
          />

          <IconTextRow
            hideSensitive={hideSensitive}
            icon={faGlobe}
            text={
              Array.isArray(currentUser?.userPersonalInfo?.languagesKnown) &&
              currentUser.userPersonalInfo.languagesKnown.length > 0
                ? currentUser.userPersonalInfo.languagesKnown.join(", ")
                : "No data"
            }
          />
        </Box>
      </Stack>
    </Box>
  );
}
