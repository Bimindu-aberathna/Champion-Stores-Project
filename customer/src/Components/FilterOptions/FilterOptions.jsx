import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { RiInboxArchiveFill } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";
import IconButton from "@mui/material/IconButton";
import { FaFilter } from "react-icons/fa";
import Slider from "@mui/material/Slider";
import { IoIosPricetag } from "react-icons/io";
import "./FilterOptions.css";
import Button from "@mui/material/Button";
import { getCategories } from "../Services/productServices";
import { FaDotCircle } from "react-icons/fa";

function valuetext(value) {
  return `${value}`;
}
const minDistance = 10;
export default function FilterOptions() {
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(12000);

  const categories = getCategories();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [value1, setValue1] = useState([0, 10000]);

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
      setMinPrice(Math.min(newValue[0], value1[1] - minDistance));
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
      setMaxPrice(Math.max(newValue[1], value1[0] + minDistance));
    }
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
          <ListItemText primary="Price" />
        </ListItem>
        <ListItem disablePadding>
          <div className="price-range">
            <div className="price-slider">
              <Box sx={{ width: 200 }}>
                <Slider
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
            <Button className="filter-price-btn" variant="outlined">
              Filter
            </Button>
          </div>
        </ListItem>
      </List>
      <Divider />
      <List>
        {categories.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FaDotCircle />
              </ListItemIcon>
              <ListItemText primary={item.name} />
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
