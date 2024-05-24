import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import storeIMG from "../Assets/store.png";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import loginImage from "../Assets/loginImage.webp";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../Services/userServices";
import { Navigate } from "react-router-dom";
import "./Login.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    loginUser({ email, password })
      .then((status) => {
        if (status === 200) {
          console.log();
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3500,
          });
          setIsAuthenticated(true);
          navigate("/");
          //window.location.href = "/";
        } else {
          toast.error("Invalid credentials!", {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          toast.error("Invalid credentials!", {
            position: "top-right",
            autoClose: 3500,
          });
        }
        console.log(error);
      });
  };

  return (
    <MDBContainer fluid className="p-3 my-5" id="loginPage">
      <MDBRow className="loginRow">
        <MDBCol col="10" md="6">
        <img
            src={loginImage}
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="loginColumn">
          <div className="loginFormDiv">
            <div id="loginHeader">
              <h1>Log in</h1>
            </div>
            <form className="loginForm" onSubmit={handleLogin}>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div style={{ position: "relative", width: "100%" }}>
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  id="formControlLg"
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="loginShowPasswordIcon"
                  onClick={(e) => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </div>
              </div>

              <div className="d-flex justify-content-between mx-4 mb-4">
                <a href="!#">Forgot password?</a>
              </div>

              <MDBBtn
                type="submit"
                rounded
                className="mb-4 w-100"
                size="lg"
                id="signInBtn"
              >
                Sign in
              </MDBBtn>
              <div className="d-flex justify-content-between mx-4 mb-4">
                <div></div>
                <div>
                  Don't have an account?&nbsp;<Link to="/signup"> Sign up</Link>
                </div>
              </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Login;
