import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import BarGraph from "./BarGraph"
import PieChart from "./PieChart"

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function FormPropsTextFields() {

  const [barChart, setBarChart] = useState(false);
  const [pieChart, setPieChart] = useState(false);
  const [dC, setDC] = useState("");
  const [cN, setCN] = useState("");
  const [data, setData] = useState([]);



  const handleViewClick = async () => {


    if (dC === "" && cN === "") {
      try {
        const response = await fetch('http://localhost:8082/h2h_milestone_3/AnalyticsViewDataServlet', {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setData(data)
      } catch (error) {
        console.error(error);
      }
    } else if (dC === "") {
      try {
        const response = await fetch(`http://localhost:8082/h2h_milestone_3/AnalyticsViewDataServlet?CustomerNumber=${cN}`, {
          method: "GET"
        });
        const data = await response.json();
        console.log(data);
        setData(data)
      } catch (error) {
        console.error(error);
      }

    } else if (cN === "") {
      try {
        const response = await fetch(`http://localhost:8082/h2h_milestone_3/AnalyticsViewDataServlet?DistributionChannel=${dC}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setData(data)
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:8082/h2h_milestone_3/AnalyticsViewDataServlet?DistributionChannel=${dC}&CustomerNumber=${cN}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setData(data)
      } catch (error) {
        console.error(error);
      }
    }

    setBarChart(true);
    setPieChart(true);

  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'distributionChannel':
        setDC(value); // Update the 'dC' state variable
        break;
      case 'customerNumber':
        setCN(value); // Update the 'cN' state variable
        break;
      // Add more cases for additional fields, if needed
      default:
        break;
    }
  };


  return (
    <div className="flex flex-col  md:flex-row md:w-auto mt-5 mr-5">
      <div className="w-full md:w-1/3 p-2  ">
        <form className={`{classes.root} border-white border-2 rounded-xl m-2`} noValidate autoComplete="off" >
          <div className='m-2'>
            <TextField id="standard-search" style={{ width: '100%' }} label="Distribution Channel" type="search" value={dC} onChange={handleChange} name='distributionChannel' className='bg-white rounded-md' />
          </div>
          <div className='m-2'>
            <TextField id="standard-search" style={{ width: '100%' }} label="Customer Number" type="search" value={cN} onChange={handleChange} name='customerNumber' className='bg-white rounded-md' />
          </div>
          <div className='m-2 mt-5'> <Button variant="outlined" style={{ width: '100%', border: '2px solid white' }} onClick={handleViewClick}>VIEW</Button></div>

        </form>
      </div>
      <div className="w-full md:w-1/3" >
        {barChart && <BarGraph data={data} />}
      </div>

      <div className="w-full md:w-1/3 ml-2 ">
        {pieChart && <PieChart data={data} />}
      </div>
    </div>

  );
}
