import * as React from 'react';
import { useState,useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './SalesGraph.css';
import {getWeeklyInstoreSales,getWeeklyOnlineSales} from '../Services/ReporService'; 
import axios from 'axios';

export default function SalesGraph() {
const weeks =  [1, 2, 3, 5, 8, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52];
const [online_sales, setOnline_Sales] = useState([]);
const [instore_sales, setInstore_Sales] = useState([]);
const [total_sales, setTotal_Sales] = useState([]);
let onlinesales = [];
let offlinesales = [];

let totalSales = [];
//const totalSales = onlinesales.map((value, index) => value + offlinesales[index]);
useEffect(() => {
  axios.get('http://localhost:5000/ownerReportServices/getOnlineSales').then((res) => {
    onlinesales = res.data;
    console.log('----------------',onlinesales);
    axios.get('http://localhost:5000/ownerReportServices/getInstoreSales').then((res) => {
      offlinesales = res.data;
      console.log('//////////////////',offlinesales);
      totalSales = onlinesales.map((value, index) => value + offlinesales[index]);
      console.log('*********',totalSales);
  }
  ).catch((error) => {
    console.log(error);
  })
}
).catch((error) => {
  console.log(error);
})
}, []);

useEffect(() => {
  setOnline_Sales(onlinesales);
  setInstore_Sales(offlinesales);
  setTotal_Sales(totalSales);
}, [onlinesales, offlinesales, totalSales]);

  return (
    <div>
    <LineChart
      xAxis={[{ data: weeks, axisLabel: 'Weeks' }]} 
      yAxis={[{ axisLabel: 'Sales' }]} 
      series={[
        {
          data: online_sales,
        },
        {
          data: instore_sales,
        },
        {
          data: total_sales,
        },
      ]}
      width={750}
      height={525}
    />
    <div className="x-axis-label">Weeks</div>
      <div className="y-axis-label">Sales<br/>x 1000 LKR</div>
    </div>
  );
}
