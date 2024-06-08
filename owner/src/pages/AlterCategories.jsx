import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { nameValidation } from "../functionality/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "./commonStyles.css";

function AlterCategories() {
  const [categories, setCategories] = useState([]); // state variable to store the categories list
  const [selectedCategory, setSelectedCategory] = useState(""); // state variable to store the selected category
  const [subCategories, setSubCategories] = useState([]); // state variable to store the sub-categories list
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // state variable to store the selected sub-category

  useEffect(() => { // useEffect to get the categories list
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories")
      .then((res) => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]);// set the selected category to the first category in the list
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {// useEffect to get the sub-categories list based on the selected category
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategory.categoryID}`
      )
      .then((res) => {
        setSubCategories(res.data);
        setSelectedSubCategory(res.data[0]);// set the selected sub-category to the first sub-category in the list
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory]);

  function addNewCategory() {// Function to add a new category
    const newCategory = document.getElementById("newCategoryName").value;
    if (categories.some(category => category.categoryName === newCategory)) {// Check if the category name already exists
      toast.error("Category name already exists");
      return;
    }
    if (nameValidation(newCategory)) {// Validate the category name
      Swal.fire({
        title: "Are you sure you want to add this category?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      }).then((result) => {// If Confirmed, add the category
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post(
              "http://localhost:5000/api/owner/productServices/addNewCategory",
              {
                categoryName: newCategory,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res);
              toast.success("Category added successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Category could not be added");
            });
        } else {
          return;
        }
      });
    } else {
      toast.error("Invalid category name");
    }
  }
  const renameCategory = () => { // Function to rename a category
    const newCategoryName = document.getElementById("categoryNewName").value;
    
    if (categories.some(category => category.categoryName === newCategoryName)) { // Check if the category name already exists
      toast.error("Category name already exists");
      return;
    }
    if (!nameValidation(newCategoryName)) { // Validate the category name
      toast.error("Invalid category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This category name will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, rename it!",
      }).then((result) => { // If confirmed, rename the category
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post(
              "http://localhost:5000/api/owner/productServices/renameCategory",
              {
                categoryNewName: newCategoryName,
                categoryID: selectedCategory.categoryID,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res);
              toast.success("Category renamed successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Category could not be renamed");
            });
        } else {
          return;
        }
      });
    }
  };

  const renameSubCategory = () => { // Function to rename a sub-category
    const newSubCategoryName =
      document.getElementById("renameSubCategory").value;
      if (subCategories.some(subcategory => subcategory.subCategoryName === newSubCategoryName)) { // Check if the sub-category name already exists
        toast.error("Sub-Category name already exists");
        return;
      }

    if (!nameValidation(newSubCategoryName)) { // Validate the sub-category name
      toast.error("Invalid Sub-Category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This sub-category name will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, rename it!",
      }).then((result) => { // If confirmed, rename the sub-category
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post(
              "http://localhost:5000/api/owner/productServices/renameSubCategory",
              {
                subCategoryNewName: newSubCategoryName,
                subCategoryID: selectedSubCategory.subCategoryID,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res);
              toast.success("Sub-Category renamed successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Sub-Category could not be renamed");
            });
        }
      });
    }
  };

  const addNewSubCategory = () => { // Function to add a new sub-category
    const newSubCategoryName =
      document.getElementById("newSubCategoryName").value;
    if (subCategories.some(subcategory => subcategory.subCategoryName === newSubCategoryName)) {  // Check if the sub-category name already exists
        toast.error("Sub-Category name already exists");
        return;
      }
    if (!nameValidation(newSubCategoryName)) {  // Validate the sub-category name
      toast.error("Invalid Sub-Category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
      }).then((result) => { // If confirmed, add the sub-category
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post(
              "http://localhost:5000/api/owner/productServices/addNewSubCategory",
              {
                subCategoryName: newSubCategoryName,
                categoryID: selectedCategory.categoryID,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res);
              toast.success("Sub-Category added successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Sub-Category could not be added");
            });
        }
      });
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <InventoryNavBar selected="altercategories" />
      <SideNavbar selected="Inventory" />
      <h1 className="mt-3" style={{ marginLeft: "7%", marginTop: "1rem" }}>
        Alter Categories
      </h1>
      <Form>
        <MDBContainer fluid className="bg-white" style={{ height: "80vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="my-4" id="alterContainerCard">
                <MDBRow className="g-0">
                  <MDBCol md="6">
                    {/* Form to change category data */}
                    <MDBCard className="alterCatCard" id="alterCatCard1">
                    <MDBCardBody
                      className="text-black d-flex flex-column justify-content-centertext-black d-flex flex-column justify-content-center align-items-center"
                      style={{ width: "100%" }}
                    >
                      <MDBCol md="6" style={{ width: "100%"}}>
                        <Form.Label htmlFor="disabledSelect" >
                          <h4>Change category data</h4>
                        </Form.Label>
                        {/* Select category section */}
                        <Form.Select
                          id="categorySelect"
                          onChange={(e) => {
                            setSelectedCategory(
                              categories.find(
                                (category) =>
                                  category.categoryID ===
                                  parseInt(e.target.value)
                              )
                            );
                          }}
                          value={selectedCategory.categoryID}
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
                      <br />
                      <MDBCol md="6" style={{ width: "100%" }}>
                        <Form.Label className="alterCatFormLabel">Rename selected category</Form.Label>
                          {/* Text box to enter new category name */}
                        <Form.Control id="categoryNewName" type="text" placeholder="Enter new category name for selected category" />
                        <Form.Text className="text-muted"></Form.Text>
                        <br />
                        {/* Button to rename the category */}
                        <Button
                          className="alterCatCardBtn"
                          variant="dark"
                          type="button"
                          style={{ display: "flex", marginLeft: "auto" }}
                          onClick={renameCategory}
                        >
                          Change
                        </Button>
                      </MDBCol>
                      <br />

                      <MDBCol md="6" style={{ width: "100%" }}>
                        <MDBCard style={{ padding: "1rem" }}>
                          <Form.Label className="alterCatFormLabel">Add new category</Form.Label>
                          {/* Text box to enter new category name */}
                          <Form.Control id="newCategoryName" type="text" placeholder="Enter new category name"/>
                          <br />
                          {/* Button to add the new category */}
                          <Button
                            className="alterCatCardBtn"
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={addNewCategory}
                          >
                            Add
                          </Button>
                        </MDBCard>
                      </MDBCol>
                    </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  

                  <MDBCol md="6">
                    {/* Form to change sub-category data */}
                    <MDBCard className="alterCatCard" id="alterCatCard2">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h4>Change sub-category data</h4>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          {/* Select category and sub-category section */}
                          <Form.Label className="alterCatFormLabel">Select category</Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={(e) => {
                              setSelectedCategory(
                                categories.find(
                                  (category) =>
                                    category.categoryID ===
                                    parseInt(e.target.value)
                                )
                              );
                            }}
                            value={selectedCategory.categoryID}
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
                          {/* Select sub-category section */}
                          <Form.Label className="alterCatFormLabel">Select sub-category</Form.Label>
                          {subCategories.length > 0 ? (
                            <Form.Select
                              id="subCategorySelect"
                              onChange={(e) => {
                                setSelectedSubCategory(
                                  subCategories.find(
                                    (subCategory) =>
                                      subCategory.subCategoryID ===
                                      parseInt(e.target.value)
                                  )
                                );
                              }}
                              value={selectedSubCategory.subCategoryID}
                            >
                              {subCategories.map((subCategory) => (
                                <option
                                  key={subCategory.subCategoryID}
                                  value={subCategory.subCategoryID}
                                >
                                  {subCategory.subCategoryName}
                                </option>
                              ))}
                            </Form.Select>
                          ) : (
                            <p>No sub-categories available</p>
                          )}
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol>
                          {/* Text box to enter new sub-category name */}
                          <Form.Label className="alterCatFormLabel">Rename sub-category</Form.Label>
                          <Form.Control
                            id="renameSubCategory"
                            type="text"
                            placeholder="Enter new sub-category name for selected sub-category"
                            style={{ marginBottom: "1rem" }}
                          />
                          {/** Button to rename the sub-category */}
                          <Button
                            className="alterCatCardBtn"
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={renameSubCategory}
                          >
                            Rename
                          </Button>
                        </MDBCol>
                      </MDBRow>

                      <MDBCard
                        style={{
                          padding: "1rem",
                          marginLeft: "auto",
                          width: "100%",
                        }}
                      >
                        {/* Form to add a new sub-category */}
                        <Form.Label className="alterCatFormLabel">Add new Sub-Category</Form.Label>
                        <Form.Control id="newSubCategoryName" type="text" placeholder="Enter new sub-category name" />
                        <br />
                        {/* Button to add the new sub-category */}
                        <Button
                          className="alterCatCardBtn"
                          variant="dark"
                          type="button"
                          style={{ display: "flex", marginLeft: "auto" }}
                          onClick={addNewSubCategory}
                        >
                          Add
                        </Button>
                      </MDBCard>
                    </MDBCardBody>
                    </MDBCard>
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

export default AlterCategories;
