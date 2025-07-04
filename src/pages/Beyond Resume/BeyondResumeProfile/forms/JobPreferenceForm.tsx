import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField, MenuItem, Button } from "@mui/material";
import {
  genderArray,
  jobMode,
  jobShift,
  jobType,
} from "../../../../components/form/data";
import FormSelect from "../../../../components/form/FormSelect";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";

const preferenceSchema = z.object({
  location: z.string().min(1),
  shift: z.string(),
  workplace: z.string(),
  employmentType: z.string(),
});

type JobPreferenceData = z.infer<typeof preferenceSchema>;

export default function JobPreferenceForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: JobPreferenceData;
  onSave: (data: JobPreferenceData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPreferenceData>({
    defaultValues,
    resolver: zodResolver(preferenceSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack spacing={2}>
        <FormTextField
          label="Preferred Location"
          valueProp="location"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />

        <FormSelect
          options={jobType}
          label="Employment Type"
          valueProp="employmentType"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          defaultValue={{ employmentType: defaultValues?.employmentType }}
        />
        <FormSelect
          options={jobMode}
          label="Workplace"
          valueProp="workplace"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          defaultValue={{ workplace: defaultValues?.workplace }}
        />
        <FormSelect
          options={jobShift}
          label="Preferred Shift"
          valueProp="shift"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
          defaultValue={{ shift: defaultValues?.shift }}
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
