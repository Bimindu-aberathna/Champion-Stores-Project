import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState, useContext } from "react";
import { CiTrash } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "./PaymentModal";
import TextField from "@mui/material/TextField";
import CartContext from "../Services/CartContext";
import Swal from "sweetalert2";
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
} from "../Validation";
import {
  getCart,
  changeDeliveryInfo,
  changeCartItemQuantity,
  removeCartItem,
  getReceiverDetails,
} from "../Services/cartServices";
import "./Cart.css";

function Cart() {
  const [loggedIn, setLoggedIn] = useState(// To be used for conditional rendering
    localStorage.getItem("logged") || false
  );
  const [editable, setEditable] = useState(false);// To be used for conditional rendering of edit button
  const [cartID, setCartID] = useState("");// To be used for updating cart items
  const [receiverName, setReceiverName] = useState("");// To be used for updating receiver details
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [cart_Items, setCart_Items] = useState([]);// To store cart items
  const [subTotal, setSubTotal] = useState(0);// To store subtotal of cart items
  const [deliveryCharge, setDeliveryCharge] = useState(0);// To store delivery charge
  const { updateCartSize } = useContext(CartContext);// To update cart size
  const [changeBtnDisabled, setChangeBtnDisabled] = useState(false);


  useEffect(() => {// To fetch cart items
    getCartDetails();
  }, []);

  function getCartDetails() {// To fetch cart items
    if (loggedIn) {
      getCart()
        .then((data) => {
          setCart_Items(data);
          setCartID(data[0].cartID);
        })
        .catch((err) => {
          console.error("Error fetching cart details:", err);
        });
    } else {
      toast.error("Please login to view cart items");
    }
  }

  useEffect(() => {// To fetch receiver details
    if (loggedIn) {
      getReceiverDetails()
        .then((data) => {
          setReceiverName(data.receiverName);
          setMobile(data.receiverTelephone);
          setAddress(data.deliveryAddress);
        })
        .catch((err) => {
          console.error("Error fetching receiver details:", err);
        });
    }
  }, []);

  
  const changeQuantityInDb = async (id, quantity) => {// To update quantity of cart items
    try {
      const response = await changeCartItemQuantity(id, quantity);//Call to changeCartItemQuantity function
      if (response && response.status === 200) {// If response is successful
        getCartDetails();
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating quantity", {
        position: "top-right",
        autoClose: 3500,
      });
    }
  };

  const handleQuantityChange = (id, change) => {// To handle quantity change of cart items
    setCart_Items((prevItems) => {
      if(change ===1 && prevItems.find((item) => item.cart_itemID === id).quantity >= 5){
        return prevItems;
      }
      return prevItems.map((item) => {
        if (item.cart_itemID === id) {
          if (item.quantity <= 1 && change === -1) {
            return item;
          } else {
            item.quantity += change;
            changeQuantityInDb(id, change);
          }
        }
        return item;
      });
    });
  };

  const handleRemove = (id) => {// To handle removal of cart items
    removeCartItem(id)
      .then((response) => {
        if (response.status === 200) {
          setCart_Items((prevItems) => {
            console.log("Item removed from cart");
            updateCartSize();
            return prevItems.filter((item) => item.cart_itemID !== id);

          });
        } else {
          alert("Error removing item");
          toast.error(response.message, {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        alert("Error removing item from cart");
        console.error("Error removing item from cart:", error);
        toast.error("Error removing item from cart", {
          position: "top-right",
          autoClose: 3500,
        });
      });
    getCartDetails();
  };

  const handleDeliveryDataChange = async () => {// To handle delivery data change
    setChangeBtnDisabled(true);
    setTimeout(() => {
      setChangeBtnDisabled(false);
    }, 2000);
    if (!validateName(receiverName).isValid) {// If receiver name is invalid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: validateName(receiverName).errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }
    if (!validatePhoneNumber(mobile).isValid) {// If mobile number is invalid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: validatePhoneNumber(mobile).errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }
    if (!validateAddress(address).isValid) {// If address is invalid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: validateAddress(address).errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }


    try {
      setEditable(false);
      const response = await changeDeliveryInfo(receiverName, mobile, address);// Call to changeDeliveryInfo function
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Delivery information updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating delivery information:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
        confirmButtonColor: "#000",
      });
    }
  };
  useEffect(() => {// To calculate subtotal when cart items change
    let subTotal = 0;
    cart_Items.forEach((item) => {
      subTotal += item.unitPrice * item.quantity;
    });
    setSubTotal(subTotal);
  }, [cart_Items]);

  useEffect(() => {// To calculate delivery charge when cart items change
    setDeliveryCharge(calculateDeliveryCharge());
  }, [cart_Items]);

  function calculateDeliveryCharge() {// To calculate delivery charge
    let weight = 0;
    cart_Items.forEach((item) => {
      weight += item.unitWeight * item.quantity;
    });
    if (weight <= 1050) {
      return 500;
    } else {
      let roundedExtraWeight = Math.ceil((weight - 1050) / 1000);
      return 500 + roundedExtraWeight * 220;
    }
  }

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="row">
        <div col="10" className="itemsColumn">
          <h1>Cart</h1>
          <div className="cartItems">
            {/* Display cart items */}
            {cart_Items.map((item) => (
              <MDBCard className="itemCard" key={item.cart_itemID}>
                <MDBCardBody className="cardBody">
                  <div className="itemName">{item.productName}</div>
                  <div className="itemDataNControls">
                    <div className="itemPrice">{item.unitPrice} p.p</div>
                    <div className="itemQuantity">
                      <MDBBtn
                        className="qtyChangeBtn"
                        color="dark"
                        onClick={() =>
                          handleQuantityChange(item.cart_itemID, -1)
                        }
                      >
                        -
                      </MDBBtn>

                      {item.quantity}
                      <MDBBtn
                        className="qtyChangeBtn"
                        color="dark"
                        onClick={() =>
                          handleQuantityChange(item.cart_itemID, 1)
                        }
                      >
                        +
                      </MDBBtn>
                    </div>
                    <MDBBtn
                      color="dark"
                      id="removeTextButton"
                      onClick={() => handleRemove(item.cart_itemID)}
                    >
                      Remove
                    </MDBBtn>
                    <MDBBtn
                      color="dark"
                      id="removeIconButton"
                      onClick={() => handleRemove(item.cart_itemID)}
                    >
                      <CiTrash />
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
                    <MDBBtn disabled={changeBtnDisabled} onClick={handleDeliveryDataChange}>Change</MDBBtn>
                  )}
                </div>
                <div className="detailItem">
                  {/* Get receiver name */}
                  <TextField
                    label="Receiver Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={receiverName}
                    focused
                    disabled={!editable}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div className="detailItem">
                  {/* Get mobile number */}
                  <TextField
                    label="Mobile"
                    variant="standard"
                    color="success"
                    value={mobile}
                    focused
                    className="detailField"
                    disabled={!editable}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="detailItem">
                  {/* Get address */}
                  <TextField
                    label="Receiver Address"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={address}
                    focused
                    disabled={!editable}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div>
            <MDBCard className="detailCard">
              {/* Display order details */}
              {cart_Items.length !== 0 ? (
                <MDBCardBody className="detailCardBody">
                  <h5>Order Details</h5>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h5>Subtotal:</h5>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4>Rs. {subTotal}</h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h5>Delivery charge:</h5>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4>Rs. {deliveryCharge}</h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h3>Net total:</h3>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4 style={{ display: "flex" }}>
                          Rs.{" "}
                          <h1 style={{ fontWeight: "bold" }}>
                            {subTotal + deliveryCharge}
                          </h1>
                          .00
                        </h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol className="text-end">
                        <div id="proceedBTNdiv">
                          <PaymentModal
                            cartID={cartID}
                            subtotal={subTotal}
                            deliveryCharge={deliveryCharge}
                            getCartDetails={getCartDetails}
                            updateCartSize={updateCartSize}
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCardBody>
              ) : (
                <MDBCardBody className="detailCardBody">
                  <h5>Order Details</h5>
                  <h4>No items in cart</h4>
                </MDBCardBody>
              )}
            </MDBCard>
          </div>
        </div>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Cart;
