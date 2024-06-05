import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import SendOTP from "../Components/sendOTP";
import ChangePassword from "../Components/ChangePassword";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function FogotPassword() {
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        id="form-div"
        style={{
          display: "flex",
          width: window.innerWidth < 768 ? "100%" : "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%" }}>
          {OTP === "" ? (
            <SendOTP email={email} setEmail={setEmail} setOTP={setOTP} />
          ) : (
            <ChangePassword OTP={OTP} setOTP={setOTP} email={email} />
          )}
        </div>
      </div>
      <div
        className="col-lg-6 d-none d-lg-block"
        style={{ position: "relative", width: "50%", height: "100%" }}
      >
        <img
          src={require("../assets/store.png")}
          alt="owner"
          style={{ width: "100%", height: "100%" }}
        />
        <div
          className="image-overlay"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          WELCOME TO
          <h1>
            <b>CHAMPIONS</b>
          </h1>
          <h2>STORES</h2>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FogotPassword;
