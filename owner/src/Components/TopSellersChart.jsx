import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, useEffect } from "react";
import { getTopSellers } from "../Services/ReporService";
import "./TopSellersChart.css";

//MUI Chart settings
const chartSetting = {
  xAxis: [
    {
      label: "Quantity",
    },
  ],
  width: 500,
  height: 400,
};

//Function to format the value
const valueFormatter = (value) => `${value} units`;

//Function to truncate the label if it is too long
const truncateLabel = (label, maxLength) => {
  if (label.length > maxLength) {
    return label.slice(0, maxLength) + "...";
  }
  return label;
};

export default function TopSellersChart() {
  const [topSellers, setTopSellers] = useState([]);//State for top sellers
  const [period, setPeriod] = useState("lastWeek");//State for the period
  const barColors = ["#9C27B0"];//Color for the bar chart bars

  const handleChange = (event) => {//Function to handle the change in the period
    setPeriod(event.target.value);
  };

  useEffect(() => {//Use effect to get the top sellers
    getTopSellers(period).then((data) => {//Get the top sellers based on the period
      // Truncate the product names before setting the state
      const truncatedData = data.map((item) => ({
        ...item,
        productName: truncateLabel(item.productName, 25),
      }));
      setTopSellers(truncatedData);//Set the top sellers
    });
  }, [period]);

  return (
    <div className="top-sellers-chart">
      <div className="periodSelector">
        {/* Period selector */}
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            defaultValue="Last Week"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="Last Week"
              control={<Radio />}
              label="Last Week"
              onClick={()=>setPeriod("lastWeek")}
            />
            <FormControlLabel
              value="Last Month"
              control={<Radio />}
              label="Last Month"
              onClick={()=>setPeriod("lastMonth")}
            />
          </RadioGroup>
        </FormControl>
      </div>
      {/* Bar chart */}
      <BarChart
        dataset={topSellers}
        yAxis={[{ scaleType: "band", dataKey: "productName" }]}
        series={[
          {
            dataKey: "total_quantity_sold",
            label: "Top Sellers",
            valueFormatter,
            color: barColors,
          },
        ]}
        layout="horizontal"
        {...chartSetting}
      />
    </div>
  );
}
