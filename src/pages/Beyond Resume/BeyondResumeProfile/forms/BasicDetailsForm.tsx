import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { genderArray1 } from "../../../../components/form/data";
import BasicDatePicker from "../../../../components/form/DatePicker";
import FormSelect from "../../../../components/form/FormSelect";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import { getUserId } from "../../../../services/axiosClient";
import {
  getProfile,
  updateByIdDataInTable,
  UploadFileInTable,
} from "../../../../services/services";
import { useNewSnackbar } from "../../../../components/shared/useSnackbar";
import CustomSnackbar from "../../../../components/util/CustomSnackbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(utc);
dayjs.extend(timezone);

const basicDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  dob: z.string(),
  gender: z.string().min(1, "Gender is required"),
  languages: z.string(),
  about: z.string().optional(),
  avatar: z.any().optional(),
});

export type BasicDetailsFormData = z.infer<typeof basicDetailsSchema>;

export default function BasicDetailsForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: BasicDetailsFormData;
  onSave: (data: BasicDetailsFormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BasicDetailsFormData>({
    defaultValues,
    resolver: zodResolver(basicDetailsSchema),
  });

  const [dob, setDob] = useState<Date | null>(null);
  // console.log(dob)
  const [currentUser, setCurrentUser] = useState<any>();
  const [genderDefault, setGenderDefault] = useState({});
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const { snackbarProps, showSnackbar } = useNewSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getProfile().then((result: any) => {
      const data = result?.data?.data;
      setCurrentUser(data);
      if (data?.userPersonalInfo || data?.userContact) {
        const fullName = [
          data?.userPersonalInfo?.firstName,
          data?.userPersonalInfo?.middleName,
          data?.userPersonalInfo?.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        setValue("name", fullName);
        setValue("email", data?.userContact?.userEmail || "");
        setValue("phone", data?.userContact?.userPhoneNumber || "");

        const genderId = data?.userPersonalInfo?.genderId;
        if (genderId) {
          setValue("gender", String(genderId));
          setGenderDefault({ gender: String(genderId) });
        }

        setValue("about", data?.userPersonalInfo?.about || "");
        setValue(
          "languages",
          Array.isArray(data?.userPersonalInfo?.languagesKnown)
            ? data.userPersonalInfo.languagesKnown.join(", ")
            : ""
        );

        if (data?.userPersonalInfo?.dob) {
          const dobDate = new Date(data.userPersonalInfo.dob);
          setDob(dobDate);
          setValue("dob", dobDate.toISOString());
        }
      }
    });
  }, [setValue]);

  const handleFormSubmit = (formData: BasicDetailsFormData) => {
    const languagesArray = formData.languages
      ?.split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang);
    const dobInIST = dob
      ? dayjs.utc(dayjs(dob).format("YYYY-MM-DD")).toISOString()
      : null;

    updateByIdDataInTable(
      "userPersonalInfo",
      getUserId(),
      {
        dob: dobInIST,
        languagesKnown: languagesArray,
        about: formData?.about,
        genderId: formData?.gender,
      },
      "userId"
    );

    updateByIdDataInTable(
      "userContact",
      getUserId(),
      {
        userPhoneNumber: formData?.phone,
      },
      "userId"
    );

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      UploadFileInTable(
        "userPersonalInfo",
        {
          primaryKey: "userId",
          primaryKeyValue: getUserId(),
          fieldToUpload: "userImage",
          folderName: `Avatar/userImage`,
        },
        formData
      )
        .then(async () => {
          showSnackbar("File uploaded successfully", "success");
        })
        .catch((error) => {
          showSnackbar(
            "There is an error occurred during the file upload. It may be due to the file size. File size should be less than 50Kb",
            "warning"
          );
        });
    }

    if (onSave) {
      showSnackbar("Saved successfully", "success");

      onSave(formData);
    }
    onCancel();
  };
  if (!dob) return null;
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2} textAlign={"left"}>
        <Box>
          <Stack
            sx={{
              position: "relative",
              width: 74,
              height: 74,
              overflow: "hidden",
              borderRadius: "50%",
              mx: "auto",
              display: "block",
            }}
          >
            <Avatar
              src={
                avatarPreview
                  ? avatarPreview
                  : currentUser?.userPersonalInfo?.userImage
              }
              sx={{ width: 74, height: 74 }}
            ></Avatar>

            <Button
              component="label"
              style={{ margin: 0 }}
              sx={{
                position: "absolute",
                bottom: "-18%",
                left: "50%",
                borderRadius: 0,
                width: "100px",
                transform: "translate(-50%, -50%)",
                border: "none",
                background: "rgba(234, 235, 239, 0.48)",
              }}
            >
              <FontAwesomeIcon
                style={{ color: "black" }}
                icon={faCamera}
              ></FontAwesomeIcon>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Stack>
        </Box>

        <FormTextField
          label="Full Name"
          valueProp="name"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
          readonly
        />
        <FormTextField
          label="Email"
          valueProp="email"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
          readonly
        />

        <FormTextField
          label="Phone"
          valueProp="phone"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
        />

        <Box px={0}>
          <BasicDatePicker
            label="Date of Birth"
            setDate={(date) => {
              setDob(date?.toDate() || null);
              setValue("dob", date?.toISOString() || "");
            }}
            value={dob ? dob : null}
            sx={commonFormTextFieldSx}
          />

          {errors.dob && (
            <Typography color="error" fontSize={12}>
              {errors.dob.message}
            </Typography>
          )}
        </Box>

        <input
          type="hidden"
          {...register("dob")}
          value={dob?.toISOString() || ""}
        />

        <FormSelect
          options={genderArray1}
          label="Gender"
          valueProp="gender"
          errors={errors}
          register={register}
          sx={commonFormTextFieldSx}
          defaultValue={genderDefault}
          watch={watch}
        />

        <FormTextField
          label="Languages Known (comma separated)"
          valueProp="languages"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
        />

        <FormTextField
          label="About"
          multiline
          rows={4}
          valueProp="about"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
        />

        <Stack direction="row" alignItems={"center"} spacing={2} p={1} px={2}>
          <BeyondResumeButton type="submit" variant="contained">
            Save
          </BeyondResumeButton>
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
        </Stack>
      </Stack>
      <CustomSnackbar {...snackbarProps} />
    </form>
  );
}
