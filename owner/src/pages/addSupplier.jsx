import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
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
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './commonStyles.css';


function AddSupplier() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [supplierDetails, setSupplierDetails] = useState("");

  const navigate = useNavigate();

  const validateData = (e) => {
    e.preventDefault();

    // Validate Supplier Name
    if (!validateName(supplierName)) {
      toast.error("Invalid supplier name");
      return;
    } else {
      if (!validateEmail(supplierEmail)) {
        toast.error("Invalid email");
        return;
      } else {
        if (!validateMobile(phone1)) {
          toast.error("Invalid mobile number");
          return;
        } else {
          if (phone2 !== "" && !validateMobile(phone2)) {
            toast.error("Invalid mobile number");
            return;
          } else {
            addSupplierToDB();
          }
        }
      }
    }
  };

  function addSupplierToDB() {
    const data = {
      supplierDetails: supplierDetails,
      supplierName: supplierName,
      supplierEmail: supplierEmail,
      phone1: phone1,
      phone2: phone2,
    };
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post(
        "http://localhost:5000/api/owner/supplierServices/addSupplier",
        data,
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      )
      .then((res) => {
        // Handle success response
        console.log("Supplier added", res);
        toast.success("Supplier added successfully");
        setTimeout(() => {
          navigate('/listsuppliers');
        }, 1800);
      })
      .catch((err) => {
        // Handle error response
        console.error("Error adding supplier", err);
        toast.error("Error adding supplier");
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
      <InventoryNavBar selected="listsuppliers" />
      <SideNavbar selected="Inventory" />
      <h1 className="mt-3" style={{marginLeft:"7%",marginTop:"1rem"}}>Add New Supplier</h1>
      <Form onSubmit={validateData}>
        <MDBContainer fluid className="bg-white" style={{ height: "80vh" }}>
          <MDBRow
            className="d-flex justify-content-center align-items-center h-100"
            style={{ zIndex: "800" }}
          >
            <MDBCol style={{width:'60%' }}>
              <MDBCard id="addSupplierCard" className="my-4">
                <MDBRow className="g-0 justify-content-center">
                  <MDBCol md="6" style={{width:'100%',padding:'1rem'}}>
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h4 className="mb-5 text-uppercase fw-bold">
                        New Supplier Details
                      </h4>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label className="addSupplierFormLabel">Supplier Name</Form.Label>
                          <Form.Control
                            id="supplierName"
                            type="text"
                            placeholder="new supplier name....."
                            pattern="^[a-zA-Z]+(?: [a-zA-Z]+)*$"
                            onChange={(e) => {
                              setSupplierName(e.target.value);
                            }}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label className="addSupplierFormLabel">E-mail</Form.Label>
                          <Form.Control
                            id="supplierEmail"
                            type="text"
                            placeholder="email address....."
                            pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
                            onChange={(e) => {
                              setSupplierEmail(e.target.value);
                            }}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label className="addSupplierFormLabel">Phone 1</Form.Label>
                          <Form.Control
                            id="phone1"
                            type="text"
                            placeholder="new supplier mobile number....."
                            pattern="^0\d{9}$"
                            onChange={(e) => {
                              setPhone1(e.target.value);
                            }}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label className="addSupplierFormLabel">Phone 2</Form.Label>
                          <Form.Control
                            id="phone2"
                            type="text"
                            placeholder="new supplier mobile number....."
                            pattern="^0\d{9}$"
                            onChange={(e) => {
                              setPhone2(e.target.value);
                            }}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label className="addSupplierFormLabel">Additional details</Form.Label>
                      <Form.Control
                        id="supplierDetails"
                        type="text"
                        placeholder="new supplier details....."
                        as={"textarea"}
                        style={{ height: "100px" }}
                        onChange={(e) => {
                          setSupplierDetails(e.target.value);
                        }}
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
      <ToastContainer />
    </div>
  );
}

export default AddSupplier;
