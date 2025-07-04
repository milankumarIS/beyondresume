import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import { useHistory } from "react-router";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass, faHourglass1, faHourglass2 } from "@fortawesome/free-solid-svg-icons";
import color from "../../../theme/color";

const BeyondResumeUpgradeRequiredModal = ({ open }) => {
  const history = useHistory();

  const handleRedirect = () => {
    history.push("/beyond-resume-pricing");
  };

  return (
    <Modal
      open={open}
      onClose={() => {}}
      closeAfterTransition
      //   slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus
    >
      <Fade in={open}>
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 400,
            mx: "auto",
            mt: "30vh",
            textAlign: "center",
            color: "black",
          }}
        >
          <FontAwesomeIcon
            style={{
              background: color.background,
              borderRadius: "999px",
              padding: "8px",
              color: "white",
              width: "24px",
              height: "24px",
            }}
            icon={faHourglass2}
          />
          <Typography variant="h6" mt={2} fontWeight="bold" gutterBottom>
            Your Access Has Ended
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            To continue using premium features, please choose a subscription
            plan or modify existing plan.
          </Typography>
          <BeyondResumeButton
            variant="contained"
            color="primary"
            onClick={handleRedirect}
            fullWidth
          >
            View Plans
          </BeyondResumeButton>
        </Box>
      </Fade>
    </Modal>
  );
};

export default BeyondResumeUpgradeRequiredModal;
