import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormTextField from "../../../../components/form/FormTextField";
import { commonFormTextFieldSx } from "../../../../components/util/CommonFunctions";
import { BeyondResumeButton } from "../../../../components/util/CommonStyle";

const skillsSchema = z.object({
  skills: z.string().min(1, "Enter at least one skill"),
});

type SkillsData = z.infer<typeof skillsSchema>;

export default function SkillsForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: SkillsData;
  onSave: (data: SkillsData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsData>({
    defaultValues,
    resolver: zodResolver(skillsSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack spacing={2}>
        <FormTextField
          label="Skills"
          valueProp="skills"
          errors={errors}
          placeholder="Eg. React, Node.js"
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
