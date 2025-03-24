import React from "react";
import InventoryNavBar from "../Components/InventoryNavBar";
import SideNavbar from "../Components/SideNavbar";
import "../Components/productlist.css";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { convertToPriceFormat } from "../functionality/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Inventory.css";

function Inventory() {
  const [items, setItems] = useState([]); // State variable to store the items
  const [searchTerm, setSearchTerm] = useState(""); // State variable to store the search term 
  const [searchResults, setSearchResults] = useState([]); // State variable to store the search results
  const [anchorEl, setAnchorEl] = useState(null); // State variable to store the anchor element 
  const [popperOpen, setPopperOpen] = useState(false);  // State variable to store the popper open status
  const [popperContent, setPopperContent] = useState(""); // State variable to store the popper content
  const [distinctSubCategories, setDistinctSubCategories] = useState([]); // State variable to store the distinct sub categories

  useEffect(() => { // Function to get the product list
    axios
      .get("http://localhost:5000/api/owner/productServices/listProducts")
      .then((res) => {
        setItems(res.data);
        setSearchResults(res.data);
        const subCategoryNames = [
          ...new Set(res.data.map((item) => item.subCategoryName)),
        ];
        setDistinctSubCategories(subCategoryNames);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server Error Occurred", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  }, []);

  useEffect(() => { // Function to filter the products based on the search term
    const results = items.filter(
      (item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, items]);

  const handleSearch = (event) => { // Function to handle the search
    setSearchTerm(event.target.value);
  };


  const handlePopoverOpen = (event, productName) => { // Function to handle the popover open
    setAnchorEl(event.currentTarget); 
    setPopperContent(productName);
    setPopperOpen(true);
  };

  const handlePopoverClose = () => { // Function to handle the popover close
    setAnchorEl(null);
    setPopperOpen(false);
  };

  return (
    <div>
      <InventoryNavBar /> {/* InventoryNavBar component */}
      <SideNavbar selected="Inventory" /> {/* SideNavbar component */}

      <div
        style={{
          paddingTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            justifyContent: "center",
          }}
        >
          {/* Display the buttons for the distinct sub categories */}
          <Button
            variant="outline-dark"
            size="sm"
            style={{ marginLeft: "0.3rem", zIndex: "950" }}
            onClick={() => setSearchTerm("")}
          > 
            All
          </Button>  
          
          {distinctSubCategories.map((item) => (
            <Button
              key={item}
              variant="outline-dark"
              size="sm"
              style={{ marginLeft: "0.3rem", zIndex: "950" }}
              onClick={() => setSearchTerm(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div
        className="flex-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          className="searchDiv"
          style={{ marginLeft: "", marginTop: "-5.9rem", zIndex: "905" }}
        >
          {/* Search bar */}
          <Form inline style={{ zIndex: "777" }}>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  onChange={handleSearch}
                />
              </Col>
              <Col xs="auto" style={{ marginLeft: "-15px" }}>
                <Button type="submit">Submit</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="productGrid">
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {searchResults.map((product) => (
                <Grid key={product.productID} item style={{ zIndex: "888" }}>
                  <Link
                    to={`/editproduct/${product.productID}`}
                    key={product.productID}
                  >
                    <Card
                      sx={{ width: 130, height: 190 }}
                      onMouseEnter={(e) =>
                        handlePopoverOpen(e, product.productName)
                      }
                      onMouseLeave={handlePopoverClose}
                      className="productCard"
                    >
                      <CardMedia
                        sx={{ height: 120 }}
                        image={product.image1}
                        title="Product"
                      />
                      <CardContent className="cardDetails">
                        <Typography variant="body2" className="two-line-text">
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="cardPrice"
                        >
                          Rs. {convertToPriceFormat(product.unitPrice)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
            <Popper
              open={popperOpen}
              anchorEl={anchorEl}
              placement="top-start"
              style={{
                zIndex: 910,
                width: "120px",
              }}
              modifiers={[
                {
                  name: "flip",
                  enabled: false,
                },
                {
                  name: "preventOverflow",
                  options: {
                    altAxis: true,
                    tether: false,
                    altBoundary: true,
                    rootBoundary: "viewport",
                    padding: 8,
                  },
                },
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ]}
            >
              <Paper
                sx={{
                  padding: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  transformOrigin: "top left",
                }}
              >
                <Typography variant="body2">{popperContent}</Typography>
              </Paper>
            </Popper>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
