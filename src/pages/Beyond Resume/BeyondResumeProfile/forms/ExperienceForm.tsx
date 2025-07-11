import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { jobFunctions, jobType } from "../../../../components/form/data";
import FormSelect from "../../../../components/form/FormSelect";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";
import FormAutocomplete2 from "../../../../components/form/FormAutocompleteWithoutFiltering";
import { useEffect, useState } from "react";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import color from "../../../../theme/color";

const experienceSchema = z.object({
  jobTitle: z.string().min(1),
  company: z.string().min(1),
  years: z.string().min(1),
  employmentType: z.string(),
  current: z.boolean(),
  noticePeriod: z.string().optional(),
});

type ExperienceData = z.infer<typeof experienceSchema>;

export default function ExperienceForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: ExperienceData;
  onSave: (data: ExperienceData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceData>({
    defaultValues,
    resolver: zodResolver(experienceSchema),
  });

  const isCurrent = watch("current");
  const [selectedJobTitle, setSelectedJobTitle] = useState(
    defaultValues?.jobTitle || ""
  );

  useEffect(() => {
    setValue("jobTitle", selectedJobTitle);
  }, [selectedJobTitle, setValue]);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack spacing={2}>
        <FormAutocomplete2
          label="Job Title"
          options={jobFunctions}
          defaultValue={selectedJobTitle}
          labelProp=""
          primeryKey=""
          setter={setSelectedJobTitle}
          sx={{ ...commonFormTextFieldSx, marginTop: "12px" }}
          px={2}
          mt={2}
          search={""}
        />
        <FormTextField
          label="Company Name"
          placeholder="Eg. TCS, Infosys"
          valueProp="company"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />

        <FormTextField
          label="Experience"
          placeholder="Eg. 2 years"
          valueProp="years"
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            sx={commonFormTextFieldSx}
            style={{
              margin: "auto",
              marginBottom: "-4px",
              marginTop: "14px",
              padding: "6px 0px",
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
            }}
            control={
              <Checkbox
                icon={<FontAwesomeIcon icon={faCircle} />}
                checkedIcon={<FontAwesomeIcon icon={faCircleCheck} />}
                sx={{
                  color: "transparent",
                  border: "solid 2px",
                  borderColor: color.newFirstColor,
                  padding: 0,
                  margin: "4px",
                  "&.Mui-checked": {
                    color: color.newFirstColor,
                  },
                }}
                {...register("current")}
                defaultChecked={defaultValues?.current}
              />
            }
            label="Currently working here"
          />
        </Box>
        {isCurrent && (
          <FormTextField
            valueProp="noticePeriod"
            errors={errors}
            register={register}
            withValidationClass={false}
            sx={{ ...commonFormTextFieldSx, marginTop: "0px" }}
            label="Notice Period"
          />
        )}
        <Stack direction="row" spacing={2} p={1} px={2}>
          <BeyondResumeButton type="submit" variant="contained">
            Save
          </BeyondResumeButton>
          <Button color="inherit" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
