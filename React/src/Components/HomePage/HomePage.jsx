import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { useSetRecoilState } from "recoil";
import { DeleteState, modalState, EditState } from "../recoil/atom";
import DeleteModal from "../DeleteData/DeleteData";
import EditModal from "../EditData/EditData";
import { toast } from "react-toastify";
import axios from "axios";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "slNo", numeric: false, disablePadding: true, label: "Sl. No." },
  {
    id: "customerOrderId",
    numeric: true,
    disablePadding: false,
    label: "Customer Order ID",
  },
  { id: "salesOrg", numeric: true, disablePadding: false, label: "Sales Org" },
  {
    id: "distributionChannel",
    numeric: true,
    disablePadding: false,
    label: "Distribution Channel",
  },
  {
    id: "companyCode",
    numeric: true,
    disablePadding: false,
    label: "Company Code",
  },
  {
    id: "orderCreationDate",
    numeric: true,
    disablePadding: false,
    label: "Order Creation Date",
  },
  {
    id: "orderAmount",
    numeric: true,
    disablePadding: false,
    label: "Order Amount",
  },
  {
    id: "orderCurrency",
    numeric: true,
    disablePadding: false,
    label: "Order Currency",
  },
  {
    id: "customerNumber",
    numeric: true,
    disablePadding: false,
    label: "Customer Number",
  },
  {
    id: "amountInUSD",
    numeric: true,
    disablePadding: false,
    label: "Amount in USD",
  },
];

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableHead(props) {
  const classes = useStyles();
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" className={classes.textWhite}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
            className={classes.textWhite}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.textWhite}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    background: "#666666",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  textWhite: {
    color: "#fff", // Set the text color to white
  },
}));

