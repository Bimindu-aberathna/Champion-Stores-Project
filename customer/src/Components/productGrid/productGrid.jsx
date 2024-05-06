import * as React from "react";
import { useEffect,useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import FilterOptions from "../FilterOptions/FilterOptions";
import { getProducts } from "../Services/productServices";
import { Link } from "react-router-dom";
import "./productGrid.css";


const noImage =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

export default function ProductGrid({ searchTerm}) {
  const [products,setProducts] = useState([]);
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Filter products based on searchQuery
const filteredProducts = products.filter((product) =>
  product.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  product.categoryName?.toLowerCase().includes(searchTerm?.toLowerCase())
);




  return (
    <div>
      <FilterOptions />
      <Box sx={{ flexGrow: 1, p: 2 }} className="productBox">
        <Grid
          className="productGrid"
          container
          spacing={2}
          sx={{
            "--Grid-borderWidth": "1px",
            borderTop: "var(--Grid-borderWidth) ",
            borderLeft: "var(--Grid-borderWidth) ",
            borderColor: "divider",
            "& > div": {
              borderRight: "var(--Grid-borderWidth) ",
              borderBottom: "var(--Grid-borderWidth) ",
              borderColor: "divider",
            },
          }}
        >
          {filteredProducts.map((product) => (
            <Grid key={product.productID} item xs={12} sm={6} md={4} lg={2}>
              <div class="card">
                <img
                  src={product.image1}
                  className="card-img-top"
                  alt="Product"
                  
                />
                <div class="card-body">
                  <h6 class="card-productName">{product.productName}</h6>
                  <p class="card-productPrice">
                    <b>Rs. {product.unitPrice}.00</b>
                  </p>
                  <div className="card-button-status">
                  <Link to={`/product/${product.productID}`}>
                    <Button variant="contained">View</Button>
                  </Link>
                    {product.currentStock >= 10 ? (
                      <p style={{ color: "green" }}>Available</p>
                    ) : (
                      <p style={{ color: "red" }}>
                        Not
                        <br />
                        Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
