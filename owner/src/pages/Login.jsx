import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import "./Login.css";

function Login({setIsAuthenticated}) {// Login page for the owner
  const emailInputRef = useRef();// Reference to the email input field
  const passwordInputRef = useRef();// Reference to the password input field
  const location = useLocation();// Location object to get the current location
  const navigate = useNavigate();// Navigation hook for redirecting to another page
  const [showPassword, setShowPassword] = useState(false);// State variable to toggle password visibility

  useEffect(() => {// Prevent the user from going back to the previous page
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  useEffect(() => {// Set the isAuthenticated state to false when the component mounts
    setIsAuthenticated(false);
  }, []); 

  function handleLoginForm(event) {// Function to handle the login form submission
    event.preventDefault(); // Prevent the default form submission behavior

    const email = emailInputRef.current.value;// Get the email value from the email input field
    const password = passwordInputRef.current.value;// Get the password value from the password input field

    //call the login api to authenticate the user
    axios
      .post("http://localhost:5000/api/owner/accountServices/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        console.log("Login Successful!");
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);// Store the access token in the local storage
          setIsAuthenticated(true);// Set the isAuthenticated state to true
          let { from } = location.state || { from: { pathname: "/transaction" } };
          navigate(from);// Redirect the user to the transaction page
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3500,
        });
      });
  }

  return (
    <div // Login page layout
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
        <Form style={{ width: "50%" }} onSubmit={handleLoginForm}>
          <h1>
            Business
            <br />
            Account
          </h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* Email input field */}
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailInputRef}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formBasicPassword"
            style={{ position: "relative" }}
          >
            {/* Password input field */}
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              ref={passwordInputRef}
            />
            <VisibilityOffIcon
              className="eye-styles"
              style={{
                display: showPassword ? "none" : "block",
                marginTop: "-3px",
                transform: "scale(0.9)"
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
            <VisibilityIcon
              className="eye-styles"
              style={{
                display: showPassword ? "block" : "none",
                marginTop: "-3px",
                transform: "scale(0.9)"
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="fogotPasswordLink">
            <a href="/forgotpassword">Fogot password</a>
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* Login button */}
            <Button variant="dark" type="submit" style={{ width: "100%" }}>
              Login
            </Button>
          </div>
        </Form>
      </div>
      <div
        className="col-lg-6 d-none d-lg-block"
        style={{ position: "relative", width: "50%", height: "100%" }}
      >
        <img
          src={require("../assets/store.png")}
          alt="owner"
          style={{ width: "100%", height: "100%"}}
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

export default Login;
