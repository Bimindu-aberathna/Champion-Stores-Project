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
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    alert(
      "Login Successful\nEmail: " +
        email +
        "\nPassword: " +
        password +
        "\nRedirecting to Home Page..."
    );
  };
  const notify = () => {
    toast.error("Success Notification !", {});
  };

  return (
    <MDBContainer fluid className="p-3 my-5" id="loginPage">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            class="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="loginColumn">
          <div className="loginFormDiv">
            <div id="loginHeader">
              <h1>Log in</h1>
            </div>
            <form className="loginForm" action="handleLogin">
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="d-flex justify-content-between mx-4 mb-4">
                <a href="!#">Forgot password?</a>
              </div>

              <MDBBtn
                type="button"
                onClick={notify}
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
