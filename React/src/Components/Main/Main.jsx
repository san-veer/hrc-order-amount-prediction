import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import HomePage from "../HomePage/HomePage";
import AddData from "../AddData/AddData";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import InputAdornment from '@material-ui/core/InputAdornment';
import AdvanceSearchModal from '../AdvanceSearch/AdvanceSearch'
import AnalyticsView from '../AnalyticsView/AnalyticsView'
import { useSetRecoilState } from "recoil";
import { SearchState } from "../recoil/atom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SimpleTabs() {
  const [value, setValue] = React.useState(0);
  const [rows, setRows] = React.useState(null);
  const [orderId, setOrderId] = React.useState("");
  const setSearchState = useSetRecoilState(SearchState);

  const handleOrderIdChange = (event) => {
    setOrderId(event.target.value);
  };

  const handleSearch = async () => {
    const apiUrl = `http://localhost:8082/h2h_milestone_3/SearchDataServlet?CustomerOrderID=${orderId}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);

      // Convert the object into an array
      const dataArray = [data];

      setRows(dataArray);
      setOrderId("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdvanceSearch = () => {
    setSearchState(true)
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <div className="bg-[#666666] py-2">
      <AppBar position="static" style={{ boxShadow: "none" }}>
        <div className=" flex flex-col  bg-[#666666] lg:flex-row justify-between items-center ">
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#D1D5DB",
              },
            }}
          >
            <Tab label="HOME PAGE" {...a11yProps(0)} />
            <Tab label="ADD DATA" {...a11yProps(1)} />
            <Tab label="ANALYTICS VIEW" {...a11yProps(2)} />
          </Tabs>
          <form
            noValidate
            autoComplete="off"
            style={{ display: "flex", alignItems: "center" }}
            className="py-2 lg:py-0"
          >
            <div style={{ marginRight: "10px", marginLeft: "10px" }}>
              <TextField
                id="outlined-helperText"

                placeholder="Enter Customer ID"
                variant="outlined"
                size="small"
                className="bg-white rounded px-2 py-1"
                onChange={handleOrderIdChange}
                value={orderId}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendRoundedIcon
                        style={{ color: "gray", cursor: "pointer", transform: "rotate(-15deg)" }}
                        onClick={handleSearch}
                      />
                    </InputAdornment>
                  )
                }}
              />
            </div>


            <Button
              variant="contained"
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: "green",
                height: "50px",
              }}
              onClick={handleAdvanceSearch}
            >
              Advanced Search
            </Button>

            <AdvanceSearchModal
              rows={rows}
              setRows={setRows}
            />
          </form>
        </div>
      </AppBar>

      <TabPanel value={value} index={0}>
        <HomePage rows={rows} setRows={setRows} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddData rows={rows} setRows={setRows} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AnalyticsView/>
      </TabPanel>
    </div>

  );
}
