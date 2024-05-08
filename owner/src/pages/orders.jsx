import React, { useState, useRef, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import SideNavbar from "../Components/SideNavbar";
import { Modal, Button } from "react-bootstrap";
import { FaRegTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const orderData = [
  {
    id: 1,
    name: "Asela Perera",
    address: "25, Lotus Street, Colombo 07.",
    orderNumber: "1520",
    date: "01/24/2023",
    total: "2294.89",
    time: "10:00 AM",
    mobile: "0771234567",
    items: [
      { id: 1, name: "Janet Cucumber Face Wash 100ml", quantity: 2 },
      { id: 2, name: "Organic Aloe Vera Gel 200ml", quantity: 1 },
      { id: 3, name: "Tea Tree Oil Face Cleanser 150ml", quantity: 3 },
      { id: 4, name: "Rosewater Toner 250ml", quantity: 2 },
    ],
  },
  {
    id: 2,
    name: "Ruwan Herath",
    address: "12, Palm Grove, Negombo.",
    orderNumber: "1521",
    date: "01/25/2023",
    total: "2125.50",
    time: "11:30 AM",
    mobile: "0772345678",
    items: [
      { id: 1, name: "Sri Lankan Coconut Oil 500ml", quantity: 1 },
      { id: 2, name: "Virgin Coconut Oil 250ml", quantity: 2 },
      { id: 3, name: "Coconut Milk Powder 200g", quantity: 1 },
      { id: 4, name: "Coconut Flour 500g", quantity: 3 },
    ],
  },
  // Add more items to other orders...
  {
    id: 3,
    name: "John Doe",
    address: "123, Main Street, New York.",
    orderNumber: "1522",
    date: "01/26/2023",
    total: "2150.00",
    time: "2:00 PM",
    mobile: "1234567890",
    items: [
      { id: 1, name: "Product 1", quantity: 1 },
      { id: 2, name: "Product 2", quantity: 2 },
      { id: 3, name: "Product 3", quantity: 3 },
      { id: 4, name: "Product 4", quantity: 4 },
    ],
  },
  // Add more items to other orders...
];

function Orders() {
  const [items, setItems] = useState(orderData);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  },[]);

  function fetchOrders() {
    axios.get('http://localhost:5000/api/owner/ECOM_services/getOrders')
    .then(response => {
      setOrders(response.data.data);
      setSelectedOrder(response.data.data[0]);
      console.log("RES--------------",response.data.data[0]);
    }).catch(error => {
        toast.error("Error fetching orders");

      console.log(error);
    });
  }

  useEffect(() => {
    setListHeight(listRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedOrder(items[0]);
    }
  }, [items]);

  const handleProceed = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const cancelTransaction = () => {
    setItems([]);
  };

  const handleItemClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            marginLeft: "7%",
            width: "50%",
            marginTop: "1rem",
            flex: "1",
          }}
        >
          <h1>Orders</h1>
          
          <ListGroup as="ol" style={{ overflow: "hidden" }}>
            <ListGroup.Item
              as="li"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <b>Order Number</b>
              </div>
              <div style={{ textAlign: "center" }}>
                <b>Date</b>
              </div>
              <div>
                <b>Amount</b>
              </div>
            </ListGroup.Item>
          </ListGroup>
          <div style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
            <ListGroup as="ol" ref={listRef}>
              {orders.map((order) => (
                <ListGroup.Item
                  as="li"
                  key={order.cartID}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => handleItemClick(order)}
                >
                  <div>{order.cartID}</div>
                  <div style={{ textAlign: "center" }}>{order.dateTime}</div>
                  <div>{order.total}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>

      <SideNavbar />

      <div style={{ position: "relative", height: "100vh" }}>
        <Card className="mt-6 w-96" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'snow', maxWidth: '32%', marginLeft: 'auto', overflowY: 'auto' }}>
          <Card.Body>
            <h3>Order number: {selectedOrder?.cartID}</h3><br />
            <p><b>Customer name:</b> {selectedOrder?.receiverName}</p>
            <p><b>Address:</b> {selectedOrder?.deliveryAddress}</p>
            <p><b>Mobile:</b> {selectedOrder?.receiverTelephone}</p>
            <p><b>Total: Rs.</b> {selectedOrder?.total}</p>
            <p><b>Date:</b> {selectedOrder?.dateTime}</p>
            <p><b>Items:</b></p>
            <ul>
              {selectedOrder && selectedOrder.items.map((item) => (
                <li key={item.cart_itemID}>
                  <span>{item.quantity} x </span>
                  <span>{item.productName}</span>
                </li>
              ))}
            </ul>
            <Button variant="dark" style={{ width: '50%', marginLeft: 'auto' }} onClick={handleProceed}>Delivered</Button>
          </Card.Body>
        </Card>
        {/* <Card>
          <Card.Header><h3>Order number: {selectedOrder?.orderNumber}</h3></Card.Header>
          <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card> */}
      </div>

      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this transaction?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button variant="primary" onClick={cancelTransaction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Orders;
