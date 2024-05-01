import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { IoLogoHtml5 } from "react-icons/io";
import axios from "axios";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { nameValidation } from "../functionality/validation";

function AlterCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories")
      .then((res) => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]);
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategory.categoryID}`
      )
      .then((res) => {
        setSubCategories(res.data);
        setSelectedSubCategory(res.data[0]);
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory]);

  function addNewCategory() {
    const newCategory = document.getElementById("newCategoryName").value;
    if (nameValidation(newCategory)) {
      const confirm = window.confirm(
        "Are you sure you want to add this category?"
      );
      if (!confirm) {
        return;
      } else {
        axios
          .post("http://localhost:5000/api/owner/productServices/addNewCategory", {
            categoryName: newCategory,
          })
          .then((res) => {
            console.log(res);
            alert("Category added successfully");
          })
          .catch((err) => {
            console.log(err);
            alert("Category could not be added");
          });
      }
    } else {
      alert("Invalid category name");
    }
  }
  const renameCategory = () => {
    const newCategoryName = document.getElementById("categoryNewName").value;
    if (!nameValidation(newCategoryName)) {
      alert("Invalid category name");
      return;
    } else {
      const confirm = window.confirm(
        "Are you sure you want to rename this category?"
      );
      if (!confirm) {
        return;
      } else {
        axios
          .post("http://localhost:5000/api/owner/productServices/renameCategory", {
            categoryNewName: newCategoryName,
            categoryID: selectedCategory.categoryID,
          })
          .then((res) => {
            console.log(res);
            alert("Category renamed successfully");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            alert("Category could not be renamed");
          });
      }
    }
  };

  const renameSubCategory = () => {
    const newSubCategoryName = document.getElementById("renameSubCategory").value;
    if (!nameValidation(newSubCategoryName)) {
      alert("Invalid Sub-category name");
      return;
    } else {
      const confirm = window.confirm(
        "Are you sure you want to rename this Sub-category?"
      );
      if (!confirm) {
        return;
      } else {
        axios
          .post("http://localhost:5000/api/owner/productServices/renameSubCategory", {
            subCategoryNewName: newSubCategoryName,
            subCategoryID: selectedSubCategory.subCategoryID,
          })
          .then((res) => {
            console.log(res);
            alert("Sub-Category renamed successfully");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            alert("Sub-Category could not be renamed");
          });
      }
    }
  };

  const addNewSubCategory = () => {
    const newSubCategoryName = document.getElementById("newSubCategoryName").value;
    if(!nameValidation(newSubCategoryName)){
      alert("Invalid sub-category name");
      return;
    } else {
      const confirm = window.confirm(
        "Are you sure you want to add this sub-category?"
      );
      if (!confirm) {
        return;
      } else {
        axios
          .post("http://localhost:5000/api/owner/productServices/addNewSubCategory", {
            subCategoryName: newSubCategoryName,
            categoryID: selectedCategory.categoryID,
          })
          .then((res) => {
            console.log(res);
            alert("Sub-Category added successfully");
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
            alert("Sub-Category could not be added");
          });
        }
    }
  };

  return (
    <div>
      <Form>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="my-4">
              <h1 style={{margin:'1rem',marginLeft:'2rem'}}>Alter Categories</h1>
                <MDBRow className="g-0">
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-centertext-black d-flex flex-column justify-content-center align-items-center">
                      <MDBCol md="6">
                        <Form.Label htmlFor="disabledSelect">
                          <h5>Change category data</h5>
                        </Form.Label>
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
                      <MDBCol md="6">
                        <Form.Label>Rename selected category</Form.Label>

                        <Form.Control id="categoryNewName" type="text" />
                        <Form.Text className="text-muted"></Form.Text>
                        <br />
                        <Button
                          variant="dark"
                          type="button"
                          style={{ display: "flex", marginLeft: "auto" }}
                          onClick={renameCategory}
                        >
                          Change
                        </Button>
                      </MDBCol>
                      <br />

                      <MDBCol md="6">
                        <MDBCard style={{ padding: "1rem" }}>
                          <Form.Label>Add new category</Form.Label>
                          <Form.Control id="newCategoryName" type="text" />
                          <br />
                          <Button
                            variant="dark"
                            type="submit"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={addNewCategory}
                          >
                            Add
                          </Button>
                        </MDBCard>
                      </MDBCol>
                    </MDBCardBody>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h5>Change sub-category data</h5>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <h6>Rename sub-categories</h6>
                        <MDBCol md="6">
                          <Form.Label>Select category</Form.Label>
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
                          <Form.Label>Select sub-category</Form.Label>
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
                        <MDBCol md="6">
                          <Form.Label>New sub-category name</Form.Label>
                          <Form.Control id="renameSubCategory" 
                          type="text"
                          placeholder="Enter new sub-category name for selected sub-category"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>{"\n"}</Form.Label>
                          <Button
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={renameSubCategory}
                          >
                            Rename
                          </Button>
                        </MDBCol>
                      </MDBRow>

                        <MDBCard style={{ padding: "1rem", marginLeft:'auto', width:'100%'}}>
                          <Form.Label>Add new Sub-Category</Form.Label>
                          <Form.Control id="newSubCategoryName" type="text" />
                          <br />
                          <Button
                            variant="dark"
                            type="submit"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={addNewSubCategory}
                          >
                            Add
                          </Button>
                        </MDBCard> 
                     
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>
    </div>
  );
}

export default AlterCategories;
