import { getProductsEndpoint,getProduceDetailsEndpoint,getCategoriesEndpoint } from "../apiCalls";
import { React, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const categories = [];

export const getProducts = async () => {
  const response = await axios.get(getProductsEndpoint);
  return response.data;
};

async function getCategories() {
  try {
    const response = await axios.get(getCategoriesEndpoint);
    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 2500,
    });
    throw error;
  }
}





function getSubcategories(categoryId) {
  return null;
}

async function getProductDetails(productId) {
  const response = await axios.get(getProduceDetailsEndpoint + "/" + productId);
  return response.data;
}


export { getCategories, getSubcategories,getProductDetails };