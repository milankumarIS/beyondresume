import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserCode } from "../../services/axiosClient";
import { paginateUserDataFromTable } from "../../services/services";
import TitleHeader from "../shared/Header/TitleHeader";
import PaginationControlled from "../shared/Pagination";
import { DataNotFound } from "./DataNotFound";

const columns = [
  // { field: 'id', headerName: 'ID' },
  { field: "userName", headerName: "Name" },
  { field: "revenue", headerName: "Revenue (₹)" },
];

const RecursiveRow: React.FC<{ row: any }> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState<any>(row);
  const [page1, setPage1] = useState(1);

  const loadChildUser = () => {
    setRowData({});
    paginateUserDataFromTable(
      {},
      {
        data: {
          userStatus: "ACTIVE",
          supervisorCode: rowData?.userDailyLifeCode,
          filter: "",
        },
        page: page1,
        pageSize: 10,
        order: [["createdAt", "ASC"]],
      }
    ).then((users: any) => {
      row.children = users?.data?.data?.rows;
      setRowData(row);
    });
  };

  useEffect(() => {
    loadChildUser();
  }, [rowData?.userDailyLifeCode, page1]);

  const renderRecursiveRow = (data: any[]) => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((child: any, index: number) => (
        <RecursiveRow key={index} row={child} />
      ));
    } else {
      return <></>;
    }
  };

  return (
    <>
      <TableRow
        key={"parentRow" + rowData?.userId}
        style={{ height: "64px" }}
        onClick={() => loadChildUser()}
      >
        <TableCell style={{ maxWidth: "10%", width: "10%" }}>
          {rowData?.children && (
            <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
              {open ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell style={{ maxWidth: "40%", width: "40%" }}>
          {rowData?.userName}
          {rowData?.children && (
            <Typography
              sx={{
                background: "#0a5c6b",
                color: "white",
                borderRadius: "50%",
                fontSize: "12px",
                padding: "5px",
                display: "inline-block",
                // width: "24px",
                // height: "30px",
                minWidth: "24px",
                minHeight: "24px",
                textAlign: "center",
                lineHeight: "14px",
                marginLeft: "5px",
              }}
            >
              {rowData?.totalSubUserCount}
            </Typography>
          )}
        </TableCell>

        <TableCell>{rowData?.revenue || 0}</TableCell>
      </TableRow>
      <TableRow key={"childRow" + rowData?.userId}>
        <TableCell
          style={{ padding: "0px", paddingLeft: "10px" }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Table size="small">
                <TableBody>
                  {renderRecursiveRow(rowData?.children)}
                  {rowData.length !== 0 ? (
                    <PaginationControlled
                      page={page1}
                      setPage={setPage1}
                      count={rowData}
                    ></PaginationControlled>
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MyTeamPerformance: React.FC = () => {
  const filterData = (query: any, data: any) => {
    if (!query) {
      return data;
    } else {
      return data.filter((d: any) => d?.userName.toString().includes(query));
    }
  };

  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [teamMates, setTeamMates] = useState<any[]>([]);
  const dataFiltered = filterData(searchQuery, teamMates);

  useEffect(() => {
    paginateUserDataFromTable(
      {},
      {
        data: {
          userStatus: "ACTIVE",
          supervisorCode: getUserCode(),
          filter: searchQuery,
        },
        page: page - 1,
        pageSize: 10,
        order: [["createdAt", "ASC"]],
      }
    ).then((users: any) => {
      setTotalCount(users?.data?.data?.count);
      setTeamMates([...users?.data?.data?.rows]);
    });
  }, []);

  return (
    <div className="ion-padding">
      <TitleHeader title="My Team Performance" />
      <Paper
        sx={{
          boxShadow: 0,
          border: "solid 2px #0a5c6b",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#0a5c6b", color: "white" }}>
                <TableCell />
                {columns.map((col) => (
                  <TableCell style={{ color: "white" }} key={col.field}>
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {teamMates.map((row: any, index: number) => (
                <RecursiveRow key={index} row={row} />
              ))}
              {totalCount !== 0 ? (
                <PaginationControlled
                  page={page}
                  setPage={setPage}
                  count={totalCount}
                ></PaginationControlled>
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
          {totalCount === 0 ? <DataNotFound></DataNotFound> : <></>}
        </TableContainer>
      </Paper>
    </div>
  );
};

export default MyTeamPerformance;
