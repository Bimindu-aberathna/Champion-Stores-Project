import React from "react";
import InventoryNavBar from "../Components/InventoryNavBar";
import SideNavbar from "../Components/SideNavbar";
import "../Components/productlist.css";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/listProducts")
      .then((res) => {
        setItems(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleMouseOver = (event) => {
    // Add blur effect to the tile when mouse is over
    event.target.closest(".box").style.filter = "blur(0px)";

    // Show the popup banner
    event.target.closest(".box").querySelector(".popup").style.display =
      "block";
  };

  const handleMouseOut = (event) => {
    // Remove blur effect when mouse leaves the tile
    event.target.closest(".box").style.filter = "none";

    // Hide the popup banner
    event.target.closest(".box").querySelector(".popup").style.display = "none";
  };
  const quicksearch = ["Soap", "Face Cream", "Face Wash", "Lipstick", "Toys"];

  return (
    <div>
      <InventoryNavBar />
      <SideNavbar />

      <div style={{ paddingTop: "1rem", paddingLeft: "13rem" }}>
        <div style={{ display: "flex", alignItems: "center", width: "90%" }}>
          {quicksearch.map((item) => (
            <Button
              key={item}
              variant="outline-dark"
              size="sm"
              style={{ marginLeft: "0.3rem", zIndex: "777" }}
            >
              {item}
            </Button>
          ))}

          <Form inline style={{ marginLeft: "0.3rem", zIndex: "777" }}>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className=" mr-sm-2"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit">Submit</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <div className="container">
        {items.map((product, index) => {
          return (
            <div
              className="box"
              key={index}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              style={{ zIndex: "888" }}
            >
              <div className="contant">
                <div className="img-box">
                  <img className="img" src={product.image1} alt="product" />
                </div>
                <div className="detail">
                  <div className="info">
                    <p>
                      <b>{product.productName}</b>
                    </p>
                    <p>Rs. {product.unitPrice}</p>
                  </div>
                </div>
              </div>
              {/* Popup banner */}
              <div
                className="popup"
                style={{
                  display: "none",
                  position: "absolute",
                  top: "0",
                  left: "0",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "#ffffff",
                  padding: "10px",
                  zIndex: "999",
                }}
              >
                {product.productName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
