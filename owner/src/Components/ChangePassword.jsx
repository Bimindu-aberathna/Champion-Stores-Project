import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import { validatePassword } from "../functionality/validation";
import { resetPassword } from "../Services/AccountServices";
import "../pages/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ChangePassword({ OTP, setOTP, email }) {
  const [userOTP, setUserOTP] = useState("");
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  //10 minutes timer
  useEffect(() => {
    const timer = setTimeout(() => {
      alert("OTP expired, please try again");
      setOTP("");
      window.location.href = "/forgotPassword";
    }, 300000);
    return () => clearTimeout(timer);
  }, []);

  function compareOTP() {
    if (userOTP === "") {
      toast.error("Please enter your OTP", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (String(OTP).trim() === String(userOTP).trim()) {
      setShow(true);
    } else {
      toast.error("OTP does not match", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
  }
  const handleClose = () => {
    setShow(false);
    window.location.href = "/forgotPassword";
  };
  const handleShow = () => setShow(true);
  function handlePassswordReset() {
    if (newPassword === "" || confirmPassword === "") {
      toast.error("Please enter your new password", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!validatePassword(newPassword)) {
      toast.error(
        "Password must contain at least one number, one special character and one alphabet. Minimum length is 7",
        {
          position: "top-right",
          autoClose: 2500,
        }
      );
      return;
    }
    resetPassword(email, newPassword, userOTP)
      .then((res) => {
        Swal.fire({
          title: "Good job!",
          text: "You resetted your password successfully!",
          icon: "success",
          confirmButtonColor: "#000000",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
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
        <br />
        <h2>Check your email for OTP</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>One Time Password</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your OTP..."
            value={userOTP}
            onChange={(e) => setUserOTP(e.target.value)}
          />

          <a href="/">Back to login</a>
        </Form.Group>
        <Button
          variant="dark"
          type="button"
          onClick={compareOTP}
          style={{ width: "100%" }}
        >
          Verify
        </Button>
      </Form>
      <ToastContainer />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Reset your password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePassswordReset}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
