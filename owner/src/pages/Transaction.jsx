import React from "react";
import SideNavbar from "../Components/SideNavbar";
import { Form, Row, Col, Button, InputGroup, Card } from "react-bootstrap";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaRegTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { LuPackageX } from "react-icons/lu";
import Boot_Button from "react-bootstrap/Button";
import Boot_Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import "./TransactionProductList.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Receipt from "../Components/Receipt";
import axios from "axios";

function Transaction() {
  const [items, setItems] = useState([]); //State to store the items in the list
  const [total, setTotal] = useState(0); //State to store the total amount of the products
  const listRef = useRef(null); //Reference to the list of products
  const [listHeight, setListHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false); //State to show the confirmation of the transaction
  const [productData, setProductData] = useState([]); //State to store the data of the products
  const [filteredData, setFilteredData] = useState([]); //State to store the filtered data of the products
  const [searchTerm, setSearchTerm] = useState(""); //State to store the search term
  const [discount, setDiscount] = useState(0); //State to store the discount default value is 0
  const [isScanning, setIsScanning] = useState(false); //State to store the scanning status
  const [barcode, setBarcode] = useState(""); //State to store the barcode
  const [scannedCode, setScannedCode] = useState(""); //State to store the scanned code
  const [showReceipt, setShowReceipt] = useState(false); //State to show the receipt
  const [distinctSubCategories, setDistinctSubCategories] = useState([]); //State to store the distinct subcategories for the search

  useEffect(() => {
    //Fetch the data of the products
    axios
      .get("http://localhost:5000/api/owner/productServices/listProducts")
      .then((res) => {
        //Set the data of the products
        const mappedData = mapProductData(res.data);
        setProductData(mappedData);
        setFilteredData(mappedData);
        const subCategoryNames = [
          ...new Set(res.data.map((item) => item.subCategoryName)),
        ];
        setDistinctSubCategories(subCategoryNames);
      })
      .catch((err) => {
        //Show the error message
        console.log(err);
        toast.error("Error occurred while fetching products", {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, []);

  useEffect(() => {
    //Filter the data of the products
    const filtered = productData.filter(
      //Filter the data of the products based on the search term
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, productData]);

  const handleSearch = (event) => {
    //Handle the search
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
    //Change the quantity of the product
    const itansQuantity = items.find((item) => item.id === itemId).quantity;
    const productQuantity = productData.find(
      (product) => product.id === itemId
    ).quantity;
    if (itansQuantity + change > productQuantity) {
      //Check if the quantity is greater than the product quantity
      toast.error("Out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setItems((prevItems) => {
      //Set the items
      return prevItems.map((item) => {
        if (item.id === itemId) {
          //Check if the item id is equal to the item id
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeItem = (itemId) => {
    //Remove the item from the list
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const clearList = () => {
    //Clear the list and new transaction
    const result = window.confirm(
      "New Transaction!!\nAre you sure you want to proceed?"
    );
    if (result) {
      setItems([]);
    }
  };

  const handleProceed = () => {
    //Handle the proceed of the transaction
    if (items.length === 0) {
      toast.error("No items in the list", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }
    setDiscount(0);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    //Handle the close of the confirmation
    setShowConfirmation(false);
  };

  const handleCloseReceipt = () => {
    //Handle the close of the receipt
    setShowReceipt(false);
    setItems([]);
  };

  const cancelTransaction = () => {
    //Cancel the transaction
    setItems([]);
  };

  const handleMouseOver = (event) => {
    //Handle the mouse over product tiles
    event.target.closest(".box").style.filter = "blur(0px)";
    event.target.closest(".box").querySelector(".popup").style.display =
      "block";
  };

  const handleMouseOut = (event) => {
    //Handle the mouse out of the product tiles
    event.target.closest(".box").style.filter = "none";
    event.target.closest(".box").querySelector(".popup").style.display = "none";
  };

  const addItem = (product) => {
    //Add the item to the list
    const existingItem = items.find((item) => item.name === product.name);
    if (product.quantity <= 0) {
      //Check if the product quantity is less than or equal to 0
      toast.error("Out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    if (existingItem) {
      //Check if the item already exists
      if (existingItem.quantity >= product.quantity) {
        toast.error("Out of stock", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      setItems((prevItems) => {
        //Set the items
        return prevItems.map((item) => {
          if (item.id === existingItem.id) {
            //If the item id is equal to the existing item id then return the updated item
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      });
    } else {
      setItems((prevItems) => [
        //add the item to the list
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

  const proceedTransaction = () => {
    // Prepare the data to be sent to the backend
    const transactionData = {
      total: total,
      discount: discount,
      items: items,
    };
    const accessToken = localStorage.getItem("accessToken") || ""; //Get the access token from the local storage

    // Make an HTTP POST request to your backend API
    axios
      .post(
        "http://localhost:5000/api/owner/productServices/transaction",
        transactionData,
        {
          headers: {
            "x-access-token": accessToken, //Set the access token
          },
        }
      )
      .then((response) => {
        //if the transaction is successful
        console.log("Transaction successful:", response.data);
        setShowConfirmation(false);
        setShowReceipt(true);

        toast.success("Transaction successful", {
          position: "top-right",
          autoClose: 1500,
        });
      })
      .catch((error) => {
        //if the transaction is unsuccessful
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3500,
        });
        console.error("Error occurred during transaction:", error);
        // Optionally, you can handle error response here
      });
  };

  const handleKeyPress = useCallback(
    //listen for the barcode scanner
    (event) => {
      if (event.key === "Enter") {
        if (barcode) {
          setScannedCode(barcode);
          isScanning && event.preventDefault();
          const product = productData.find((item) => item.barcode === barcode);
          if (product) {
            //if the product exists then add the product to the list
            addItem(product);
          }
          setBarcode("");
        }
      } else {
        setBarcode((prev) => prev + event.key);
      }
    },
    [barcode]
  );

  const barcodeReader = () => {
    //Handle the barcode reader
    setIsScanning((prevState) => !prevState);
  };

  useEffect(() => {
    //Listen for the key press
    if (isScanning) {
      window.addEventListener("keypress", handleKeyPress);
    } else {
      window.removeEventListener("keypress", handleKeyPress);
    }

    // Cleanup event listener on component unmount or when scanning stops
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isScanning, handleKeyPress]);

  return (
    <>
      <SideNavbar selected="Transaction" />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            {/* quick access search */}
            <div className="quickSearchContainer">
              <div className="quickSearchDiv">
                <Button
                  variant="outline-dark"
                  size="sm"
                  style={{ marginLeft: "0.3rem", zIndex: "950" }}
                  onClick={() => setSearchTerm("")}
                >
                  All
                </Button>
                {distinctSubCategories.map(
                  (
                    item //Map the distinct subcategories
                  ) => (
                    <Button
                      key={item}
                      variant="outline-dark"
                      size="sm"
                      style={{ marginLeft: "0.3rem", zIndex: "905" }}
                      onClick={() => setSearchTerm(item)}
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>
            </div>
            {/* search bar */}
            <div className="flex-container">
              <div
                className="searchDiv"
                style={{ marginLeft: "", marginTop: "-5.9rem", zIndex: "900" }}
              >
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
            {/* product list */}
            <div className="container">
              {filteredData.map((product, index) => {
                //Map the filtered data
                return (
                  <div
                    className="box"
                    key={index}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={() => addItem(product)}
                    style={{ zIndex: "888", width: "13.7%" }}
                  >
                    <div className="contant">
                      <div className="img-box">
                        <img
                          className="img"
                          src={product.image}
                          alt="product"
                        />
                      </div>
                      <div className="detail">
                        <div className="info">
                          <p>
                            <b>{product.name}</b>
                          </p>
                          <p className="productPrice">
                            Rs. {product.price} &nbsp;
                            {product.quantity <= 0 && (
                              <LuPackageX style={{ color: "red" }} />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="popup">{product.name}</div>
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item xs={6} md={4}>
            <div
              style={{
                position: "fixed",
                top: 45,
                left: 0,
                right: 0,
                bottom: "20%",
                maxWidth: "32%",
                marginLeft: "auto",
                overflowY: "auto",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <div className="d-grid gap-2">
                <Button
                  variant="secondary"
                  size="lg"
                  style={{
                    backgroundColor: "grey",
                    margin: "1rem",
                    paddingTop: "0.15rem",
                    paddingBottom: "0.15rem",
                  }}
                  onClick={clearList}
                >
                  New Transaction
                </Button>
              </div>
              {/* list of purchased items */}
              <div ref={listRef}>
                <ul
                  className="list-group"
                  style={{
                    display: "block",
                    width: "100%",
                    margin: "1rem",
                    fontSize: "13px",
                    marginTop: 0,
                  }}
                >
                  {items.map(
                    (
                      item //Map the items
                    ) => (
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
                          <span
                            style={{
                              marginRight: "1rem",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
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
                    )
                  )}
                </ul>
              </div>
            </div>
            {/* transaction footer for total and proceed */}
            <div className="transactionFooter">
              <Boot_Card style={{ width: "100%" }}>
                <Boot_Card.Body>
                  <Boot_Card.Text>
                    <div style={{ display: "flex" }}>
                      <div
                        className="barCode"
                        style={{ marginRight: "3rem", width: "5rem" }}
                      >
                        <Button
                          onClick={barcodeReader}
                          variant={isScanning ? "dark" : "outline-dark"}
                          style={{ fontSize: "16px" }}
                        >
                          {isScanning ? "Scanning" : "Scan Barcode"}
                        </Button>
                      </div>
                      <h3>Total</h3>
                      <div
                        className="totalPriceBox"
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
          </Grid>
        </Grid>
      </Box>

      {/*Modal for finalize of the transaction*/}
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
            <Form.Control //Input for the discount
              type="number"
              min="0"
              placeholder="Amount (to the nearest dollar)"
              aria-label="Amount (to the nearest dollar)"
              value={discount}
              onChange={(e) => {
                let value = parseFloat(e.target.value);
                setDiscount(value.toFixed(2));
              }}
            />
          </InputGroup>
          <p style={{ display: "flex" }}>
            Sub-Total:&nbsp;&nbsp; <h4>Rs. {total - discount}</h4>
          </p>
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

      {/*Modal for receipt*/}
      <Modal show={showReceipt} onHide={handleCloseReceipt}>
        <Modal.Header closeButton>
          <Modal.Title>Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Receipt items={items} discount={discount} />
        </Modal.Body>
      </Modal>

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
    category: item.categoryName,
    subCategory: item.subCategoryName,
    image: item.image1,
    price: item.unitPrice,
    quantity: item.currentStock,
    barcode: item.barcode,
  }));

  return mappedData;
}
