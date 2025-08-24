
    import { Box, Typography } from "@mui/material";
    import { useRef, useState } from "react";
    import { useHistory } from "react-router";
    import { BeyondResumeButton } from "../../components/util/CommonStyle";
    import BeyondResumeFAQ from "./Beyond Resume Components/BeyondResumeFAQ";
    import BeyondResumeSubscription from "./Beyond Resume Components/BeyondResumeSubscription";
    import BeyondResumeTestimony from "./Beyond Resume Components/BeyondResumeTestimony";
    import BeyondResumeFeatures from "./Beyond Resume Interview/BeyondResumeFeatures";
    import BeyondResumeHero from "./Beyond Resume Interview/BeyondResumeHero";
    import BeyondResumeSteps from "./Beyond Resume Interview/BeyondResumeSteps";

    export default function BeyondResumeHome() {
      const history = useHistory();
      const scrollRef = useRef<HTMLDivElement>(null);

      const handleScroll = () => {
        if (scrollRef.current) {
          const elementTop =
            scrollRef.current.getBoundingClientRect().top + window.pageYOffset;
          const offset = -60;
          window.scrollTo({
            top: elementTop - offset,
            behavior: "smooth",
          });
        }
      };

      const [duration, setDuration] = useState("1month");
      return (
        <Box
          sx={{
            position: "relative",
            maxWidth: "100vw",
          }}
        >
          {/* <BlobAnimation /> */}

          <BeyondResumeHero onScrollClick={handleScroll} />
          <BeyondResumeFeatures ref={scrollRef} />
          <BeyondResumeSteps />
          <Typography variant="h3" fontFamily="Custom-Bold" textAlign="center">
            Subscription Plans
          </Typography>
          <Typography
            variant="h6"
            mb={4}
            fontFamily="Montserrat-Regular"
            textAlign="center"
          >
            Try our mock interview tool for free today. Start practicing and
            improving your skills immediately.
          </Typography>
          <BeyondResumeSubscription
            setSelectedPlan={null}
            designOnly={true}
            duration={duration}
          />

          <BeyondResumeFAQ />

          <Box sx={{ width: "calc(100vw - 92px)" }}>
            <BeyondResumeTestimony />
          </Box>

          <Box
            sx={{
              textAlign: "center",
              pb: 8,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                width: "fit-content",
                m: "auto",
                fontFamily: "Custom-Bold",
                p: 2,
                borderRadius: "12px",
                zIndex: 2,
                position: "relative",
              }}
            >
              Start practicing today and land your dream job
            </Typography>

            <Typography
              gutterBottom
              variant="h6"
              sx={{ mb: 2, fontFamily: "Montserrat-Regular" }}
            >
              Try our mock interview tool for free today. Start practicing and
              improving your skills immediately.
            </Typography>

            <BeyondResumeButton
              sx={{ p: 2, px: 4 }}
              onClick={() => history.push("/beyond-resume-practicePools")}
            >
              Start Practicing Today
            </BeyondResumeButton>
          </Box>
        </Box>
      );
    }