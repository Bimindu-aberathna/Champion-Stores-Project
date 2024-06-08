import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "../pages/Login.css";
import { checkEmail,sendUserOTP } from "../Services/AccountServices";

function SendOTP({ email, setEmail, setOTP }) {
  const [btnDisabled, setBtnDisabled] = useState(false);//State for disabling the button

  function handlesendOTP() {//Function to handle the sending of OTP
    if (email === "") {//If the email is empty
      toast.error("Please enter your email", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    setBtnDisabled(true);
    checkEmail(email)//Check if the email exists
      .then((res) => {
        const generateRandomNumber = Math.floor(1000 + Math.random() * 9000);//Generate a random number for OTP
        sendUserOTP(email, generateRandomNumber)//Send the OTP to the user's email
          .then((res) => {
            console.log(res);
            setOTP(generateRandomNumber);
            setEmail(email);
            
          })
          .catch((err) => {
            setBtnDisabled(false);
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div>
      <Form style={{ width: "100%" }}>
        <h1>
          Reset
          <br />
          Password
        </h1>
        {/* Email input */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
       {/**Link to go back to login page */}   
      <a href="/">Back to login</a>
        </Form.Group>
        {/* Send OTP button */}
        <Button
          variant="dark"
          type="button"
          onClick={handlesendOTP}
          style={{ width: "100%" }}
          disabled={btnDisabled}
        >
          Send OTP
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default SendOTP;
