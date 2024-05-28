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
import EYEicon from "../Assets/eye.png";
import loginImage from "../Assets/loginImage.webp";
import { signUpUser } from "../Services/userServices";
import Swal from 'sweetalert2';
import Confetti from "react-confetti";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
  validateAddress,
  validatePassword,
} from "../Validation";
import { Link } from "react-router-dom";
import "./Login.css";


function SignUp() {
  const [firstName, setFirstName] = useState(""); // State variable for first name
  const [firstNameError, setFirstNameError] = useState(false); // State variable for first name error
  const [lastName, setLastName] = useState(""); // State variable for last name
  const [lastNameError, setLastNameError] = useState(false); // State variable for last name error
  const [PhoneNumber, setPhoneNumber] = useState(""); // State variable for phone number
  const [phoneNumberError, setPhoneNumberError] = useState(false); // State variable for phone number error
  const [address, setAddress] = useState(""); // State variable for address
  const [addressError, setAddressError] = useState(false); // State variable for address error
  const [email, setEmail] = useState(""); // State variable for email
  const [emailError, setEmailError] = useState(false); // State variable for email error
  const [password, setPassword] = useState(""); // State variable for password
  const [passwordError, setPasswordError] = useState(false);  // State variable for password error
  const [confirmPassword, setConfirmPassword] = useState(""); // State variable for confirm password
  const [confirmPasswordError, setConfirmPasswordError] = useState(false); // State variable for confirm password error
  const [showPassword, setShowPassword] = useState(false); // State variable to show password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State variable to show confirm password
  const [showConfetti, setShowConfetti] = useState(false); // State variable to show confetti
  
  const handleSignUp = async (event) => { // Function to handle sign up
    event.preventDefault();
    const firstNameValidation = validateName(firstName); // Validate first name
    const lastNameValidation = validateName(lastName); // Validate last name
    const phoneNumberValidation = validatePhoneNumber(PhoneNumber); // Validate phone number
    const addressValidation = validateAddress(address); // Validate address
    const emailValidation = validateEmail(email); // Validate email 
    const passwordValidation = validatePassword(password);  // Validate password
  
    if (!firstNameValidation.isValid) { // Check if first name is valid
      setFirstNameError(true);
      toast.error(firstNameValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!lastNameValidation.isValid) { // Check if last name is valid
      setLastNameError(true);
      toast.error(lastNameValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!phoneNumberValidation.isValid) { // Check if phone number is valid
      setPhoneNumberError(true);
      toast.error(phoneNumberValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!addressValidation.isValid) { // Check if address is valid
      setAddressError(true);
      toast.error(addressValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!emailValidation.isValid) { // Check if email is valid
      setEmailError(true);
      toast.error(emailValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (!passwordValidation.isValid) { // Check if password is valid
      setPasswordError(true); 
      toast.error(passwordValidation.errorMessage, {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    if (password !== confirmPassword) { // Check if password and confirm password match
      setConfirmPasswordError(true);
      setPasswordError(true);
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 2500,
      });
      return;
    }
    // Create user data object
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      phoneNumber: PhoneNumber,
      password: password,
    };
  
    try {// Call sign up user service
      const response = await signUpUser(userData);
      // Handle success response
      if(response === 200){
        setShowConfetti(true);
        Swal.fire({
          title: 'Success!',
          text: 'You have registered successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }
    } catch (error) {
      // Handle error response
      console.error('Error during signup:', error.message);
      if(error.message === "Request failed with status code 409"){
        toast.error("User already exists!", {
          position: "top-left",
          autoClose: 5000,
        });
    }
  };
  
  }
 

  return (
    <MDBContainer fluid className="p-3 my-5" id="signupPage">
      <MDBRow className="signUpRow">
        <MDBCol col="10" md="6" className="imageCol">
          <img
            src={loginImage}
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="signupColumn">
          <div className="signupFormDiv">
            <div id="signupHeader">
              <h1>Sign Up</h1>
            </div>
            {/* user sign up form */}
            <form className="signupForm" onSubmit={handleSignUp}>
              <div className="userNameDiv">
                <MDBInput // First name input field
                  wrapperClass="mb-4"
                  className="firstNameInput"
                  label="First name"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    backgroundColor: firstNameError
                      ? "rgb(255,0,0,.15)"
                      : "none",
                  }}
                />

                <MDBInput // Last name input field
                  wrapperClass="mb-4"
                  label="Last name"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    backgroundColor: lastNameError
                      ? "rgb(255,0,0,.15)"
                      : "none",
                  }}
                />
              </div>
              <MDBInput // Email input field
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: emailError ? "rgb(255,0,0,.15)" : "none",
                }}
              />
              <MDBInput  // Address input field
                wrapperClass="mb-4"
                label="Home address"
                id="formControlLg"
                type="text"
                size="lg"
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  backgroundColor: addressError ? "rgb(255,0,0,.15)" : "none",
                }}
              />
              <MDBInput // Phone number input field
                wrapperClass="mb-4"
                label="Phone number"
                id="formControlLg"
                type="text"
                size="lg"
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  backgroundColor: phoneNumberError
                    ? "rgb(255,0,0,.15)"
                    : "none",
                }}
              />
              <div className="userPasswordDiv">
                <div style={{ position: "relative", width: "100%" }}>
                  <MDBInput // Password input field
                    wrapperClass="mb-4"
                    label="Password"
                    id="formControlLg"
                    type={showPassword ? "text" : "password"}
                    size="lg"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      backgroundColor: passwordError
                        ? "rgb(255,0,0,.15)"
                        : "none",
                    }}
                  />
                  <div
                    className="showPasswordIcon"
                    onClick={(e) => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </div>
                </div>

                <div style={{ position: "relative", width: "100%" }}>
                  <MDBInput // Confirm password input field
                    wrapperClass="mb-4"
                    label="Confirm password"
                    id="formControlLg"
                    type={showConfirmPassword ? "text" : "password"}
                    size="lg"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div
                    className="showPasswordIcon"
                    onClick={(e) =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </div>
                </div>
              </div>

              <MDBBtn
                type="submit"
                rounded
                className="mb-4 w-100"
                size="lg"
                id="signupBtn"
              >
                Create account
              </MDBBtn>
              <div className="d-flex justify-content-between mx-4 mb-4">
                <div></div>
                <div>
                  Already have an account?&nbsp;<Link to="/login"> Log in</Link>
                </div>
              </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      {showConfetti && <Confetti/>}
      <ToastContainer />
    </MDBContainer>
  );
}

export default SignUp;
