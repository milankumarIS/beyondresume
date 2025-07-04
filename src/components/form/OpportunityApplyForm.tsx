
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormLabel,
  Grid2,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import { getUserId, getUserSelectedModuleId } from "../../services/axiosClient";
import {
  getDataFromTable,
  insertDataInTable,
  searchListDataFromTable,
  updateByIdDataInTable,
} from "../../services/services";
import TitleHeader from "../shared/Header/TitleHeader";
import { useSnackbar } from "../shared/SnackbarProvider";
import CapsuleSelector from "../util/CapsuleSelector";
import QuillInputEditor from "../util/QuilInputEditor";
import RequiredStar from "../util/RequiredStar";
import CountrySelectWithSearch from "./CountrySelectWIthSearch";
import { contactStatusType, jobType } from "./data";
import BasicDatePicker from "./DatePicker";
import FormAutocomplete from "./FormAutocomplete";
import FormSelect from "./FormSelect";
import FormTextField from "./FormTextField";
import { JobApplySchemaType, jobApplySchema } from "./schema";

interface Capsule {
  id: number;
  label: string;
}
const degreeAndSpecialisation = [
  "Bachelor's in Computer Science",
  "Master's in Business Administration",
  "Bachelor's in Mechanical Engineering",
  "Master's in Data Science",
];

const bonusSalary = ["Yes", "No"];
const hiringFrequency = ["Weekly", "Monthly", "Yearly"];

const capsuleData: Capsule[] = [
  { id: 1, label: "Age" },
  { id: 2, label: "Preferred Language" },
  { id: 3, label: "Assets" },
  { id: 4, label: "Skills" },
  { id: 5, label: "Degree and Specialisation" },
  { id: 6, label: "Preferred Industry" },
];

const assets: Capsule[] = [
  { id: 1, label: "Bike" },
  { id: 2, label: "License" },
  { id: 3, label: "Aadhar Card" },
  { id: 4, label: "PAN Card" },
  { id: 5, label: "Heavy Driver License" },
  { id: 6, label: "Camera" },
  { id: 7, label: "Laptop" },
  { id: 8, label: "Auto / Rickshow" },
  { id: 9, label: "Tempo" },
  { id: 10, label: "Tempo Traveller / Van" },
  { id: 11, label: "Yulu / E-Bike" },
];

const preferredLanguage: Capsule[] = [
  { id: 1, label: "English" },
  { id: 2, label: "Hindi" },
  { id: 3, label: "Marathi" },
  { id: 4, label: "Punjabi" },
  { id: 5, label: "Kannada" },
  { id: 6, label: "Bengali" },
  { id: 7, label: "Telegu" },
  { id: 8, label: "Tamil" },
  { id: 9, label: "Gujurati" },
  { id: 10, label: "Urdu" },
  { id: 11, label: "Malayalam" },
  { id: 12, label: "Odia" },
  { id: 13, label: "Assamese" },
  { id: 14, label: "Sontali" },
  { id: 15, label: "Meitei (Manipuri)" },
  { id: 16, label: "Sanskrit" },
];

const preferredIndustry: Capsule[] = [
  { id: 1, label: "Any Industry" },
  { id: 2, label: "Education" },
  { id: 3, label: "Retail" },
  { id: 4, label: "Finance" },
  { id: 5, label: "Health Care" },
  { id: 6, label: "Real Estate" },
  { id: 7, label: "Consumer Goods (FMCG)" },
  { id: 8, label: "BPO / Call Centre" },
  { id: 9, label: "Banking" },
  { id: 10, label: "Advertising and Marketing" },
  { id: 11, label: "Insurance" },
  { id: 12, label: "Telecom / ISP" },
  { id: 13, label: "Credit Card" },
  { id: 14, label: "Automobile" },
  { id: 15, label: "Loan" },
];

const skillsRequiredForJob: Capsule[] = [
  { id: 1, label: "React" },
  { id: 2, label: "JavaScript" },
  { id: 3, label: "CSS" },
  { id: 4, label: "Node.js" },
  { id: 5, label: "Python" },
  { id: 6, label: "Django" },
  { id: 7, label: "Angular" },
  { id: 8, label: "Vue.js" },
  { id: 9, label: "MySQL" },
  { id: 10, label: "MongoDB" },
  { id: 11, label: "AWS" },
  { id: 12, label: "Azure" },
  { id: 13, label: "DevOps" },
  { id: 14, label: "HTML" },
  { id: 15, label: "TypeScript" },
  { id: 16, label: "Excel" },
];

