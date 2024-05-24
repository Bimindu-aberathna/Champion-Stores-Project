import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import {
  validateEmail,
  validatePhoneNumber,
} from "../functionality/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function ListSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [editable, setEditable] = useState(false);
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/owner/supplierServices/getSuppliers") // Assuming this endpoint fetches suppliers
      .then((res) => {
        setSuppliers(res.data);
        setSelectedSupplier(res.data[0]);
        setEmail(res.data[0].email);
        setPhone1(res.data[0].phone1);
        setPhone2(res.data[0].phone2);
        setDetails(res.data[0].details);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error fetching suppliers!", {
          position: "top-right",
          autoClose: 3500,
        });
      });
  }, []);

  const handleSupplierChange = (event) => {
    const selectedSupplierID = parseInt(event.target.value);
    const foundSupplier = suppliers.find(
      (supplier) => supplier.supplierID === selectedSupplierID
    );
    setSelectedSupplier(foundSupplier);
    setEditable(false);
    if (foundSupplier.email === null) {
      setEmail("");
    } else {
      setEmail(foundSupplier.email);
    }
    setPhone1(foundSupplier.phone1);
    if (foundSupplier.phone2 === null) {
      setPhone2("");
    } else {
      setPhone2(foundSupplier.phone2);
    }
    if (foundSupplier.details === null) {
      setDetails("");
    } else {
      setDetails(foundSupplier.details);
    }
  };

  const handleCancelEdit = () => {
    setEmail(selectedSupplier.email);
    setPhone1(selectedSupplier.phone1);
    setPhone2(selectedSupplier.phone2);
    setDetails(selectedSupplier.details);
    setEditable(false);
  };

  function handleEditSupplier() {
    
    console.log("Edit supplier with ID: " + selectedSupplier.supplierID);
    if (!validateEmail(email)) {
      toast.error("Invalid email");
      return;
    } else if (!validatePhoneNumber(phone1)) {
      toast.error("Invalid phone number");
      return;
    } else if (phone2 !== "" && !validatePhoneNumber(phone2)) {
      toast.error("Invalid phone number");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .put(
              "http://localhost:5000/api/owner/supplierServices/updateSupplier",
              {
                supplierID: selectedSupplier.supplierID,
                email: email,
                phone1: phone1,
                phone2: phone2,
                details: details,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                toast.success("Supplier details updated successfully", {
                  position: "top-right",
                  autoClose: 2500,
                });
                setEditable(false);
              } else {
                toast.error("Failed to update supplier details", {
                  position: "top-right",
                  autoClose: 2500,
                });
                return;
              }
            })
            .catch((err) => {
              console.log(err);
              toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 3500,
              });
              return;
            });
        }
      });
    }
  }

  return (
    <div>
      <InventoryNavBar selected="listsuppliers" />
      <SideNavbar selected="Inventory" />
      <Form>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol style={{ paddingRight: "1rem" }}>
              <MDBCard
                className="my-4"
                style={{
                  display: "flex",
                  width: "91%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  zIndex: "888",
                }}
              >
                <MDBRow className="g-0">
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-centertext-black d-flex flex-column justify-content-center align-items-center">
                      <MDBCol md="6">
                        <Form.Label htmlFor="disabledSelect">
                          <h5>Select Supplier</h5>
                        </Form.Label>
                        <Form.Select
                          id="categorySelect"
                          onChange={handleSupplierChange}
                          value={
                            selectedSupplier ? selectedSupplier.supplierID : ""
                          }
                        >
                          {suppliers.map((supplier) => (
                            <option
                              key={supplier.supplierID}
                              value={supplier.supplierID}
                            >
                              {supplier.name}
                            </option>
                          ))}
                        </Form.Select>
                      </MDBCol>
                    </MDBCardBody>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3 className="mb-5 text-uppercase fw-bold">
                          Supplier Info
                        </h3>
                        <Link to="/addSupplier">
                          <Button
                            as="input"
                            variant="dark"
                            type="button"
                            value="Add supplier"
                            style={{ width: "10rem" }}
                          />
                        </Link>
                      </div>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Supplier Name</Form.Label>
                          <Form.Control
                            id="supplierName"
                            type="text"
                            placeholder="Supplier name....."
                            disabled
                            value={
                              selectedSupplier
                                ? selectedSupplier.name
                                : "Data not available"
                            }
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>E-mail</Form.Label>
                          <Form.Control
                            id="supplierEmail"
                            type="text"
                            placeholder="email address....."
                            disabled={!editable}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            disabled={!editable}
                            value={phone1}
                            onChange={(e) => setPhone1(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Phone 2</Form.Label>
                          <Form.Control
                            id="phone2"
                            type="text"
                            placeholder="new supplier mobile number....."
                            disabled={!editable}
                            value={phone2}
                            onChange={(e) => setPhone2(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label>Additional details</Form.Label>
                      <Form.Control
                        id="supplierDetails"
                        type="text"
                        placeholder="Additional details....."
                        value={details}
                        as={"textarea"}
                        disabled={!editable}
                        style={{ height: "100px" }}
                        onChange={(e) => setDetails(e.target.value)}
                      />
                      <Form.Text className="text-muted"></Form.Text>

                      <div className="d-flex justify-content-end pt-3">
                        &nbsp;
                        {editable ? (
                          <div style={{ display: "flex", gap: "10px" }}>
                            <Button
                              variant="outline-dark"
                              type="button"
                              style={{ width: "10rem" }}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="dark"
                              type="button"
                              style={{ width: "10rem" }}
                              onClick={handleEditSupplier}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="dark"
                            type="button"
                            style={{ width: "10rem" }}
                            onClick={() => setEditable(true)}
                          >
                            Edit
                          </Button>
                        )}
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

export default ListSuppliers;
