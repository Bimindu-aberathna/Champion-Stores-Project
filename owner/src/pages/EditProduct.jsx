import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import "./AddProducts.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { imgStorage } from "../config";
import InventoryNavBar from "../Components/InventoryNavBar";
import SideNavbar from "../Components/SideNavbar";
import {
  validatePrice,
  validateIntegers,
  nameValidation,
  validateWeight
} from "../functionality/validation";

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";


function EditProduct() {
  const navigate = useNavigate(); // Navigation hook for redirecting to another page
  const { productId } = useParams(); // Get the product ID from the URL
  const [productName, setProductName] = useState(""); // State variable to store the product name
  const [brand, setBrand] = useState(""); // State variable to store the product brand
  const [categories, setCategories] = useState([]); // State variable to store the categories
  const [selectedCategoryID, setSelectedCategoryID] = useState(""); // State variable to store the selected category ID
  const [selectedCategory, setSelectedCategory] = useState(""); // State variable to store the selected category
  const [subCategories, setSubCategories] = useState([]); // State variable to store the subcategories
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // State variable to store the selected subcategory
  const [selectedSubcategoryID, setSelectedSubcategoryID] = useState(""); // State variable to store the selected subcategory ID
  const [index, setIndex] = useState(0); // State variable to store the index of the carousel
  const [suppliers, setSuppliers] = useState([]); // State variable to store the suppliers
  const [selectedSupplierID, setSelectedSupplierID] = useState(""); // State variable to store the selected supplier ID
  const [supplier, setSupplier] = useState(""); // State variable to store the selected supplier
  const [openingStock, setOpeningStock] = useState(""); // State variable to store the opening stock
  const [reorderLevel, setReorderLevel] = useState(""); // State variable to store the reorder level
  const [unitPrice, setUnitPrice] = useState(""); // State variable to store the unit price
  const [unitWeight, setUnitWeight] = useState(0); // State variable to store the unit weight
  const [productDescription, setProductDescription] = useState(""); // State variable to store the product description
  const [img1, setImg1] = useState(""); //to display image1 in the carousel if user has not uploaded a new image
  const [img2, setImg2] = useState("");  //to display image2 in the carousel if user has not uploaded a new image
  const [img3, setImg3] = useState("");   //to display image3 in the carousel if user has not uploaded a new image
  const [uploadIMG1, setUploadIMG1] = useState(null); //to store image1 which needs to be uploaded to firebase
  const [uploadIMG2, setUploadIMG2] = useState(null); //to store image2 which needs to be uploaded to firebase
  const [uploadIMG3, setUploadIMG3] = useState(null); //to store image3 which needs to be uploaded to firebase
  const [image1, setImage1] = useState(""); //to display image1 in the carousel if user has uploaded a new image
  const [image2, setImage2] = useState(""); //to display image2 in the carousel if user has uploaded a new image
  const [image3, setImage3] = useState(""); //to display image3 in the carousel if user has uploaded a new image
  const [dataSending, setDataSending] = useState(false); // State variable to store the data sending status
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State variable to store the delete modal status
  const [item, setItem] = useState([]); // State variable to store the product data

  useEffect(() => {
    // Fetch product data from backend using product ID
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getProductData/${productId}`
      )
      .then((res) => { // Set the fetched data to the state variables
        setItem(res.data[0]);
        setProductName(res.data[0].productName);
        setBrand(res.data[0].brandName);

        setSupplier(res.data[0].supplierName);
        setOpeningStock(res.data[0].currentStock);
        setReorderLevel(res.data[0].preorderLevel);
        setUnitPrice(res.data[0].unitPrice);
        setProductDescription(res.data[0].details);
        setSelectedSupplierID(res.data[0].supplierID);
        setSelectedCategoryID(res.data[0].categoryID);
        setSelectedCategory(res.data[0].categoryName);
        setSelectedSubcategoryID(res.data[0].subCategoryID);
        setSelectedSubcategory(res.data[0].subCategoryName);
        setImg1(res.data[0].image1);
        setImg2(res.data[0].image2);
        setImg3(res.data[0].image3);
        setUnitWeight(res.data[0].unitWeight);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  useEffect(() => { // Fetch suppliers from the backend
    axios
      .get("http://localhost:5000/api/owner/supplierServices/getSuppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCategoryChange = (event) => { // Handle category change
    setSelectedCategoryID(event.target.value);
    console.log(selectedCategoryID);
  };

  const handleSupplierChange = (event) => { // Handle supplier change
    setSelectedSupplierID(event.target.value);
    console.log(selectedSupplierID);
  };

  useEffect(() => { // Fetch categories from the backend
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories")
      .then((res) => {
        setCategories(res.data); // Set the fetched categories to the state variable
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => { // Fetch subcategories from the backend
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategoryID}`
      )
      .then((res) => {
        setSubCategories(res.data); // Set the fetched subcategories to the state variable
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategoryID]);

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    setSelectedSubcategoryID(selectedSubcategoryId); // Set the selected subcategory ID to the state variable
  };

  const handleSelect = (selectedIndex) => { // Handle carousel index change
    setIndex(selectedIndex);
  };

  function handleChange(e, image) { // Handle image change
    console.log(e.target.files);
    if (image === 1) { // Set the image to the state variable based on the image number
      setImage1(URL.createObjectURL(e.target.files[0]));
      setUploadIMG1(e.target.files[0]);
    } else if (image === 2) { // Set the image to the state variable based on the image number
      setImage2(URL.createObjectURL(e.target.files[0]));
      setUploadIMG2(e.target.files[0]);
    } else if (image === 3) { // Set the image to the state variable based on the image number
      setImage3(URL.createObjectURL(e.target.files[0]));
      setUploadIMG3(e.target.files[0]);
    } else {
      toast.error("Error uploading image");
    }
  }

  function validateForm(event) { // Function to validate the form
    event.preventDefault(); 
    {
      if (// Validate the form fields
        productName === "" ||
        brand === "" ||
        openingStock === "" ||
        reorderLevel === "" ||
        productDescription === ""
      ) {
        toast.error("All fields are required");
        return;
      } else if (// Validate opening stock and reorder level
        !validateIntegers(openingStock) ||
        !validateIntegers(reorderLevel)
      ) {
        toast.error("Invalid input for stock and reorder level");
        return;
      } else if (!validatePrice(unitPrice)) { // Validate unit price
        toast.error("Invalid input for unit price");
        return;
      }else if (!validateWeight(unitWeight)) { // Validate unit weight
        toast.error("Invalid input for unit weight");
        return;
      }else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#000000",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Edit item!",
          focusCancel: true,
        }).then((result) => {
          if (result.isConfirmed) { // Call the image upload function
            imageUpload();
          }
        });
      }
    }
  }

  const imageUpload = async () => { // Function to upload images
    setDataSending(true);
    const formData = new FormData();
    if (image1 !== "") {// Upload image 1 if it is not empty
      const storageRef = ref(imgStorage, uploadIMG1.name);
      await uploadBytesResumable(storageRef, uploadIMG1)
        .then(async (snapshot) => {
          const url1 = await getDownloadURL(snapshot.ref);
          formData.append("img1", url1);
          console.log("formdata", url1);

          console.log("File available at", url1);
        })
        .catch((error) => {
          console.error("Error uploading image 1", error);
          toast.error("Error uploading image 1");
        });
    } else {
      formData.append("img1", img1);
    }
    if (image2 !== "") { // Upload image 2 if it is not empty
      const storageRef = ref(imgStorage, uploadIMG2.name);
      await uploadBytesResumable(storageRef, uploadIMG2)
        .then(async (snapshot) => {
          const url2 = await getDownloadURL(snapshot.ref);
          formData.append("img2", url2);
          console.log("File available at", url2);
        })
        .catch((error) => {
          console.error("Error uploading image 2", error);
          toast.error("Error uploading image 2");
        });
    } else {
      formData.append("img2", img2);
    }
    if (image3 !== "") { // Upload image 3 if it is not empty
      const storageRef = ref(imgStorage, uploadIMG3.name);
      await uploadBytesResumable(storageRef, uploadIMG3)
        .then(async (snapshot) => {
          const url3 = await getDownloadURL(snapshot.ref);
          formData.append("img3", url3);
          console.log("File available at", url3);
        })
        .catch((error) => {
          console.error("Error uploading image 3", error);
          toast.error("Error uploading image 3");
        });
    } else {
      formData.append("img3", img3);
    }
    // Append the form data
    formData.append("productId", productId);
    formData.append("productName", productName);
    formData.append("brandName", brand);
    formData.append("subCategory", selectedSubcategoryID);
    formData.append("openingStock", openingStock);
    formData.append("reorderLevel", reorderLevel);
    formData.append("unitPrice", unitPrice);
    formData.append("productDetails", productDescription);
    formData.append("supplierID", selectedSupplierID);
    formData.append("unitWeight", unitWeight);
    const accessToken = localStorage.getItem("accessToken");
    // Send POST request to the backend API
    axios
      .post(
        "http://localhost:5000/api/owner/productServices/updateProductInfo",
        formData,
        {
          headers: {
            "x-access-token": accessToken,
          },
        }
      )
      .then((res) => {
        console.log("Product Edited", res);
        toast.success("Product edited successfully");
      })
      .catch((err) => {
        // Handle error response
        console.error("Error adding product", err);
        toast.error("Error editing product");
      });

    setDataSending(false);
  };

  // Function to handle opening the delete confirmation modal
  const handleShowDeleteModal = () => { 
    setShowDeleteModal(true);
  };

  // Function to handle closing the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Function to handle deleting the product
  const handleDeleteProduct = () => {
    // Send DELETE request to your backend API
    const accessToken = localStorage.getItem("accessToken");
    axios
      .delete(
        `http://localhost:5000/api/owner/productServices/deleteProduct/${productId}`,
        { headers: { "x-access-token": accessToken } }
      )
      .then((res) => {
        navigate("/inventory", { replace: true });
        console.log("Product deleted successfully", res);
      })
      .catch((error) => {
        console.error("Error deleting product", error);
        toast.error("Error deleting product");
      });

    // Close the modal after successful deletion
    handleCloseDeleteModal();
    handleCloseDeleteModal();
  };

  return (
    <>
      <SideNavbar />
      <InventoryNavBar />
      <Form onSubmit={validateForm}>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="my-4">
                <MDBRow
                  className="g-0"
                  style={{
                    width: "90%",
                    display: "flex",
                    alignSelf: "center",
                    zIndex: "800",
                  }}
                >
                  <MDBCol
                    md="6"
                    className="d-none d-md-block "
                    style={{ marginTop: "1rem" }}
                  >
                    {/* Carousel to display the images */}
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
                              : img1
                              ? img1
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="First slide"
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
                              : img2
                              ? img2
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
                              : img3
                              ? img3
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Third slide"
                          style={{ height: "50vh", width: "100%" }}
                        />
                        <Carousel.Caption>
                          <h3>Image 3</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                    {/* Image upload form */}
                    <div style={{ margin: "1rem" }}>
                      <Form.Label>Select image 1</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleChange(e, 1);
                        }}
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
                      <div style={{ display: "flex" }}>
                        <h3 className="mb-5 text-uppercase fw-bold">
                          Change product info
                        </h3>
                        {/* Add inventory button to navigate to the add inventory page */}
                        <Link
                          to={`/newinventory/${productId}`}
                          key={productId}
                          style={{ marginLeft: "auto" }}
                        >
                          <Button
                            variant="outline-dark"
                            type="button"
                            style={{
                              marginLeft: "auto",
                              height: "fit-content",
                              fontWeight: "bold",
                              border: "solid 2px black",
                            }}
                          >
                            Add Inventory
                          </Button>
                        </Link>
                      </div>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          {/* Product Name */}
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            id="inputProductName"
                            type="text"
                            placeholder="new product name....."
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          {/* Brand Name */}
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            id="inputBrandName"
                            type="text"
                            placeholder="brand name"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          {/* Category  of the product */}
                          <Form.Label htmlFor="disabledSelect">
                            Category
                          </Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={handleCategoryChange}
                            value={selectedCategoryID}
                          >
                            <option disabled value={item.categoryID}>
                              {item.categoryName}
                            </option>
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
                            value={selectedSubcategoryID}
                          >
                            <option disabled value="">
                              Select a subcategory
                            </option>
                            {subCategories.map((item) => (
                              <option
                                key={item.subCategoryID}
                                value={item.subCategoryID} // Set the value to the subcategoryID
                              >
                                {item.subCategoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Current stock</Form.Label>
                          <Form.Control
                            id="inputOpeningStock"
                            type="text"
                            placeholder="first stock quantity"
                            value={openingStock}
                            min="0" // Enforce a minimum value of 1
                            step="1" // Allow only whole numbers (integers)
                            pattern="^[1-9]\d*$"
                            onChange={(e) => setOpeningStock(e.target.value)}
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
                            value={reorderLevel}
                            pattern="^[1-9]\d*$" // Enforce positive integers with regex
                            onChange={(e) => setReorderLevel(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Unit price</Form.Label>
                          <Form.Control
                            id="inputUnitPrice"
                            type="text"
                            placeholder="product buying price per unit"
                            value={unitPrice}
                            min="0"
                            onChange={(e) => setUnitPrice(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Supplier
                          </Form.Label>
                          <Form.Select
                            id="inputSupplier"
                            onChange={handleSupplierChange}
                            value={selectedSupplierID}
                          >
                            {/* Default option with the selected supplier */}
                            <option disabled>
                              {supplier}
                              {console.log(
                                "Supplier data",
                                selectedSupplierID,
                                supplier
                              )}
                            </option>

                            {/* Iterate over suppliers and render options */}
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

                      <MDBRow style={{ marginBottom: "1rem" }}>
                      <MDBCol md="6">
                          <Form.Label>Unit Weight</Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control
                              placeholder="Unit weight"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              type="number"
                              value={unitWeight}
                              onChange={(e) => setUnitWeight(e.target.value)}
                              title="Enter precise weight of the delivery calculation."
                            />
                            <InputGroup.Text id="basic-addon1">
                              grams
                            </InputGroup.Text>
                          </InputGroup>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label>Product details</Form.Label>
                      <Form.Control
                        id="inputProductDetails"
                        type="text"
                        placeholder="new product details....."
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        as={"textarea"}
                        style={{ height: "100px" }}
                      />
                      <Form.Text className="text-muted"></Form.Text>

                      <div className="d-flex justify-content-end pt-3">
                        <Button
                          variant="outline-dark"
                          type="button"
                          onClick={handleShowDeleteModal}
                        >
                          Delete Product
                        </Button>
                        &nbsp;
                        <Button
                          as="input"
                          variant="dark"
                          type="submit"
                          value="Save Changes"
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
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={dataSending}
        onHide={(e) => setDataSending(false)}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
      >
        <Modal.Body className="modalBody">
          <Spinner
            animation="grow"
            variant="success"
            style={{ marginBottom: "2rem" }}
          />
          <h4 style={{ color: "black" }}>Database Updating</h4>
          <h6 style={{ color: "black" }}>This may take few seconds.</h6>
          <h6 style={{ color: "black" }}>Please wait...</h6>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default EditProduct;
