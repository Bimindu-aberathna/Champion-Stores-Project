// AccountSetings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Modal, Button, Toast } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import SideNavbar from "../Components/SideNavbar";
import { validateIntegers } from "../functionality/validation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getEmail,
  ChangeEmail,
  verifyPassword,
  changePassword,
} from "../Services/AccountServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateEmail, validatePassword } from "../functionality/validation";
import Swal from "sweetalert2";
import "./AccountSettings.css";

function AccountSetings() {
  const [showConfirmation, setShowConfirmation] = useState(false); //State for showing the confirmation modal
  const [showMailChange, setShowMailChange] = useState(false); //State for showing the email change form
  const [currentMail, setCurrentMail] = useState(""); //State for the current email
  const [newMail, setNewMail] = useState(""); //State for the new email
  const [verified, setVerified] = useState(false); //State for verifying the password
  const [currentPassword, setCurrentPassword] = useState(""); //State for the current password
  const [newPassword, setNewPassword] = useState(""); //State for the new password
  const [confirmPassword, setConfirmPassword] = useState(""); //State for the confirm password
  const [showPassword, setShowPassword] = useState(false); //State for showing the password

  useEffect(() => {
    //Use effect to fetch the email of the user when the component mounts
    const fetchEmail = async () => {
      //Function to fetch the email of the user
      try {
        const email = await getEmail(); //Get the email of the user
        if (email) {
          console.log(email);
          setCurrentMail(email); // Only setting the email string to the state
        } else {
          console.log("email is undefined");
        }
      } catch (err) {
        console.error("Failed to fetch email:", err);
      }
    };

    fetchEmail();
  }, []);

  const handleCloseConfirmation = () => {
    //Function to close the confirmation modal
    setShowConfirmation(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show); //Function to handle the visibility of the password

  const handleMouseDownPassword = (event) => {
    //Function to handle the mouse down event on the password
    event.preventDefault();
  };

  const handleEmailChange = () => {
    //Function to handle the email change
    if (newMail === "") {
      //If the new email is empty
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (!validateEmail(newMail)) {
      //If the email is not valid
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (newMail === currentMail) {
      //If the new email is the same as the current email
      toast.error("Please enter a different email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Your logging email will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#050505",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          ChangeEmail(newMail) //Change the email
            .then((res) => {
              if (res.status === 200) {
                //If the success status is 200
                toast.success("Email Updated", {
                  position: "top-right",
                  autoClose: 3500,
                });
                setCurrentMail(newMail); //Set the current email to the new email
                setNewMail("");
                setShowMailChange(false);
              } else {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 3500,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          setNewMail("");
          setShowMailChange(false);
        }
      });
    }
  };
  const verifyCurrentPassword = () => {
    //Function to verify the current password
    if (currentPassword === "") {
      //If the current password is empty
      toast.error("Please enter your password", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else {
      //Verify the password
      verifyPassword(currentPassword) //Verify the password
        .then((res) => {
          if (res.status === 200) {
            //If the status is 200
            toast.success("Password Verified", {
              position: "top-right",
              autoClose: 3500,
            });
            setVerified(true);
            setCurrentPassword("");
          } else {
            toast.error(res.message, {
              position: "top-right",
              autoClose: 3500,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const changeOwnerPassword = () => {
    //Function to change the password
    if (newPassword === "" || confirmPassword === "") {
      //If the new password or confirm password is empty
      toast.error("Please enter your new password", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (newPassword !== confirmPassword) {
      //If the new password and confirm password do not match
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (!validatePassword(newPassword)) {
      //If the new password does not meet the password requirements
      toast.error(
        "Password must contain at least 7 characters, including 1 letter, 1 number and 1 Symbol",
        {
          position: "top-right",
          autoClose: 3500,
        }
      );
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Your logging password will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#050505",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          //If the result is confirmed
          changePassword(newPassword) //Call the change password function
            .then((res) => {
              if (res.status === 200) {
                toast.success("Password Changed Successfully!", {
                  position: "top-right",
                  autoClose: 3500,
                });
                //set Default values
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setVerified(false);
              } else {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 3500,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  };

  return (
    <>
      <SideNavbar selected="AccountSettings" />
      <div
        style={{
          height: "100vh",
        }}
      >
        <div
          style={{
            marginLeft: "7%",
            width: "50%",
            marginTop: "1rem",
          }}
        >
          <h1>Account Settings</h1>
        </div>
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "55%",
              Index: "888",
              boxShadow: "0 0 15px 0 rgba(0,0,0,0.15)",
            }}
          >
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ width: "85%" }}>
                <Card.Title>
                  <h4>Change Credentials</h4>
                </Card.Title>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                ></div>
                {/* Login Form */}
                <Form>
                  <Form.Group className="mb-3">
                    {/* // Email Change */}
                    <div className="currentMail">
                      {" "}
                      Current E-mail : &nbsp;&nbsp;
                      <h5>{currentMail}</h5>&nbsp;
                      {!showMailChange ? (
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="outline-dark"
                          type="button"
                          onClick={() => setShowMailChange(true)}
                        >
                          Change
                        </Button>
                      ) : (
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="dark"
                          type="button"
                          onClick={() => setShowMailChange(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                    <div
                      className="ChageMail"
                      style={{ display: !showMailChange ? "none" : "" }}
                    >
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "100%" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        {/* Input for the new email */}
                        <TextField
                          id="filled-basic"
                          label="New E-mail"
                          variant="filled"
                          value={newMail}
                          onChange={(e) => setNewMail(e.target.value)}
                        />
                      </Box>
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="dark"
                          type="button"
                          onClick={handleEmailChange}
                        >
                          Set
                        </Button>
                      </div>
                    </div>
                  </Form.Group>
                </Form>
                {/* Change Password */}
                <Form>
                  <Form.Group className="mb-3">
                    <div className="currentPassword">
                      {" "}
                      <h5>Change Password</h5>
                      <div style={{ display: verified ? "none" : "" }}>
                        <p>Please verify your current password to change it.</p>
                        {/* Input for the current password */}
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          <InputLabel htmlFor="filled-adornment-password">
                            Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </FormControl>
                        {/* Button to verify the password */}
                        <div className="verifyBTN">
                          <Button
                            style={{ width: "6rem", marginLeft: "0.75rem" }}
                            variant="outline-dark"
                            type="button"
                            onClick={verifyCurrentPassword}
                          >
                            Verify Me
                          </Button>
                        </div>
                      </div>
                      {/* -----------------------------------------------------------------------     */}
                      {/* Change Password */}
                      <div
                        className="changePassword"
                        style={{ display: !verified ? "none" : "" }}
                      >
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          {/* Input for the new password */}
                          <InputLabel htmlFor="filled-adornment-password">
                            New Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </FormControl>
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          {/* Input for the confirm password */}
                          <InputLabel htmlFor="filled-adornment-password">
                            Confirm Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOffIcon />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </FormControl>
                        {/* Button to change the password */}
                        <div className="changePwdBtn">
                          <Button
                            style={{ width: "6rem", marginLeft: "0.75rem" }}
                            variant="dark"
                            type="button"
                            onClick={changeOwnerPassword}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form.Group>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to proceed?
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default AccountSetings;
