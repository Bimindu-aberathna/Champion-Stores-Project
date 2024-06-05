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
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
} from "../Validation";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import './CustomerProfile.css';

function CustomerProfile({customerName="User", customerEmail=""}) {
  const [enableEdit, setEnableEdit] = useState(false);//state for enable edit
  const [customerDetails, setCustomerDetails] = useState({});//state for customer details
  const [newDetails, setNewDetails] = useState({//State to store new details
    firstName: "",
    lastName: "",
    telephone: "",
    address: "",
  });

  const handleEdit = () => {//function to handle edit
    setEnableEdit(!enableEdit);
  };

  useEffect(() => {//use effect to fetch customer details
    fetchCustomerDetails();
  }, []);

  function fetchCustomerDetails() {//function to fetch customer details
    getCustomerDetails()//get customer details
      .then((response) => {//if the details are fetched
        setCustomerDetails(response.data);
        setNewDetails({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          telephone: response.data.telephone,
          address: response.data.address
        });
      })
      .catch((error) => {//if the details are not fetched
        
        console.log(error);
      });
  }

  function handleCustomerInfoChange() {//function to handle customer info change
    const nameValidation = validateName(newDetails.firstName);//validate first name
    const lastNameValidation = validateName(newDetails.lastName);//validate last name
    const phoneValidation = validatePhoneNumber(newDetails.telephone);//validate phone number
    const addressValidation = validateAddress(newDetails.address);//validate address
    if(!nameValidation.isValid){//if the first name is not valid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: nameValidation.errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }if(!lastNameValidation.isValid){//if the last name is not valid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: lastNameValidation.errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }if(!phoneValidation.isValid){//if the phone number is not valid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: phoneValidation.errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }if(!addressValidation.isValid){//if the address is not valid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: addressValidation.errorMessage,
        confirmButtonColor: "#000",
      });
      return;
    }
    changeCustomerDetails(newDetails)
      .then((response) => {//if the details are changed
        fetchCustomerDetails();
        setEnableEdit(false);
      })
      .catch((error) => {//if the details are not changed
        console.log(error);
      });
  }

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        {/* prile info */}
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

        <MDBCol col="4" md="6">
          <div>
            <div>
              <h1>You Info</h1>
            </div>
            <form>
              
                <div className="receiverDatailNBtn">
                  <h5>Receiver Details</h5>
                  {!enableEdit ? (//if the edit is not enabled
                    <MDBBtn type="button"  onClick={handleEdit}>Edit</MDBBtn>
                  ) : (//if the edit is enabled
                    <div>
                      <MDBBtn type="button" onClick={handleCustomerInfoChange}>Save</MDBBtn>&nbsp;&nbsp;
                      <MDBBtn type="button" onClick={handleEdit}>Cancel</MDBBtn>
                    </div>
                  )}
                </div>
                <div className="detailItem">
                  <TextField // First name input
                    label="First Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.firstName}
                    focused
                    onChange={(e) => setNewDetails({...newDetails,firstName:e.target.value})}
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField // Last name input
                    label="Last Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.lastName}
                    onChange={(e) => setNewDetails({...newDetails,lastName:e.target.value})}
                    focused
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Phone" // Telephone input
                    variant="standard"
                    color="success"
                    value={newDetails.telephone}
                    onChange={(e) => setNewDetails({...newDetails,telephone:e.target.value})}
                    focused
                    className="detailField"
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField // Address input
                    label="Receiver Address"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.address}
                    onChange={(e) => setNewDetails({...newDetails,address:e.target.value})}
                    focused
                    disabled={!enableEdit}
                  />
                </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer/>
    </MDBContainer>
  );
}

export default CustomerProfile;
