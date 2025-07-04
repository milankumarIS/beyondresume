import styled from "@emotion/styled";
import {
  faChevronRight,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { getUserId } from "../../services/axiosClient";
import {
  searchListDataFromTable,
  syncByTwoUniqueKeyData,
  UploadFileInTable,
} from "../../services/services";
import TitleHeader from "../shared/Header/TitleHeader";
import { useSnackbar } from "../shared/SnackbarProvider";
import AddressSelectionModal from "../util/AddressSelectionModal";
import { storeType } from "./data";
import FormSelect from "./FormSelect";
import FormTextField from "./FormTextField";
import { storeDetailsSchema, storeDetailsSchemaType } from "./schema";
import YearPicker from "./YearPicker";

const DeliveryBox = styled.div`
  display: flex;
  align-items: center;
  border: solid 1px grey;
  gap: 5px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 12px;
  min-height: 70px;
  color: black;
  justify-content: space-between;
  margin-left: 16px;
  margin-right: 16px;
`;

interface Address {
  type: string;
  villageOrHouseNumber: string;
  street: string;
  post: string;
  policeStation: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

const StoreDetailsForm: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [open1, setOpen1] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [myAdresses, setMyAdresses] = useState<any>([]);
  const [modules, setModules] = useState<any[]>([]);
  const history = useHistory();
  const openSnackBar = useSnackbar();
  const [year, setYear] = React.useState<number | null>(null);
  const queryParams: any = new URLSearchParams(location.search);
  const moduleCode = queryParams.get("moduleCode");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<storeDetailsSchemaType>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      storeName: "",
      storeType: storeType[0],
      moduleId: parseInt(queryParams.get("moduleId") || "1"),
      GSTINNumber: "",
      storeContact: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024) {
        setImageError("Image size should not exceed 50KB.");
        return;
      }
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: storeDetailsSchemaType) => {
    let payload = {
      ...data,
      yearOfEstablishment: year,
      userId: getUserId(),
      moduleId: getValues("moduleId"),
      storeLocationId: selectedAddress.addressId,
      sellerStatus: "APPLIED",
    };

    if (file) {
      syncByTwoUniqueKeyData(
        `${moduleCode}_seller`,
        payload,
        "userId",
        "moduleId"
      )
        .then(async (result: any) => {
          const formData = new FormData();
          formData.append("file", file);
          UploadFileInTable(
            `${moduleCode}_seller`,
            {
              primaryKey: "sellerId",
              primaryKeyValue: result?.data?.data?.sellerId,
              fieldToUpload: "storeImage",
              folderName: `${moduleCode}_seller/storeImages`,
            },
            formData
          )
            .then(() => {
              openSnackBar(result?.data?.msg);
              history.goBack();
            })
            .catch((error) => {
              openSnackBar(
                "There is an error occured during the file upload may be it is due to the file size. File size should be less than 1MB"
              );
            });
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    } else {
      openSnackBar("please upload store image");
    }
  };

  const handleOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    handleClose1();
  };

  useEffect(() => {
    searchListDataFromTable("address", { userId: getUserId() }).then(
      (result: any) => {
        setMyAdresses([...result?.data?.data]);
        if (result?.data?.data?.length > 0) {
          setSelectedAddress(result?.data?.data[0]);
        }
      }
    );
  }, []);

  const onErrorHandler = (error: any) => {
    console.log(error);
  };

  return (
    <div className="ion-padding">
      <TitleHeader title="Store Details" />

      <form noValidate onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label htmlFor="file-upload">
            <Box
              sx={{
                width: 150,
                height: 150,
                border: "2px dotted grey",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              {avatarPreview ? (
                <Box
                  component="img"
                  src={avatarPreview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Add Store Image
                </Typography>
              )}
            </Box>
          </label>
          <input
            type="file"
            accept="image/*"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>
        {imageError && (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {imageError}
          </Typography>
        )}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <FormTextField
              label="Store Name"
              valueProp="storeName"
              errors={errors}
              register={register}
            />
            <FormSelect
              options={storeType}
              defaultValue={{ storeType: storeType[0] }}
              label="Store Type"
              valueProp="storeType"
              errors={errors}
              register={register}
            />
            <FormTextField
              label="Store Contact"
              valueProp="storeContact"
              errors={errors}
              register={register}
            />

            <FormTextField
              label="GSTIN"
              valueProp="GSTINNumber"
              errors={errors}
              register={register}
            />

            <YearPicker
              label="ESTD. Year"
              setYear={setYear}
              value={null}
            ></YearPicker>
          </Box>
          <DeliveryBox onClick={handleOpen1}>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "5px",
              }}
            >
              <Typography sx={{ textAlign: "left" }}>
                <FontAwesomeIcon
                  style={{ marginRight: "5px" }}
                  icon={faStore}
                />
                Store Location{" "}
              </Typography>
              <Typography>
                {selectedAddress
                  ? `${selectedAddress.villageOrHouseNumber}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zipcode}`
                  : myAdresses && myAdresses[0]
                  ? `${myAdresses[0].villageOrHouseNumber || ""}, ${
                      myAdresses[0].street || ""
                    }, ${myAdresses[0].city || ""}, ${
                      myAdresses[0].zipcode || ""
                    }`
                  : ""}
              </Typography>
            </Box>

            <FontAwesomeIcon
              onClick={handleOpen1}
              style={{ marginLeft: "5px" }}
              icon={faChevronRight}
            />
          </DeliveryBox>

          <AddressSelectionModal
            open={open1}
            onClose={handleClose1}
            addresses={myAdresses}
            onSelect={handleAddressSelect}
          />
        </Box>
        <Box sx={{ marginTop: 3, textAlign: "center" }}>
          <Button
            type="submit"
            sx={{
              backgroundColor: "#0a5c6b",
              color: "white",
              textTransform: "none",
              fontSize: 18,
              padding: "5px 25px",
              boxShadow: "1px 1px 10px #00000058",
              "&:hover": {
                backgroundColor: "#074a57",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default StoreDetailsForm;
