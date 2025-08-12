import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { CompanyHeaderSection } from "./sections/CompanyHeaderSection";
import { AwardsTab } from "./sections/AwardsTab";
import { GalleryTab } from "./sections/GalleryTab";
import { NewsTab } from "./sections/NewsTab";
import { OverviewTab } from "./sections/OverViewTab";

export const CompanyProfilePage: React.FC = () => {
  const [tab, setTab] = useState(0);

  const companyData = {
    industryId: "IND-001",
    industryName: "Information Technology",
    industryCategory: "Technology & Software",
    industryType: "Private",
    description: "The IT industry involves the development, maintenance...",
    establishedYear: 1990,
    headquarters: { city: "Bangalore", state: "Karnataka", country: "India" },
    website: "https://www.exampleitindustry.com",
    logoUrl: "https://cdn.example.com/industries/it/logo.png",
    bannerUrl: "https://cdn.example.com/industries/it/banner.jpg",
    primaryContactName: "Ravi Kumar",
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

  return (
    <Box sx={{ p: 2 }}>
      <CompanyHeaderSection companyInfo={companyData} />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Gallery" />
          <Tab label="Awards" />
          <Tab label="News" />
        </Tabs>
      </Box>
      {tab === 0 && <OverviewTab companyInfo={companyData} />}
      {tab === 1 && <GalleryTab images={galleryImages} />}
      {tab === 2 && <AwardsTab awards={awards} />}
      {tab === 3 && <NewsTab news={news} />}
      {/* {tab === 4 && <CompanyForm />} */}
    </Box>
  );
};
