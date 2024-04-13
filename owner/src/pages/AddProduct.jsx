import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./AddProducts.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

const regex = /^(0|[1-9]\d*)$/;

function AddProduct() {
  const [image1, setImage1] = useState(null);
  const [uploadIMG1, setUploadIMG1] = useState("");
  const [image2, setImage2] = useState(null);
  const [uploadIMG2, setUploadIMG2] = useState("");
  const [image3, setImage3] = useState(null);
  const [uploadIMG3, setUploadIMG3] = useState("");
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierID, setSelectedSupplierID] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [img1URL, setImg1URL] = useState("");
  const [img2URL, setImg2URL] = useState("");
  const [img3URL, setImg3URL] = useState("");
  const [imgUploadError, setImgUploadError] = useState(false);
  const [dataSending, setDataSending] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getCategories")
      .then((res) => {
        setCategories(res.data);
        setSelectedCategoryID(res.data[0].categoryID);
        console.log(selectedCategoryID);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getSuppliers")
      .then((res) => {
        setSelectedSupplierID(res.data[0].supplierID);
        setSuppliers(res.data);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategoryID(event.target.value);
    console.log(selectedCategoryID);
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplierID(event.target.value);
    console.log(selectedSupplierID);
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
      setUploadIMG1(e.target.files[0]);
    } else if (image === 2) {
      setImage2(URL.createObjectURL(e.target.files[0]));
      setUploadIMG2(e.target.files[0]);
    } else if (image === 3) {
      setImage3(URL.createObjectURL(e.target.files[0]));
      setUploadIMG3(e.target.files[0]);
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
    const buyingPrice = document.getElementById("inputbuyingprice").value;
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
        return;
      } else if (
        !validateIntegers(openingStock) ||
        !validateIntegers(reorderLevel)
      ) {
        alert("Opening stock and reorder level should be integers");
        return;
      } else if (
        !validatePrice(buyingPrice) ||
        !validatePrice(unitPrice)
      ) {
        alert("Buying price and unit price should be numbers greater than zero");
        return;
      }else {
        //Create FormData object to send files along with form data
        setDataSending(true);
        imageUpload();

        //Send POST request using Axios
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
  function validatePrice(value) {
    // Check if the value is a valid number and greater than zero
    if (!isNaN(value) && parseFloat(value) > 0) {
      return true;
    }
    return false;
  }
  

  const imageUpload = async () => {
    const formData = new FormData();
    if (uploadIMG1 !== "") {
      const storageRef = ref(imgStorage, uploadIMG1.name);
      await uploadBytesResumable(storageRef, uploadIMG1)
        .then(async (snapshot) => {
          const url1 = await getDownloadURL(snapshot.ref);
          formData.append("img1", url1);
          console.log("formdata", url1);

          console.log("File available at", url1);
          setImg1URL(url1);
        })
        .catch((error) => {
          console.error("Error uploading image 1", error);
          setImgUploadError(true);
        });
    }
    if (uploadIMG2 !== "") {
      const storageRef = ref(imgStorage, uploadIMG2.name);
      await uploadBytesResumable(storageRef, uploadIMG2)
        .then(async (snapshot) => {
          const url2 = await getDownloadURL(snapshot.ref);
          formData.append("img2", url2);
          console.log("File available at", url2);
          setImg2URL(url2);
        })
        .catch((error) => {
          console.error("Error uploading image 2", error);
          setImgUploadError(true);
        });
    }
    if (uploadIMG3 !== "") {
      const storageRef = ref(imgStorage, uploadIMG3.name);
      await uploadBytesResumable(storageRef, uploadIMG3)
        .then(async (snapshot) => {
          const url3 = await getDownloadURL(snapshot.ref);
          formData.append("img2", url3);
          console.log("File available at", url3);
          setImg2URL(url3);
        })
        .catch((error) => {
          console.error("Error uploading image 3", error);
          setImgUploadError(true);
        });
    }
    // setTimeout(DatabaseCall, 3000); // Delay DatabaseCall() by 3 seconds
    const productName = document.getElementById("inputProductName").value;
    const brandName = document.getElementById("inputBrandName").value;
    const category = document.getElementById("categorySelect").value;
    const subCategory = selectedCategoryID;
    const buyingPrice = document.getElementById("inputbuyingprice").value;
    const unitPrice = document.getElementById("inputUnitPrice").value;
    const openingStock = document.getElementById("inputOpeningStock").value;
    const reorderLevel = document.getElementById("inputReorderLevel").value;
    const productDetails = document.getElementById("inputProductDetails").value;
    const supplier = document.getElementById("inputSupplier").value;
    formData.append("productName", productName);
    formData.append("brandName", brandName);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("openingStock", openingStock);
    formData.append("reorderLevel", reorderLevel);
    //formData.append("buyingPrice", buyingPrice);
    formData.append("unitPrice", unitPrice);
    formData.append("productDetails", productDetails);
    formData.append("supplierID", selectedCategoryID);
    console.log("Calling database");
    axios
      .post("http://localhost:5000/addProduct", formData)
      .then((res) => {
        // Handle success response

        setShowConfirmation(true);
      })
      .catch((err) => {
        // Handle error response
        console.error("Error adding product", err);
      });

    setDataSending(false);
  };

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
                      <h3 className="mb-3 text-uppercase fw-bold">
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
                          <Form.Label>Buying price</Form.Label>
                          <Form.Control
                            id="inputbuyingprice"
                            type="number"
                            placeholder="buying price per unit"
                            min="0" // Enforce a minimum value of 1
                            step="0.01"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Selling price</Form.Label>
                          <Form.Control
                            id="inputUnitPrice"
                            type="number"
                            placeholder="product selling price per unit"
                            min="0" // Enforce a minimum value of 1
                            step="0.01" 
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                       

                        {/* <MDBCol md="6">
                          <Form.Label>Supplier</Form.Label>
                          <Form.Control
                            id="inputSupplier"
                            type="text"
                            placeholder="Supplier name"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol> */}
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Supplier
                          </Form.Label>
                          <Form.Select
                            id="inputSupplier"
                            onChange={handleSupplierChange}
                            value={selectedSupplierID}
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

      <div
        className="cover"
        style={{ display: dataSending ? "block" : "none" }}
      >
        <div className="innerCover">
          <Spinner animation="grow" variant="light" />;
          <h4 style={{ color: "snow" }}>Database Updating</h4>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
