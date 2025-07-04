import { useLocation, useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { BeyondResumeButton } from "../../components/util/CommonStyle";
import { useState, useEffect, useRef } from "react";
import { getProfile, syncDataInTable } from "../../services/services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripe } from "@fortawesome/free-brands-svg-icons";
import { getUserId, getUserRole } from "../../services/axiosClient";
import { commonFormTextFieldSx } from "../../components/util/CommonFunctions";

const BeyondResumePayment = () => {
  const location = useLocation();
  const history = useHistory();
  const { plan, duration }: any = location.state || {};

  //   console.log(plan)
  //   console.log(duration)

  if (!plan || !duration) {
    return (
      <Typography>No plan selected. Go back and choose a plan.</Typography>
    );
  }

  const price = plan.prices[duration];
  const [currentUser, setCurrentUser] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const [securityCode, setSecurityCode] = useState(["BR12", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidDigitInput = (val: string) => /^[0-9]+$/.test(val);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = e.target.value.replace(/\s/g, "");

    if (index === 0) {
      const withoutBR = rawValue.replace(/^BR/, ""); // Strip BR if user somehow retypes it
      const digitsOnly = withoutBR.replace(/[^0-9]/g, "").slice(0, 2); // max 2 digits
      setSecurityCode((prev) => {
        const newCode = [...prev];
        newCode[0] = "BR" + digitsOnly;
        return newCode;
      });

      if (digitsOnly.length === 2) {
        inputRefs.current[1]?.focus();
      }
      return;
    }

    // For index 1-3
    const digitsOnly = rawValue.replace(/[^0-9]/g, "").slice(0, 4);
    setSecurityCode((prev) => {
      const newCode = [...prev];
      newCode[index] = digitsOnly;
      return newCode;
    });

    if (digitsOnly.length === 4 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (index === 0) {
        const digitsPart = securityCode[0].slice(2); // after BR
        if (digitsPart.length > 0) {
          // Remove last digit
          setSecurityCode((prev) => {
            const newCode = [...prev];
            newCode[0] = "BR" + digitsPart.slice(0, -1);
            return newCode;
          });
        }
        e.preventDefault(); // Prevent default backspace from triggering
      } else if (!securityCode[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirmCode = () => {
    const enteredCode = securityCode.join("");
    if (enteredCode === "BR12123456789012") {
      syncSubscription();
      setOpenModal(false);
    } else {
      setErrorMsg("Incorrect code. Please try again.");
    }
  };

  useEffect(() => {
    getProfile().then((result: any) => {
      setCurrentUser({ ...result?.data?.data });
    });
  }, []);

  const syncSubscription = async () => {
    const now = new Date();
    const startDate = now.toISOString();

    let endDate: string;

    if (duration === "lifetime") {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 100);
      endDate = future.toISOString();
    } else {
      const months = parseInt(duration);
      const future = new Date();
      future.setMonth(future.getMonth() + months);
      endDate = future.toISOString();
    }

    const payload = {
      planName: plan?.title,
      createdBy: getUserId(),
      duration: duration,
      price: price,
      role: getUserRole(),
      brPaymentStatus: "ACTIVE",
      startDate,
      endDate,
    };

    //   console.log(payload);

    try {
      await syncDataInTable("brPayments", payload, "createdBy");
      history.push("/beyond-resume-interviews");
    } catch (error) {
      console.error("Error saving ", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [openModal]);

  return (
    <Box
      sx={{
        color: "white",
        background:
          "linear-gradient(180deg,rgb(255, 255, 255),rgb(220, 220, 220))",
        position: "relative",
        padding: "16px",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Custom-Bold",
          color: "black",
          width: "fit-content",
          p: 4,
          pb: 2,
          borderRadius: "12px",
          textAlign: "center",
          m: "auto",
          lineHeight: 1,
        }}
      >
        Review and Pay
      </Typography>
      <Typography
        fontSize={"18px"}
        mb={4}
        maxWidth={"60%"}
        mx={"auto"}
        fontFamily="Montserrat-Regular"
        color="black"
        textAlign="center"
      >
        Complete your purchase securely with Stripe — a trusted platform for
        fast and safe online payments
      </Typography>

      <Box
        sx={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.46)",
          background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
          width: "fit-content",
          p: 2,
          mx: "auto",
          borderRadius: "12px",
          px: 4,
          color: "black",
        }}
      >
        <Box
          sx={{
            background: "#f7f9fc",
            borderRadius: "12px",
            p: 4,
            width: 400,
            mx: "auto",
            m: 2,
            textAlign: "left",
          }}
        >
          <Typography
            variant="h5"
            mb={2}
            textAlign={"center"}
            fontFamily={"custom-bold"}
            sx={{ textDecoration: "underline" }}
          >
            Billing Details
          </Typography>

          <Box mb={2}>
            <Typography fontFamily={"montserrat-regular"}>Name:</Typography>
            <Typography>
              {currentUser?.userPersonalInfo?.firstName} {""}
              {currentUser?.userPersonalInfo?.middleName}
              {""}
              {currentUser?.userPersonalInfo?.lastName}
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography fontFamily={"montserrat-regular"}>
              Email Address:
            </Typography>
            <Typography>{currentUser?.userContact?.userEmail}</Typography>
          </Box>

          <Box mb={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              fontFamily={"Custom-Bold"}
            >
              {duration === "lifetime"
                ? "Lifetime – " + plan.title + " Plan"
                : `${duration.replace("month", "")} Month${
                    duration !== "1month" ? "s" : ""
                  } – ${plan.title} Plan`}
            </Typography>
            <Typography fontFamily={"Custom-Bold"} sx={{ color: "green" }}>
              Save ₹{plan.prices["1month"] * parseInt(duration) - price} total
            </Typography>
          </Box>

          <Box mb={2}>
            <Typography fontFamily={"montserrat-regular"}>
              Total Billed
            </Typography>
            <Typography fontFamily={"Custom-Bold"} variant="h4">
              ₹{price}
            </Typography>
            <Typography fontSize="12px">
              One-time payment. No automatic renewal.
            </Typography>
          </Box>

          <BeyondResumeButton
            // onClick={() => {
            //   syncSubscription();
            // }}
            onClick={() => setOpenModal(true)}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ffc439",
              fontWeight: "bold",
              mt: 2,
            }}
          >
            Checkout with{" "}
            <FontAwesomeIcon
              style={{ fontSize: "38px", marginLeft: "8px" }}
              icon={faStripe}
            />
          </BeyondResumeButton>

          <BeyondResumeButton
            variant="outlined"
            fullWidth
            onClick={() => history.goBack()}
            sx={{ mt: 2 }}
          >
            Go Back
          </BeyondResumeButton>
          <Dialog open={openModal} onClose={() => {}} disableEscapeKeyDown>
            <DialogTitle textAlign="center">
              <Typography
                variant="h5"
                textAlign={"center"}
                fontFamily={"custom-bold"}
              >
                Enter Payment Code
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center" }}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: 0, mb: 1 }}
              >
                {securityCode.map((block, index) => (
                  <Grid item key={index}>
                    <TextField
                      sx={{
                        ...commonFormTextFieldSx,
                        mb: 2,
                        borderRadius: "12px",
                      }}
                      value={block}
                      inputProps={{
                        maxLength: 4,
                        style: {
                          textAlign: "center",
                          fontSize: "20px",
                          width: "4rem",
                          height: "3rem",
                          letterSpacing: "2px",
                        },
                        readOnly: index === 0 && securityCode[0].length <= 2,
                      }}
                      onChange={(e: any) => handleChange(e, index)}
                      onKeyDown={(e: any) => handleKeyDown(e, index)}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                    />
                  </Grid>
                ))}
              </Grid>

              {errorMsg && (
                <Typography color="error" mt={1} fontSize="14px">
                  {errorMsg}
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <BeyondResumeButton
                variant="contained"
                color="primary"
                onClick={handleConfirmCode}
                sx={{ px: 4 }}
              >
                Confirm Payment
              </BeyondResumeButton>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default BeyondResumePayment;
