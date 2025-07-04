import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormTextField from "../../../../components/form/FormTextField";
import {
  commonFormTextFieldSx,
  formatDate,
} from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import { getUserId } from "../../../../services/axiosClient";
import {
  getProfile,
  updateByIdDataInTable
} from "../../../../services/services";
import color from "../../../../theme/color";
import BasicDatePicker from "../../../../components/form/DatePicker";

const basicDetailsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  dob: z.string(),
  gender: z.string(),
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
  const [dob, setdob] = useState(new Date());
  const [currentUser, setCurrentUser] = useState<any>();
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
        setValue("gender", data?.userPersonalInfo?.gender?.gender || "");
        setValue("about", data?.userPersonalInfo?.about || "");
        setValue(
          "languages",
          Array.isArray(data?.userPersonalInfo?.languagesKnown)
            ? data.userPersonalInfo.languagesKnown.join(", ")
            : ""
        );

        setValue(
          "dob",
          formatDate(data?.userPersonalInfo?.dob || dob)
        );
      }
    });
  }, [setValue]);

  const handleFormSubmit = (formData: BasicDetailsFormData) => {
    const languagesArray = formData.languages
      ?.split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang);

    updateByIdDataInTable(
      "userPersonalInfo",
      getUserId(),
      {
        languagesKnown: languagesArray,
        about: formData?.about,
      },
      "userId"
    );

    if (onSave) {
      onSave(formData);
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2} textAlign={"left"}>
        <Stack direction="column" spacing={2} alignItems="center">
          <Avatar
            src={currentUser?.userPersonalInfo?.userImage}
            sx={{ width: 84, height: 84 }}
          />
        </Stack>

        <FormTextField
          label="Full Name"
          valueProp="name"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
        />
        <FormTextField
          label="Email"
          valueProp="email"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          watch={watch}
        />

        <FormTextField
          label="Phone"
          valueProp="phone"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={{ ...commonFormTextFieldSx }}
          watch={watch}
        />

        <FormTextField
          label="Date of Birth"
          valueProp="dob"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={{ ...commonFormTextFieldSx }}
          readonly
          watch={watch}
        />

                  {/* <BasicDatePicker
                        label={"Date of Birth"}
                        setDate={setdob}
                        value={data?.dob}
                      ></BasicDatePicker> */}

        <FormTextField
          label="Gender"
          valueProp="gender"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={{ ...commonFormTextFieldSx }}
          readonly
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

        <Typography fontSize={"12px"}>
          * The readonly fields are to be edited in the account section only.{" "}
          <a style={{ color: color.newFirstColor }} href="account">
            {" "}
            Click here
          </a>
        </Typography>
      </Stack>
    </form>
  );
}
