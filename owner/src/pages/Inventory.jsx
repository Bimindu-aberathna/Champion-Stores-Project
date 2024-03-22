import React from "react";
import InventoryNavBar from "../Components/InventoryNavBar";
import SideNavbar from "../Components/SideNavbar";
import "../Components/productlist.css";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";

const productData = [
  {
    id: 1,
    image: require("../assets/9-5.jpg"),
    name: "Nature's Secret Face Wash 100ml",
    price: 100,
  },
  {
    id: 2,
    image: require("../assets/boque.jpg"),
    name: "Product 2",
    price: 100,
  },
  {
    id: 3,
    image: require("../assets/flower.jpg"),
    name: "Product 3",
    price: 100,
  },
  {
    id: 4,
    image: require("../assets/girl.jpg"),
    name: "Product 4",
    price: 100,
  },
  {
    id: 5,
    image: require("../assets/flower.jpg"),
    name: "Product 5",
    price: 100,
  },
  {
    id: 6,
    image: require("../assets/boque.jpg"),
    name: "Product 6",
    price: 100,
  },
  {
    id: 7,
    image: require("../assets/9-5.jpg"),
    name: "Product 7",
    price: 100,
  },
  {
    id: 8,
    image: require("../assets/girl.jpg"),
    name: "Product 8",
    price: 100,
  },
  {
    id: 9,
    image: require("../assets/boque.jpg"),
    name: "Product 9",
    price: 100,
  },
  {
    id: 10,
    image: require("../assets/logo.png"),
    name: "Product 10",
    price: 100,
  },
  {
    id: 11,
    image: require("../assets/9-5.jpg"),
    name: "Product 11",
    price: 100,
  },
  {
    id: 12,
    image: require("../assets/flower.jpg"),
    name: "Product 12",
    price: 100,
  },
  {
    id: 3,
    image: require("../assets/flower.jpg"),
    name: "Product 3",
    price: 100,
  },
  {
    id: 4,
    image: require("../assets/girl.jpg"),
    name: "Product 4",
    price: 100,
  },
  {
    id: 5,
    image: require("../assets/flower.jpg"),
    name: "Product 5",
    price: 100,
  },
  {
    id: 6,
    image: require("../assets/boque.jpg"),
    name: "Product 6",
    price: 100,
  },
  {
    id: 7,
    image: require("../assets/9-5.jpg"),
    name: "Product 7",
    price: 100,
  },
  {
    id: 8,
    image: require("../assets/girl.jpg"),
    name: "Product 8",
    price: 100,
  },
  {
    id: 9,
    image: require("../assets/boque.jpg"),
    name: "Product 9",
    price: 100,
  },
  {
    id: 10,
    image: require("../assets/logo.png"),
    name: "Product 10",
    price: 100,
  },
  {
    id: 11,
    image: require("../assets/9-5.jpg"),
    name: "Product 11",
    price: 100,
  },
  {
    id: 12,
    image: require("../assets/flower.jpg"),
    name: "Product 12",
    price: 100,
  },
];

function Inventory() {
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
            <button
              key={item}
              type="button"
              className="inline-block rounded-full border-2 border-gray-800 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-gray-800 transition duration-150 ease-in-out hover:border-gray-800 hover:bg-gray-800 hover:text-white focus:border-gray-800 focus:bg-gray-800 focus:text-white focus:outline-none focus:ring-0 active:border-gray-900 active:text-gray-900 motion-reduce:transition-none dark:text-gray-600 dark:hover:bg-gray-900 dark:focus:bg-gray-900"
              data-twe-ripple-init
              style={{ marginLeft: "0.2rem" }}
            >
              {item}
            </button>
          ))}

          <Form inline style={{ marginLeft: "0.5rem", marginBottom: "0" }}>
            <Row className="align-items-center">
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" style={{ backgroundColor: "#5B5B5B" }}>
                  <i className="pi pi-search" style={{ fontSize: "1rem" }}></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <div className="container">
        {productData.map((product, index) => {
          return (
            <div
              className="box"
              key={index}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <div className="contant">
                <div className="img-box">
                  <img className="img" src={product.image} alt="product" />
                </div>
                <div className="detail">
                  <div className="info">
                    <p>
                      <b>{product.name}</b>
                    </p>
                    <p>Rs. {product.price}</p>
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
                {product.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
