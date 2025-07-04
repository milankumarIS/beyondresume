import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import BeyondResumeSubscription from "./Beyond Resume Components/BeyondResumeSubscription";
import { pricingPlans } from "../../components/form/data";
import { getUserId } from "../../services/axiosClient";
import {
  getProfile,
  searchDataFromTable,
  searchListDataFromTable,
} from "../../services/services";
import { BeyondResumeButton } from "../../components/util/CommonStyle";

export default function BeyondResumePricing() {
  const [duration, setDuration] = useState("1month");
  const handleTabChange = (event, newValue) => {
    setDuration(newValue);
  };
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [remainingMockInterviews, setRemainingMockInterviews] = useState(0);
  const [remainingJobPosts, setRemainingJobPosts] = useState(0);

  const [subscriptionData, setSubscriptionData] = useState({
    userName: "",
    phone: "",
    plan: "",
    daysLeft: 0,
    mockUsed: 0,
    mockTotal: 0,
    jobUsed: 0,
    jobTotal: 0,
  });

  //   console.log(subscriptionData);

  const categories = [
    {
      icon: "Shape 3",
      title: "Tailored Interview Practice",
      desc: "Premium users unlock custom mock interviews based on their resume or dream job, ensuring every practice session is aligned with their actual career goals.",
    },
    {
      icon: "Shape 7",
      title: "Real-Time Voice Interview Simulations",
      desc: "Experience advanced voice-based interviews that mimic real-world scenarios — available exclusively to Premium members for more immersive and confident preparation.",
    },
    {
      icon: "Shape 4",
      title: "Detailed AI Performance Insights",
      desc: "Gain access to in-depth analytics on every answer — from structure to tone — with actionable suggestions to help you improve and stand out in real interviews.",
    },
  ];

  useEffect(() => {
    const checkSubscription = async () => {
      const userId = getUserId();

      const [payments, interviews, jobs, user]: any = await Promise.all([
        searchDataFromTable("brPayments", {
          createdBy: userId,
          brPaymentStatus: "ACTIVE",
        }),
        searchListDataFromTable("brInterviews", {
          createdBy: userId,
          brInterviewStatus: "CONFIRMED",
        }),
        searchListDataFromTable("brJobs", {
          createdBy: userId,
          brJobStatus: "ACTIVE",
        }),
        getProfile(),
      ]);

      const payment = payments?.data?.data;

      setActiveSubscription(payment);
      const now = new Date();

      if (!payment || new Date(payment.endDate) < now) return;

        const planDetails = pricingPlans.find((plan) =>
          payment.planName?.toLowerCase().includes(plan.title.toLowerCase())
        );

    //   const planDetails = pricingPlans.find((plan) => plan.title === subscription.planName);

      const mockFeature = planDetails?.features.find((f) =>
        f.label.toLowerCase().includes("mock interview")
      );

      const jobFeature = planDetails?.features.find((f) =>
        f.label.toLowerCase().includes("job post")
      );

      const extractNumberFromLabel = (label: string): number => {
        const match = label.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };

    //   console.log(mockFeature);

      const mockTotal = mockFeature?.label
        ? extractNumberFromLabel(mockFeature.label)
        : 0;
      const jobTotal = jobFeature?.label
        ? extractNumberFromLabel(jobFeature.label)
        : 0;

      const mockUsed = interviews?.data?.data?.length || 0;
      const jobUsed = jobs?.data?.data?.length || 0;

      const end = new Date(payment.endDate);
      const daysLeft = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );

      const currentuser = user?.data?.data;

      setSubscriptionData({
        userName:
          `${currentuser?.userPersonalInfo?.firstName || ""} ${
            currentuser?.userPersonalInfo?.middleName || ""
          } ${currentuser?.userPersonalInfo?.lastName || ""}`.trim() || "User",
        phone: currentuser?.userContact?.userEmail || "",
        plan: payment.planName || "N/A",
        daysLeft,
        mockUsed,
        mockTotal,
        jobUsed,
        jobTotal,
      });
    };

    checkSubscription();
  }, []);

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
      {activeSubscription && (
        <>
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
            Your Active Plan
          </Typography>
          <SubscriptionGlassCard
            {...subscriptionData}
            onUpgrade={() =>
              document
                .getElementById("plan-details")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </>

        // <Box
        //   sx={{
        //     //   background: "#f4f4f4",
        //     p: 3,
        //     borderRadius: 2,
        //     maxWidth: "600px",
        //     mx: "auto",
        //     textAlign: "center",
        //     mt: 4,
        //     mb: 2,
        //     background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        //   }}
        // >
        //   <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        //     Current Plan: {activeSubscription.planName}
        //   </Typography>
        //   <Typography variant="body1">
        //     Duration:{" "}
        //     {new Date(activeSubscription.startDate).toLocaleDateString()} to{" "}
        //     {new Date(activeSubscription.endDate).toLocaleDateString()}
        //   </Typography>
        //   <Typography variant="body2" sx={{ mt: 1 }}>
        //     Days Left:{" "}
        //     {Math.max(
        //       0,
        //       Math.floor(
        //         (new Date(activeSubscription.endDate).getTime() -
        //           new Date().getTime()) /
        //           (1000 * 60 * 60 * 24)
        //       )
        //     )}
        //   </Typography>
        //   <Typography variant="body2" sx={{ mt: 1 }}>
        //     Mock Interviews Left: {remainingMockInterviews}
        //   </Typography>
        //   <Typography variant="body2" sx={{ mt: 0.5 }}>
        //     Job Posts Left: {remainingJobPosts}
        //   </Typography>

        //   <Button
        //     variant="contained"
        //     sx={{ mt: 2, borderRadius: "999px", px: 4 }}
        //     onClick={() => {
        //       document
        //         .getElementById("plan-details")
        //         ?.scrollIntoView({ behavior: "smooth" });
        //     }}
        //   >
        //     Upgrade Plan
        //   </Button>
        // </Box>
      )}

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
        Your ideal plan starts here
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
        Explore our flexible subscription plans and choose the one that best
        fits your unique needs, whether you're just starting out or scaling up.
      </Typography>

      <Box
        id="plan-details"
        sx={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.46)",
          background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
          width: "fit-content",
          p: 2,
          mx: "auto",
          borderRadius: "12px",
          px: 4,
        }}
      >
        <Tabs
          value={duration}
          onChange={handleTabChange}
          allowScrollButtonsMobile
          centered
          sx={{
            mt: 4,
            mb: 4,
            "& .MuiTab-root": {
              color: "white",
              background: "#2d3436",
              borderRadius: "999px",
              marginRight: "8px",
              paddingX: "16px",
              textTransform: "none",
              border: "1px solid #ffffff44",
            },
            "& .Mui-selected": {
              background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              color: "white !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Tab label="1 Month" value="1month" />
          <Tab label="3 Months" value="3month" />
          <Tab label="6 Months" value="6month" />
          <Tab label="Lifetime" value="lifetime" />
        </Tabs>
        <BeyondResumeSubscription
          designOnly={false}
          duration={duration}
          setSelectedPlan={setSelectedPlan}
        />
      </Box>

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
        Why go premium
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
        Premium gives you smarter practice, real-time simulations, and AI
        feedback — all to help you land your dream job.
      </Typography>

      <Grid container spacing={4} p={2} justifyContent="center">
        {categories.map((cat, index) => (
          <Grid
            sx={{ display: "flex", justifyContent: "center" }}
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
          >
            <CategoryCard {...cat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const CategoryCard = ({ icon, title, highlight, desc }: any) => {
  return (
    <Card
      elevation={highlight ? 8 : 3}
      sx={{
        p: 6,
        textAlign: "left",
        borderRadius: 3,
        width: "70%",
        height: "300px",
        boxShadow: "0 8px 24px rgba(29, 28, 39, 0.07)",
        position: "relative",
        background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        color: "white",
      }}
    >
      <Box position={"relative"} mb={2}>
        {/* <FontAwesomeIcon
          icon={icon}
          size="6x"
          style={{ marginBottom: "20px" }}
        /> */}
        <img style={{ width: "80px" }} src={`/assets/${icon}.png`}></img>
        <Typography
          mt={2}
          variant="h6"
          sx={{ fontFamily: "custom-bold", lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{ fontFamily: "Montserrat-Regular" }}
          variant="body2"
          mt={1}
        >
          {desc}
        </Typography>
      </Box>
    </Card>
  );
};

const SubscriptionGlassCard = ({
  userName = "Loganayaki",
  phone = "9003701098",
  plan = "12 Months",
  daysLeft = 30,
  mockUsed = 3,
  mockTotal = 5,
  jobUsed = 1,
  jobTotal = 3,
  onUpgrade,
}: any) => {
  const mockPercent = (mockUsed / mockTotal) * 100;
  const jobPercent = (jobUsed / jobTotal) * 100;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        mt: 4,
        borderRadius: 4,
        p: 4,
        pt:6,
        background: "linear-gradient(145deg, #0d0d0d, #2D3436)",

        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        color: "white",
        position: "relative",
      }}
    >
      <Box textAlign="left" mb={3}>
        {/* <Avatar
          src="/assets/avatar.png"
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        /> */}
        <Typography variant="h6">Name: {userName}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Email: {phone}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        //   px: 1,
        }}
      >
        <Box>
          <Typography fontSize={14} sx={{ opacity: 0.7 }}>
            Current Plan
          </Typography>
          <Typography fontWeight="bold">{plan}</Typography>
        </Box>
        <Box>
          <Typography fontSize={14} sx={{ opacity: 0.7 }}>
            Days Left
          </Typography>
          <Typography fontWeight="bold">{daysLeft} days</Typography>
        </Box>
      </Box>

      <Box mt={3}>
        <Typography fontSize={14} mb={1}>
          Mock Interviews ({mockUsed}/{mockTotal})
        </Typography>
        <LinearProgress
          variant="determinate"
          value={mockPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#333",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#50bcf6",
            },
            mb: 2,
          }}
        />

        <Typography fontSize={14} mb={1}>
          Job Posts ({jobUsed}/{jobTotal})
        </Typography>
        <LinearProgress
          variant="determinate"
          value={jobPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#333",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#00c853",
            },
          }}
        />
      </Box>

      <BeyondResumeButton
        variant="contained"
        color="primary"
        sx={{ m: "auto", display: "block", mt: 4 }}
        onClick={onUpgrade}
      >
        Upgrade Plan
      </BeyondResumeButton>
    </Card>
  );
};
