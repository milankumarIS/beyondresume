import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import GradientText, {
  BeyondResumeButton,
  BeyondResumeButton2,
  BlobAnimation,
  BlobComponent,
} from "../../../components/util/CommonStyle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { searchListDataFromTable } from "../../../services/services";
import color from "../../../theme/color";

export default function BeyondResumeHero({ onScrollClick }) {
  const blobPaths = [
    "M33.6,-38.2C45.5,-30,58.4,-21.3,63,-9C67.6,3.2,64,19,55.2,29.7C46.4,40.3,32.6,45.8,18.7,50.6C4.8,55.4,-9.2,59.4,-21.8,56.4C-34.5,53.3,-45.9,43.2,-52.5,30.8C-59,18.4,-60.6,3.7,-59.1,-11.4C-57.6,-26.5,-53,-42.1,-42.6,-50.5C-32.3,-59,-16.1,-60.3,-2.6,-57.2C10.8,-54,21.7,-46.4,33.6,-38.2Z",
    "M56.2,-52.2C72.2,-40.3,84.1,-20.1,82,-2.1C79.9,16,63.9,32,47.9,47.8C32,63.6,16,79.3,-1.8,81.1C-19.6,82.9,-39.2,70.8,-55.4,55C-71.7,39.2,-84.7,19.6,-83.9,0.7C-83.2,-18.1,-68.7,-36.2,-52.5,-48.2C-36.2,-60.2,-18.1,-66,1,-67.1C20.1,-68.1,40.3,-64.2,56.2,-52.2Z",
  ];

  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const [interviewList, setInterviewList] = useState<any[]>([]);

  useEffect(() => {
    searchListDataFromTable("brJobApplicant", {
      // brInterviewStatus: "CONFIRMED",
    }).then((result: any) => {
      setInterviewList(result?.data?.data);
      // console.log(result)
    });
  }, []);

  const [count, setCount] = useState(0);

  const total = interviewList.length;

  useEffect(() => {
    if (count < total) {
      const increment = total > 50 ? 5 : 1;
      const timer = setTimeout(() => {
        setCount((prev) => Math.min(prev + increment, total));
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [count, total]);

  return (
    <Box
      ref={ref}
      className={`slide-in ${isVisible ? "visible" : ""}`}
      sx={{
        py: 20,
        pt:15,
        mb: 4,
        mt: -10,
        position: "relative",
        borderRadius: "0px 0px 680px 680px",
        // overflow: "hidden",
        background: color.cardBg,
      }}
    >
      {/* <BlobComponent
        right="-20px"
        bottom="-120px"
        width={300}
        height={250}
        path={blobPaths[0]}
        text="AI Powered"
        textColor="#fff"
        fontSize={18}
        icon={
          <FontAwesomeIcon
            icon={faRobot}
            style={{ color: "#fff", fontSize: 28 }}
          />
        }
      /> */}
      {/* <BlobAnimation /> */}

      <Box sx={{ textAlign: "center", position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            px: 6,
          }}
        >
          {/* <Typography sx={{ fontFamily: "montserrat-regular" }} variant="h4">
            Welcome To Your
          </Typography>
          <GradientText text={"Interview Hub"} variant="h4" /> */}

          <Typography
            variant="h3"
            gutterBottom
            sx={{
              width: "fit-content",
              m: "auto",
              fontFamily: "Custom-Bold",
              // background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
              p: 2,
              borderRadius: "12px",
              // boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
              zIndex: 2,
              position: "relative",
            }}
          >
            Land your dream job faster with our mock interview practice tool.
          </Typography>

          <Typography
            variant="h6"
            sx={{ mt: 2, fontFamily: "Montserrat-Regular" }}
          >
            Ace any job interview with unlimited mock interviews, tailored
            feedback, and an interactive interview simulator.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <BeyondResumeButton
            onClick={() => history.push("/beyond-resume-practicePools")}
            sx={{ p: 2, px: 4 }}
          >
            Start Practicing Today
          </BeyondResumeButton>

          <BeyondResumeButton2
            onClick={onScrollClick}
            sx={{
              p: 2,
              px: 4,
            }}
          >
            Learn More
          </BeyondResumeButton2>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 6 }}
        >
          <AvatarGroup max={4}>
            <Avatar
              alt="User 1"
              src="https://randomuser.me/api/portraits/women/1.jpg"
            />
            <Avatar
              alt="User 2"
              src="https://randomuser.me/api/portraits/men/2.jpg"
            />
            <Avatar
              alt="User 3"
              src="https://randomuser.me/api/portraits/women/3.jpg"
            />
            <Avatar
              alt="User 4"
              src="https://randomuser.me/api/portraits/men/4.jpg"
            />
          </AvatarGroup>
          <Typography variant="body1" sx={{ ml: 1 }}>
            Trusted by {count}+ Candidates
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
