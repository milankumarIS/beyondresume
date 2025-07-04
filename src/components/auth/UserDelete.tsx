import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { getUserId } from "../../services/axiosClient";
import { logout, updateByIdDataInTable } from "../../services/services";

function UserDelete({ isSet, setIsSet, openSnackBar }: any) {
  const onConfirm = () => {
    updateByIdDataInTable(
      "user",
      getUserId(),
      { userStatus: "PASSIVE" },
      "userId"
    )
      .then((result: any) => {
        openSnackBar(result?.data?.msg);
        setIsSet(false);
        logout("login");
      })
      .catch((error) => {
        openSnackBar(error?.response?.data?.msg);
      });
  };

  const handleClose = () => {
    setIsSet(false);
  };

  return (
    <Dialog open={isSet} onClose={handleClose}>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete your account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="primary">
          No
        </Button>
        <Button variant="contained" onClick={onConfirm} color="error" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserDelete;
