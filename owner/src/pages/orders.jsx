import React, { useState, useRef, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import SideNavbar from "../Components/SideNavbar";
import { Modal, Button } from "react-bootstrap";
import { FaRegTrashAlt, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

import Card from "react-bootstrap/Card";

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
  {
    id: 4,
    name: "Jane Smith",
    address: "456, Elm Street, Los Angeles.",
    orderNumber: "1523",
    date: "01/27/2023",
    total: "275.99",
    time: "4:30 PM",
    mobile: "9876543210",
    items: [
      { id: 1, name: "Product 5", quantity: 1 },
      { id: 2, name: "Product 6", quantity: 2 },
      { id: 3, name: "Product 7", quantity: 3 },
      { id: 4, name: "Product 8", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 5,
    name: "David Johnson",
    address: "789, Oak Street, Chicago.",
    orderNumber: "1524",
    date: "01/28/2023",
    total: "2200.50",
    time: "9:00 AM",
    mobile: "5555555555",
    items: [
      { id: 1, name: "Product 9", quantity: 1 },
      { id: 2, name: "Product 10", quantity: 2 },
      { id: 3, name: "Product 11", quantity: 3 },
      { id: 4, name: "Product 12", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 6,
    name: "Emily Davis",
    address: "987, Pine Street, San Francisco.",
    orderNumber: "1525",
    date: "01/29/2023",
    total: "2100.00",
    time: "1:30 PM",
    mobile: "9999999999",
    items: [
      { id: 1, name: "Product 13", quantity: 1 },
      { id: 2, name: "Product 14", quantity: 2 },
      { id: 3, name: "Product 15", quantity: 3 },
      { id: 4, name: "Product 16", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 7,
    name: "Michael Brown",
    address: "654, Maple Street, Houston.",
    orderNumber: "1526",
    date: "01/30/2023",
    total: "250.00",
    time: "3:00 PM",
    mobile: "1111111111",
    items: [
      { id: 1, name: "Product 17", quantity: 1 },
      { id: 2, name: "Product 18", quantity: 2 },
      { id: 3, name: "Product 19", quantity: 3 },
      { id: 4, name: "Product 20", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 8,
    name: "Olivia Wilson",
    address: "321, Cedar Street, Seattle.",
    orderNumber: "1527",
    date: "01/31/2023",
    total: "280.00",
    time: "5:30 PM",
    mobile: "2222222222",
    items: [
      { id: 1, name: "Product 21", quantity: 1 },
      { id: 2, name: "Product 22", quantity: 2 },
      { id: 3, name: "Product 23", quantity: 3 },
      { id: 4, name: "Product 24", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 9,
    name: "Sophia Taylor",
    address: "159, Birch Street, Boston.",
    orderNumber: "1528",
    date: "02/01/2023",
    total: "2120.00",
    time: "8:00 AM",
    mobile: "3333333333",
    items: [
      { id: 1, name: "Product 25", quantity: 1 },
      { id: 2, name: "Product 26", quantity: 2 },
      { id: 3, name: "Product 27", quantity: 3 },
      { id: 4, name: "Product 28", quantity: 4 },
    ],
  },
  // Add more items to other orders...
  {
    id: 10,
    name: "Liam Anderson",
    address: "753, Willow Street, Miami.",
    orderNumber: "1529",
    date: "02/02/2023",
    total: "2150.00",
    time: "10:30 AM",
    mobile: "4444444444",
    items: [
      { id: 1, name: "Product 29", quantity: 1 },
      { id: 2, name: "Product 30", quantity: 2 },
      { id: 3, name: "Product 31", quantity: 3 },
      { id: 4, name: "Product 32", quantity: 4 },
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

  useEffect(() => {
    setListHeight(listRef.current.offsetHeight);
  }, [items]);

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
                <b>Time</b>
              </div>
            </ListGroup.Item>
          </ListGroup>
          <div style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
            <ListGroup as="ol" ref={listRef}>
              {items.map((order) => (
                <ListGroup.Item
                  as="li"
                  key={order.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => handleItemClick(order)}
                >
                  <div>{order.orderNumber}</div>
                  <div style={{ textAlign: "center" }}>{order.date}</div>
                  <div>{order.time}</div>
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
            <h3>Order number: {selectedOrder?.orderNumber}</h3><br />
            <p><b>Customer name:</b> {selectedOrder?.name}</p>
            <p><b>Address:</b> {selectedOrder?.address}</p>
            <p><b>Mobile:</b> {selectedOrder?.mobile}</p>
            <p><b>Total: Rs.</b> {selectedOrder?.total}</p>
            <p><b>Date:</b> {selectedOrder?.date}</p>
            <p><b>Time:</b> {selectedOrder?.time}</p>
            <p><b>Items:</b></p>
            <ul>
              {selectedOrder && selectedOrder.items.map((item) => (
                <li key={item.id}>
                  <span>{item.quantity} x </span>
                  <span>{item.name}</span>
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
