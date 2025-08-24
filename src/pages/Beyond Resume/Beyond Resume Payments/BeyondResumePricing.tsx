import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { pricingPlans } from "../../../components/form/data";
import { formatDateJob } from "../../../components/util/CommonFunctions";
import GradientText from "../../../components/util/CommonStyle";
import { getUserFirstName, getUserId, getUserRole } from "../../../services/axiosClient";
import {
  getProfile,
  searchDataFromTable,
  searchListDataFromTable,
} from "../../../services/services";
import color from "../../../theme/color";
import BeyondResumeSubscription from "../Beyond Resume Components/BeyondResumeSubscription";
import { useUserData } from "../../../components/util/UserDataContext";

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
    endDate: "",
    daysLeft: 0,
    mockUsed: 0,
    mockTotal: 0,
    jobUsed: 0,
    jobTotal: 0,
  });

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
        endDate: formatDateJob(payment.endDate),
      });
    };

    checkSubscription();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        padding: "16px",
        minHeight: "100vh",
      }}
    >
      {/* {activeSubscription && (
        <>
          <SubscriptionGlassCard
            {...subscriptionData}
            onUpgrade={() =>
              document
                .getElementById("plan-details")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </>
      )} */}

      <Typography
        variant="h4"
        sx={{
          fontFamily: "Custom-Bold",
          width: "fit-content",
          p: 4,
          pb: 0,
          borderRadius: "12px",
          textAlign: "center",
          m: "auto",
          lineHeight: 1,
        }}
      >
        Manage Your plans
      </Typography>

      <Box
        id="plan-details"
        sx={{
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
            m: "auto",
            fontFamily: "montserrat-regular",

            my: 4,
            background: "white",
            width: "fit-content",
            borderRadius: "32px",
            p: 1,
            minHeight: "0px",

            "& .MuiTab-root": {
              color: "black",
              background: "transparent",
              borderRadius: "999px",
              marginRight: "8px",
              paddingX: "16px",
              minHeight: "0px",
              textTransform: "none",
              border: "1px solid #ffffff44",
              fontFamily: "montserrat-regular",
            },
            "& .Mui-selected": {
              background: color.newbg,
              color: "white !important",
            },
            "& .MuiButtonBase-root": {
              p: 0,
              py: 1,
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
    </Box>
  );
}

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
  endDate,
}: any) => {

   const { userData } = useUserData();

  const mockPercent = mockUsed / mockTotal;
  const datePercent = 1 - daysLeft / 30;
  const jobPercent = (jobUsed / jobTotal) ;

  const mocksLeft = mockTotal - mockUsed;
  const jobsLeft = jobTotal - jobUsed;

  const stats = [
    {
      title:  "Practice Interviews" ,
      centerText: "Left",
      subtitle: `Used ${mockUsed} out of ${mockTotal}`,
      progress: mockPercent,
      color: color.secondActiveColor,

      mocksLeft: `${mocksLeft}`,
    },
    {
      title: "Auto-renewal in",
      centerText: "days",
      subtitle: `on ${endDate}`,
      progress: datePercent,
      color: color.activeColor,

      daysLeft: `${daysLeft}`,
    },
  ];

  const stats1 = [
    {
      title: 'Job Posts',
      centerText: "Left",
      subtitle: `Used ${jobUsed} out of ${jobTotal}`,
      progress: jobPercent,
      color: color.secondActiveColor,

      mocksLeft: `${jobsLeft}`,
    },
    {
      title: "Auto-renewal in",
      centerText: "days",
      subtitle: `on ${endDate}`,
      progress: datePercent,
      color: color.activeColor,

      daysLeft: `${daysLeft}`,
    },
  ];

  const statsMap = getUserRole() === 'CAREER SEEKER' ? stats : stats1;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography variant="h4">Hi</Typography>
                   <GradientText text={userData?.firstName} variant="h4" />

      </Box>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "montserrat-regular",
          width: "fit-content",
          p: 4,
          pb: 2,
          borderRadius: "12px",
          textAlign: "center",
          m: "auto",
          lineHeight: 1,
        }}
      >
        You're currently on the{" "}
        <span style={{ fontFamily: "custom-bold" }}> {plan} Plan</span>
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 4,
        }}
      >
        {statsMap.map((stat, idx) => (
          <DonutStatCard key={idx} {...stat} />
        ))}
      </Box>
    </Box>
  );
};

interface DonutStatCardProps {
  title: string;
  centerText: string;
  subtitle: string;
  progress: number; 
  color?: string;
  daysLeft?: string;
  mocksLeft?: string;
}

const DonutStatCard: React.FC<DonutStatCardProps> = ({
  title,
  centerText,
  subtitle,
  progress,
  color = "#00B0F0",
  daysLeft,
  mocksLeft,
}) => {
  const size = 120;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <Box
      sx={{
        borderRadius: 3,
        padding: 2,
        width: 180,
        height: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        backgroundColor: "#0A0E1A",
      }}
    >
      <Typography
        sx={{ fontFamily: "custom-bold" }}
        variant="subtitle1"
        fontWeight="bold"
        mb={1}
      >
        {title}
      </Typography>

      <Box sx={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            stroke="#2A2D3E"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {mocksLeft ? mocksLeft : daysLeft}
          <br /> {""}
          {centerText}
        </Typography>
      </Box>

      <Typography
        sx={{ fontFamily: "montserrat-regular" }}
        variant="body2"
        mt={2}
        textAlign="center"
      >
        {subtitle}
      </Typography>
    </Box>
  );
};
