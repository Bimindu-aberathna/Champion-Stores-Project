import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "../pages/Login.css";
import { checkEmail,sendUserOTP } from "../Services/AccountServices";

function SendOTP({ email, setEmail, setOTP }) {
  const [btnDisabled, setBtnDisabled] = useState(false);

  function handlesendOTP() {
    if (email === "") {
      toast.error("Please enter your email", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    setBtnDisabled(true);
    checkEmail(email)
      .then((res) => {
        const generateRandomNumber = Math.floor(1000 + Math.random() * 9000);
        sendUserOTP(email, generateRandomNumber)
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
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
      <a href="/">Back to login</a>
        </Form.Group>
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
