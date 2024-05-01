// ProductReturn.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Modal, Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import SearchBar from "../Components/SearchBar";
import SideNavbar from "../Components/SideNavbar";
import { validateIntegers } from "../functionality/validation";

function ProductReturn() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isNotExchanging, setIsNotExchanging] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/listProducts")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleItemSelect = (item) => {
    setSelectedItem(item); // Set the selected item in the state
  };

  const handleProceed = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const cancelReturn = () => {
    setSelectedItem(null); // Clear the selected item
  };
  const handleCheckBoxChange = (event) => {
    setIsNotExchanging(event.target.checked);
  };

  const handleReturn = () => {
    if (selectedItem === null) {
      alert("Please select a product to return.");
      return;
    }
    const productID = selectedItem.productID;
    if (!validateIntegers(quantity)||quantity===0) {
      alert("Please enter a valid quantity.");
      return;
    }
    const supplierID = selectedItem.supplierID;
    const notExchanging = isNotExchanging;
    axios
      .post("http://localhost:5000/api/owner/productServices/returnProduct", {
        productID,
        quantity,
        supplierID,
        notExchanging,
      })
      .then((res) => {
        if (res.data.message === "success") {
          // Corrected response handling
          alert("Product returned successfully.");
          cancelReturn();
        } else {
          alert("Product return failed.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Product return failed."); // Handle network errors
      });
    setQuantity(1);
    setShowConfirmation(false);
  };

  return (
    <>
      <SideNavbar />
      <div
        style={{
          height: "100vh",
        }}
      >
        <div
          style={{
            marginLeft: "7%",
            width: "50%",
            marginTop: "1rem",
          }}
        >
          <h1>Product return</h1>
        </div>
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "55%",
              paddingTop: "2.5rem",
              paddingBottom: "2.5rem",
            }}
          >
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ width: "85%" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {/* Render the SearchBar component */}
                  <SearchBar items={items} onItemSelect={handleItemSelect} />
                </div>
                <Form style={{ marginTop: "6rem" }}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Selected product name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Selected return item..."
                      value={selectedItem ? selectedItem.productName : ""}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="Not exchanging!"
                      onChange={handleCheckBoxChange}
                      checked={isNotExchanging}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      style={{ width: "6rem" }}
                      variant="outline-dark"
                      type="reset"
                    >
                      Clear
                    </Button>
                    <Button
                      style={{ width: "6rem", marginLeft: "0.75rem" }}
                      variant="dark"
                      type="button"
                      onClick={handleProceed}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Rest of your component */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to proceed?
          <br />
          <br />
          {isNotExchanging && (
            <p>
              You have <b>selected "Not exchanging"</b>. The selected item will
              not be removed from the inventory.
            </p>
          )}
          {!isNotExchanging && (
            <p>
              You have <b>not selected "Not exchanging"</b>. The selected item
              will be removed from the inventory.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReturn}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductReturn;
