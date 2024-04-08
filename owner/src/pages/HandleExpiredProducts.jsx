
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { validateIntegers } from "../functionality/validation";

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





function HandleExpiredProducts() {

    const [categories, setCategories] = useState([]); 
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/getCategories").then((res) => {
          console.log(res.data);
          setCategories(res.data);
            setSelectedCategory(res.data[0]);
        }).catch((err) => {
            alert("Error fetching data");
        });
      }, []);  

      useEffect(() => {
        if (selectedCategory !== "") { 
            axios.get(`http://localhost:5000/getSubCategories/${selectedCategory.categoryID}`).then((res) => {
                setSubCategories(res.data);
                setSelectedSubCategory(res.data[0]);
            }).catch((err) => {
                alert("Error fetching data");
            });
        }
    }, [selectedCategory]); 

    useEffect(() => {
        if (selectedSubCategory !== "") { 
            axios.get(`http://localhost:5000/getProductsBySubCategory/${selectedSubCategory.subCategoryID}`).then((res) => {
                setProducts(res.data);
                setSelectedProduct(res.data[0]);
            }).catch((err) => {
                alert("Error fetching data");
            });
        }
    }, [selectedSubCategory]);
    
      
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = document.getElementById("productQuantity").value;
    const productID = selectedProduct.productID;
    if (!validateIntegers(quantity)) {
      alert("Invalid quantity");
      return;
    }else if(quantity<=0){
      alert("Quantity should be greater than 0");
      return;
    }else if(quantity>selectedProduct.currentStock){
        alert("Quantity should be less than current stock");
        return;
    }else{
    
    axios
      .post("http://localhost:5000/removeExpiredProducts", {
        productID: productID,
        quantity: quantity,
      })
      .then((res) => {
        console.log(res.data);
        alert("Expired products removed successfully");
      })
      .catch((err) => {
        alert("Error removing expired products");
      });
    }
  };

  return (
    <div>
     <Form onSubmit={handleSubmit}>
  <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
    <MDBRow className="d-flex justify-content-center align-items-center h-100">
      <MDBCol>
        <MDBCard className="my-4">
          <MDBRow className="g-0 justify-content-center"> {/* Added justify-content-center class here */}
            <MDBCol md="6">
              <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                <h3 className="mb-5 text-uppercase fw-bold">
                  Expired products
                </h3>

                <MDBRow style={{ marginBottom: "1rem" }}>
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
                  { subCategories.length > 0 ? (
                    <Form.Select
                          id="subCategorySelect"
                          onChange={(e) => {
                            setSelectedSubCategory(
                              subCategories.find(
                                (subcategory) =>
                                  subcategory.subCategoryID ===
                                  parseInt(e.target.value)
                              )
                            );
                          }}
                          value={selectedSubCategory.subCategoryID}
                        >
                          {subCategories.map((subcategory) => (
                            <option
                              key={subcategory.subCategoryID}
                              value={subcategory.subCategoryID}
                            >
                              {subcategory.subCategoryName}
                            </option>
                          ))}
                        </Form.Select>
                    ) : (
                        <Form.Select disabled>
                            <option>No sub-categories available</option>
                            setSelectedSubCategory("");
                        </Form.Select>
                        )}
                  </MDBCol>
                </MDBRow>
                <MDBRow style={{ marginBottom: "1rem" }}>
                  {/* <MDBCol md="6"> */}
                  <Form.Label>Select product</Form.Label>
                  { products.length > 0 ? (
                    <Form.Select
                          id="productSelect"
                          onChange={(e) => {
                            setSelectedProduct(
                              products.find(
                                (product) =>
                                  product.productID ===
                                  parseInt(e.target.value)
                              )
                            );
                          }}
                          value={selectedProduct.productID}
                        >
                          {products.map((product) => (
                            <option
                              key={product.productID}
                              value={product.productID}
                            >
                              {product.productName}
                            </option>
                          ))}
                        </Form.Select>
                    ) : (
                        <Form.Select disabled>
                            <option>No sub-categories available</option>
                            setSelectedSubCategory("");
                        </Form.Select>
                        )}
                  {/* </MDBCol> */}

                 
                </MDBRow>

                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  id="productQuantity"
                  type="number"
                  placeholder="number of expired units....."
                />

                <div className="d-flex justify-content-end pt-3">
                  <Button variant="outline-dark" type="reset">
                    Clear all
                  </Button>
                  &nbsp;
                  <Button
                    as="input"
                    variant="dark"
                    type="submit"
                    value="Remove items"
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

export default HandleExpiredProducts
