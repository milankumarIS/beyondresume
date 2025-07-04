import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { logout } from "../../services/services";
import "./Logout.css";

function Logout({ isSet, setIsSet }: any) {
  const handleClose = () => {
    setIsSet(false);
  };

  const handleLogout = () => {
    setIsSet(false);
    logout("login");
  };

  return (
    <Dialog open={isSet} onClose={handleClose}>
      <DialogTitle>Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleLogout}
          color="error"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Logout;
