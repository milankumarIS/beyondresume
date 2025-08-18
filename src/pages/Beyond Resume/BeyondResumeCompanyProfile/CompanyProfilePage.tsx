import {
  faArrowUpRightFromSquare,
  faBuilding,
  faCalendarAlt,
  faCity,
  faEnvelope,
  faFlag,
  faGlobe,
  faLayerGroup,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Link, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import color from "../../../theme/color";
import { AwardsTab } from "./sections/AwardsTab";
import { CompanyHeaderSection } from "./sections/CompanyHeaderSection";
import { GalleryTab } from "./sections/GalleryTab";
import { NewsTab } from "./sections/NewsTab";
import { OverviewTab } from "./sections/OverViewTab";
import { useTheme } from "../../../components/util/ThemeContext";

export const CompanyProfilePage: React.FC = () => {
  const [tab, setTab] = useState(0);

  const companyData = {
    industryId: "IND-001",
    industryName: "Information Technology",
    industryCategory: "Technology & Software",
    industryType: "Private",
    description:
      "The IT industry involves the development, maintenance. A company about section typically refers to asummary or description of a company, often found in a company profile oron the company's website. It provides an overview of the business,including its history, mission, values, products or services, andsometimes even its culture and team. This section serves as anintroduction to the company, helping stakeholders understand its purposeand what it offers.",
    establishedYear: 1990,
    headquarters: { city: "Bangalore", state: "Karnataka", country: "India" },
    website: "https://www.exampleitindustry.com",
    logoUrl:
      "https://media.licdn.com/dms/image/v2/D563DAQHjtmMCmopbpA/image-scale_191_1128/B56Zg6pQyrHUAc-/0/1753330553881/infosys_cover?e=1755687600&v=beta&t=lfM4-wf-7A1yus9bhTSUjxCczeyJotC256T9azghh3M",
    bannerUrl:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    primaryContactName: "Ravi Kumar",
    companyContactEmail: "contact@exampleitindustry.com",
    companyContactPhone: "+91-9876543210",
    primaryContactEmail: "contact@exampleitindustry.com",
    primaryContactPhone: "+91-9876543210",
    socialLinks: {
      linkedin: "https://linkedin.com/company/example-it-industry",
      twitter: "https://twitter.com/exampleitindustry",
      facebook: "https://facebook.com/exampleitindustry",
    },
  };

  const galleryImages = [
    "https://indi.skillablers.com/static/media/visualprofiling-white.7e60cf51.png",
    "https://cdn.example.com/images/industry2.jpg",
  ];

  const awards = [
    {
      title: "Best Technology Sector",
      description:
        "Awarded for excellence in technology innovation and contributions to the IT industry.",
      imageURL: "https://example.com/news/industry-growth",
    },
  ];

  const news = [
    {
      title: "Industry hits record growth",
      description:
        "The IT industry has achieved unprecedented growth, reaching new milestones in innovation and employment.",
      imageURL: "https://example.com/news/industry-growth",
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const { theme } = useTheme();

  return (
    <Box p={2}>
      <Box
        sx={{
          height: 250,
          backgroundImage: `url(${companyData.bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 4,
          position: "relative",
        }}
      >
        <Link
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            boxShadow: "0px 0px 10px #00000021",
            background: "white",
            borderRadius: "999px",
            padding: "4px 14px",
            color: "black",
            fontSize: "14px",
            textDecoration: "none",
            fontFamily: "custom-regular",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          href={companyData.website}
        >
          Visit Website{" "}
          <FontAwesomeIcon
            style={{ marginLeft: "4px" }}
            icon={faArrowUpRightFromSquare}
          />
        </Link>
      </Box>

      <Box sx={{ display: "flex", position: "relative" }}>
        <Box
          sx={{
            // background: color.background2,
            background: theme === "dark" ? color.background2 : "white",
            mx: 2,
            borderRadius: 4,
            boxShadow: "0px 0px 10px #00000021",
            mt: -14,
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              boxShadow: "0px 0px 10px #00000021",
            }}
          >
            <CompanyHeaderSection companyInfo={companyData} />
            <Box>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  mt: 1,
                  mb: 0,
                  pb: 1.5,
                  px: 2,
                  "& .MuiTab-root": {
                    color: "white",
                    background: "#2d3436",
                    borderRadius: "40px",
                    marginRight: "8px",
                    padding: "8px 24px",
                    minHeight: "0px",
                    textTransform: "none",
                    border: "1px solid #ffffff44",
                  },
                  "& .Mui-selected": {
                    background: color.activeButtonBg,
                    color: "white !important",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Jobs" />
                <Tab label="Gallery" />
                <Tab label="Awards" />
                <Tab label="News" />
              </Tabs>
            </Box>
          </Box>

          {tab === 0 && <OverviewTab companyInfo={companyData} />}
          {tab === 1 && <GalleryTab images={galleryImages} />}
          {tab === 2 && <GalleryTab images={galleryImages} />}
          {tab === 3 && <AwardsTab awards={awards} />}
          {tab === 4 && <NewsTab news={news} />}
          {/* {tab === 4 && <CompanyForm />} */}
        </Box>

        <Box sx={{ minWidth: "400px", mt: 2 }}>
          <Box
            sx={{
              boxShadow: "0px 0px 10px #00000021",
              p: 2,
              borderRadius: 4,
              border: "solid 1px white",
            }}
          >
            <Typography mb={2}>Organisation Status</Typography>
            {[
              {
                label: "ESTD.",
                value: companyData.establishedYear,
                icon: faCalendarAlt,
              },
              {
                label: "Industry Category",
                value: companyData.industryCategory,
                icon: faLayerGroup,
              },
              {
                label: "Industry Type",
                value: companyData.industryType,
                icon: faBuilding,
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={idx ? 2 : 0}
              >
                <Typography fontSize="14px" display={"flex"} gap={1}>
                  <Box
                    sx={{
                      background: "#ebebeb",
                      padding: "2px",
                      height: "18px",
                      width: "18px",
                      borderRadius: "4px",
                      color: "#5b5e66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </Box>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "montserrat-regular" }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              boxShadow: "0px 0px 10px #00000021",
              p: 2,
              borderRadius: 4,
              mt: 2,
              border: "solid 1px white",
            }}
          >
            <Typography mb={2}>Organisation Contact</Typography>
            {[
              { label: "Website", value: companyData.website, icon: faGlobe },
              {
                label: "Email",
                value: companyData.companyContactEmail,
                icon: faEnvelope,
              },
              {
                label: "Phone",
                value: companyData.companyContactPhone,
                icon: faPhone,
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={idx ? 2 : 0}
              >
                <Typography fontSize="14px" display={"flex"} gap={1}>
                  <Box
                    sx={{
                      background: "#ebebeb",
                      padding: "2px",
                      height: "18px",
                      width: "18px",
                      borderRadius: "4px",
                      color: "#5b5e66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </Box>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "montserrat-regular" }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              boxShadow: "0px 0px 10px #00000021",
              p: 2,
              borderRadius: 4,
              mt: 2,
              border: "solid 1px white",
            }}
          >
            <Typography mb={2}>HeadQuarters</Typography>
            {[
              {
                label: "City",
                value: companyData.headquarters.city,
                icon: faCity,
              },
              {
                label: "State",
                value: companyData.headquarters.state,
                icon: faMapMarkerAlt,
              },
              {
                label: "Country",
                value: companyData.headquarters.country,
                icon: faFlag,
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={idx ? 2 : 0}
              >
                <Typography fontSize="14px" display={"flex"} gap={1}>
                  <Box
                    sx={{
                      background: "#ebebeb",
                      padding: "2px",
                      height: "18px",
                      width: "18px",
                      borderRadius: "4px",
                      color: "#5b5e66",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </Box>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "montserrat-regular" }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
