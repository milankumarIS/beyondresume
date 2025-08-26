import {
  faChevronCircleRight,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  formatDateWithSuffix,
  getRemark
} from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton2
} from "../../../components/util/CommonStyle";
import { searchListDataFromTable } from "../../../services/services";

interface AssessedApplicantsProps {
  brJobId: string;
  color: any;
}

const AssessedApplicants: React.FC<AssessedApplicantsProps> = ({
  brJobId,
  color,
}) => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    if (!brJobId) return;

    setLoading(true);
    searchListDataFromTable("brJobApplicant", {
      brJobApplicantStatus: "CONFIRMED",
      brJobId,
    }).then((result: any) => {
      const rows = result?.data?.data || [];

      // Group and sort
      const levelOrder = ["complex", "advance", "intermediate", "beginner"];
      const groupedByLevel: Record<string, any[]> = {};
      levelOrder.forEach((level) => (groupedByLevel[level] = []));
      rows.forEach((item: any) => {
        const level = item.brInterviewLevel || "beginner";
        groupedByLevel[level]?.push(item);
      });
      for (const level in groupedByLevel) {
        groupedByLevel[level].sort((a: any, b: any) => b.score - a.score);
      }

      setInterviews([
        ...groupedByLevel.complex,
        ...groupedByLevel.advance,
        ...groupedByLevel.intermediate,
        ...groupedByLevel.beginner,
      ]);

      setLoading(false);
    });
  }, [brJobId]);

  if (loading)
    return (
      <Typography mt={2} width={"100%"} textAlign={"center"}>
        Loading assessed applicants...
      </Typography>
    );

  const size = 80;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <Grid container spacing={3}>
      {interviews.length > 0 ? (
        interviews.map((interview, index) => {
          const score = interview.interviewScore || 0;
          const { remark, bgcolor } = getRemark(score);
          // if (!interview?.interviewOverview) return null;
          return (
            <Grid item xs={12} sm={12} md={12} key={index} position="relative">
              <Card
                sx={{
                  background: color.cardBg,
                  color: "inherit",
                  borderRadius: 3,
                  textAlign: "center",
                  p: 2,
                  py: 3,
                  pb: 3,
                  // maxWidth: "250px",
                  minWidth: "250px",
                  position: "relative",
                  m: "auto",
                  opacity: interview.interviewOverview ? 1 : 0.6,
                  display: "flex",
                  boxShadow: "none",
                }}
              >
                <Box width={"100%"}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        height: "32px",
                        width: "32px",
                        background: color.cardBg,
                        padding: "8px",
                        borderRadius: "999px",
                      }}
                      icon={faUser}
                    />

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        fontWeight="bold"
                        noWrap
                        sx={{
                          fontFamily: "custom-bold",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flexGrow: 1,
                          minWidth: 0,
                          textAlign: "left",
                        }}
                      >
                        {interview?.fullName}
                      </Typography>

                      <Typography
                        variant="caption"
                        display="block"
                        textAlign="left"
                        sx={{
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        Submitted {formatDateWithSuffix(interview.createdAt)},{" "}
                        {new Date(interview.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                    </div>
                  </Box>

                  {/* <Box sx={{ textAlign: "left", my: 2 }}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "4px" }}
                        icon={faPhone}
                      />{" "}
                      {interview?.phone}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Montserrat-Regular",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flexGrow: 1,
                        minWidth: 0,
                        textAlign: "left",
                      }}
                    >
                      <FontAwesomeIcon
                        style={{ marginRight: "4px" }}
                        icon={faEnvelope}
                      />
                      {interview?.email}
                    </Typography>
                  </Box> */}

                  <Typography textAlign="left" mt={1}>
                    Summary:
                  </Typography>
                  <Typography
                    variant="body2"
                    mt={0.4}
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      fontFamily: "Montserrat-Regular",
                      fontSize: "12px",
                      textAlign: "left",
                    }}
                  >
                    {interview.interviewOverview ||
                      "Interview could not be finished. This might be due to a network failure or server error."}
                  </Typography>
                </Box>

                <Box minWidth={"200px"} px={2}>
                  <Box
                    position={"relative"}
                    width={"fit-content"}
                    m={"auto"}
                    mb={2}
                  >
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
                        stroke={
                          score >= 70 ? "green" : score >= 40 ? "orange" : "red"
                        }
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - score / 100)}
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
                        fontFamily: "custom-bold",
                      }}
                    >
                      {score}%
                    </Typography>
                  </Box>

                  {interview.interviewOverview && (
                    <BeyondResumeButton2
                      onClick={() =>
                        history.push(
                          `/beyond-resume-interview-overview/${interview?.brJobApplicantId}?type=candidateResult`
                        )
                      }
                    >
                      View Details
                      <FontAwesomeIcon
                        style={{ marginLeft: "5px" }}
                        icon={faChevronCircleRight}
                      />
                    </BeyondResumeButton2>
                  )}
                </Box>

                {/* 
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: bgcolor,
                    color: getTextColor(bgcolor),
                    px: 1,
                    py: 0.5,
                    borderRadius: "0px 0px 0px 8px",
                  }}
                >
                  <Typography sx={{ color: getTextColor(bgcolor) }}>
                    Score: {score}/100
                  </Typography>
                </Box> */}
              </Card>
            </Grid>
          );
        })
      ) : (
        <Typography mt={2} width={"100%"} textAlign={"center"}>
          No assessed applicants found.
        </Typography>
      )}
    </Grid>
  );
};

export default AssessedApplicants;
