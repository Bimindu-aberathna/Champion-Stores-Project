import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBCard,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PiContactlessPayment } from "react-icons/pi";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentModal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompletePayment } from "../Services/cartServices";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Swal from 'sweetalert2'

const stripePromise = loadStripe(
  "pk_test_51PGG6EP2zpaVFzfp9y3yd5MNQ5BPFe7b5E2SuV2juQpqGb7YwwZS6sAESe3lTi9BgiQi9eZMdas8arBpeE4UNxjz00FmLqJEUu"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ setCardType, toggleOpen,total,getCartDetails,deliveryCharge,updateCartSize }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
      setError(error);
      setProcessing(false);
      toast.error("Error in payment", {
        position: "top-right",
        autoClose: 2500,
        closeOnClick: true
      }
      );
    } else {
      const response = await fetch(
        "http://localhost:5000/api/cartServices/charge",
        {
          method: "POST",
          headers: { "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken")
           },
          body: JSON.stringify({ paymentMethodId: paymentMethod.id,amount: total}),
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        toast.error("Error in payment", {
          position: "top-right",
          autoClose: 2500,
          closeOnClick: true
        }
        );

      } else {
        toast.success("Payment Successful", {
          position: "top-right",
          autoClose: 1500,
          closeOnClick: true
        });
        const response = await CompletePayment(deliveryCharge);
        if (response.status === 200) {
          Swal.fire({
            title: "Good job!",
            text: "Your order has been placed Successfully! It will arive in 3-4 days",
            icon: "success"
          }).then(() => {
          getCartDetails();
          updateCartSize();
          toggleOpen();
          });
        } else {
          toast.error("Error in payment", {
            position: "top-right",
            autoClose: 2500,
            closeOnClick: true
          });
          toggleOpen();
        }
      }

      setProcessing(false);
    }
  };

  const handleCardNumberChange = (event) => {
    if (event.brand === "visa") {
      setCardType("visa");
    } else if (event.brand === "mastercard") {
      setCardType("mastercard");
    } else {
      setCardType("");
    }
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="cardNumber" className="form-control-label">
          Card Number
        </label>
        <CardNumberElement
          id="cardNumber"
          options={CARD_ELEMENT_OPTIONS}
          className="form-control"
          onChange={handleCardNumberChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cardExpiry" className="form-control-label">
          Expiry Date
        </label>
        <CardExpiryElement
          id="cardExpiry"
          options={CARD_ELEMENT_OPTIONS}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="cardCvc" className="form-control-label">
          CVC
        </label>
        <CardCvcElement
          id="cardCvc"
          options={CARD_ELEMENT_OPTIONS}
          className="form-control"
        />
      </div>
      {/* <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className="btn btn-primary"
      >
        Pay
      </button> */}
      <div className="btn-grp">
      <MDBBtn color="secondary" type="button" onClick={toggleOpen}>
        Close
      </MDBBtn>
      <Button
        style={{ backgroundColor: "green" }}
        type="button"
        onClick={handleSubmit}
        variant="contained"
        endIcon={<PiContactlessPayment />}
        disabled={!stripe || processing}
        className="payButton"
      >
        Pay
      </Button>
      </div>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
};

export default function PaymentModal({
  cartID,
  subtotal = 0,
  deliveryCharge = 0,
  getCartDetails,
  updateCartSize,
}) {
  const [centredModal, setCentredModal] = useState(false); // state for modal of payment
  //const [imgSrc, setImgSrc] = useState("https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/images%2Ffile.png?alt=media&token=82798e75-5590-4fdf-81f3-aca09df5d5fa"); // state for image of card
  const [cardType, setCardType] = useState("");
  const toggleOpen = () => {
    // function to open and close the modal
    setCentredModal(!centredModal);
  };
  const total = subtotal + deliveryCharge;

  return (
    <>
      <Stack direction="row" spacing={2}>
        {/* button to open the modal */}
        <Button
          style={{ backgroundColor: "green" }}
          variant="contained"
          endIcon={<PiContactlessPayment />}
          onClick={toggleOpen}
        >
          Proceed To Checkout
        </Button>
      </Stack>
      {/* Modal for payment */}
      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <form onSubmit={{}}>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Pay Via Stripe</MDBModalTitle>
                
              </MDBModalHeader>
              <MDBCard className="priceCard">
                <MDBRow className="priceCardheading">
                  <MDBCol>
                    <p>Subtotal</p>
                  </MDBCol>
                  <MDBCol>
                    <>+</>
                  </MDBCol>
                  <MDBCol>
                    <>Delivery</>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3" style={{ marginTop: "-1rem" }}>
                  <MDBCol>
                    <h5>{subtotal}.00</h5>
                  </MDBCol>
                  <MDBCol>
                    <h5>+</h5>
                  </MDBCol>
                  <MDBCol>
                    <h5>{deliveryCharge}.00</h5>
                  </MDBCol>
                </MDBRow>
                <MDBCol>
                  <MDBRow>
                    <h4>
                      <b>Total : RS.{subtotal + deliveryCharge}.00</b>
                    </h4>
                  </MDBRow>
                </MDBCol>
              </MDBCard>
              <MDBModalBody>
                <MDBCard>
                  <MDBRow className="gridRow">
                    <MDBCol>
                      {cardType === "" ? (
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/images%2Ffile.png?alt=media&token=82798e75-5590-4fdf-81f3-aca09df5d5fa"
                          alt="card"
                          className="cardImage"
                        />
                      ) : null}
                      {cardType === "visa" ? (
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/images%2FvisaCard.png?alt=media&token=d9bb8800-33ff-43d5-a3f4-54cb7ae78be6"
                          alt="VISA card"
                          className="cardImage"
                        />
                      ) : null}
                      {cardType === "mastercard" ? (
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/images%2Fmastercard.png?alt=media&token=f7d3c692-b866-420a-980e-08446221096b"
                          alt="MASTER card"
                          className="cardImage"
                        />
                      ) : null}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="gridRow">
                    <MDBCol>
                      <Elements stripe={stripePromise}>
                        <CheckoutForm
                          setCardType={setCardType}
                          toggleOpen={toggleOpen}
                          total={total}
                          getCartDetails={getCartDetails}
                          deliveryCharge={deliveryCharge}
                          updateCartSize={updateCartSize}
                        />
                      </Elements>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBModalBody>
            </MDBModalContent>
          </form>
        </MDBModalDialog>
      </MDBModal>
      <ToastContainer />
    </>
  );
}
