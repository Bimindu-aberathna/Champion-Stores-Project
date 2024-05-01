import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextField from "@mui/material/TextField";
import { validateName, validatePhoneNumber } from "../Validation";
import "./Cart.css";
function Cart() {
  const [loggedIn, setLoggedIn] = useState(false);
  const customerID = localStorage.getItem("customerID");
  const total = 1564;
  const deliveryCharge = 250;
  const [editable, setEditable] = useState(false);
  const [receiverName, setReceiverName] = useState("Bimindu Aberathna");
  const [mobile, setMobile] = useState("0778910378");
  const [address, setAddress] = useState(
    "217/4, 1st Lane, Polonnaruwa, Kandana"
  );

  /////add to cart handle krpn

  const cartItems = [
    {
      id: 1,
      name: "Lakme Absolute Matte Lipstick",
      price: 100,
      quantity: 2,
    },
    {
      id: 2,
      name: "Maybelline Fit Me Foundation",
      price: 200,
      quantity: 1,
    },
    {
      id: 3,
      name: "L'Oreal Paris Mascara",
      price: 150,
      quantity: 3,
    },
    {
      id: 4,
      name: "Revlon ColorStay Eyeliner",
      price: 50,
      quantity: 5,
    },
    {
      id: 5,
      name: "MAC Studio Fix Powder Plus Foundation",
      price: 300,
      quantity: 2,
    },
    {
      id: 6,
      name: "NYX Professional Makeup Highlight & Contour Palette. 10 colors with 2 brushes. Delivery charges applied. Good qulity. Made in India",
      price: 120,
      quantity: 1,
    },
    {
      id: 7,
      name: "The Body Shop Tea Tree Oil",
      price: 250,
      quantity: 4,
    },
    {
      id: 8,
      name: "Clinique Moisture Surge 72-Hour Auto-Replenishing Hydrator shala lala lala lala laaaaaaaa",
      price: 80,
      quantity: 3,
    },
    {
      id: 9,
      name: "Estee Lauder Double Wear Stay-in-Place Foundation",
      price: 180,
      quantity: 2,
    },
    {
      id: 10,
      name: "NARS Radiant Creamy Concealer",
      price: 90,
      quantity: 1,
    },
  ];
  const handleQuantityChange = (id, value) => {};
  const handleRemove = (id) => {};

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="row">
        <div col="10" className="itemsColumn">
          <h1>Cart</h1>
          <div className="cartItems">
            {cartItems.map((item) => (
              <MDBCard className="itemCard" key={item.id}>
                <MDBCardBody className="cardBody">
                  <div className="itemName">{item.name}</div>
                  <div className="itemDataNControls">
                    <div className="itemPrice">{item.price} p.p</div>
                    <div className="itemQuantity">
                      <IoIosRemoveCircleOutline
                        className="qtyChangeBtn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      />
                      {item.quantity}
                      <IoIosAddCircleOutline
                        className="qtyChangeBtn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      />
                    </div>
                    <MDBBtn
                      color="dark"
                      className="removeButton"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            ))}
          </div>
        </div>

        <div col="10" className="detailsColumn">
          <h2>Order details</h2>

          <div>
            <MDBCard className="detailCard">
              <MDBCardBody className="detailCardBody">
                <div className="receiverDatailNBtn">
                  <h5>Receiver Details</h5>
                  {!editable ? (
                    <MDBBtn onClick={(e) => setEditable(true)}>Edit</MDBBtn>
                  ) : (
                    <MDBBtn onClick={(e) => setEditable(false)}>Change</MDBBtn>
                  )}
                </div>
                <div className="detailItem">
                  <TextField
                    label="Receiver Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={receiverName}
                    focused
                    disabled={!editable}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Mobile"
                    variant="standard"
                    color="success"
                    value={mobile}
                    focused
                    className="detailField"
                    disabled={!editable}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Receiver Address"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={address}
                    focused
                    disabled={!editable}
                  />
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div>
            <MDBCard className="detailCard">
              <MDBCardBody className="detailCardBody">
                <h5>Order Details</h5>
                <MDBContainer>
                  <MDBRow>
                    <MDBCol md="8" className="text-end"><h5>Subtotal:</h5></MDBCol>
                    <MDBCol md="4" className="text-end"><h4>Rs. {total}</h4></MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="8" className="text-end"><h5>Delivery charge:</h5></MDBCol>
                    <MDBCol md="4" className="text-end"><h4>Rs. {deliveryCharge}</h4></MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="8" className="text-end"><h3>Net total:</h3></MDBCol>
                    <MDBCol md="4" className="text-end"><h4 style={{display:'flex'}}>Rs. <h1 style={{fontWeight:'bold'}}>{total}</h1>.00</h4></MDBCol>
                  </MDBRow>
                </MDBContainer>

                {/* <div className="orderSubTitle">
                  <h5>Subtotal</h5>
                </div>
                <div className="orderSubTitle">
                  <h5>Delivery charge</h5>
                </div>
                <div className="orderSubTitle">
                  <h3>Total:</h3><h3><p style={{width:'10rem',backgroundColor:'gray',padding:'1rem',borderRadius:'10px'}}>{total}.00</p></h3>
                </div> */}
              </MDBCardBody>
            </MDBCard>
          </div>
        </div>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Cart;
