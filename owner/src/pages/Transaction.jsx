import React from "react";
import SideNavbar from "../Components/SideNavbar";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { FaRegTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import Boot_Button from "react-bootstrap/Button";
import Boot_Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import "./TransactionProductList.css";

function Transaction() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Calculate total whenever items change
    let newTotal = 0;
    items.forEach((item) => {
      newTotal += item.quantity * item.price;
    });

    setTotal(newTotal);

    // Update list height
    setListHeight(listRef.current.offsetHeight);
  }, [items]);

  const changeQuantity = (itemId, change) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearList = () => {
    const result = window.confirm(
      "New Transaction!!\nAre you sure you want to proceed?"
    );
    if (result) {
      setItems([]);
    }
  };

  const handleProceed = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const cancelTransaction = () => {
    setItems([]);
  };

  const handleMouseOver = (event) => {
    event.target.closest(".box").style.filter = "blur(0px)";
    event.target.closest(".box").querySelector(".popup").style.display =
      "block";
  };

  const handleMouseOut = (event) => {
    event.target.closest(".box").style.filter = "none";
    event.target.closest(".box").querySelector(".popup").style.display = "none";
  };

  const addItem = (product) => {
    const existingItem = items.find((item) => item.name === product.name);
    if (existingItem) {
      setItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.id === existingItem.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      });
    } else {
      setItems((prevItems) => [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

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
  const quicksearch = ["Soap", "Face Cream", "Face Wash", "Lipstick", "Toys"];

  return (
    <>
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

          <Form inline>
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

      <div className="container" style={{ width: "60%" }}>
        {productData.map((product, index) => {
          return (
            <div
              className="box"
              key={index}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => addItem(product)}
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

      {/* </div> */}

      <div style={{ position: "relative", height: "100vh" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "20%",
            backgroundColor: "snow",
            maxWidth: "32%",
            marginLeft: "auto",
            overflowY: "auto",
          }}
        >
          
          <div className="d-grid gap-2">
            <Button
              variant="secondary"
              size="lg"
              style={{ backgroundColor: "grey", margin: "1rem" }}
              onClick={clearList}
            >
              New Transaction
            </Button>
          </div>

          <div ref={listRef}>
            <Boot_Card className="w-95">
              <ul
                className="list-group"
                style={{ display: "block", width: "100%", margin: "1rem" }}
              >
                {items.map((item) => (
                  <li
                    className="list-group-item"
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.name}</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                      }}
                    >
                      <span style={{ marginRight: "1rem" }}>
                        x{item.quantity}
                      </span>

                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => changeQuantity(item.id, -1)}
                        style={{ marginRight: "0.2rem" }}
                      >
                        <FaMinusCircle />
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => changeQuantity(item.id, 1)}
                        style={{ marginRight: "0.2rem" }}
                      >
                        <FaPlusCircle />
                      </Button>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        style={{ marginRight: "0.2rem" }}
                      >
                        <FaRegTrashAlt />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Boot_Card>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            top: "80%",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            maxWidth: "32%",
            marginLeft: "auto",
            backgroundColor: "white",
          }}
        >
          <Boot_Card style={{ width: "100%" }}>
            <Boot_Card.Body>
              <Boot_Card.Text>
                <div style={{ display: "flex" }}>
                  <h3>Total</h3>
                  <div
                    style={{
                      backgroundColor: "#B7B7B7",
                      marginLeft: "auto",
                      marginRight: "1rem",
                      width: "40%",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      display: "flex",
                    }}
                  >
                    Rs. &nbsp;&nbsp;&nbsp;<h4>{total}</h4>
                  </div>
                </div>
              </Boot_Card.Text>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Boot_Button
                  variant="outline-dark"
                  style={{ width: "45%", margin: "0.5rem" }}
                  onClick={cancelTransaction}
                >
                  Cancel
                </Boot_Button>
                <Boot_Button
                  variant="dark"
                  style={{ width: "45%", margin: "0.5rem" }}
                  onClick={handleProceed}
                >
                  Proceed
                </Boot_Button>
              </div>
            </Boot_Card.Body>
          </Boot_Card>
        </div>
        <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Total:&nbsp;&nbsp; <b>Rs. 1000</b>
            <br />
            <InputGroup className="mb-3">
              <InputGroup.Text>add discount</InputGroup.Text>
              <InputGroup.Text>Rs.</InputGroup.Text>
              <Form.Control aria-label="Amount (to the nearest dollar)" />
            </InputGroup>
            Are you sure you want to proceed?
          </Modal.Body>
          <Modal.Footer>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Boot_Button
                variant="outline-dark"
                style={{ width: "45%", margin: "0.5rem" }}
                onClick={handleCloseConfirmation}
              >
                Cancel
              </Boot_Button>
              <Boot_Button
                variant="dark"
                style={{ width: "45%", margin: "0.5rem" }}
              >
                Finish
              </Boot_Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default Transaction;
