import styled from "@emotion/styled";
import {
  faChevronDown,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import {
  getUserId,
  getUserSelectedModuleCode,
  getUserSelectedModuleId,
} from "../../services/axiosClient";
import {
  searchListDataFromTable,
  syncByTwoUniqueKeyData,
  UploadFileInTable,
} from "../../services/services";
import TitleHeader from "../shared/Header/TitleHeader";
import { useSnackbar } from "../shared/SnackbarProvider";
import AddressSelectionModal from "../util/AddressSelectionModal";
import ImageUploader from "../util/ImageUploader";
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

const StoreEditForm: React.FC = () => {
  const [open1, setOpen1] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [myAdresses, setMyAdresses] = useState<any>([]);

  const history = useHistory();
  const openSnackBar = useSnackbar();
  const moduleCode = getUserSelectedModuleCode();
  const location = useLocation<any>();
  let storeEdit: any = location.state;
  const sellerProfile = location.state;

  const [year, setYear] = React.useState<number | null>(
    storeEdit?.yearOfEstablishment
      ? dayjs(`${storeEdit.yearOfEstablishment}-01-01`).year()
      : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<storeDetailsSchemaType>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      // storeName: "",
      // storeType: "",
      moduleId: parseInt(getUserSelectedModuleId()),
    },
  });

  const handleImageUpload = (file: File) => {
    if (file) {
      setFile(file);
    }
  };

  const onSubmit = (data: storeDetailsSchemaType) => {
    let payload = {
      ...data,
      yearOfEstablishment: year,
      userId: getUserId(),
      moduleId: sellerProfile?.moduleId || getUserSelectedModuleId(),
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
          await UploadFileInTable(
            `${moduleCode}_seller`,
            {
              primaryKey: "sellerId",
              primaryKeyValue: result?.data?.data?.sellerId,
              fieldToUpload: "storeImage",
              folderName: `${moduleCode}_seller/storeImages`,
            },
            formData
          );
          openSnackBar(result?.data?.msg);
          history.goBack();
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
    } else {
      syncByTwoUniqueKeyData(
        `${moduleCode}_seller`,
        payload,
        "userId",
        "moduleId"
      )
        .then((result: any) => {
          openSnackBar(result?.data?.msg);
          // setEditable(false);
          history.goBack();
        })
        .catch((error) => {
          openSnackBar(error?.response?.data?.msg);
        });
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

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minHeight: 300,
    width: "95%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
  };

  const renderStoreEdit = () => {
    {
      if (storeEdit) {
        return (
          <>
            <FormTextField
              defaultValue={storeEdit?.storeName}
              label="Store Name"
              valueProp={"storeName"}
              errors={errors}
              register={register}
            />
            <FormSelect
              options={storeType}
              defaultValue={{ storeType: storeEdit?.storeType || storeType[0] }}
              label="Store Type"
              valueProp="storeType"
              errors={errors}
              register={register}
            />
            <FormTextField
              defaultValue={storeEdit?.storeContact}
              label="Store Contact"
              valueProp="storeContact"
              errors={errors}
              register={register}
            />

            <FormTextField
              defaultValue={storeEdit?.GSTINNumber}
              label="GSTIN"
              valueProp="GSTINNumber"
              errors={errors}
              register={register}
            />

            <YearPicker
              label="ESTD. Year"
              setYear={setYear}
              value={year ? `${year}-01-01` : null}
            />
          </>
        );
      } else {
        return (
          <>
            <FormTextField
              label="Store Name"
              valueProp={"storeName"}
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
              label={"ESTD. Year"}
              setYear={setYear}
              value={"yearOfEstablishment"}
            ></YearPicker>
          </>
        );
      }
    }
  };

  return (
    <div className="ion-padding">
      <TitleHeader title="Edit Store Details" />
      <form noValidate onSubmit={handleSubmit(onSubmit, onErrorHandler)}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageUploader
            onUpload={handleImageUpload}
            placeholderText="Change Store Image"
            initialImage={storeEdit?.storeImage}
          />
        </Box>

        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>{renderStoreEdit()}</Box>

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
              style={{ marginRight: "5px" }}
              icon={faChevronDown}
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
            Update Changes
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default StoreEditForm;
