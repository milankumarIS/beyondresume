import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useHistory } from "react-router";
import "./Proceed.css";

const Proceed = ({ setIsOpen, isOpen, dismissprop, fromHome }: any) => {
  const history = useHistory();
  const handleClick = () => {
    location.href = "/signup";
    dismiss();
    if (!fromHome) dismissprop();
  };

  const handleClick1 = () => {
    // location.href = "/login";
    dismiss();
    if (!fromHome) dismissprop();
  };

  function dismiss() {
    setIsOpen(false);
  }

  return (
    <Modal open={isOpen} onClose={dismiss}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          borderRadius: 2,
          overflowY: "scroll",
          maxHeight: "90vh",
          height: "fit-content",
          pb: 4,
        }}
      >
        <FontAwesomeIcon
          onClick={() => setIsOpen(false)}
          style={{
            fontSize: "24px",
            color: "red",
            position: "absolute",
            right: 15,
            top: 10,
            cursor: "pointer",
          }}
          icon={faClose}
        ></FontAwesomeIcon>

        <Box>
          <Box className="proceed_welcome">
            <Typography className="proceed_welcome">Welcome,</Typography>
          </Box>

          <Box className="proceed_text">
            <Typography className="proceed_text" sx={{ px: 2 }}>
              Please login or signup to continue using our app.
            </Typography>
          </Box>

          <Box className="proceed_img">
            <img style={{width:'100%'}} className="proceed_img1" src="./assets/Workers.png"></img>
          </Box>

          {/* <Box className="proceed_text1">
            <Typography className="proceed_text1">Login with your username</Typography>
          </Box> */}

          <Box className="proceed_login_btns">
            <Button onClick={handleClick1} className="proceed_login_btn">
              Login
            </Button>
          </Box>

          <Box className="proceed_text2">
            <Typography className="proceed_text2">
              Don't have an account?
            </Typography>
            <Typography onClick={handleClick} className="proceed_signup">
              Sign up
            </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Proceed;