const OpportunityApplyForm: React.FC = () => {
  const [filteredSubCategory, setFilteredSubCategory] = useState<any[]>([]);
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobApplySchemaType>({
    resolver: zodResolver(jobApplySchema),
    defaultValues: {
      categoryId: 1,
      subCategoryId: 1,
      dailyOppertunityStatus: "ACTIVE",
      country: "India",
      state: "Odisha",
      city: "Bhubaneswar",
    },
  });
  const location = useLocation();
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [selectedCapsules, setSelectedCapsules] = useState<Capsule[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>();
  const jobDetail: any = location.state;
  const [gender, setGender] = useState(jobDetail?.gender);
  const [experience, setExperience] = useState(jobDetail?.experienceRequired);
  const [qualification, setQualification] = useState(jobDetail?.qualification);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [selectedCity, setSelectedCity] = useState<any>(0);
  const [listCategory, setListCategory] = useState<any[]>([]);
  const [listSubCategory, setListSubCategory] = useState<any[]>([]);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [lastDateOfApply, setLastDateOfApply] = useState(
    jobDetail?.lastDateOfApply || new Date()
  );
  const [selectedValues, setSelectedValues] = useState({
    Assets: jobDetail?.assets,
    Skills: jobDetail?.skillsRequiredForJob,
    "Preferred Language": jobDetail?.preferredLanguage,
    "Preferred Industry": jobDetail?.preferredIndustry,
  });

  const handleCapsuleSelect = (category: string, selectedItems: any[]) => {
    setSelectedValues((prev: any) => ({
      ...prev,
      [category]: selectedItems,
    }));
  };

  const getContryOptions = () => {
    getDataFromTable("country").then((result: { data: { data: any } }) => {
      setCountries([...result?.data?.data]);
    });
  };

  const getStateOptions = (countryName: string) => {
    const filteredCountry = countries.find((o) => o.name === countryName);
    if (filteredCountry) {
      searchListDataFromTable("state", { countryId: filteredCountry.id })
        .then((result: { data: { data: any } }) => {
          setStates([...result?.data?.data]);
        })
        .catch((error: any) => console.error("Error fetching states:", error));
    } else {
      setStates([]);
    }
  };

  const getCityOptions = (stateName: string) => {
    const filteredState = states.find(
      (o: { name: any }) => o.name === stateName
    );
    const filteredCountry = countries.find(
      (o) => o.name === getValues("country")
    );
    if (filteredState && filteredCountry) {
      searchListDataFromTable("city", {
        countryId: filteredCountry.id,
        stateId: filteredState.id,
      })
        .then((result: { data: { data: any } }) => {
          setCities([...result?.data?.data]);
          setValue("city", jobDetail?.city || "Bhubaneswar");
        })
        .catch((error: any) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  };

  useEffect(() => {
    if (jobDetail?.assets?.length > 0) {
      setSelectedCapsules((value) => [
        ...value,
        capsuleData.filter((o) => o.label === "Assets")[0],
      ]);
    }
    if (jobDetail?.skillsRequiredForJob?.length > 0) {
      setSelectedCapsules((value) => [
        ...value,
        capsuleData.filter((o) => o.label === "Skills")[0],
      ]);
    }
    if (jobDetail?.preferredLanguage?.length > 0) {
      setSelectedCapsules((value) => [
        ...value,
        capsuleData.filter((o) => o.label === "Preferred Language")[0],
      ]);
    }
    if (jobDetail?.preferredIndustry?.length > 0) {
      setSelectedCapsules((value) => [
        ...value,
        capsuleData.filter((o) => o.label === "Preferred Industry")[0],
      ]);
    }
  }, []);

  useEffect(() => {
    getContryOptions();
  }, []);

  useEffect(() => {
    const selectedCountry = getValues("country");
    if (selectedCountry) {
      getStateOptions(selectedCountry);
    }
  }, [countries]);

  useEffect(() => {
    const selectedState = getValues("state");
    if (selectedState) {
      getCityOptions(selectedState);
    }
  }, [states]);

  useEffect(() => {
    searchListDataFromTable("category", {
      categoryStatus: "ACTIVE",
      moduleId: getUserSelectedModuleId(),
    }).then((categories: any) => {
      setListCategory(categories?.data?.data || []);
      searchListDataFromTable("subCategory", {
        subCategoryStatus: "ACTIVE",
      }).then((result: any) => {
        setListSubCategory([...result?.data?.data]);
        if (jobDetail) {
          setValue("categoryId", jobDetail?.categoryId);
          setValue("subCategoryId", jobDetail?.subCategoryId);
          getFilteredSubCategory(
            categories?.data?.data,
            result?.data?.data,
            jobDetail?.categoryId
          );
        } else {
          getFilteredSubCategory(
            categories?.data?.data,
            result?.data?.data,
            categories?.data?.data[0]?.categoryId
          );
        }
      });
    });
  }, [jobDetail]);

  const getFilteredSubCategory = (
    category: any[],
    subCats: any[],
    categoryId: any
  ) => {
    if (Array.isArray(category) && category.length > 0) {
      setFilteredSubCategory([
        ...subCats
          .filter((o: any) => o.categoryId === categoryId)
          .sort((a: any, b: any) =>
            a.subCategoryName.localeCompare(b.subCategoryName)
          ),
      ]);
    }
  };

  const handleAddCapsule = (capsule: Capsule) => {
    if (!selectedCapsules.some((item) => item.id === capsule.id)) {
      setSelectedCapsules([...selectedCapsules, capsule]);
    }
  };

  const handleRemoveCapsule = (capsuleId: number) => {
    setSelectedCapsules(
      selectedCapsules.filter((capsule) => capsule.id !== capsuleId)
    );
  };

  const handleExperienceChange = (event, newExperience) => {
    if (newExperience !== null) {
      setExperience(newExperience);
      setValue("experienceRequired", newExperience);
    }
  };

  const handleGenderChange = (event, newGender) => {
    if (newGender !== null) {
      setGender(newGender);
      setValue("gender", newGender);
    }
  };

  const handleQualificationChange = (event, newQualification) => {
    if (newQualification !== null) {
      setQualification(newQualification);
      setValue("qualification", newQualification);
    }
  };

  const onSubmitHandler = (data: any) => {
    const payload = {
      ...data,
      jobDescription: description,
      authorId: getUserId(),
      lastDateOfApply,
      assets: selectedValues["Assets"]?.map((item: any) => item.label) || [],
      skillsRequiredForJob:
        selectedValues["Skills"]?.map((item: any) => item.label) || [],
      preferredLanguage:
        selectedValues["Preferred Language"]?.map((item: any) => item.label) ||
        [],
      preferredIndustry:
        selectedValues["Preferred Industry"]?.map((item: any) => item.label) ||
        [],
    };

    console.log("Payload:", payload);
    if (jobDetail?.dailyOppertunityId) {
      updateByIdDataInTable(
        "dailyOppertunities",
        jobDetail?.dailyOppertunityId,
        payload,
        "dailyOppertunityId"
      )
        .then((result: any) => {
          openSnackBar(result?.data?.msg);
          history.push("/opportunitySearch");
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    } else {
      insertDataInTable("dailyOppertunities", payload)
        .then((result: any) => {
          openSnackBar(result?.data?.msg);
          history.push("/opportunitySearch");
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    }
  };

  useEffect(() => {
    fetchDescription();
  }, []);

  const handleQuill = (content: string) => {
    setDescription(content);
    if (content.trim()) {
      if (content.replace(/<\/?[^>]+(>|$)/g, "").length >= 10) {
        setError(null);
      } else {
        setError("Description must be at least 10 characters.");
      }
    } else {
      setError("Description is required.");
    }
  };
  const fetchDescription = async () => {
    const fetchedDescription = jobDetail?.jobDescription;
    setDescription(fetchedDescription);
  };
  const renderFields = (capsule: Capsule) => {
    switch (capsule.label) {
      case "Age":
        return (
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
          >
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "#0a5c6b",
                  marginLeft: "15px",
                }}
              >
                Minimum Age
              </Typography>
              <FormTextField
                fieldType="number"
                defaultValue={jobDetail?.minimumAge}
                label="Eg. 18"
                valueProp="minimumAge"
                errors={errors}
                register={register}
              />
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "#0a5c6b",
                  marginLeft: "15px",
                }}
              >
                Maximum Age
              </Typography>
              <FormTextField
                fieldType="number"
                defaultValue={jobDetail?.maximumAge}
                label="Eg. 40"
                valueProp="maximumAge"
                errors={errors}
                register={register}
              />
            </Box>
          </Box>
        );

      case "Degree and Specialisation":
        return (
          <Box sx={{ width: { xs: "100%", md: "50%" }, marginLeft: "-20px" }}>
            <FormSelect
              options={degreeAndSpecialisation}
              defaultValue={{
                degreeAndSpecialisation: jobDetail?.degreeAndSpecialisation,
              }}
              label="Degree and Specialisation"
              valueProp="degreeAndSpecialisation"
              errors={errors}
              register={register}
            />
          </Box>
        );

      case "Assets":
      case "Skills":
      case "Preferred Language":
      case "Preferred Industry":
        return (
          <CapsuleSelector
            capsules={
              capsule.label === "Assets"
                ? assets
                : capsule.label === "Skills"
                ? skillsRequiredForJob
                : capsule.label === "Preferred Language"
                ? preferredLanguage
                : preferredIndustry
            }
            preselectedCapsules={
              selectedValues[capsule.label]?.map((label) => ({
                id:
                  capsuleData.find((item) => item.label === capsule.label)
                    ?.id || 0,
                label,
              })) || []
            }
            onCapsuleSelect={(selected) =>
              handleCapsuleSelect(capsule.label, selected)
            }
          />
        );

      default:
        return null;
    }
  };

  const renderCategory = (selectedCategory: any) => {
    if (Array.isArray(listCategory) && listCategory.length > 0) {
      return (
        <FormAutocomplete
          setter={setValue}
          filteringFullOption={listSubCategory}
          setFilteredOption={setFilteredSubCategory}
          filtering={true}
          options={listCategory}
          defaultValue={{ categoryId: selectedCategory }}
          label={"Category"}
          valueProp={"categoryId"}
          labelProp={"categoryName"}
          primeryKey={"categoryId"}
          errors={errors}
          register={register}
        ></FormAutocomplete>
      );
    } else {
      return (
        <FormAutocomplete
          setter={setValue}
          filteringFullOption={listSubCategory}
          setFilteredOption={setFilteredSubCategory}
          filtering={true}
          options={listCategory}
          defaultValue={{ categoryId: selectedCategory }}
          label={"Category"}
          valueProp={"categoryId"}
          labelProp={"categoryName"}
          primeryKey={"categoryId"}
          errors={errors}
          register={register}
        ></FormAutocomplete>
      );
    }
  };

  const renderSubCategory = (selectedSubCategory: any) => {
    if (Array.isArray(filteredSubCategory) && filteredSubCategory.length > 0) {
      return (
        <FormAutocomplete
          setter={setValue}
          options={filteredSubCategory}
          defaultValue={{ subCategoryId: selectedSubCategory }}
          filteringFullOption={listSubCategory}
          setFilteredOption={setFilteredSubCategory}
          filtering={false}
          labelProp={"subCategoryName"}
          primeryKey={"subCategoryId"}
          label={"Sub Category"}
          valueProp={"subCategoryId"}
          errors={errors}
          register={register}
        ></FormAutocomplete>
      );
    } else {
      return (
        <FormAutocomplete
          setter={setValue}
          options={filteredSubCategory}
          defaultValue={{ subCategoryId: selectedSubCategory }}
          filteringFullOption={listSubCategory}
          setFilteredOption={setFilteredSubCategory}
          filtering={false}
          labelProp={"subCategoryName"}
          primeryKey={"subCategoryId"}
          label={"Sub Category"}
          valueProp={"subCategoryId"}
          errors={errors}
          register={register}
        ></FormAutocomplete>
      );
    }
  };
  return (
    <div className="ion-padding">
      <TitleHeader title={jobDetail ? "Edit Opportunity" : "Add Opportunity"} />
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#0a5c6b",
              marginLeft: "20px",
              marginTop: "30px",
            }}
          >
            Basic Job Details
          </Typography>
        </FormLabel>
        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Category
        </Typography>
        {renderCategory(jobDetail?.categoryId || listCategory[0]?.categoryId)}
        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Sub Category
        </Typography>
        {renderSubCategory(
          jobDetail?.subCategoryId || filteredSubCategory[0]?.subCategoryId
        )}

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Job Title <RequiredStar />
        </Typography>
        <FormTextField
          required={true}
          defaultValue={jobDetail?.jobTitle}
          label="Enter the Job Title"
          valueProp="jobTitle"
          errors={errors}
          register={register}
        />

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginTop: "20px",
            marginLeft: "20px",
          }}
        >
          Job Type
        </Typography>
        <FormSelect
          options={jobType}
          defaultValue={{ jobType: jobDetail?.jobType }}
          label="Enter the Job Type"
          valueProp="jobType"
          errors={errors}
          register={register}
        />

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Job Location
        </Typography>
        <Box
          sx={{
            margin: "0px 16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid2 spacing={2}
            container
            className="jobs_card_row"
            style={{ marginTop: "20px" }}
          >
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <CountrySelectWithSearch
                options={countries}
                defaultValue={jobDetail?.country}
                label={"Country"}
                onSelectionChange={(country: string) => {
                  setValue("country", country);
                  getStateOptions(country);
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <CountrySelectWithSearch
                options={states}
                defaultValue={jobDetail?.state}
                label={"State"}
                onSelectionChange={(state: string) => {
                  setValue("state", state);
                  getCityOptions(state);
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <CountrySelectWithSearch
                options={cities}
                defaultValue={jobDetail?.city}
                label={"City"}
                onSelectionChange={(city: string) => {
                  setValue("city", city);
                  setSelectedCity(city);
                }}
              />
            </Grid2>
          </Grid2>
        </Box>

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          No Of Openings
        </Typography>
        <FormTextField
          defaultValue={jobDetail?.noOfVacancy}
          label="Enter the number of vacancies"
          valueProp="noOfVacancy"
          errors={errors}
          register={register}
        />
        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#0a5c6b",
              marginLeft: "20px",
              marginTop: "30px",
            }}
          >
            Total Experience of Candidate
          </Typography>
        </FormLabel>
        <ToggleButtonGroup
          value={experience}
          exclusive
          onChange={handleExperienceChange}
          aria-label="experience"
          sx={{
            marginLeft: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <ToggleButton
            value="Any"
            aria-label="any"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Any
          </ToggleButton>
          <ToggleButton
            value="Freshers"
            aria-label="freshers"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Freshers
          </ToggleButton>
          <ToggleButton
            value="Experienced Only"
            aria-label="experienced"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Experienced Only
          </ToggleButton>
        </ToggleButtonGroup>

        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#0a5c6b",
              marginLeft: "20px",
              marginTop: "20px",
            }}
          >
            Gender of Candidate
          </Typography>
        </FormLabel>
        <ToggleButtonGroup
          value={gender}
          exclusive
          onChange={handleGenderChange}
          aria-label="gender"
          sx={{
            marginLeft: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <ToggleButton
            value="Both"
            aria-label="both"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Both
          </ToggleButton>
          <ToggleButton
            value="Male"
            aria-label="male"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Male
          </ToggleButton>
          <ToggleButton
            value="Female"
            aria-label="female"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Female
          </ToggleButton>
          <ToggleButton
            value="Others"
            aria-label="others"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.7rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Others
          </ToggleButton>
        </ToggleButtonGroup>

        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#0a5c6b",
              marginLeft: "20px",
              marginTop: "20px",
            }}
          >
            Qualification of Candidate
          </Typography>
        </FormLabel>
        <ToggleButtonGroup
          value={qualification}
          exclusive
          onChange={handleQualificationChange}
          aria-label="qualification"
          sx={{
            marginLeft: "20px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <ToggleButton
            value="Any"
            aria-label="Any"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Any
          </ToggleButton>
          <ToggleButton
            value="Below 10th"
            aria-label="Below 10th"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Below 10th
          </ToggleButton>
          <ToggleButton
            value="10th Pass or above"
            aria-label="10th Pass or above"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            10th Pass or above
          </ToggleButton>
          <ToggleButton
            value="12th Pass or above"
            aria-label="12th Pass or above"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            12th Pass or above
          </ToggleButton>
          <ToggleButton
            value="Graduate or Post Graduate"
            aria-label="Graduate or Post Graduate"
            sx={{
              border: "2px solid #0a5c6b",
              borderRadius: "10px",
              color: "#0a5c6b",
              fontSize: { xs: "0.8rem", md: "1rem" },
              "&.Mui-selected": {
                color: "#fff",
                backgroundColor: "#0a5c6b",
              },
            }}
          >
            Graduate or Post Graduate
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Monthly In-hand Salary
        </Typography>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <FormTextField
              fieldType="number"
              defaultValue={jobDetail?.estimatedLowSalary}
              label="Low Salary Estimate in LPA"
              valueProp="estimatedLowSalary"
              errors={errors}
              register={register}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100vw", md: "fit-content" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                width: "fit-content",
                padding: 1.5,
                color: "#0a5c6b",
                backgroundColor: "#c8ccc9",
                fontSize: "1.5rem",
                mt: 2,
                borderRadius: "10px",
              }}
            >
              To
            </Typography>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <FormTextField
              fieldType="number"
              defaultValue={jobDetail?.estimatedHighSalary}
              label="High Salary Estimate in LPA"
              valueProp="estimatedHighSalary"
              errors={errors}
              register={register}
            />
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Do you offer bonus in addition to monthly salary?
        </Typography>
        <FormSelect
          options={bonusSalary}
          defaultValue={{ bonusSalary: jobDetail?.bonusSalary }}
          label="Bonus Salary"
          labelProp={"bonusSalary"}
          valueProp="bonusSalary"
          errors={errors}
          register={register}
        ></FormSelect>

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Job Info / Job Description
        </Typography>

        <Box
          sx={{
            marginBottom: 2,
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginTop: "20px",
          }}
        >
          <Box sx={{ m: 2 }}>
            <QuillInputEditor
              // toolbarOptions={customToolbar}

              value={jobDetail?.jobDescription || description}
              setValue={handleQuill}
              placeholder="Write Job Description"
            />
            {error && (
              <Typography
                style={{ marginTop: "-15px" }}
                color="error"
                variant="caption"
              >
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            margin: "30px 16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Accordion>
            <AccordionSummary
              expandIcon={
                <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "#0a5c6b",
                }}
              >
                Personal details, Education, additional info
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                {selectedCapsules.map((capsule, index) => (
                  <Box
                    key={index}
                    sx={{
                      fontSize: "0.8rem",
                      backgroundColor: "#0a5c6b",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      color: "#fff",
                      fontWeight: "bold",
                      gap: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {capsule.label}
                    <IconButton color="inherit">
                      <FontAwesomeIcon
                        style={{ fontSize: "1.1rem" }}
                        icon={faXmark}
                        onClick={() => handleRemoveCapsule(capsule.id)}
                      ></FontAwesomeIcon>
                    </IconButton>
                  </Box>
                ))}
                {selectedCapsules.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No details added yet
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                {capsuleData.map((capsule: any) => (
                  <Button
                    key={capsule.id}
                    onClick={() => handleAddCapsule(capsule)}
                    sx={{
                      fontSize: "0.8rem",
                      backgroundColor: "#0a5c6b",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      gap: 1,
                      "&:hover": {
                        backgroundColor: capsule.color,
                        opacity: 0.8,
                      },
                    }}
                    disabled={selectedCapsules.some(
                      (item) => item.id === capsule.id
                    )}
                  >
                    {capsule.label}+
                  </Button>
                ))}
              </Box>

              {selectedCapsules.map((capsule) => (
                <Box
                  key={capsule.id}
                  sx={{
                    fontSize: "0.8rem",
                    width: "100%",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "16px",
                    mb: 2,
                    position: "relative",
                  }}
                >
                  <IconButton
                    color="inherit"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => handleRemoveCapsule(capsule.id)}
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: "1.1rem" }}
                      icon={faXmark}
                    ></FontAwesomeIcon>
                  </IconButton>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {capsule.label}
                  </Typography>

                  {renderFields(capsule)}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          sx={{
            margin: "0px 16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Accordion>
            <AccordionSummary
              expandIcon={
                <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "#0a5c6b",
                }}
              >
                Timings
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      color: "#0a5c6b",
                      marginLeft: "30px",
                    }}
                  >
                    Job Timings
                  </Typography>
                  <Box
                    sx={{
                      fontSize: "1.2rem",
                      color: "#0a5c6b",
                      marginLeft: "10px",
                      marginRight: "20px",
                      mb: 2,
                    }}
                  >
                    <FormTextField
                      defaultValue={jobDetail?.jobTiming}
                      label="9:30 AM - 6:30 PM | Monday to Saturday"
                      valueProp="jobTiming"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                </Box>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      color: "#0a5c6b",
                      marginLeft: "30px",
                    }}
                  >
                    Interview Details
                  </Typography>
                  <Box
                    sx={{
                      fontSize: "1.2rem",
                      color: "#0a5c6b",
                      marginLeft: "10px",
                      marginRight: "20px",
                    }}
                  >
                    <FormTextField
                      defaultValue={jobDetail?.interviewDetails}
                      label="11:00 AM - 4:00 PM | Monday to Saturday"
                      valueProp="interviewDetails"
                      errors={errors}
                      register={register}
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        <FormLabel component="legend" sx={{ marginBottom: 1 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              color: "#0a5c6b",
              marginLeft: "20px",
              marginTop: "40px",
            }}
          >
            About Your Company
          </Typography>
        </FormLabel>

        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              Company Name <RequiredStar />
            </Typography>
            <FormTextField
              defaultValue={jobDetail?.companyName}
              label="Company Name"
              valueProp="companyName"
              errors={errors}
              register={register}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              Size of Organization
            </Typography>
            <FormTextField
              fieldType="number"
              defaultValue={jobDetail?.sizeOfOrganization}
              label="Enter the size of organization"
              valueProp="sizeOfOrganization"
              errors={errors}
              register={register}
            />
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              Phone Number <RequiredStar />
            </Typography>
            <FormTextField
              defaultValue={jobDetail?.contactPhoneNumber}
              label="Contact Phone"
              valueProp="contactPhoneNumber"
              errors={errors}
              register={register}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              Email Id <RequiredStar />
            </Typography>
            <FormTextField
              defaultValue={jobDetail?.contactEmail}
              label="Contact Email"
              valueProp="contactEmail"
              errors={errors}
              register={register}
            />
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              Job Address
            </Typography>
            <Box
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginTop: "15px",
              }}
            >
              <FormTextField
                multiline
                rows={4}
                defaultValue={jobDetail?.jobAddress}
                label="Job Address"
                valueProp="jobAddress"
                errors={errors}
                register={register}
              />
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontSize: "1.2rem",
                color: "#0a5c6b",
                marginLeft: "20px",
                marginTop: "20px",
              }}
            >
              How often do you have a new job vacancy?
            </Typography>
            <FormSelect
              options={hiringFrequency}
              defaultValue={{ hiringFrequency: jobDetail?.hiringFrequency }}
              label="Hiring Frequency"
              labelProp={"hiringFrequency"}
              valueProp="hiringFrequency"
              errors={errors}
              register={register}
            ></FormSelect>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Job Source Link
        </Typography>
        <FormTextField
          defaultValue={jobDetail?.dailyOppertunitySourceLink}
          label="Job source link (if any)"
          valueProp="dailyOppertunitySourceLink"
          errors={errors}
          register={register}
        />
        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Last Date Of Apply
        </Typography>
        <BasicDatePicker
          label={"Last Date"}
          setDate={setLastDateOfApply}
          minimum={lastDateOfApply}
          value={lastDateOfApply}
        ></BasicDatePicker>

        <Typography
          sx={{
            fontSize: "1.2rem",
            color: "#0a5c6b",
            marginLeft: "20px",
            marginTop: "20px",
          }}
        >
          Status
        </Typography>
        <FormSelect
          options={contactStatusType}
          defaultValue={{
            dailyOppertunityStatus:
              jobDetail?.dailyOppertunityStatus ||
              getValues("dailyOppertunityStatus"),
          }}
          label="Status"
          valueProp="dailyOppertunityStatus"
          errors={errors}
          register={register}
        />
        <Box sx={{ textAlign: "center" }}>
          <Button
            style={{
              marginTop: "20px",
              background: "#0a5c6b",
              color: "white",
              textTransform: "none",
              fontSize: "18px",
              padding: "5px 25px",
              boxShadow: "1px 1px 10px #00000058",
            }}
            type="submit"
          >
            {jobDetail ? "Save Changes" : "Add Opportunity"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default OpportunityApplyForm;
