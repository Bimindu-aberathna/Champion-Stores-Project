import React, { useState, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

function LowStock() {
  const [items, setItems] = useState([]); // State variable to store the items in low stock

  useEffect(() => { // Function to get the list of low stock products
    axios.get("http://localhost:5000/api/owner/productServices/listLowStockProducts")
    .then((res) => {
      setItems(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);


  return (
    <>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginLeft: "7%",
            marginTop: "1rem",
            flex: "1",
          }}
        >
          <h1>Low Stock Items</h1>
          <div style={{ display: "flex", justifyContent: "flex-end" ,margin:'1rem'}}>
            {/*Table to display the low stock items*/}
          <Table striped bordered hover>
            <thead>
              {/*Table headers*/}
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Brand Name</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/*Table rows to display the low stock items*/}
              {items.map((product) => (
                <tr key={product.productID}>
                  <td>{product.productID}</td>
                  <td>{product.productName}</td>
                  <td>{product.brandName}</td>
                  <td>{product.currentStock}</td>
                  <td>{product.preorderLevel}</td>
                  <td>
                  {/*Button to redirect to the edit product page*/}
                  <Link to={`/editproduct/${product.productID}`} key={product.productID}>
                    <Button variant="dark" size="sm" style={{ backgroundColor: 'black' }}>Add Product</Button>
                  </Link>  
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        </div>
      </div>

      <SideNavbar selected="Low Stocks"/>
    </>
  );
}

export default LowStock;