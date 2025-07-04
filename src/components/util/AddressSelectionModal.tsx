import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";

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

interface AddressSelectionModalProps {
  open: boolean;
  onClose: () => void;
  addresses: Address[];
  onSelect: (address: Address) => void;
}

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

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  open,
  onClose,
  addresses,
  onSelect,
}) => {
  const history = useHistory();

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div
          style={{ marginBottom: "20px", borderRadius: "10px" }}
          className="add_member_header"
        >
          Select Address
        </div>

        <Box
          className="custom-scrollbar"
          sx={{
            width: "100%",
            display: "flex",
            gap: 3,
            p: 2,
            overflowX: "scroll",
          }}
        >
          {addresses?.map((address, index) => (
            <Box
              key={index}
              style={{
                justifyContent: "space-around",
                display: "flex",
              }}
            >
              <Box
                onClick={() => onSelect(address)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "200px",
                  minWidth: "300px",
                  boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.1)",
                  p: 2,
                  position: "relative",
                  pt: 3,
                  gap: 0.5,
                  borderRadius: "12px",
                  border: "solid 2px white",
                  color: "black",
                  cursor: "pointer",
                  transition: "all ease 0.3s",
                  "&:hover": {
                    border: "solid 2px #0a5c6b",
                  },
                }}
              >
                <Typography sx={{ fontWeight: "bold", marginBottom: "5px" }}>
                  Address Type: {address.type}
                </Typography>
                <Typography> {address.villageOrHouseNumber}</Typography>
                <Typography>{address.street}</Typography>
                <Typography>
                  {address.post}, {address.policeStation}
                </Typography>
                <Typography>
                  {address.city}, {address.state} ,{address.zipcode}
                </Typography>
                <Typography>{address.country}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Button
          id="button"
          variant="contained"
          onClick={() => history.push("/address")}
          style={{
            margin: "auto",
            fontSize: "18px",
            marginTop: "20px",
          }}
        >
          + Add Address
        </Button>
      </Box>
    </Modal>
  );
};

export default AddressSelectionModal;
