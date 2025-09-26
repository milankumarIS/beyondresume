import {
  faBuilding,
  faChevronCircleRight,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  Divider,
  Grid,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PaginationControlled from "../../../components/shared/Pagination";
import { getFormattedDateKey, getFormattedDateKey1 } from "../../../components/util/CommonFunctions";
import {
  BeyondResumeButton,
  BeyondResumeButton2,
} from "../../../components/util/CommonStyle";
import { useTheme } from "../../../components/util/ThemeContext";
import { getUserId } from "../../../services/axiosClient";
import { paginateDataFromTable } from "../../../services/services";
import color from "../../../theme/color";
import BeyondResumeApplications from "./BeyondResumeApplications";
import { jobKeywordIcons } from "../../../components/form/data";

const BeyondResumeInterviewList = () => {
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPractice, setIsPractice] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reload, setReload] = useState(false);
  const history = useHistory();
  const { theme } = useTheme();

  useEffect(() => {
    setLoading(true);

    const tableName = isPractice ? "brInterviews" : "brJobApplicant";
    const params = isPractice
      ? {
          createdBy: getUserId(),
          brInterviewStatus: "CONFIRMED",
        }
      : {
          createdBy: getUserId(),
          brJobApplicantStatus: "CONFIRMED",
        };

    paginateDataFromTable(tableName, {
      page: page - 1,
      pageSize: 10,
      data: {
        ...params,
        filter: "",
        fields: [],
      },
    }).then((result: any) => {
      setTotalCount(result?.data?.data?.count);
      const sortedList = result?.data?.data?.rows?.sort((a: any, b: any) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      const grouped = sortedList.reduce((acc: any, item: any) => {
        const dateKey = getFormattedDateKey1(item.updatedAt);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      }, {});
      setInterviewList(grouped);
      setLoading(false);
    });
  }, [isPractice, page, reload]);


  return (
    <Box
      sx={{
        // p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        textAlign={"center"}
        mt={2}
        // sx={{ fontFamily: "montserrat-regular" }}
      >
        Your Interview Hub
      </Typography>

      <Box
        sx={{
          // background: color.cardBg,
          p: { xs: 0, md: 4 },
          mb: 0,
          mt: { xs: 2, md: 0 },
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            color: "inherit",
          }}
        >
          <CustomToggleButtonGroup
            value={isPractice ? "yes" : isUpcoming ? "upcoming" : "no"}
            exclusive
            onChange={(_, newValue) => {
              if (newValue === "yes") {
                setIsPractice(true);
                setIsUpcoming(false);
              } else if (newValue === "upcoming") {
                setIsPractice(false);
                setIsUpcoming(true);
              } else {
                setIsPractice(false);
                setIsUpcoming(false);
              }
            }}
          >
            <CustomToggleButton value="upcoming">
              Upcoming Interviews
            </CustomToggleButton>
            <CustomToggleButton value="no">Past Interviews</CustomToggleButton>
            <CustomToggleButton value="yes">
              Past Practice Interviews
            </CustomToggleButton>
          </CustomToggleButtonGroup>
        </Box>

        {isUpcoming ? (
          <BeyondResumeApplications />
        ) : loading ? (
          <Box
            sx={{
              minHeight: "70vh",
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
              Processing your Result
            </Typography>
          </Box>
        ) : Object.keys(interviewList).length === 0 ? (
          <Box
            sx={{
              minHeight: "70vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              color: "inherit",
            }}
          >
            <Typography variant="h6" color="inherit">
              No Data Available
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            mt={1}
            p={{ xs: 0, md: 3 }}
            sx={{ minHeight: "30vh" }}
          >
            {Object.entries(interviewList).map(
              ([date, interviews]: [string, any[]]) => (
                <React.Fragment key={date}>
                  {/* {isPractice && (
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 4,
                          mb: 1,
                          position: "relative",
                          borderRadius: "999px !important",
                          padding: "6px 16px",
                          fontWeight: 600,
                          //   fontSize: "18px",
                          background: color.activeButtonBg,
                          color: "#fff",
                          boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                          width: "fit-content",
                        }}
                      >
                        {date}
                      </Typography>
                    </Grid>
                  )} */}

                  {interviews.map((interview, index) => {
                    const score = interview.interviewScore;
                    const { remark, bgcolor } = getRemark(score);
                    // console.log(interview);

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={isPractice ? 12 : 12}
                        md={isPractice ? 12 : 12}
                        key={index}
                        position={"relative"}
                      >
                        <Card
                          onClick={() =>
                            history.push(
                              `/beyond-resume-interview-overview/${
                                isPractice
                                  ? interview?.brInterviewId
                                  : interview?.brJobApplicantId
                              }?type=${isPractice ? "practice" : "job"}`
                            )
                          }
                          sx={{
                            borderRadius: 3,
                            textAlign: "center",
                            p: 2,
                            position: "relative",
                            m: "auto",
                            boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s",
                            background:
                              theme === "dark"
                                ? color.jobCardBg
                                : color.jobCardBgLight,
                            color: "inherit",
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          <Box
                            sx={{ display: "flex" }}
                            flexDirection={{ xs: "column", md: "row" }}
                          >
                            {interview.companyName ? (
                              <>
                                <Box
                                  display={"flex"}
                                  alignItems={"center"}
                                  textAlign={"left"}
                                  gap={2}
                                  mb={2}
                                >
                                  <Box>
                                    <FontAwesomeIcon
                                      icon={faBuilding}
                                      style={{
                                        fontSize: "44px",
                                        background: "white",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        color: color.newbg,
                                      }}
                                    />
                                  </Box>

                                  <div>
                                    <Typography
                                      mb={0.5}
                                      variant="h6"
                                      onClick={() =>
                                        history.push(
                                          `/beyond-resume-interview-overview/${
                                            isPractice
                                              ? interview?.brInterviewId
                                              : interview?.brJobApplicantId
                                          }?type=${
                                            isPractice ? "practice" : "job"
                                          }`
                                        )
                                      }
                                      sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        cursor: "pointer",
                                        color:
                                          theme === "dark"
                                            ? color.titleColor
                                            : color.titleLightColor,
                                        "&:hover": {
                                          textDecoration: "underline",
                                        },
                                      }}
                                    >
                                      {interview.jobTitle}
                                    </Typography>

                                    <Typography
                                      fontSize={"16px"}
                                      mt={-0.5}
                                      mb={1}
                                      sx={{ fontFamily: "Custom-Regular" }}
                                    >
                                      {interview.companyName}
                                    </Typography>

                                    <Typography
                                      fontSize={"14px"}
                                      mt={-0.5}
                                      sx={{ fontFamily: "montserrat-regular" }}
                                    >
                                      {interview.location} ({interview.jobType})
                                    </Typography>
                                  </div>
                                </Box>
                              </>
                            ) : (
                              <Box
                                display={"flex"}
                                alignItems={"center"}
                                textAlign={"left"}
                                gap={2}
                                mb={2}
                              >
                                {isPractice ? (
                                  interview?.jobTitle ? (
                                    jobKeywordIcons.map((entry) =>
                                      interview?.jobTitle
                                        ?.toLowerCase()
                                        .includes(
                                          entry.keyword.toLowerCase()
                                        ) ? (
                                        <img
                                          key={entry.keyword}
                                          src={entry.iconUrl}
                                          alt={entry.keyword}
                                          style={{
                                            width: 44,
                                            height: 44,
                                            background:
                                              theme !== "dark"
                                                ? color.jobCardBg
                                                : color.jobCardBgLight,
                                            padding: "12px",
                                            borderRadius: "50%",
                                          }}
                                        />
                                      ) : (
                                        <></>
                                      )
                                    )
                                  ) : (
                                    <Box>
                                      <FontAwesomeIcon
                                        icon={faGraduationCap}
                                        style={{
                                          fontSize: "44px",
                                          background: "white",
                                          borderRadius: "8px",
                                          padding: "12px",
                                          color: color.newbg,
                                        }}
                                      />
                                    </Box>
                                  )
                                ) : (
                                  <Box>
                                    <FontAwesomeIcon
                                      icon={faBuilding}
                                      style={{
                                        fontSize: "44px",
                                        background: "white",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        color: color.newbg,
                                      }}
                                    />
                                  </Box>
                                )}

                                <div>
                                  <Typography
                                    mb={0.5}
                                    variant="h6"
                                    sx={{
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      WebkitLineClamp: 1,
                                      WebkitBoxOrient: "vertical",
                                      cursor: "pointer",
                                      color:
                                        theme === "dark"
                                          ? color.titleColor
                                          : color.titleLightColor,
                                      "&:hover": {
                                        textDecoration: "underline",
                                      },
                                    }}
                                  >
                                    {interview.jobTitle}
                                  </Typography>

                                  <Typography
                                    fontSize={"16px"}
                                    mt={-0.5}
                                    mb={1}
                                    sx={{ fontFamily: "Custom-Regular" }}
                                  >
                                    {interview.jobLevel}
                                  </Typography>

                                  <Typography
                                    fontSize={"14px"}
                                    mt={-0.5}
                                    sx={{ fontFamily: "montserrat-regular" }}
                                  >
                                    Applied (on) {""}
                                    {getFormattedDateKey(interview.createdAt)}
                                  </Typography>
                                </div>
                              </Box>
                            )}

                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  // flexDirection:'column',
                                  justifyContent: {
                                    xs: "center",
                                    md: "flex-end",
                                  },
                                  flexGrow: 1,
                                  minHeight: "100px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    // alignItems:'center',
                                    // justifyContent:'center',
                                  }}
                                >
                                  {isPractice ? (
                                    <BeyondResumeButton2
                                      sx={{
                                        position: "relative",
                                        overflow: "hidden",
                                        borderColor: getColor(score),
                                        py: 0.6,
                                        "&:hover": {
                                          transform: "none",
                                          borderColor: getColor(score),
                                        },
                                      }}
                                    >
                                      <span
                                        style={{
                                          position: "absolute",
                                          left: 0,
                                          top: 0,
                                          bottom: 0,
                                          width: `${score}%`,
                                          // borderRadius:'999px',
                                          backgroundColor: getColor(score),
                                          transition: "width 0.4s ease",
                                        }}
                                      />
                                      <span
                                        style={{
                                          position: "relative",
                                          zIndex: 1,
                                        }}
                                      >
                                        {score}%
                                      </span>
                                    </BeyondResumeButton2>
                                  ) : (
                                    <BeyondResumeButton2
                                      sx={{ fontSize: "12px" }}
                                      onClick={() => {
                                        history.push(
                                          `/beyond-resume-applicationJD/${interview.brJobId}`
                                        );
                                      }}
                                    >
                                      Review JD
                                      <FontAwesomeIcon
                                        style={{ marginLeft: "8px" }}
                                        icon={faChevronCircleRight}
                                      />
                                    </BeyondResumeButton2>
                                  )}
                                  <BeyondResumeButton
                                    sx={{ fontSize: "12px" }}
                                    onClick={() =>
                                      history.push(
                                        `/beyond-resume-interview-overview/${
                                          isPractice
                                            ? interview?.brInterviewId
                                            : interview?.brJobApplicantId
                                        }?type=${
                                          isPractice ? "practice" : "job"
                                        }`
                                      )
                                    }
                                  >
                                    View Feedback
                                    <FontAwesomeIcon
                                      style={{ marginLeft: "8px" }}
                                      icon={faChevronCircleRight}
                                    />
                                  </BeyondResumeButton>
                                </div>
                              </Box>
                            </>
                          </Box>

                          <Typography
                            textAlign={!isPractice ? "left" : "left"}
                            mt={1}
                          >
                            Overview:
                          </Typography>
                          <Typography
                            mt={0}
                            mb={2}
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              fontFamily: "Montserrat-Regular",
                              fontSize: "14px",
                              textAlign: !isPractice ? "left" : "left",
                            }}
                          >
                            {interview.interviewSuggestion}
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </React.Fragment>
              )
            )}
          </Grid>
        )}

        <Box sx={{ maxWidth: "100%", ml: "auto", mb: 2 }}>
          {Object.keys(interviewList).length !== 0 && !isUpcoming ? (
            <PaginationControlled
              page={page}
              setPage={setPage}
              count={totalCount}
            ></PaginationControlled>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <Typography variant="h5" my={2} sx={{ textAlign: "center" }}>
        Meanwhile, want to stay sharp? Try a quick Al-powered practice
        interview.
      </Typography>

      <BeyondResumeButton
        sx={{ m: "auto", display: "block", mb: 4, mt: 1 }}
        onClick={() => {
          history.push(`/beyond-resume-practicePools`);
        }}
      >
        Start Practice Interview
      </BeyondResumeButton>
    </Box>
  );
};

export default BeyondResumeInterviewList;

const getRemark = (score: number) => {
  if (score >= 85)
    return {
      remark: "Excellent",
      comparison: "You scored higher than 90% of the people.",
      bgcolor: "linear-gradient(0deg, #4CAF50, #81C784)",
    };
  if (score >= 70)
    return {
      remark: "Great",
      comparison: "You scored higher than 65% of the people.",
      bgcolor: "linear-gradient(0deg, #8BC34A, #AED581)",
    };
  if (score >= 50)
    return {
      remark: "Good",
      comparison: "You scored higher than 40% of the people.",
      bgcolor: "linear-gradient(0deg, #FFC107, #FFD54F)",
    };
  if (score >= 35)
    return {
      remark: "Fair",
      comparison: "You scored higher than 25% of the people.",
      bgcolor: "linear-gradient(0deg, #FF9800, #FFB74D)",
    };
  return {
    remark: "Needs Improvement",
    comparison: "Keep practicing to improve your score.",
    bgcolor: "linear-gradient(0deg, #F44336,rgb(186, 39, 39))",
  };
};

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "rgba(94, 94, 94, 0.15)",
  borderRadius: "44px",
  padding: "8px",
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  borderRadius: "44px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "12px", // default for xs
  textTransform: "none",
  color: "grey",
  marginRight: "8px",

  [theme.breakpoints.up("md")]: {
    fontSize: "18px", // override for md+
  },

  "&.Mui-selected": {
    borderRadius: "12px",
    background: color.activeButtonBg,
    color: "white",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.11)",
  },
}));



const getColor = (score: number) => {
  if (score < 40) return "#e53935"; // Red
  if (score < 70) return "#fbc02d"; // Yellow
  return "#43a047"; // Green
};
