import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { z } from "zod";
import FormAutocomplete2 from "../../../components/form/FormAutocompleteWithoutFiltering";
import FormSelect from "../../../components/form/FormSelect";
import FormTextField from "../../../components/form/FormTextField";
import {
  industryCategories,
  industryClassificationProduct,
  industryClassificationService,
  industryType,
} from "../../../components/form/data";
import {
  awardSchema,
  companySchema,
  gallerySchema,
  newsSchema,
} from "../../../components/form/schema";
import { useNewSnackbar } from "../../../components/shared/useSnackbar";
import { commonFormTextFieldSx } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../../components/util/CommonStyle";
import CustomSnackbar from "../../../components/util/CustomSnackbar";
import { getUserId } from "../../../services/axiosClient";
import {
  insertBulkDataInTable,
  searchDataFromTable,
  searchListDataFromTable,
  syncDataInTable,
  updateByIdDataInTable,
} from "../../../services/services";
import { useIndustry } from "../../../components/context/IndustryContext";

const CompanyForm = () => {
  const [loading, setLoading] = useState(true);
  const { snackbarProps, showSnackbar } = useNewSnackbar();
  const [selectedIndustryCategory, setSelectedIndustryCategory] = useState("");
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {},
  });

  const { industryName } = useIndustry();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await searchDataFromTable("companyInfo", {
          createdBy: getUserId(),
        });

        const prevData = res?.data?.data || {};

        // reset form with previous data
        reset({
          industryName: prevData?.industryName || industryName,
          industryCategory: prevData?.industryCategory || "",
          industryType: prevData?.industryType || "",
          industryClassification: prevData?.industryClassification || "",
          description: prevData?.description || "",
          establishedYear: prevData?.establishedYear || undefined,
          headquartersCity: prevData?.headquarters?.city || "",
          headquartersState: prevData?.headquarters?.state || "",
          headquartersCountry: prevData?.headquarters?.country || "",
          companyContactEmail: prevData?.companyContactEmail || "",
          companyContactPhone: prevData?.companyContactPhone || "",
          primaryContactName: prevData?.primaryContactName || "",
          primaryContactEmail: prevData?.primaryContactEmail || "",
          primaryContactPhone: prevData?.primaryContactPhone || "",
          website: prevData?.website || "",
          logoUrl: prevData?.logoUrl || "",
          bannerUrl: prevData?.bannerUrl || "",
          linkedin: prevData?.socialLinks?.linkedin || "",
          insta: prevData?.socialLinks?.insta || "",
          twitter: prevData?.socialLinks?.twitter || "",
          fb: prevData?.socialLinks?.fb || "",
        });

        setSelectedIndustryCategory(prevData?.industryCategory || "");
      } catch (err) {
        console.error("Error fetching default values:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  useEffect(() => {
    setValue("industryCategory", selectedIndustryCategory);
  }, [setValue, selectedIndustryCategory]);

  const selectedType = watch("industryType");

  const classificationOptions =
    selectedType === "Product Based"
      ? industryClassificationProduct
      : selectedType === "Service Based"
      ? industryClassificationService
      : [];

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    const {
      headquartersCity,
      headquartersState,
      headquartersCountry,
      linkedin,
      insta,
      twitter,
      fb,
      ...rest
    } = data;

    const socialLinks: Record<string, string> = {};
    if (linkedin) socialLinks.linkedin = linkedin;
    if (insta) socialLinks.insta = insta;
    if (twitter) socialLinks.twitter = twitter;
    if (fb) socialLinks.fb = fb;

    const payload = {
      ...rest,
      createdBy: getUserId(),
      headquarters: {
        city: headquartersCity,
        state: headquartersState,
        country: headquartersCountry,
      },
      socialLinks,
    };

    console.log(payload);

    try {
      await syncDataInTable("companyInfo", payload, "createdBy");
      showSnackbar("Details Updated Successfully", "success");
      location.href = `/beyond-resume-company-profile`;
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="newtons-cradle">
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
        </div>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
        <Typography textAlign={"center"} gutterBottom ml={2} variant="h5">
          Company Details Form
        </Typography>
        <FormTextField
          label="Industry Name"
          valueProp="industryName"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
          readonly
        />

        <FormAutocomplete2
          label="Industry Category"
          options={industryCategories}
          defaultValue={selectedIndustryCategory}
          labelProp="industryCategory"
          primeryKey="industryId"
          setter={setSelectedIndustryCategory}
          sx={{ ...commonFormTextFieldSx }}
          px={2}
        />
        {errors["industryCategory"] && errors["industryCategory"].message && (
          <FormHelperText
            sx={{
              display: "flex",
              alignItems: "center",
              color: "red !important",
              ml: 3,
            }}
            error
          >
            <FontAwesomeIcon
              icon={faXmarkCircle}
              style={{ marginRight: 4, fontSize: "18px" }}
            />
            {errors["industryCategory"].message}
          </FormHelperText>
        )}

        <FormSelect
          // defaultValue={{ industryType: watch("industryType") }}
          options={industryType}
          label="Industry Type"
          valueProp="industryType"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />



        <FormSelect
          // defaultValue={{
          //   industryClassification: watch("industryClassification"),
          // }}
          options={classificationOptions}
          label="Industry Classification"
          valueProp="industryClassification"
          errors={errors}
          register={register}
          withValidationClass={false}
          sx={commonFormTextFieldSx}
        />

        <FormTextField
          label="Description"
          valueProp="description"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <Box p={2} pb={0}>
          <Controller
            name="establishedYear"
            control={control}
            render={({ field }) => (
              <DatePicker
                views={["year"]}
                label="Established Year"
                value={field.value ? dayjs().year(field.value) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    const year = newValue.year();
                    field.onChange(year);
                  } else {
                    field.onChange(undefined);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.establishedYear,
                    sx: commonFormTextFieldSx,
                  },
                }}
              />
            )}
          />
        </Box>

        <FormTextField
          label="Headquarters City"
          valueProp="headquartersCity"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Headquarters State"
          valueProp="headquartersState"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Headquarters Country"
          valueProp="headquartersCountry"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Website"
          valueProp="website"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Logo"
          valueProp="logoUrl"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Banner"
          valueProp="bannerUrl"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Primary Contact Name"
          valueProp="primaryContactName"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Primary Contact Email"
          valueProp="primaryContactEmail"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Primary Contact Phone"
          valueProp="primaryContactPhone"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Company Contact Email"
          valueProp="companyContactEmail"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Company Contact Phone"
          valueProp="companyContactPhone"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="LinkedIn"
          valueProp="linkedin"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Instagram"
          valueProp="insta"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Twitter"
          valueProp="twitter"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <FormTextField
          label="Facebook"
          valueProp="fb"
          register={register}
          errors={errors}
          sx={commonFormTextFieldSx}
        />
        <BeyondResumeButton
          sx={{ mt: 2, mx: "auto", display: "flex" }}
          type="submit"
          variant="contained"
        >
          Save
        </BeyondResumeButton>
      </Box>
      <CustomSnackbar {...snackbarProps} />
    </LocalizationProvider>
  );
};

const GalleryForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof gallerySchema>>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { gallery: [{ imageUrl: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery",
  });

  const onSubmit = (data: any) => {
    console.log("Gallery Data:", data);
  };

  const canAdd = () => fields.every((f) => f.imageUrl);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      <Typography gutterBottom variant="h5">
        Gallery
      </Typography>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
        >
          <FormTextField
            label={`Image URL ${index + 1}`}
            valueProp={`gallery.${index}.imageUrl`}
            register={register}
            errors={errors}
            sx={{ mb: 1 }}
          />
          {fields.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
            >
              Delete
            </Button>
          )}
        </Box>
      ))}

      {fields.length < 3 && (
        <Button
          variant="outlined"
          onClick={() => canAdd() && append({ imageUrl: "" })}
          sx={{ mr: 2 }}
        >
          Add
        </Button>
      )}
      <Button type="submit" variant="contained">
        Save
      </Button>
    </Box>
  );
};

type Award = {
  cAwardId?: number; // optional
  title: string;
  description: string;
  imageURL: string;
};

type AwardsFormValues = {
  awards: Award[];
};

function AwardsForm() {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AwardsFormValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: { awards: [{ title: "", description: "", imageURL: "" }] },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "awards",
  });

  const [loaded, setLoaded] = useState(false);

  // Load existing awards for the user
  useEffect(() => {
    const loadAwards = async () => {
      const res = await searchListDataFromTable("companyAwards", {
        createdBy: getUserId(),
      });
      const prevData = res?.data?.data || [];

      if (prevData.length) {
        // Replace default fields with existing awards
        replace(prevData);
      }
      setLoaded(true);
    };

    loadAwards();
  }, [replace]);

  const onSubmit = async (data: AwardsFormValues) => {
    console.log(data);

    const formatted = data.awards.map((a: any) => ({
      cAwardId: a.cAwardId, // undefined for new entries
      title: a.title,
      description: a.description,
      imageURL: a.imageURL,
      industryId: a.industryId || 0,
      createdBy: getUserId(),
      createdAt: a.createdAt || new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    }));

    try {
      const newAwards = formatted.filter((a: any) => !a.cAwardId);
      const updateAwards = formatted.filter((a: any) => a.cAwardId);

      //   console.log(newAwards);
      //   console.log(updateAwards);

      if (newAwards.length) {
        await insertBulkDataInTable("companyAwards", newAwards);
      }

      if (updateAwards.length) {
        await Promise.all(
          updateAwards.map((award: any) =>
            updateByIdDataInTable(
              "companyAwards",
              award.cAwardId,
              award,
              "cAwardId"
            )
          )
        );
      }

      alert("Awards saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  const canAdd = () => {
    const values = getValues("awards");
    return values.every((a: any) => a.title && a.description && a.imageURL);
  };

  if (!loaded) return <div>Loading...</div>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      {fields.map((field, index) => {
        console.log(fields);

        return (
          <Box key={field.id}>
            <Controller
              name={`awards.${index}.title`}
              control={control}
              defaultValue={field.title || ""}
              render={({ field }) => (
                <TextField {...field} label="Title" fullWidth />
              )}
            />
            <Controller
              name={`awards.${index}.description`}
              control={control}
              defaultValue={field.description || ""}
              render={({ field }) => (
                <TextField {...field} label="Description" fullWidth />
              )}
            />
            <Controller
              name={`awards.${index}.imageURL`}
              control={control}
              defaultValue={field.imageURL || ""}
              render={({ field }) => (
                <TextField {...field} label="Image URL" fullWidth />
              )}
            />
            <input type="hidden" {...register(`awards.${index}.cAwardId`)} />
            {fields.length > 1 && (
              <FontAwesomeIcon
                onClick={() => remove(index)}
                icon={faXmarkCircle}
              />
            )}
          </Box>
        );
      })}

      {/* {fields.length < 3 && ( */}
      <BeyondResumeButton2
        variant="outlined"
        onClick={() => {
          if (canAdd()) {
            append({ title: "", description: "", imageURL: "" });
          } else {
            alert(
              "Please fill all fields of the previous award before adding a new one."
            );
          }
        }}
        sx={{ mr: 2 }}
      >
        Add
      </BeyondResumeButton2>

      <BeyondResumeButton type="submit" variant="contained">
        Save
      </BeyondResumeButton>
    </Box>
  );
}

const NewsForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      news: [
        { title: "", description: "", imageURL: "" },
        { title: "", description: "", imageURL: "" },
        { title: "", description: "", imageURL: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "news" });

  const onSubmit = (data: any) => console.log("News Data:", data);
  const canAdd = () =>
    fields.every((f) => f.title && f.description && f.imageURL);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
      <Typography variant="h6">News</Typography>
      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}
        >
          <FormTextField
            label="Title"
            valueProp={`news.${index}.title`}
            register={register}
            errors={errors}
            sx={{ mb: 1 }}
          />
          <FormTextField
            label="Description"
            valueProp={`news.${index}.description`}
            register={register}
            errors={errors}
            sx={{ mb: 1 }}
          />
          <FormTextField
            label="Image URL"
            valueProp={`news.${index}.imageURL`}
            register={register}
            errors={errors}
            sx={{ mb: 1 }}
          />
          {fields.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
            >
              Delete
            </Button>
          )}
        </Box>
      ))}
      {fields.length < 3 && (
        <Button
          variant="outlined"
          onClick={() =>
            canAdd() && append({ title: "", description: "", imageURL: "" })
          }
          sx={{ mr: 2 }}
        >
          Add
        </Button>
      )}
      <Button type="submit" variant="contained">
        Save
      </Button>
    </Box>
  );
};

const CompanyProfileForm = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mx: "auto",
            mt: 4,
            pb: 1.5,
            px: 2,
            "& .MuiTab-root": {
              fontSize: "16px",
              color: "white",
              background: "#2d3436",
              borderRadius: "40px",
              marginRight: "16px",
              padding: "8px 24px",
              minHeight: "0px",
              textTransform: "none",
              border: "1px solid #ffffff44",
            },
            "& .Mui-selected": {
              background: color.activeButtonBg,
              color: "white !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Tab label="Company" />
          <Tab label="Gallery" />
          <Tab label="Awards" />
          <Tab label="News" />
        </Tabs>
      </Box> */}

      {tabIndex === 0 && <CompanyForm />}
      {/* {tabIndex === 1 && <GalleryForm />}
      {tabIndex === 2 && <AwardsForm />}
      {tabIndex === 3 && <NewsForm />} */}
    </Box>
  );
};

export default CompanyProfileForm;
