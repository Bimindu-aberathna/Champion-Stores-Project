import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './SalesGraph.css';

export default function SalesGraph() {
const weeks =  [1, 2, 3, 5, 8, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
const onlinesales = [8,9,6,5,7,10,11,10.3,6.8,7.5,8.5,9.5,10.5,11.5,12.5,13.5,14.5,15.5,12.5,11.5,16.5,8.5,10.5,11.5,12.15,13.5,14.5,15.5,16.5,17.5];
const offlinesales = [8.5,12.6,13.42,17.21,15.6,18.3,12.36,13.54,14.23,15.45,16.23,17.45,18.23,19.45,14.23,15.45,13.23,16.45,17.23,19.45,14.23,16.45,12.23,12.45,10.23,11.45,12.23,13.45,14.23,18.45];
const totalSales = onlinesales.map((value, index) => value + offlinesales[index]);

  return (
    <div>
    <LineChart
      xAxis={[{ data: weeks, axisLabel: 'Weeks' }]} 
      yAxis={[{ axisLabel: 'Sales' }]} 
      series={[
        {
          data: onlinesales,
        },
        {
          data: offlinesales,
        },
        {
          data: totalSales,
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
