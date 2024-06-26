import React from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
  MDBCarousel,
  MDBCarouselItem,
  MDBCarouselCaption,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState, useContext } from "react";
import { getProductDetails } from "../Services/productServices";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { addProductToCart } from "../Services/cartServices";
import {transformPrice} from "../Validation"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CartContext from "../Services/CartContext";
import "./ProductPage.css";

function ProductPage() {
  const productID = useParams().id;
  const [product, setProduct] = useState([]);
  const { updateCartSize } = useContext(CartContext); // Use cartSize from context
  const [quantity, setQuantity] = useState(1);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("logged") || false
  );


  useEffect(() => {
    getProductDetails(productID)
      .then((data) => {
        setProduct(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAddCart = () => {
    if (loggedIn) {
      console.log("Add to cart");
      addProductToCart(productID, quantity, product.unitPrice)
        .then((status) => {
          if (status === 200) {
            toast.success("Product added to cart!", {
              position: "top-right",
              autoClose: 3500,
            });
            updateCartSize();
          }
        })
        .catch((error) => {
          if (error.response.status === 402) {
            toast.error("Sesion time out. ", {
              position: "top-right",
              autoClose: 3500,
            });
            return;
          }
          console.log(error);
        });
    } else {
      toast.error("Please login to add to cart!", {
        position: "top-right",
        autoClose: 3500,
      });
    }
  };

  const handleQuantityChange = (value) => {
    if (value === "add") {
      if (quantity < 5) setQuantity(quantity + 1);
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col="10" md="6" className="productCarouselCol">
          <Carousel className="productCarousel">
            <div>
              <img src={product.image1} alt="Image 1" />
            </div>
            <div>
              {product.image2 === "null" ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                  alt="Image 2"
                />
              ) : (
                <img src={product.image2} alt="Image 2" />
              )}
            </div>
            <div>
              {product.image3 === "null" ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                  alt="Image 3"
                />
              ) : (
                <img src={product.image3} alt="Image 3" />
              )}
            </div>
          </Carousel>
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="productDataContainer">
            <div className="productNameDiv">{product.productName}</div>
            <div className="brand-category-div">
              <dev className="productBrandDiv">
                <p className="attributeLabel">Brand: </p>
                {product.brandName}
              </dev>
              <dev className="productCategoryDiv">
                <p className="attributeLabel">Category: </p>
                {product.subCategoryName}
              </dev>
            </div>
            <div className="productPriceDiv">
              <p className="attributeLabel">Price: Rs. {transformPrice(product.unitPrice)}</p>
            </div>
            <p className="attributeLabel">Quantity:</p>
            <div className="productQuantityDiv">
              <div
                className="changeQTY"
                onClick={() => handleQuantityChange("minus")}
              >
                <IoIosRemoveCircleOutline />
              </div>
              <div className="quantityInput">
                <MDBInput
                  type="number"
                  value={quantity}
                  disabled
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div
                className="changeQTY"
                onClick={() => handleQuantityChange("add")}
              >
                <IoIosAddCircleOutline />
              </div>
            </div>
            <div className="productButtonDiv">
              {product.currentStock >= 15 ? (
                <div className="addBtnContainer">
                <MDBBtn color="primary" onClick={handleAddCart}>
                  Add to Cart
                </MDBBtn>
                <p className="productStatus" style={{marginTop:'1rem'}}>In Stock</p>
                </div>
              ) : (
                <MDBBtn color="danger">Out of Stock</MDBBtn>
              )}
            </div>
            <div className="productDescriptionDiv">
              <p className="attributeLabel">Description:</p>
              <p>{product.details}</p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default ProductPage;
