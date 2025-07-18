import {
  faBriefcase,
  faBuilding,
  faChevronCircleRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  Grid,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  BeyondResumeButton,
  BlobAnimation,
} from "../../components/util/CommonStyle";
import { getUserId } from "../../services/axiosClient";
import {
  paginateDataFromTable,
  searchListDataFromTable,
} from "../../services/services";
import PaginationControlled from "../../components/shared/Pagination";
import React from "react";

const BeyondResumeInterviewList = () => {
  const [interviewList, setInterviewList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPractice, setIsPractice] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [reload, setReload] = useState(false);


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
// console.log(result?.data?.data?.rows)
      const sortedList = result?.data?.data?.rows?.sort((a: any, b: any) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      const grouped = sortedList.reduce((acc: any, item: any) => {
        const dateKey = getFormattedDateKey(item.updatedAt);
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

  const history = useHistory();

  //   if (loading) {
  //     return (
  //       <Box
  //         sx={{
  //           minHeight: "100vh",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           flexDirection: "column",
  //           background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
  //         }}
  //       >
  //         <div className="newtons-cradle">
  //           <div className="newtons-cradle__dot"></div>
  //           <div className="newtons-cradle__dot"></div>
  //           <div className="newtons-cradle__dot"></div>
  //           <div className="newtons-cradle__dot"></div>
  //         </div>

  //         <Typography variant="h6" sx={{ mb: 2 }}>
  //           Processing your Result
  //         </Typography>
  //       </Box>
  //     );
  //   }

  return (
    <Box
      sx={{
        background: "linear-gradient(145deg, #0d0d0d, #2D3436)",
        color: "white",
        p: 4,
        minHeight: "90vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <BlobAnimation />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          mb: 3,
        }}
      >
        <CustomToggleButtonGroup
          value={isPractice ? "yes" : "no"}
          exclusive
          onChange={() => setIsPractice((prev) => !prev)}
        >
          <CustomToggleButton value="yes">
            Practice Interviews
          </CustomToggleButton>
          <CustomToggleButton value="no">Job Interviews</CustomToggleButton>
        </CustomToggleButtonGroup>
      </Box>

      {loading ? (
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
      ) : Object.keys(interviewList).length  === 0 ? (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            No Data Available
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} mt={2} sx={{ minHeight: "70vh" }}>
          {Object.entries(interviewList).map(
            ([date, interviews]: [string, any[]]) => (
              <React.Fragment key={date}>
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
                      background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
                      color: "#fff",
                      boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
                      width: "fit-content",
                    }}
                  >
                    {date}
                  </Typography>
                </Grid>

                {interviews.map((interview, index) => {
                  const score = interview.interviewScore;
                  const { remark, bgcolor } = getRemark(score);

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={index}
                      position={"relative"}
                    >
                      <Card
                        sx={{
                          background:
                            "linear-gradient(145deg, #0d0d0d, #2D3436)",

                          color: "white",
                          borderRadius: 3,
                          textAlign: "center",
                          p: 2,
                          py: 4,
                          pb: 3,
                          maxWidth: "300px",
                          minHeight: "250px",
                          position: "relative",
                          m: "auto",
                        }}
                      >
                        {interview.companyName ? (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                justifyContent: "flex-start",
                                mt: 2,
                              }}
                            >
                              <FontAwesomeIcon
                                style={{
                                  height: "40px",
                                  background:
                                    "linear-gradient(145deg, #0d0d0d, #2D3436)",
                                  padding: "6px",
                                  borderRadius: "4px",
                                  // border: "solid 1px white",
                                }}
                                icon={faBuilding}
                              ></FontAwesomeIcon>
                              <div style={{ textAlign: "left" }}>
                                <Typography fontWeight="bold">
                                  {interview?.companyName}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontFamily: "Montserrat-Regular",
                                  }}
                                  mt={0}
                                >
                                  {interview?.jobTitle}
                                </Typography>
                              </div>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 2,
                                width: "90%",
                                textAlign: "left",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontFamily: "Montserrat-Regular",
                                  width: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <FontAwesomeIcon icon={faLocationDot} />
                                <Box
                                  component="span"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "inline-block",
                                  }}
                                >
                                  {interview?.location}
                                </Box>
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontFamily: "Montserrat-Regular",
                                  width: "50%",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <FontAwesomeIcon icon={faBriefcase} />
                                {interview?.jobType}
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box
                              sx={{
                                background: bgcolor,
                                mt: 2,
                                borderRadius: "50%",
                                width: 120,
                                height: 120,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography variant="h4" fontWeight="bold">
                                  {score}
                                </Typography>
                                <Typography variant="body2">of 100</Typography>
                              </Box>
                            </Box>

                            <Typography variant="h6" fontWeight="bold">
                              {remark}
                            </Typography>
                          </>
                        )}

                        <Typography
                          textAlign={!isPractice ? "left" : "center"}
                          mt={1}
                        >
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
                            textAlign: !isPractice ? "left" : "center",
                          }}
                        >
                          {interview.interviewSuggestion}
                        </Typography>

                        <BeyondResumeButton
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
                            width: isPractice ? "fit-content" : "100%",
                            p: 0.5,
                            px: 1.5,
                            background: isPractice
                              ? bgcolor
                              : "linear-gradient(180deg, #50bcf6, #5a81fd)",
                            ml: "auto",
                            display: isPractice
                              ? "-webkit-inline-flex"
                              : "block",
                          }}
                        >
                          See Result
                          <FontAwesomeIcon
                            style={{ marginLeft: "5px" }}
                            icon={faChevronCircleRight}
                          ></FontAwesomeIcon>
                        </BeyondResumeButton>

                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            // border:'solid 1px white',
                            background:
                              "linear-gradient(180deg, #50bcf6, #5a81fd)",
                            px: 1,
                            py: 0.5,
                            borderRadius: "0px 0px 8px 0px",
                          }}
                        >
                          <Typography variant="caption" display="block">
                            {formatDateWithSuffix(interview.updatedAt)}, {""}
                            {new Date(interview.updatedAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </React.Fragment>
            )
          )}
        </Grid>
      )}

      <Box sx={{ maxWidth: "200px", ml: "auto" }}>
        {Object.keys(interviewList).length !== 0 ? (
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

function formatDateWithSuffix(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}`;
}

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "#f0f2f7",
  borderRadius: "999px",
  padding: "8px",
}));

const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: "none",
  borderRadius: "999px !important",
  padding: "6px 16px",
  fontWeight: 600,
  fontSize: "18px",
  textTransform: "none",
  color: "grey",

  "&.Mui-selected": {
    background: "linear-gradient(180deg, #50bcf6, #5a81fd)",
    color: "#fff",
    boxShadow: "0px 4px 10px rgba(90, 128, 253, 0.49)",
  },
}));

const getFormattedDateKey = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  // Format as "28th May"
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // "May"
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${suffix} ${month}`;
};
