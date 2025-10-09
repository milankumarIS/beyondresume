import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { BeyondResumeButton } from "../../../components/util/CommonStyle";
import { searchListDataFromTable } from "../../../services/services";
import {
  formatDateWithSuffix,
  getRemark,
  getTextColor,
} from "../../../components/util/CommonFunctions";

interface AssessedApplicantsProps {
  brJobId: string;
  color: any;
}

const PendingAssessmentApplicants: React.FC<AssessedApplicantsProps> = ({
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
    brJobApplicantStatus: "APPLIED",
    brJobId,
  }).then((result: any) => {
    const rows = result?.data?.data || [];

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

    const merged = [
      ...groupedByLevel.complex,
      ...groupedByLevel.advance,
      ...groupedByLevel.intermediate,
      ...groupedByLevel.beginner,
    ];

    merged.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setInterviews(merged);
    setLoading(false);
  });
}, [brJobId]);


  if (loading)
    return (
      <Typography mt={2} width={"100%"} textAlign={"center"}>
        Loading assessed applicants...
      </Typography>
    );

  return (
    <Grid container spacing={3}>
      {interviews.length > 0 ? (
        interviews.map((interview, index) => {
          const score = interview.interviewScore;
          const { remark, bgcolor } = getRemark(score);

          return (
            <Grid item xs={12} sm={12} md={12} key={index} position="relative">
              <Card
                sx={{
                  background: color.cardBg,
                  color: "inherit",
                  borderRadius: 3,
                  textAlign: "center",
                  p: 2,
                  py: 1,
                  pb: 3,
                  // maxWidth: "250px",
                  // minWidth:'250px',
                  // width:'100%',
                  // minHeight: "150px",
                  position: "relative",
                  m: "auto",
                  boxShadow:'none',
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
                >
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
                        Applied On {formatDateWithSuffix(interview.createdAt)},{" "}
                        {new Date(interview.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                    </div>
                  </Box>
                  <Box sx={{ textAlign: "left", my: 2, mr:6 }}>
                    <Typography
                      sx={{
                        fontSize: "14px",
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
                        fontSize: "14px",
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
                  </Box>
                </Box>

                {/* Contact */}

                {/* Overview */}
                <Typography textAlign="left" mt={1}>
                  Overview:
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
                  Assessmet is pending
                </Typography>
              </Card>
            </Grid>
          );
        })
      ) : (
        <Typography mt={2} width={"100%"} textAlign={"center"}>
          No pending applicants found.
        </Typography>
      )}
    </Grid>
  );
};

export default PendingAssessmentApplicants;
