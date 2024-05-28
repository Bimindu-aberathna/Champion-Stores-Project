import React, { useState,useEffect } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { FaCircleUser } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import {changeCustomerDetails,getCustomerDetails} from "../Services/userServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { verifyPassword , changePassword } from "../Services/userServices";
import {validatePassword} from "../Validation";
import './ChangePassword.css';

function ChangePassword({customerName="User", customerEmail=""}) {
const [currentPassword, setCurrentPassword] = useState("");//state for current password
const [newPassword, setNewPassword] = useState("");//state for new password
const [confirmPassword, setConfirmPassword] = useState("");//state for confirm password 
const [verified, setVerified] = useState(false);//state for verified
 
function handleVerify(){//function to verify the current password
  verifyPassword(currentPassword)
  .then((response) => {//if the password is verified
    console.log();
    if(response.status===200)
    setVerified(true);
    
  })
  .catch((error) => {//if the password is not verified
    setVerified(false);
    toast.error("Invalid Password", {
      position: "top-right",
      autoClose: 3500,
      });
      console.log(error);
}
  );
}
function handleChangePassword(){//function to change the password
    if(newPassword!==confirmPassword){//if the new password and confirm password do not match
        toast.error("Passwords do not match!", {
            position: "top-right",
            autoClose: 3500,
            });
            return;
    }else if(!validatePassword(newPassword)){//if the new password is not valid
        toast.error("Password must be at least 7 characters long and contain at least one number, one special character and one alphabet", {
            position: "top-right",
            autoClose: 3500,
            });
            return;
    }else{//if the new password and confirm password match
        changePassword(newPassword)
        .then((response) => {//if the password is changed
            console.log(response);
        }).catch((error) => {//if the password is not changed
            console.log("ChangePassword.jsx",error);
        });
    }

  }


  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        {/* Display Customer Profile */}
        <MDBCol col="10" md="6">
          <h1 className="text-center">Customer Profile</h1>
          <div>
            <div className="d-flex justify-content-center">
              <FaCircleUser size="8em" />
            </div>
            <br />
            <div className="d-flex justify-content-center">
              <h4>{customerName}</h4>
            </div>
            <div className="d-flex justify-content-center">
              {customerEmail}
            </div>
          </div>
        </MDBCol>
        {/* Change Password */}
        <MDBCol col="4" md="6">
          <div>
            <div>
              <h1>Change Password</h1>
            </div>
            {!verified ? (//if the password is not verified
                <div >
                  <p>Enter your current password to verify it's you!</p>  
                  <TextField
                    label="Current Password"
                    variant="standard"
                    type="password"
                    color="success"
                    className="detailField"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div className="verifyBtnDiv"><MDBBtn color="dark" type="button" className="verifyBtn" onClick={handleVerify}>Verify me</MDBBtn> </div>
                   
                </div>
                ) : (//if the password is verified
                <div >
                  <p>Let's set your new password</p>  
                  <TextField
                    label="New Password"
                    variant="standard"
                    type="password"
                    color="success"
                    className="detailField"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    label="Confirm Password"
                    variant="standard"
                    type="password"
                    color="success"
                    className="detailField"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  /><div className="ChangePassBtn">
                    <MDBBtn color="outline-dark" type="button" onClick={()=>setVerified(!verified)}>Cancel</MDBBtn>
                    <MDBBtn color="dark" type="button" className="verifyBtn" onClick={handleChangePassword}>Change Password</MDBBtn>
                  </div>
                   </div>
                 
                )}
                
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer/>
    </MDBContainer>
  );
}

export default ChangePassword;
