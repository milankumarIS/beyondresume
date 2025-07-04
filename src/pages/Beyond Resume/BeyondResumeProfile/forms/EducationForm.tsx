import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";

const educationSchema = z.object({
  academy: z.string().min(1),
  degree: z.string().min(1),
  specialization: z.string().min(1),
  startMonthYear: z.string(),
  endMonthYear: z.string(),
});

type EducationData = z.infer<typeof educationSchema>;

export default function EducationForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: EducationData;
  onSave: (data: EducationData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationData>({
    defaultValues,
    resolver: zodResolver(educationSchema),
  });


  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack spacing={2}>
        <FormTextField
          label="Academy Name"
          valueProp="academy"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Degree"
          valueProp="degree"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Specialization"
          valueProp="specialization"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Start (e.g., Jan 2020)"
          valueProp="startMonthYear"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="End (e.g., Dec 2023)"
          valueProp="endMonthYear"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />
        <Stack direction="row" spacing={2} p={1} px={2}>
          <BeyondResumeButton type="submit" variant="contained">
            Save
          </BeyondResumeButton>
          <Button onClick={onCancel}>Cancel</Button>
        </Stack>
      </Stack>
    </form>
  );
}
