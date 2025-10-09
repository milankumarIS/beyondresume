import {
  faArrowUpRightFromSquare,
  faBuilding,
  faCalendarAlt,
  faCity,
  faEdit,
  faEnvelope,
  faFlag,
  faGlobe,
  faLayerGroup,
  faMapMarkerAlt,
  faPhone,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTheme } from "../../../components/context/ThemeContext";
import { getUserId } from "../../../services/axiosClient";
import { searchDataFromTable } from "../../../services/services";
import color from "../../../theme/color";
import { CompanyHeaderSection } from "./sections/CompanyHeaderSection";
import { OverviewTab } from "./sections/OverViewTab";

export const CompanyProfilePage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await searchDataFromTable("companyInfo", {
          createdBy: getUserId(),
        });

        const prevData = res?.data?.data || {};

        setCompanyData(prevData);
      } catch (err) {
        console.error("Error fetching default values:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const companyData = {
  //   industryId: "IND-001",
  //   industryName: "Information Technology",
  //   industryCategory: "Technology & Software",
  //   industryType: "Product Based",
  //   industryClass: "Startup",
  //   description:
  //     "The IT industry involves the development, maintenance. A company about section typically refers to asummary or description of a company, often found in a company profile oron the company's website. It provides an overview of the business,including its history, mission, values, products or services, andsometimes even its culture and team. This section serves as anintroduction to the company, helping stakeholders understand its purposeand what it offers.",
  //   establishedYear: 1990,
  //   headquarters: { city: "Bangalore", state: "Karnataka", country: "India" },
  //   website: "https://www.exampleitindustry.com",
  //   logoUrl:
  //     "https://media.licdn.com/dms/image/v2/D563DAQHjtmMCmopbpA/image-scale_191_1128/B56Zg6pQyrHUAc-/0/1753330553881/infosys_cover?e=1755687600&v=beta&t=lfM4-wf-7A1yus9bhTSUjxCczeyJotC256T9azghh3M",
  //   bannerUrl:
  //     "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   primaryContactName: "Ravi Kumar",
  //   companyContactEmail: "contact@exampleitindustry.com",
  //   companyContactPhone: "+91-9876543210",
  //   primaryContactEmail: "contact@exampleitindustry.com",
  //   primaryContactPhone: "+91-9876543210",
  //   socialLinks: {
  //     linkedin: "https://linkedin.com/company/example-it-industry",
  //     twitter: "https://twitter.com/exampleitindustry",
  //     facebook: "https://facebook.com/exampleitindustry",
  //   },
  // };

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
  const history = useHistory();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="newtons-cradle">
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
          <div className="newtons-cradle__dot"></div>
        </div>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading
        </Typography>
      </Box>
    );
  }

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
        <Box
          onClick={() => history.push("/beyond-resume-company-profile-form")}
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            boxShadow: "0px 0px 10px #00000021",
            background: "white",
            borderRadius: "999px",
            padding: "4px 14px",
            color: "black",
            fontSize: "14px",
            textDecoration: "none",
            fontFamily: "custom-regular",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
          }}

          // href={companyData.website}
        >
          Edit <FontAwesomeIcon style={{ marginLeft: "4px" }} icon={faEdit} />
        </Box>
      </Box>

      <Box sx={{ display: "flex", position: "relative" }}>
        <Box
          sx={{
            // background: color.background2,
            background: theme === "dark" ? '#082028' : '#e3ecf5',
            mx: 2,
            borderRadius: 4,
            boxShadow: "0px 0px 10px #00000021",
            mt: -14,
            flexGrow: 1,
            border: "solid 1px white",
          }}
        >
          <Box>
            <CompanyHeaderSection companyInfo={companyData} />
            {/* <Box>
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
                    mx: "auto",
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
            </Box> */}
          </Box>

          {tab === 0 && <OverviewTab companyInfo={companyData} />}
          {/* {tab === 1 && <GalleryTab images={galleryImages} />}
          {tab === 2 && <GalleryTab images={galleryImages} />}
          {tab === 3 && <AwardsTab awards={awards} />}
          {tab === 4 && <NewsTab news={news} />} */}
          {/* {tab === 4 && <CompanyForm />} */}
        </Box>

        <Box sx={{ width: "450px", mt: 2 }}>
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
              {
                label: "Industry Classification",
                value: companyData.industryClassification,
                icon: faSuitcase,
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
              {
                label: "Website",
                value: companyData.website,
                icon: faGlobe,
                type: "website",
              },
              {
                label: "Email",
                value: companyData.companyContactEmail,
                icon: faEnvelope,
                type: "email",
              },
              {
                label: "Phone",
                value: companyData.companyContactPhone,
                icon: faPhone,
                type: "phone",
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={idx ? 2 : 0}
                gap={1}
              >
                <Typography fontSize="14px" display="flex" gap={1}>
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

                {/* Conditional rendering for value */}
                {item.type === "website" && item.value ? (
                  <a
                    href={
                      item.value.startsWith("http")
                        ? item.value
                        : `https://${item.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "montserrat-regular",
                      fontSize: "14px",
                      color: "#1976d2",
                      textDecoration: "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "200px",
                    }}
                  >
                    {item.value}
                  </a>
                ) : item.type === "email" && item.value ? (
                  <a
                    href={`mailto:${item.value}`}
                    style={{
                      fontFamily: "montserrat-regular",
                      fontSize: "14px",
                      color: "#1976d2",
                      textDecoration: "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "200px",
                    }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "montserrat-regular",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "200px",
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
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
                value: companyData.headquarters?.city,
                icon: faCity,
              },
              {
                label: "State",
                value: companyData.headquarters?.state,
                icon: faMapMarkerAlt,
              },
              {
                label: "Country",
                value: companyData.headquarters?.country,
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
