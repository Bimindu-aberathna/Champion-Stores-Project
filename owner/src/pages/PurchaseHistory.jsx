import React, { useState, useRef, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function PurchaseHistory() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [purchaseID, setPurchaseID] = useState(null);
  useEffect(() => {
    getPurchaseHistory();
  }, []);

  const getPurchaseHistory = () => {
    axios.get("http://localhost:5000/api/owner/productServices/purchaseHistory").then((res) => {
      console.log(res.data);
      setItems(res.data);
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()} / ${d.getMonth()} / ${d.getFullYear()}`;
  };

  const handleCancelRequest = (purchaseID) => () => {
    setPurchaseID(purchaseID);
    setShowModal(true);
  };
  const onModelClose = () => {
    setShowModal(false);
    setPurchaseID(null);
  };

  const cacelPurchase = () => {
    axios
      .post("http://localhost:5000/api/owner/productServices/cancelPurchase", {
        purchaseID: purchaseID,
      })
      .then((res) => {
        console.log(res.data);
        setItems((prevItems) =>
          prevItems.map((item) => {
            if (item.purchaseID === purchaseID) {
              return { ...item, ableToCancel: false };
            }
            return item;
          })
        );
        getPurchaseHistory();
        setShowModal(false);
      });
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginLeft: "7%",
            marginTop: "1rem",
            flex: "1",
          }}
        >
          <h1>Purchase history</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem",
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Brand Name</th>
                  <th>Date</th>
                  <th>Per unit(Rs.)</th>
                  <th>Stock</th>
                  <th>Total cost</th>
                  <th>Supplier</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productName}>
                    <td>{item.brandName}</td>
                    <td>{item.productName}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.unitBuyingPrice}</td>
                    <td>{item.itemCount}</td>
                    <td>{item.itemCount * item.unitBuyingPrice}</td>
                    <td>{item.name}</td>
                    <td>
                      <Button
                        variant="dark"
                        size="sm"
                        disabled={!item.ableToCancel}
                        onClick={handleCancelRequest(item.purchaseID)} // Pass a function to onClick
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <SideNavbar />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to cancel this purchase!!</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={onModelClose}>Cancel</Button>
          <Button variant="danger" onClick={cacelPurchase}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PurchaseHistory;
