
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
// import { imgDB } from "../firebase";
import { imgStorage } from "../config";

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";





function addSupplier() {

  const validateData = (e) => {
    e.preventDefault();
    const supplierNameInput = document.getElementById("supplierName");
    const supplierEmailInput = document.getElementById("supplierEmail");
    const phone1Input = document.getElementById("phone1");
    const phone2Input = document.getElementById("phone2");
  
    const supplierName = supplierNameInput.value;
    const supplierEmail = supplierEmailInput.value;
    const phone1 = phone1Input.value;
    const phone2 = phone2Input.value;
  
    // Validate Supplier Name
    if (!validateName(supplierName)) {
      return alert("Invalid supplier name");
    } else {
      if (!validateEmail(supplierEmail)) {
        return alert("Invalid email address");
      } else {
        if (!validateMobile(phone1)||!validateMobile(phone2)) {
          return alert("Invalid phone number");
        } else {
          addSupplierToDB(supplierName, supplierEmail, phone1, phone2);
        }
      }
    }
    
  }
  
  function addSupplierToDB() {
      const supplierDetails = document.getElementById("supplierDetails").value;
      const supplierName = document.getElementById("supplierName").value;
      const supplierEmail = document.getElementById("supplierEmail").value;
      const phone1 = document.getElementById("phone1").value;
      const phone2 = document.getElementById("phone2").value;
      console.log(supplierName);
      console.log(supplierEmail);
      console.log(phone1);
      console.log(phone2);
      console.log(supplierDetails);
      
      const data = {
        supplierDetails: supplierDetails,
        supplierName: supplierName,
        supplierEmail: supplierEmail,
        phone1: phone1,
        phone2: phone2
      };
    
      axios
        .post("http://localhost:5000/addSupplier", data)
        .then((res) => {
          // Handle success response
        })
        .catch((err) => {
          // Handle error response
          console.error("Error adding supplier", err);
        });
    }
  
  
  
  
  function validateMobile(number) {
    const regex = /^0\d{9}$/;
  
    if (regex.test(number)) {
      return true;
    } else {
      return false;
    }
  }
  
  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }
  
  function validateName(name) {
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
  
    return regex.test(name);
  }
  
  

  return (
    <div>
     <Form onSubmit={validateData}>
  <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
    <MDBRow className="d-flex justify-content-center align-items-center h-100">
      <MDBCol>
        <MDBCard className="my-4">
          <MDBRow className="g-0 justify-content-center"> {/* Added justify-content-center class here */}
            <MDBCol md="6">
              <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                <h3 className="mb-5 text-uppercase fw-bold">
                  New Supplier
                </h3>

                <MDBRow style={{ marginBottom: "1rem" }}>
                  <MDBCol md="6">
                    <Form.Label>Supplier Name</Form.Label>
                    <Form.Control
                      id="supplierName"
                      type="text"
                      placeholder="new supplier name....."
                      pattern="^[a-zA-Z]+(?: [a-zA-Z]+)*$"
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </MDBCol>

                  <MDBCol md="6">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      id="supplierEmail"
                      type="text"
                      placeholder="email address....."
                      pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </MDBCol>
                </MDBRow>
                <MDBRow style={{ marginBottom: "1rem" }}>
                  <MDBCol md="6">
                    <Form.Label>Phone 1</Form.Label>
                    <Form.Control
                      id="phone1"
                      type="text"
                      placeholder="new supplier mobile number....."
                      pattern="^0\d{9}$"
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </MDBCol>

                  <MDBCol md="6">
                    <Form.Label>Phone 2</Form.Label>
                    <Form.Control
                      id="phone2"
                      type="text"
                      placeholder="new supplier mobile number....."
                      pattern="^0\d{9}$"
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </MDBCol>
                </MDBRow>

                <Form.Label>Additional details</Form.Label>
                <Form.Control
                  id="supplierDetails"
                  type="text"
                  placeholder="new supplier details....."
                  as={"textarea"}
                  style={{ height: "100px" }}
                />
                <Form.Text className="text-muted"></Form.Text>

                <div className="d-flex justify-content-end pt-3">
                  <Button variant="outline-dark" type="reset">
                    Clear all
                  </Button>
                  &nbsp;
                  <Button
                    as="input"
                    variant="dark"
                    type="submit"
                    value="Add supplier"
                  />
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</Form>

    </div>
  )
}

export default addSupplier
