import React, { useState, useRef, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar"
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import './PurchaseHistory.css';

function PurchaseHistory() {
  const [items, setItems] = useState([]); // State variable to store the items
  const [showModal, setShowModal] = useState(false); // State variable to store the modal status
  const [purchaseID, setPurchaseID] = useState(null); // State variable to store the purchase ID
  useEffect(() => { // Function to get the purchase history
    getPurchaseHistory();
  }, []);

  const getPurchaseHistory = () => { // Function to get the purchase history
    axios
      .get("http://localhost:5000/api/owner/productServices/purchaseHistory")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch purchase history", {
          position: "top-right",
          autoClose: 3500,
        });
      });
  };

  const formatDate = (date) => { // Function to format the date in the required format
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  };

  const handleCancelRequest = (purchaseID) => () => { // Function to handle the cancel request
    setPurchaseID(purchaseID);
    setShowModal(true);
  };
  const onModelClose = () => { // Function to close the modal
    setShowModal(false);
    setPurchaseID(null);
  };

  const cacelPurchase = () => { // Function to cancel the purchase
    setShowModal(false);
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        "http://localhost:5000/api/owner/productServices/cancelPurchase",
        {
          purchaseID: purchaseID,
        },
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Good job!",
          text: "You have successfully cancelled the purchase",
          icon: "success",
          confirmButtonColor: "#000",
        });
        setItems((prevItems) => // Update the items state
          prevItems.map((item) => {
            if (item.purchaseID === purchaseID) {
              return { ...item, ableToCancel: false };
            }
            return item;
          })
        );
        getPurchaseHistory();
      }).catch((err) => {
        console.log(err);
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3500,
        });
      });
  };

  return (
    <>
      <div
        className="main-container"
      >
        <div
          style={{
            marginTop: "1rem",
            width: "91%",
            marginLeft: "auto",
            marginRight: "auto",
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
            {/* Display the purchase history in a table */}
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
                {/*Purchase history table rows*/}
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
                      {/* Button to cancel the purchase */}
                      <Button
                        variant="dark"
                        size="sm"
                        disabled={!item.ableToCancel}
                        onClick={handleCancelRequest(item.purchaseID)} 
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

      <SideNavbar selected="Inventory" />
      <InventoryNavBar selected="purchasehistory"/>

      {/* Modal to confirm the purchase cancellation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to cancel this purchase!!</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" className="modalBtn" onClick={onModelClose}>
            Cancel
          </Button>
          <Button variant="danger" className="modalBtn" onClick={cacelPurchase}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default PurchaseHistory;
