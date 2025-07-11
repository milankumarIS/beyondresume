import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";

const educationSchema = z.object({
  academy: z.string().min(1),
  degree: z.string().min(1),
  specialization: z.string().min(1),
  startMonthYear: z.any(),
  endMonthYear: z.any(),
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
    control,
    formState: { errors },
  } = useForm<EducationData>({
    defaultValues: {
      ...defaultValues,
      startMonthYear: defaultValues?.startMonthYear
        ? dayjs(defaultValues.startMonthYear)
        : null,
      endMonthYear: defaultValues?.endMonthYear
        ? dayjs(defaultValues.endMonthYear)
        : null,
    },
    resolver: zodResolver(educationSchema),
  });

  const onSubmit = (data: EducationData) => {
    const formattedData = {
      ...data,
      startMonthYear: data.startMonthYear?.format("YYYY-MM"),
      endMonthYear: data.endMonthYear?.format("YYYY-MM"),
    };
    onSave(formattedData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FormTextField
            label="Academy Name"
            placeholder="Eg. IIT Delhi"
            valueProp="academy"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          />

          <FormTextField
            label="Degree"
            placeholder="Eg. B.Tech, M.Sc"
            valueProp="degree"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          />

          <FormTextField
            label="Specialization"
            placeholder="Eg. Computer Science, Mechanical"
            valueProp="specialization"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={commonFormTextFieldSx}
          />

          <Box p={2}>
            <Controller
              name="startMonthYear"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  views={["year", "month"]}
                  label="Start Month & Year"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.startMonthYear,
                      sx: commonFormTextFieldSx,
                    },
                  }}
                />
              )}
            />
          </Box>

          <Box p={2} pt={0}>
            <Controller
              name="endMonthYear"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  views={["year", "month"]}
                  label="End Month & Year"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endMonthYear,
                      sx: commonFormTextFieldSx,
                    },
                  }}
                />
              )}
            />
          </Box>

          <Stack direction="row" spacing={2} p={1} px={2}>
            <BeyondResumeButton type="submit" variant="contained">
              Save
            </BeyondResumeButton>
            <Button onClick={onCancel}>Cancel</Button>
          </Stack>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
