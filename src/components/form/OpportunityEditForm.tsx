import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button } from "@mui/material";
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
import BasicDatePicker from "./DatePicker";
import FormAutocomplete from "./FormAutocomplete";
import FormCountrySelectWIthSearch from "./FormCountrySelectWIthSearch";
import FormSelect from "./FormSelect";
import FormTextField from "./FormTextField";
import { contactStatusType, experienceRequired, jobType } from "./data";
import { JobPostSchemaType, jobPostSchema } from "./schema";

const OpportunityEditForm: React.FC = () => {
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const location = useLocation<any>();
  const jobDetail = location.state;
  const [jobs, setJobs] = useState<any[]>([]);
  const [lastDateOfApply, setLastDateOfApply] = useState(
    jobDetail?.lastDateOfApply || new Date()
  );
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [filteredSubCategory, setFilteredSubCategory] = useState<any[]>([]);
  const [listCategory, setListCategory] = useState<any[]>([]);
  const [listSubCategory, setListSubCategory] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);

  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobPostSchemaType>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      categoryId: 1,
      subCategoryId: 1,
      dailyOppertunityStatus: "ACTIVE",
      country: "India",
      state: "Odisha",
      city: "Bhubaneswar",
    },
  });

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

    searchListDataFromTable("oppertunitySkills", {
      oppertunitySkillStatus: "ACTIVE",
    }).then((response: any) => {
      setSkills(response?.data?.data || []);
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

  watch("subCategoryId");

  const onSubmitHandler = async (values: JobPostSchemaType) => {
    const payload = {
      ...values,
      authorId: getUserId(),
      lastDateOfApply,
      experienceRequired: values?.experienceRequired?.toString(),
    };

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
  const onErrorHandler = (error: any) => {
    console.log(error);
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
    <Box className="ion-padding">
      <TitleHeader title={jobDetail ? "Edit Opportunity" : "Add Opportunity"} />
      <form
        noValidate
        onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        {renderCategory(jobDetail?.categoryId || listCategory[0]?.categoryId)}
        {renderSubCategory(
          jobDetail?.subCategoryId || filteredSubCategory[0]?.subCategoryId
        )}

        <FormTextField
          defaultValue={jobDetail?.companyName}
          label="Company Name"
          valueProp="companyName"
          errors={errors}
          register={register}
        />
        <FormTextField
          defaultValue={jobDetail?.noOfVacancy}
          label="Number of Vacancies"
          valueProp="noOfVacancy"
          errors={errors}
          register={register}
        />
        <FormTextField
          defaultValue={jobDetail?.estimatedLowSalary}
          label="Low Salary Estimate in LPA"
          valueProp="estimatedLowSalary"
          errors={errors}
          register={register}
        />
        <FormTextField
          defaultValue={jobDetail?.estimatedHighSalary}
          label="High Salary Estimate in LPA"
          valueProp="estimatedHighSalary"
          errors={errors}
          register={register}
        />
        <FormTextField
          defaultValue={jobDetail?.contactPhoneNumber}
          label="Contact Phone (if any)"
          valueProp="contactPhoneNumber"
          errors={errors}
          register={register}
        />
        <FormTextField
          defaultValue={jobDetail?.contactEmail}
          label="Contact Email (if any)"
          valueProp="contactEmail"
          errors={errors}
          register={register}
        />
        {/* <Box sx={{ m: 2 }}>
          <QuillInputEditor
            value={getValues('jobDescription')}
            setValue={(content: any) => {
              setValue('jobDescription',content);
            }}
            placeholder="Write Job Description"
          ></QuillInputEditor>
        </Box> */}
        <FormTextField
          defaultValue={jobDetail?.dailyOppertunitySourceLink}
          label="Job source link (if any)"
          valueProp="dailyOppertunitySourceLink"
          errors={errors}
          register={register}
        />
        <FormSelect
          options={experienceRequired}
          defaultValue={{ experienceRequired: jobDetail?.experienceRequired }}
          label="Job Experience"
          valueProp="experienceRequired"
          errors={errors}
          register={register}
        />
        <FormSelect
          primeryKey="oppertunitySkillName"
          options={skills.filter(
            (o) => o.subCategoryId === getValues("subCategoryId")
          )}
          defaultValue={{
            skillsRequiredForJob: jobDetail?.skillsRequiredForJob,
          }}
          label="Skills"
          labelProp="oppertunitySkillName"
          valueProp="skillsRequiredForJob"
          errors={errors}
          register={register}
        />
        <FormSelect
          options={jobType}
          defaultValue={{ jobType: jobDetail?.jobType }}
          label="Job Type"
          valueProp="jobType"
          errors={errors}
          register={register}
        />
        <FormCountrySelectWIthSearch
          options={countries}
          defaultValue={jobDetail?.country ? jobDetail?.country : "India"}
          label={"Country"}
          valueProp={"country"}
          errors={errors}
          register={register}
          onSelectionChange={(countryName: string) => {
            getStateOptions(countryName);
            setValue("country", countryName);
          }}
        ></FormCountrySelectWIthSearch>

        <FormCountrySelectWIthSearch
          options={states}
          defaultValue={jobDetail?.state ? jobDetail?.state : "Odisha"}
          label={"State"}
          valueProp={"state"}
          errors={errors}
          register={register}
          onSelectionChange={(stateName: string) => {
            getCityOptions(stateName);
            setValue("state", stateName);
          }}
        ></FormCountrySelectWIthSearch>

        <FormCountrySelectWIthSearch
          options={cities}
          defaultValue={jobDetail?.city ? jobDetail?.city : "Bhubaneswar"}
          label={"City"}
          valueProp={"city"}
          errors={errors}
          register={register}
          onSelectionChange={(cityName: string) => {
            setValue("city", cityName);
          }}
        ></FormCountrySelectWIthSearch>
        <BasicDatePicker
          label={"Last Date"}
          setDate={setLastDateOfApply}
          minimum={lastDateOfApply}
          value={lastDateOfApply}
        ></BasicDatePicker>
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
      </form>
    </Box>
  );
};

export default OpportunityEditForm;
