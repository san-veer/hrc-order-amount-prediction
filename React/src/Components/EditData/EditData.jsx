import { useRecoilValue, useSetRecoilState } from "recoil";
import { EditState } from "../recoil/atom";
import { modalState } from "../recoil/atom";
import Modal from "react-modal";
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        overflow: "hidden",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
    inputField: {
        marginBottom: theme.spacing(2),
    },
}));

const EditModal = ({ selected, rows, setRows, setSelected }) => {
    const classes = useStyles();
    const showModal = useRecoilValue(EditState);
    const setEditState = useSetRecoilState(EditState);
    const setModalState = useSetRecoilState(modalState);
    const [customerOrderId, setCustomerOrderId] = React.useState("");
    const [distributionChannel, setDistributionChannel] = React.useState("");
    const [companyCode, setCompanyCode] = React.useState("");
    const [orderCreationDate, setOrderCreationDate] = React.useState("");
    const [orderAmount, setOrderAmount] = React.useState(0);
    const [orderCurrency, setOrderCurrency] = React.useState("");
    const [customerNumber, setCustomerNumber] = React.useState("");
    const [amountInUSD, setAmountInUSD] = React.useState(0);
    const [slNo, setSlNo] = React.useState(0);
    const [salesOrg, setSalesOrg] = React.useState("");
    const [data, setData] = React.useState(null);


    useEffect(() => {
        if (showModal) {
            const fetchData = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:8082/h2h_milestone_3/EditDataServlet?slNo=${selected[selected.length - 1]}`
                    );
                    if (!response.ok) {
                        throw new Error("API request failed");
                    }
                    const d = await response.json();
                    setData(d);
                    setSlNo(d.slNo);
                    setAmountInUSD(d.amountInUsd);
                    setCompanyCode(d.companyCode);
                    setCustomerNumber(d.customerNumber);
                    setCustomerOrderId(d.customerOrderID);
                    setDistributionChannel(d.distributionChannel);
                    setOrderAmount(d.orderAmount);
                    setOrderCurrency(d.orderCurrency);
                    setSalesOrg(d.salesOrg);
                    const orderCreationDate = moment(d.orderCreationDate, "DD-MM-YYYY").toDate();
                    const formattedDate = moment(orderCreationDate).format("YYYY-MM-DD");
                    setOrderCreationDate(formattedDate);
                } catch (error) {
                    toast.error(error);
                }
            };

            fetchData();
        }
    }, [selected, showModal]);


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

    const handleUpdateData = async () => {
        setEditState(false);
        setModalState(true);
        validator();
        try {
            const formattedDate = moment(orderCreationDate).format("DD-MM-YYYY");
            const requestBody = {

                slNo: slNo,
                customerOrderID: customerOrderId,
                salesOrg: salesOrg,
                distributionChannel: distributionChannel,
                companyCode: companyCode,
                orderCreationDate: formattedDate,
                orderAmount: orderAmount,
                orderCurrency: orderCurrency,
                customerNumber: customerNumber,
                amountInUsd: amountInUSD,

                //not in frontened
                orderCreationTime: new Date().getTime(),
                requestedDeliveryDate: new Date().toLocaleDateString(),
                creditStatus: "0",
                uniqueCustNumber: String(customerNumber) + String(companyCode),

                //deafult
                division: data.division,
                releasedCreditValue: data.releasedCreditValue,
                purchaseOrderType: data.purchaseOrderType,
                creditControlArea: data.creditControlArea,
                soldToParty: data.soldToParty,
            };

            await fetch(
                `http://localhost:8082/h2h_milestone_3/EditDataServlet?slNo=${selected}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    mode: "no-cors",
                    body: JSON.stringify(requestBody),
                }
            );

            const updatedRows = rows.map((row) => {
                if (row.slNo === slNo) {
                    return requestBody;
                }
                return row;
            });

            setRows(updatedRows);

            toast.success("Updated Data Succesfully");
        } catch (error) {
            toast.error("failed to add data : ", error);
        }
        setModalState(false);
    };

    const handleCancelClick = () => {
        setEditState(false);
    };

    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Set the overlay background color with transparency
        },
        content: {
            background: 'none', // Set the modal content background to none
            border: 'none', // Remove the border
            padding: '0', // Remove padding
            inset: '40px', // Set the position inset
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    return (
        <Modal
            isOpen={showModal}
            ariaHideApp={false}
            className="Modal "
            contentLabel="Edit Modal"
            style={modalStyles}
        >
            <div className="modal-content bg-white m-5 max-h-screen overflow-y-auto max-w-3xl rounded-md">
                <div
                    className={`${classes.root} p-7  flex justify-center items-center`}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                required
                                id="outlined-required"
                                value={slNo}
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
                </div>
                <div className=" m-2 py-3 flex justify-between items-center mb-10">
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "49%", backgroundColor: "orange" }}
                        onClick={handleUpdateData}
                    >
                        Update Data
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ width: "49%" }}
                        onClick={handleCancelClick}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditModal;
