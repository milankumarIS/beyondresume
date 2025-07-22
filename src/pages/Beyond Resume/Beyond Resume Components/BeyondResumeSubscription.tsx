import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router";
import { pricingPlans } from "../../../components/form/data";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import color from "../../../theme/color";
import { useTheme } from "../../../components/util/ThemeContext";

const PricingCard = ({
  plan,
  index,
  hoveredIndex,
  setHoveredIndex,
  duration,
  designOnly,
  setSelectedPlan,
}) => {
  const history = useHistory();

  const handleProceed = () => {
    history.push({
      pathname: "/beyond-resume-payment",
      state: {
        plan,
        duration,
      },
    });
  };

  const isHovered = hoveredIndex === index;
  const price = plan.prices[duration] ?? 0;
  const monthlyPrice = plan.prices["1month"];
  const discount =
    duration !== "1month" && monthlyPrice
      ? Math.round(
          ((monthlyPrice * parseInt(duration) - price) /
            (monthlyPrice * parseInt(duration))) *
            100
        )
      : 0;
  const { theme } = useTheme();

  return (
    <Box
      p={1}
      sx={{
        background:
          plan.title === "Starter" ? color.activeButtonBg : "transparent",
        borderRadius: 4,
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transition: "all 0.6s ease",
        pb: 0,
      }}
    >
      <Card
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{
          width: 280,
          borderRadius: 4,
          position: "relative",
          zIndex: isHovered ? 2 : 1,
          // transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "all 0.6s ease",
          // background: isHovered ? "black" : "white",
          // color: isHovered ? "#fff" : "black",
          border: "solid 2px",
          borderColor: isHovered ? color.newFirstColor : "transparent",
          background: theme === "dark" ? 'white' : color.jobCardBgLight,
          color: "black",
          boxShadow: isHovered
            ? "0px 0px 15px rgba(80, 188, 246, 0.3)"
            : "4px 4px 15px rgba(0, 0, 0, 0.11)",
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: color.activeButtonBg,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              display: "inline-block",
              fontFamily: "custom-bold",
            }}
          >
            ₹{price}
            <Typography
              variant="body2"
              component="span"
              fontFamily={"Custom-ExtraBold"}
            >
              {duration === "lifetime" ? " / lifetime" : ` / ${duration}`}
            </Typography>
          </Typography>

          {discount > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: "white",
                p: 0.5,
                fontSize: "12px",
                px: 1.5,
                borderRadius: "0px 0px 0px 8px",
                fontWeight: "bold",
                mb: 1,
                position: "absolute",
                top: 0,
                right: 0,
                background: color.background,
              }}
            >
              {discount}% OFF
            </Typography>
          )}
          <Typography variant="h6" mb={0} fontFamily="Custom-ExtraBold">
            {plan.title}
          </Typography>
          <Typography variant="body2" mb={2} fontFamily="Montserrat-regular">
            {plan.description}
          </Typography>
          <Stack spacing={1} mb={3}>
            {plan.features.map((feature, i) => (
              <Typography
                key={i}
                fontFamily="Montserrat-regular"
                fontSize="14px"
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: "4px" }}
                />
                {feature.label}
              </Typography>
            ))}
          </Stack>
          {designOnly ? (
            <BeyondResumeButton
              variant="contained"
              fullWidth
              onClick={() => history.push("/beyond-resume-pricing")}
              style={{
                border: "solid 1px black",
                borderColor: isHovered ? "white" : "black",
                background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                color: "white",
              }}
            >
              View Plan
            </BeyondResumeButton>
          ) : (
            <BeyondResumeButton
              variant="contained"
              fullWidth
              onClick={handleProceed}
              sx={{
                border: "solid 1px black",
                borderColor: isHovered ? "white" : "black",
                background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
                color: "white",
              }}
            >
              Proceed
            </BeyondResumeButton>
          )}
        </CardContent>
      </Card>
      {plan.title === "Starter" && (
        <Typography
          sx={{
            textAlign: "center",
            p: 1,
            fontFamily: "custom-bold",
            color:'white'
          }}
        >
          RECOMMENDED
        </Typography>
      )}
    </Box>
  );
};

const BeyondResumeSubscription = ({
  duration,
  designOnly,
  setSelectedPlan,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div style={{ marginBottom: "64px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 4,
          position: "relative",
        }}
      >
        {pricingPlans.map((plan, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              zIndex: hoveredIndex === index ? 2 : 1,
            }}
          >
            <PricingCard
              plan={plan}
              index={index}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              duration={duration}
              designOnly={designOnly}
              setSelectedPlan={setSelectedPlan}
            />
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default BeyondResumeSubscription;
