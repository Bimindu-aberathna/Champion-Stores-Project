import React from "react";
import SideNavbar from "../Components/SideNavbar";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { FaRegTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { LuPackageX } from "react-icons/lu";
import Boot_Button from "react-bootstrap/Button";
import Boot_Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import "./TransactionProductList.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Transaction() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/listProducts")
      .then((res) => {
        const mappedData = mapProductData(res.data);
        setProductData(mappedData);
        setFilteredData(mappedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const filtered = productData.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);

  }, [searchTerm,productData]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

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
    const itansQuantity = items.find((item) => item.id === itemId).quantity;
    const productQuantity = productData.find((product) => product.id === itemId).quantity;
    if (itansQuantity + change > productQuantity) {
      toast.error("Out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
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
    if (product.quantity <= 0) {
      toast.error("Out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
      toast.error("Out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
      }
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

  const quicksearch = ["Soap", "Face Cream", "Face Wash", "Lipstick", "Toys"];

  const proceedTransaction = () => {
    console.log("proceeding transaction");
    console.log("Total: ", total);
    console.log("Discount: ", discount);
    console.log("Subtotal: ", total - discount);
    console.log("Items: ", items);

    // Prepare the data to be sent to the backend
  const transactionData = {
    total: total,
    discount: discount,
    items: items
  };
  const accessToken = localStorage.getItem("accessToken")||"";

  // Make an HTTP POST request to your backend API
  axios.post('http://localhost:5000/api/owner/productServices/transaction', transactionData, {
    headers: {
      "x-access-token": accessToken,
    },
  }
  )
    .then(response => {
      console.log('Transaction successful:', response.data);
      setShowConfirmation(false);
      setItems([]);
      toast.success('Transaction successful', {
        position: "top-right",
        autoClose: 1500,
      });
    })
    .catch(error => {
      toast.error("Hello"+error.response.data.message, {
        position: "top-right",
        autoClose: 3500,
      });
      console.error('Error occurred during transaction:', error);
      // Optionally, you can handle error response here
    });
  };

  return (
    <>
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
                  onChange={handleSearch}
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
        {filteredData.map((product, index) => {
          return (
            <div
              className="box"
              key={index}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => addItem(product)}
              style={{ zIndex: "888" }}
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
                    <p>Rs. {product.price} &nbsp;{product.quantity<=0 && <LuPackageX style={{color:"red"}}/>}</p>
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
            backgroundColor: "white",
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
            Total:&nbsp;&nbsp; <b>Rs. {total}</b>
            <br />
            <InputGroup className="mb-3">
              <InputGroup.Text>add discount</InputGroup.Text>
              <InputGroup.Text>Rs.</InputGroup.Text>
              <Form.Control
                type="number"
                min="0"
                placeholder="Amount (to the nearest dollar)"
                aria-label="Amount (to the nearest dollar)"
                onChange={(e) => {
                  setDiscount(e.target.value);
                }}
              />
            </InputGroup>
            <p style={{display:'flex'}}>Sub-Total:&nbsp;&nbsp; <h4>Rs. {total-discount}</h4></p>
            
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
                onClick={proceedTransaction}
              >
                Finish
              </Boot_Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
}

export default Transaction;

function mapProductData(apiData) {
  // Map the incoming data to the desired format
  const mappedData = apiData.map((item) => ({
    id: item.productID,
    name: item.productName,
    image: item.image1,
    price: item.unitPrice,
    quantity: item.currentStock,
  }));

  return mappedData;
}
