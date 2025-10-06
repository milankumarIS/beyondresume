import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { SocialIcon } from "../../../../components/util/CommonStyle";

interface Props {
  companyInfo: any;
}

export const CompanyHeaderSection: React.FC<Props> = ({ companyInfo }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar
            src={companyInfo.logoUrl}
            sx={{ width: 100, height: 100, mr: 2, border: "2px solid white" }}
          />
          <Box>
            <Typography variant="h5">{companyInfo.industryName}</Typography>
            {/* <Typography variant="body1" sx={{ fontFamily: "montserrat-regular" }}>
            {companyInfo.description}
          </Typography> */}

            <Typography
              variant="body2"
              //   color="text.secondary"
              sx={{
                fontFamily: "montserrat-regular",
                opacity: 0.6,
                color: "inherit",
              }}
            >
              {companyInfo.industryCategory} | {companyInfo.headquarters?.city},{" "}
              {companyInfo.headquarters?.state},{" "}
              {companyInfo.headquarters?.country}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.2, mt: 1 }}>
              {companyInfo.socialLinks?.instagram && (
                <SocialIcon
                  icon={faInstagram}
                  link={companyInfo.socialLinks.instagram}
                />
              )}
              {companyInfo.socialLinks?.facebook && (
                <SocialIcon
                  icon={faFacebook}
                  link={companyInfo.socialLinks.facebook}
                />
              )}
              {companyInfo.socialLinks?.twitter && (
                <SocialIcon
                  icon={faXTwitter}
                  link={companyInfo.socialLinks.twitter}
                />
              )}
              {companyInfo.socialLinks?.linkedin && (
                <SocialIcon
                  icon={faLinkedin}
                  link={companyInfo.socialLinks.linkedin}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
