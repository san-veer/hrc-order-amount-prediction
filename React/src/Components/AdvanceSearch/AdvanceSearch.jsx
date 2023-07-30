import { useRecoilValue, useSetRecoilState } from "recoil";
import { SearchState } from "../recoil/atom";
import { modalState } from "../recoil/atom";
import Modal from "react-modal";
import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { toast } from "react-toastify";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';




const AdvanceModal = ({ selected, rows, setRows, setSelected }) => {

    const showModal = useRecoilValue(SearchState);
    const setSearchState = useSetRecoilState(SearchState);
    const setModalState = useSetRecoilState(modalState);
    const [customerOrderID, setcustomerOrderID] = React.useState("");
    const [customerNumber, setCustomerNumber] = React.useState("");
    const [salesOrg, setSalesOrg] = React.useState("");
    const [searchArray, setSearchArray] = React.useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const fieldSetters = {
            customerOrderID: setcustomerOrderID,
            customerNumber: setCustomerNumber,
            salesOrg: setSalesOrg,
        };

        const fieldSetter = fieldSetters[name];
        if (fieldSetter) {
            fieldSetter(value);
        }
    };

    const validator = () => {
        if (isNaN(customerOrderID)) {
            toast.error("Customer Order ID should be a non-empty number");

            return false;
        } else if (isNaN(salesOrg)) {

            toast.error("Sales Org should be a non-empty number");
            return false
        } else if (isNaN(customerNumber)) {

            toast.error("CustomerNumber should be a non-empty number");
            return false
        }
        return true
    };





    const handleSearchData = async () => {
        setSearchState(false);
        setModalState(true);
        let saa = [];

        // Create an array of fetch promises
        const fetchPromises = searchArray.map((sa) => {
            return fetch(`http://localhost:8082/h2h_milestone_3/AdvanceSearchDataServlet?${sa.name}=${sa.value}`)
                .then(response => response.json())
                .then(data => {
                    saa.push(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        });

        try {
            // Wait for all fetch requests to complete
            await Promise.all(fetchPromises);
            setRows(saa);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }

        setModalState(false);
        // setSearchArray([])
    };


    const handleCancelClick = () => {
        setSearchState(false);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (validator()) {
                const { name, value } = event.target;
                setSearchArray((prevSearchArray) => [
                    ...prevSearchArray,
                    { name, value },
                ]);
                event.target.blur();
                if (name === "salesOrg") {
                    setSalesOrg("")
                } else if (name === "customerNumber") {
                    setCustomerNumber("")

                } else if (name === "customerOrderID") {
                    setcustomerOrderID("")
                }
            }
            setSalesOrg("")
            setCustomerNumber("")
            setcustomerOrderID("")
        }
    };

    const handleRemoveItem = (index) => {
        const updatedArray = [...searchArray];
        updatedArray.splice(index, 1);
        setSearchArray(updatedArray);
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
            className="Modal"
            contentLabel="Edit Modal"
            style={modalStyles}
        >
            <div className="fixed inset-0 flex items-center justify-center z-50 m-4 overflow-y-auto">
                <div className="p-2 w-full max-w-md bg-white rounded-md border-2 border-green-500">
                    <div className="p-4 text-center rounded-lg shadow-sm mt-8 sm:mt-0">
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required"
                                    label="Customer Order ID"
                                    variant="outlined"
                                    fullWidth
                                    className="rounded-lg bg-white"
                                    value={customerOrderID}
                                    onChange={handleChange}
                                    name="customerOrderID"
                                    onKeyDown={(event) => handleKeyDown(event, "customerOrderID")}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required"
                                    label="Customer Number"
                                    variant="outlined"
                                    fullWidth
                                    className="rounded-lg bg-white"
                                    value={customerNumber}
                                    onChange={handleChange}
                                    onKeyDown={(event) => handleKeyDown(event, "customerNumber")}
                                    name="customerNumber"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-required"
                                    label="Sales Org"
                                    variant="outlined"
                                    fullWidth
                                    className="rounded-lg bg-white"
                                    value={salesOrg}
                                    onChange={handleChange}
                                    onKeyDown={(event) => handleKeyDown(event, "salesOrg")}
                                    name="salesOrg"
                                />
                            </Grid>
                        </Grid>
                    </div>

                    {!(searchArray.length > 0) && (
                        <div className="m-4 py-3 flex justify-between items-center ml-2 bg-blue-200 rounded-md">
                            <IconButton color="primary" aria-label="info">
                                <InfoIcon />
                            </IconButton>
                            <p className="pr-2">Add up to 12 Filters. Press Enter after every input</p>
                        </div>
                    )}

                    <div className="flex flex-wrap text-sm">
                        {searchArray.map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center rounded-lg px-2 py-1 m-1 ${item.name === "salesOrg"
                                    ? "bg-cyan-300"
                                    : item.name === "customerNumber"
                                        ? "bg-orange-300"
                                        : item.name === "customerOrderID"
                                            ? "bg-rose-300"
                                            : ""
                                    }`}
                            >
                                <span className="mr-2">{item.name} {item.value}</span>
                                <button
                                    className="text-red-500 focus:outline-none"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.293 4.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 11-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="m-2 py-3 flex justify-center items-center">
                        <div className="mr-2 ">
                            <Button
                                variant="contained"
                                color="primary"
                                className="w-full sm:w-auto"
                                style={{ backgroundColor: "orange" }}
                                onClick={handleSearchData}
                            >
                                Search
                            </Button>
                        </div>
                        <div className="ml-2 ">
                            <Button
                                variant="contained"
                                color="secondary"
                                className="w-full sm:w-auto"
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>


    );
};

export default AdvanceModal;