export default function EnhancedTable({ rows, setRows }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [predictedData, setPredictedData] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const setModalState = useSetRecoilState(modalState);
  const setDeleteState = useSetRecoilState(DeleteState);
  const setEditState = useSetRecoilState(EditState);

  const fetchData = async () => {
    try {
      setModalState(true);
      const response = await fetch(
        "http://localhost:8082/h2h_milestone_3/ReadDataServlet"
      );
      const responseData = await response.json();
      setRows(responseData);
      setModalState(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!rows) {
      fetchData();
    }
  }, [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row.slNo);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, slNo) => {
    const selectedIndex = selected.indexOf(slNo);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, slNo);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (slNo) => selected.indexOf(slNo) !== -1;

  const emptyRows = rows
    ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)
    : 0;

  const handleDeleteData = async () => {
    if (selected.length === 0) {
      toast.info("No Row Selected!");
    } else {
      setDeleteState(true);
    }
  };

  const handleEditData = async () => {
    if (selected.length === 0) {
      toast.info("No Row Selected!");
    } else if (selected.length === 1) {
      setEditState(true);
    } else {
      toast.info("One Row Can be Edited At a Time!");
    }
  };

  const handlePrediction = async () => {
    const res = {};
    try {
      for (const s of selected) {
        const response = await fetch(
          `http://localhost:8082/h2h_milestone_3/EditDataServlet?slNo=${s}`
        );
        const d = await response.json();
        res[s] = d;
      }

      console.log(res);
    } catch (error) {
      toast.error(error);
    }

    // falsk

    const apibody = {
      CUSTOMER_ORDER_ID: [],
      SALES_ORG: [],
      DISTRIBUTION_CHANNEL: [],
      DIVISION: [],
      RELEASED_CREDIT_VALUE: [],
      PURCHASE_ORDER_TYPE: [],
      COMPANY_CODE: [],
      ORDER_CREATION_DATE: [],
      ORDER_CREATION_TIME: [],
      CREDIT_CONTROL_AREA: [],
      SOLD_TO_PARTY: [],
      ORDER_AMOUNT: [],
      REQUESTED_DELIVERY_DATE: [],
      ORDER_CURRENCY: [],
      CREDIT_STATUS: [],
      CUSTOMER_NUMBER: [],
    };

    // console.log(convertedData);
    const convertDate = (date) => {
      const [day, month, year] = date.split("-");
      return `${year}${month}${day}`;
    };

    const convertTime = (time) => {
      const date = new Date(time);
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");
      return parseInt(`${hours}${minutes}${seconds}`);
    };

    Object.values(res).forEach((r) => {
      const convertedData = {
        date: convertDate(r.orderCreationDate),
        time: convertTime(r.orderCreationTime),
      };
      apibody.CUSTOMER_ORDER_ID.push(r.customerOrderID);
      apibody.SALES_ORG.push(r.salesOrg);
      apibody.DISTRIBUTION_CHANNEL.push(r.distributionChannel);
      apibody.DIVISION.push(r.division);
      apibody.RELEASED_CREDIT_VALUE.push(r.releasedCreditValue);
      apibody.PURCHASE_ORDER_TYPE.push(r.purchaseOrderType);
      apibody.COMPANY_CODE.push(r.companyCode);
      apibody.ORDER_CREATION_DATE.push(convertedData.date);
      apibody.ORDER_CREATION_TIME.push(parseInt(convertedData.time));
      apibody.CREDIT_CONTROL_AREA.push(r.creditControlArea);
      apibody.SOLD_TO_PARTY.push(r.soldToParty);
      apibody.ORDER_AMOUNT.push(r.orderAmount);
      apibody.REQUESTED_DELIVERY_DATE.push(
        r.requestedDeliveryDate.replace(/\//g, "")
      );
      apibody.ORDER_CURRENCY.push(r.orderCurrency);
      apibody.CREDIT_STATUS.push(r.creditStatus);
      apibody.CUSTOMER_NUMBER.push(r.customerNumber);
    });

    const config = {
      method: "post",
      url: "http://127.0.0.1:5000/predict",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(apibody),
    };

    axios(config)
      .then((response) => {
        setPredictedData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    // save flask data in database

    const conversion_rates = {
      EUR: 1.19,
      GBP: 1.39,
      AED: 0.27,
      CHF: 1.08,
      AUD: 0.75,
      CAD: 0.82,
      MYR: 0.24,
      PLN: 0.26,
      HKD: 0.13,
      RON: 0.23,
      SGD: 0.74,
      CZK: 0.044,
      HU1: 0.0036,
      NZD: 0.7,
      BHD: 2.65,
      SAR: 0.27,
      QAR: 0.27,
      KWD: 3.31,
      SEK: 0.12,
    };

    const convertAmountToAU = (amount, currency) => {
      const conversionRate = conversion_rates[currency];
      return amount * conversionRate;
    };

    // Object.values(res).forEach((r, index) => {
    //   const OA = predictedData[index];
    //   const AU = convertAmountToAU(OA, r.orderCurrency);

    //   fetch(
    //     `http://localhost:8082/h2h_milestone_3/SetOrderAndAmount?slNo=${r.slNo}&orderAmount=${OA}&amountInUsd=${AU}`,
    //     {
    //       method: "POST",
    //       mode: "no-cors",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )

    //   // update the row order amount and amount in usd based on sl no , coorect the code
    //   const updatedRows = rows.map((row) => {
    //     if (row.slNo === slNo) {
    //         return requestBody;
    //     }
    //     return row;
    //   });
    //   //

    // setRows(updatedRows);

    //   toast.success("Updated Data Succesfully");
    // });

    Object.values(res).forEach(async (r, index) => {
      let OA = predictedData[index];
      let AU = convertAmountToAU(OA, r.orderCurrency);
      OA = Number(OA?.toFixed(4));
      AU = Number(AU?.toFixed(4));

      try {
        const response = await fetch(
          `http://localhost:8082/h2h_milestone_3/SetOrderAndAmount?slNo=${r.slNo}&orderAmount=${OA}&amountInUsd=${AU}`,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Update the row order amount and amount in USD based on slNo
        const updatedRows = rows.map((row) => {
          if (row.slNo === r.slNo) {
            return {
              ...row,
              orderAmount: OA,
              amountInUsd: AU,
            };
          }
          return row;
        });

        setRows(updatedRows);

        toast.success("Updated Data Successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to update data");
      }
    });
  };

  return (
    <div className={`${classes.root} py-2 `}>
      <Paper className={`${classes.paper} `}>
        <TableContainer>
          <Table
            className={` ${classes.table} text-white`}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            {rows && (
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows?.length}
              />
            )}
            {rows?.length > 0 ? (
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.slNo);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.slNo)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.slNo}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            className={classes.textWhite}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          className={classes.textWhite}
                        >
                          {row.slNo}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.customerOrderID}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.salesOrg}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.distributionChannel}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.companyCode}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.orderCreationDate}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.orderAmount}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.orderCurrency}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.customerNumber}
                        </TableCell>
                        <TableCell align="right" className={classes.textWhite}>
                          {row.amountInUsd}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={11}></TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={11}>
                  <p>NO DATA FOUND</p>
                </TableCell>
              </TableRow>
            )}
          </Table>
        </TableContainer>
        <div className="flex p-2 justify-between  flex-col   lg:flex-row  items-center">
          <div className="mt-3 space-x-2 ">
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#FC7500",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={fetchData}
            >
              REFRESH DATA
            </Button>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#FC7500",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={handleEditData}
            >
              EDIT
            </Button>
            <EditModal
              selected={selected}
              setSelected={setSelected}
              rows={rows}
              setRows={setRows}
            />
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#FC7500",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={handleDeleteData}
            >
              DELETE
            </Button>
            <DeleteModal
              selected={selected}
              setSelected={setSelected}
              rows={rows}
              setRows={setRows}
            />
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#FC7500",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={handlePrediction}
            >
              PREDICT
            </Button>
          </div>
          <div>
            <TablePagination
              className={classes.textWhite}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={rows?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </Paper>
      <div className="flex p-2 justify-between  flex-col   lg:flex-row  items-center">
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
          className="text-white"
        />
      </div>
    </div>
  );
}
