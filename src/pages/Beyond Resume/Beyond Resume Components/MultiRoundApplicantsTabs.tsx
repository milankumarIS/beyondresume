import {
  faChevronCircleRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  formatDateWithSuffix,
  formatRoundTS,
} from "../../../components/util/CommonFunctions";
import { BeyondResumeButton2 } from "../../../components/util/CommonStyle";
import { searchListDataFromTable } from "../../../services/services";
import color from "../../../theme/color";

type StatusKey = "PASS" | "FAIL" | "PENDING";

interface MultiRoundApplicantsTabsProps {
  jobId: string;
}

interface Round {
  roundId: string;
  roundNumber: number;
  roundName?: string;
}

interface ApplicantRound {
  brJobApplicantId: string;
  brJobId: string;
  roundId: string;
  roundStatus: StatusKey;
  interviewScore?: number;
  interviewOverview?: string;
  interviewSuggestion?: string;
  brInterviewLevel?: string;
  createdAt: string;
}

interface Applicant {
  brJobApplicantId: string;
  fullName: string;
  phone: string;
  email: string;
  // add other fields from brJobApplicant if needed
}

const statusTabs = [
  {
    key: "PASS" as StatusKey,
    label: "Passed",
    color: "#16a34a",
    filter: (roundApplicants: ApplicantRound[]) =>
      roundApplicants.filter((r) => r?.roundStatus === "PASS"),
  },
  {
    key: "FAIL" as StatusKey,
    label: "Failed",
    color: "#dc2626",
    filter: (roundApplicants: ApplicantRound[]) =>
      roundApplicants.filter((r) => r?.roundStatus === "FAIL"),
  },
  {
    key: "PENDING" as StatusKey,
    label: "Pending",
    color: "#f97316",
    filter: (roundApplicants: ApplicantRound[]) =>
      roundApplicants.filter((r) => r?.roundStatus === "PENDING"),
  },
];

const MultiRoundApplicantsTabs: React.FC<MultiRoundApplicantsTabsProps> = ({
  jobId,
}) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [applicantRounds, setApplicantRounds] = useState<ApplicantRound[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [activeRound, setActiveRound] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<StatusKey>("PASS");
  const history = useHistory();
  const size = 80;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roundDataRes: any = await searchListDataFromTable("brJobRounds", {
          brJobId: jobId,
        });
        const roundsData: Round[] = roundDataRes?.data?.data || [];
        setRounds(roundsData);

        const applicantRoundsRes: any = await searchListDataFromTable(
          "brJobApplicantRounds",
          { brJobId: jobId }
        );
        const applicantRoundsData: ApplicantRound[] =
          applicantRoundsRes?.data?.data || [];
        setApplicantRounds(applicantRoundsData);

        const applicantsRes: any = await searchListDataFromTable(
          "brJobApplicant",
          { brJobId: jobId }
        );
        const applicantsData: Applicant[] = applicantsRes?.data?.data || [];
        setApplicants(applicantsData);

        if (roundsData.length > 0) {
          setActiveRound(roundsData[0].roundId);
        }
      } catch (err) {
        console.error("Error fetching multi-round data", err);
      }
    };

    fetchData();
  }, [jobId]);

  const roundApplicants = applicantRounds.filter(
    (r) => r.roundId === activeRound
  );

  const unstartedApplicants = applicants.filter(
    (a) =>
      !roundApplicants.some((r) => r.brJobApplicantId === a.brJobApplicantId)
  );

  const unstartedApplicantRounds: ApplicantRound[] =
    activeRound === rounds[0]?.roundId
      ? unstartedApplicants.map((a) => ({
          brJobApplicantId: a.brJobApplicantId,
          brJobId: jobId,
          roundId: activeRound,
          roundStatus: "PENDING",
          createdAt: new Date().toISOString(),
        }))
      : [];

  const allRoundApplicants = [...roundApplicants, ...unstartedApplicantRounds];

  // console.log(allRoundApplicants);

  const filteredApplicants =
    statusTabs
      .find((s) => s.key === activeStatus)
      ?.filter(allRoundApplicants) ?? [];

  const enrichedApplicants = filteredApplicants.map((ar) => {
    const details = applicants.find(
      (a) => a.brJobApplicantId === ar.brJobApplicantId
    );

    return {
      ...ar,
      fullName: details?.fullName || "",
      phone: details?.phone || "",
      email: details?.email || "",
    };
  });

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          value={activeRound}
          onChange={(_, v) => setActiveRound(v)}
          sx={{
            mt: 2,
            "& .MuiTab-root": {
              borderRadius: "999px",
              mx: 1,
              minWidth: 80,
              background: "grey",
              color: "white",
              fontWeight: 500,
              px: 4,
              py: 1,
              minHeight: 0,
              textTransform: "none",
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
          {rounds.map((round) => (
            <Tab
              key={round.roundId}
              label={formatRoundTS(round.roundId)}
              value={round.roundId}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ background: "#d1d1d13f", pt: 3, pb: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            value={activeStatus}
            onChange={(_, v) => setActiveStatus(v)}
            sx={{
              "& .MuiTab-root": {
                borderRadius: "999px",
                mx: 1,
                minWidth: 80,
                background: "grey",
                color: "#ffffffff",
                fontWeight: 500,
                px: 2,
                py: 0.8,
                minHeight: 0,
                textTransform: "none",
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
            {statusTabs.map((tab) => (
              <Tab
                key={tab.key}
                label={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    {tab.label}
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "2px 8px",
                        borderRadius: "44px",
                        marginLeft: "6px",
                        // width:'8px',
                        height: "16px",
                        fontSize: "14px",
                      }}
                    >
                      {tab.filter(allRoundApplicants).length}
                    </span>
                  </span>
                }
                value={tab.key}
              />
            ))}
          </Tabs>
        </Box>

        <div>
          {enrichedApplicants.length === 0 ? (
            <Typography textAlign={"center"} my={1}>
              No applicants found for this round/status.
            </Typography>
          ) : (
            enrichedApplicants.map((applicant) => {
              //   console.log(applicant);

              const score = applicant.interviewScore || 0;

              return (
                <Card
                  sx={{
                    background: color.cardBg,
                    color: "inherit",
                    borderRadius: 3,
                    textAlign: "center",
                    p: 2,
                    py: 3,
                    // maxWidth: "250px",
                    minWidth: "250px",
                    position: "relative",
                    m: "auto",
                    opacity: applicant.interviewOverview ? 1 : 0.6,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
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
                          {applicant?.fullName}
                        </Typography>

                        <Typography
                          variant="caption"
                          display="block"
                          textAlign="left"
                          sx={{
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          Submitted {formatDateWithSuffix(applicant?.createdAt)}
                          ,{" "}
                          {new Date(applicant?.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                        </Typography>
                      </div>
                    </Box>

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
                      {applicant.interviewOverview ||
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
                            score >= 70
                              ? "green"
                              : score >= 40
                              ? "orange"
                              : "red"
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
                          fontSize: 14,
                          fontFamily: "custom-bold",
                        }}
                      >
                        {score}%
                      </Typography>
                    </Box>

                    {applicant.interviewOverview && (
                      <BeyondResumeButton2
                        onClick={
                          () =>
                            history.push(
                              `/beyond-resume-interview-overview/${applicant?.brJobApplicantId}-${applicant?.roundId}?type=multiround`
                            )
                          //               history.push(
                          //     `/beyond-resume-interview-overview/${job?.brJobApplicantId}-${round?.roundId}?type=multiround`
                          //   );
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
              );
            })
          )}
        </div>
      </Box>
    </div>
  );
};

export default MultiRoundApplicantsTabs;
