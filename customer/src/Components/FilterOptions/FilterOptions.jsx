import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { FaFilter, FaDotCircle } from "react-icons/fa";
import { IoIosPricetag } from "react-icons/io";
import { getCategories } from "../Services/productServices";
import "./FilterOptions.css";

function valuetext(value) {
  return `${value}`;
}

const minDistance = 10; //minimum distance for price slider

export default function FilterOptions({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  search,
  setSearch,
}) {
  const [open, setOpen] = useState(false); //state for open drawer
  const [value1, setValue1] = useState([minPrice, maxPrice]); //state for value of price slider

  const [categories, setCategories] = useState([]);//state for categories
  React.useEffect(() => {//use effect to fetch categories
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const toggleDrawer = (newOpen) => () => {//function to toggle drawer
    setOpen(newOpen);
  };

  const handleChange1 = (event, newValue, activeThumb) => {//function to handle change in price slider
    if (!Array.isArray(newValue)) {//if new value is not an array
      return;
    }

    if (activeThumb === 0) {//if active thumb is 0 , set min price
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      setMinPrice(Math.min(newValue[0], value1[1] - minDistance));
    } else {//if active thumb is 1 or not defined , set max price
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      setMaxPrice(Math.max(newValue[1], value1[0] + minDistance));
    }
  };

  const resetPrice = () => {//function to reset price
    setValue1([0, 10000]);
    setMinPrice(0);
    setMaxPrice(10000);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <div className="filter-header">
          <FaFilter className="filter-header-icon" />
          <h4>Filter Options</h4>
        </div>
        <ListItem disablePadding>
          <ListItemIcon>
            <IoIosPricetag />
          </ListItemIcon>
          <ListItemText className="listItemText" primary="Price" />
        </ListItem>
        <ListItem disablePadding>
          <div className="price-range">
            <div className="price-slider">
              <Box sx={{ width: 200 }}>
                <Slider //price slider
                  getAriaLabel={() => "Minimum distance"}
                  value={value1}
                  onChange={handleChange1}
                  valueLabelDisplay="auto"
                  getAriaValueText={valuetext}
                  min={0}
                  max={10000}
                  disableSwap
                />
              </Box>
            </div>
            <Button
              className="reset-price-btn"
              variant="outlined"
              onClick={resetPrice}
            >
              Reset
            </Button>
          </div>
        </ListItem>
      </List>
      <Divider />
      <List>
        {categories.map((item) => (
          <ListItem
            key={item.categoryID}
            disablePadding
            onClick={setSearch(item.categoryName)}
          >
            <ListItemButton>
              <ListItemIcon>
                <FaDotCircle />
              </ListItemIcon>
              <ListItemText
                className="listItemText"
                primary={item.categoryName}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="filter">
      <IconButton
        aria-label="delete"
        className="filterBtn"
        onClick={toggleDrawer(true)}
      >
        <FaFilter className="filter-btn-icon" />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
