import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  "& > *": {
    margin: theme.spacing(1),
  },
}));

export default function CenteredGrid({ rows, setRows }) {
  const classes = useStyles();
  const [customerOrderId, setCustomerOrderId] = React.useState("");
  const [distributionChannel, setDistributionChannel] = React.useState("");
  const [companyCode, setCompanyCode] = React.useState("");
  const [orderCreationDate, setOrderCreationDate] = React.useState("");
  const [orderAmount, setOrderAmount] = React.useState(null);
  const [orderCurrency, setOrderCurrency] = React.useState("");
  const [customerNumber, setCustomerNumber] = React.useState("");
  const [amountInUSD, setAmountInUSD] = React.useState(null);
  const [salesOrg, setSalesOrg] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldSetters = {
      customerOrderId: setCustomerOrderId,
      distributionChannel: setDistributionChannel,
      companyCode: setCompanyCode,
      orderCreationDate: setOrderCreationDate,
      orderAmount: setOrderAmount,
      orderCurrency: setOrderCurrency,
      customerNumber: setCustomerNumber,
      amountInUSD: setAmountInUSD,
      salesOrg: setSalesOrg,
    };

    const fieldSetter = fieldSetters[name];
    if (fieldSetter) {
      fieldSetter(value);
    }
  };

  const handleClear = () => {
    setCustomerOrderId("");
    setDistributionChannel("");
    setCompanyCode("");
    setOrderCreationDate("");
    setOrderAmount("");
    setOrderCurrency("");
    setCustomerNumber("");
    setAmountInUSD("");
    setSalesOrg("");
  };

  const validator = () => {
    if (!customerOrderId || isNaN(customerOrderId)) {
      setCustomerOrderId("");
      toast.error("Customer Order ID should be a non-empty number");
    } else if (!companyCode || isNaN(companyCode)) {
      setCompanyCode("");
      toast.error("Company Code should be a non-empty number");
    } else if (!salesOrg || isNaN(salesOrg)) {
      setSalesOrg("");
      toast.error("Sales Org should be a non-empty number");
    } else if (isNaN(orderAmount)) {
      setOrderAmount("");
      toast.error("Order Amount should be a non-empty number");
    } else if (!customerNumber || isNaN(customerNumber)) {
      setCustomerNumber("");
      toast.error("Customer Number should be a non-empty number");
    } else if (isNaN(amountInUSD)) {
      setAmountInUSD("");
      toast.error("Amount in USD should be a non-empty number");
    } else if (
      !distributionChannel ||
      !/^[A-Za-z]+$/.test(distributionChannel)
    ) {
      setDistributionChannel("");
      toast.error(
        "Distribution Channel should be a non-empty string with alphabetic characters"
      );
    } else if (!orderCreationDate) {
      setOrderCreationDate("");
      toast.error("Order Creation Date should be a non-empty");
    } else if (!orderCurrency || !/^[A-Za-z]+$/.test(orderCurrency)) {
      setOrderCurrency("");
      toast.error(
        "Order Currency should be a non-empty string with alphabetic characters"
      );
    }
  };

  const handleAddData = async () => {
    validator();
    try {
      const requestBody = {
        customerOrderID: customerOrderId,
        salesOrg: salesOrg,
        distributionChannel: distributionChannel,
        companyCode: companyCode,
        orderCreationDate: orderCreationDate,
        orderAmount: orderAmount !== null ? orderAmount : 0,
        orderCurrency: orderCurrency,
        customerNumber: customerNumber,
        amountInUsd: amountInUSD !== null ? amountInUSD : 0,

        //not in frontened
        orderCreationTime: new Date().getTime(),
        requestedDeliveryDate: new Date().toLocaleDateString(),
        creditStatus: "0",
        uniqueCustNumber: String(customerNumber) + String(companyCode),

        //deafult
        division: "South-Region",
        releasedCreditValue: "100",
        purchaseOrderType: "1000",
        creditControlArea: "NR03",
        soldToParty: "798847812",
      };

      await fetch("http://localhost:8082/h2h_milestone_3/AddDataServlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        mode: "no-cors",
        body: JSON.stringify(requestBody),
      });

      toast.success("Invoice added successfully.");
      handleClear();
    } catch (error) {
      toast.error("failed to add data : ", error);
    }
  };

  return (
    <div className={`${classes.root} p-7`}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            defaultValue="Sl. No. Automtically Generated"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            label="Customer Order ID"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={customerOrderId}
            onChange={handleChange}
            name="customerOrderId"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            label="Company Code"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={companyCode}
            onChange={handleChange}
            name="companyCode"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            label="Sales Org"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={salesOrg}
            onChange={handleChange}
            name="salesOrg"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label="Distribution Channel"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={distributionChannel}
            onChange={handleChange}
            name="distributionChannel"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label="_____________Order Creation Date"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            type="date"
            value={orderCreationDate}
            onChange={handleChange}
            name="orderCreationDate"
            placeholder=""
            InputProps={{
              inputProps: {
                placeholder: "",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            label="Customer Number"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={customerNumber}
            onChange={handleChange}
            name="customerNumber"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            id="outlined-required"
            label="Order Amount"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={orderAmount}
            onChange={handleChange}
            name="orderAmount"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            required
            id="outlined-required"
            label="Order Currency"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={orderCurrency}
            onChange={handleChange}
            name="orderCurrency"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            id="outlined-required"
            label="Amount in USD"
            variant="outlined"
            fullWidth
            className="rounded-lg bg-white"
            value={amountInUSD}
            onChange={handleChange}
            name="amountInUSD"
          />
        </Grid>
      </Grid>
      <div className="py-3 flex justify-between items-center">
        <Button
          variant="contained"
          color="primary"
          style={{ width: "49%", backgroundColor: "orange" }}
          onClick={handleAddData}
        >
          Add Data
        </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: "49%" }}
          onClick={handleClear}
        >
          Clear Data
        </Button>
      </div>
    </div>
  );
}
