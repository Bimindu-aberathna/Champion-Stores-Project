import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./AddProducts.css";
import { imgDB } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

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

const regex = /^(0|[1-9]\d*)$/;

function AddProduct() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getCategories")
      .then((res) => {
        setCategories(res.data);
        setSelectedCategoryID(res.data[0].categoryID);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategoryID(event.target.value);
    console.log(selectedCategoryID);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/getSubCategories/${selectedCategoryID}`)
      .then((res) => {
        setSubcategories(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategoryID]);

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    setSelectedSubcategory(selectedSubcategoryId);
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  function handleChange(e, image) {
    console.log(e.target.files);
    if (image === 1) {
      setImage1(URL.createObjectURL(e.target.files[0]));
    } else if (image === 2) {
      setImage2(URL.createObjectURL(e.target.files[0]));
    } else if (image === 3) {
      setImage3(URL.createObjectURL(e.target.files[0]));
    } else {
      alert("Invalid image");
    }
  }
  
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };


  function validateForm(event) {
    event.preventDefault();
    const productName = document.getElementById("inputProductName").value;
    const brandName = document.getElementById("inputBrandName").value;
    const category = document.getElementById("categorySelect").value;
    const subCategory = selectedCategoryID;
    const unitPrice = document.getElementById("inputUnitPrice").value;
    const openingStock = document.getElementById("inputOpeningStock").value;
    const reorderLevel = document.getElementById("inputReorderLevel").value;
    const productDetails = document.getElementById("inputProductDetails").value;
    const supplier = document.getElementById("inputSupplier").value;
    {
      if (
        productName === "" ||
        brandName === "" ||
        category === "" ||
        subCategory === "" ||
        openingStock === "" ||
        reorderLevel === "" ||
        productDetails === ""
      ) {
        alert("Please fill all the fields");
      } else if (
        !validateIntegers(openingStock) ||
        !validateIntegers(reorderLevel)
      ) {
        alert("Opening stock and reorder level should be integers");
      } else {
        //Create FormData object to send files along with form data
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("brandName", brandName);
        formData.append("category", category);
        formData.append("subCategory", subCategory);
        formData.append("openingStock", openingStock);
        formData.append("reorderLevel", reorderLevel);
        formData.append("unitPrice", unitPrice);
        formData.append("productDetails", productDetails);

        // Send POST request using Axios
        axios
          .post("http://localhost:5000/addProduct", formData)
          .then((res) => {
            // Handle success response
            console.log("Product added successfully", res.data);
            setShowConfirmation(true);
          })
          .catch((err) => {
            // Handle error response
            console.error("Error adding product", err);
          });
      }
    }
  }

  function validateIntegers(number) {
    if (regex.test(number)) {
      return true;
    } else {
      return false;
    }
  }
  

  function validateIntegers(number) {
    if (regex.test(number)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Form onSubmit={validateForm}>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="my-4">
                <MDBRow className="g-0">
                  <MDBCol
                    md="6"
                    className="d-none d-md-block "
                    style={{ marginTop: "1rem" }}
                  >
                    {/* ----------------------------------------------------------------------------------------- */}

                    <Carousel
                      interval={5000}
                      activeIndex={index}
                      onSelect={handleSelect}
                      style={{
                        width: "40%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <Carousel.Item>
                        <img
                          src={
                            image1
                              ? image1
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />
                        <Carousel.Caption>
                          <h3>Image 1</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          src={
                            image2
                              ? image2
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />

                        <Carousel.Caption>
                          <h3>Image 2</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          src={
                            image3
                              ? image3
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />
                        <Carousel.Caption>
                          <h3>Image 3</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                    {/* ----------------------------------------------------------------------------------------- */}

                    {/* <div className="App">
                  <h4>Add Image 1:</h4>
                  <input type="file" onChange={{}} />
                  <img src={image1} />
                </div> */}
                    <div style={{ margin: "1rem" }}>
                      <Form.Label>Select image 1</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 1)}
                      />
                      <Form.Label>Select image 2</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 2)}
                      />
                      <Form.Label>Select image 3</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 3)}
                      />
                    </div>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h3 className="mb-5 text-uppercase fw-bold">
                        New product info
                      </h3>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            id="inputProductName"
                            type="text"
                            placeholder="new product name....."
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            id="inputBrandName"
                            type="text"
                            placeholder="brand name"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Category
                          </Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={handleCategoryChange}
                            value={selectedCategoryID}
                          >
                            {categories.map((category) => (
                              <option
                                key={category.categoryID}
                                value={category.categoryID}
                              >
                                {category.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Sub Category
                          </Form.Label>
                          <Form.Select
                            id="subCategorySelect"
                            onChange={handleSubcategoryChange}
                            value={selectedSubcategory}
                          >
                            {subcategories.map((item) => (
                              <option
                                key={item.subcategoryID}
                                value={item.subcategoryID} // Set the value to the subcategoryID
                              >
                                {item.subCategoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Opening stock</Form.Label>
                          <Form.Control
                            id="inputOpeningStock"
                            type="text"
                            placeholder="first stock quantity"
                            min="0" // Enforce a minimum value of 1
                            step="1" // Allow only whole numbers (integers)
                            pattern="^[1-9]\d*$"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Re-order level</Form.Label>
                          <Form.Control
                            id="inputReorderLevel"
                            type="number"
                            placeholder="product reorder level"
                            min="0" // Enforce a minimum value of 1
                            step="1" // Allow only whole numbers (integers)
                            pattern="^[1-9]\d*$" // Enforce positive integers with regex
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Unit price</Form.Label>
                          <Form.Control
                            id="inputUnitPrice"
                            type="number"
                            placeholder="product buying price per unit"
                            min="0" // Enforce a minimum value of 1
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Supplier</Form.Label>
                          <Form.Control
                            id="inputSupplier"
                            type="text"
                            placeholder="Supplier name"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label>Product details</Form.Label>
                      <Form.Control
                        id="inputProductDetails"
                        type="text"
                        placeholder="new product details....."
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
                          value="Add product"
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
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <h5>Congratulations!! Your new product has been successfully added.</h5>
            
            
          </Modal.Body>
          <Modal.Footer>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="dark"
                
                onClick={handleCloseConfirmation}
              >
                Ok
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
    </>
  );
}

export default AddProduct;
