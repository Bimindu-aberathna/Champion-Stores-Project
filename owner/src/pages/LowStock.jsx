import React, { useState, useRef, useEffect } from "react";
import SideNavbar from "../Components/SideNavbar";
import { Button, Table } from "react-bootstrap";

const productData = [
  {
    productID: 1,
    productName: "Carrot face wash-100ml",
    brandName: "Nature's Secrets",
    currentStock: 15,
    reorderLevel: 18,
  },
  {
    productID: 2,
    productName: "Aloe Vera Gel-200ml",
    brandName: "Reebonn",
    currentStock: 10,
    reorderLevel: 20,
  },
  {
    productID: 3,
    productName: "Tea Tree Oil-30ml",
    brandName: "Link Natural",
    currentStock: 4,
    reorderLevel: 10,
  },
  {
    productID: 4,
    productName: "Coconut Hair Oil-100ml",
    brandName: "Kumarika",
    currentStock: 10,
    reorderLevel: 12,
  },
  {
    productID: 5,
    productName: "Lemon Face Wash-150ml",
    brandName: "Ponti",
    currentStock: 20,
    reorderLevel: 25,
  },
  {
    productID: 6,
    productName: "Rose Water-200ml",
    brandName: "Bare Nature",
    currentStock: 17,
    reorderLevel: 15,
  },
  {
    productID: 7,
    productName: "Cucumber Toner-100ml",
    brandName: "Dove",
    currentStock: 18,
    reorderLevel: 20,
  },
  // Add more items to other orders...
];

function LowStock() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const filteredItems = productData.filter(product => product.currentStock <= product.reorderLevel);
    setItems(filteredItems);
  }, [productData]);

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
          <Table striped bordered hover>
            <thead>
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
              {items.map((product) => (
                <tr key={product.productID}>
                  <td>{product.productID}</td>
                  <td>{product.productName}</td>
                  <td>{product.brandName}</td>
                  <td>{product.currentStock}</td>
                  <td>{product.reorderLevel}</td>
                  <td>
                    <Button variant="dark" size="sm" style={{ backgroundColor: 'black' }}>Add Product</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        </div>
      </div>

      <SideNavbar />
    </>
  );
}

export default LowStock;