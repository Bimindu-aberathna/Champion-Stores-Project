import { cartServiceEndpoint, addToCartEndpoint } from "../apiCalls";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

async function addProductToCart(productID, quantity = 1, unitPrice) {//add product to cart
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.post(
    addToCartEndpoint,
    { productID: productID, quantity: quantity, unitPrice: unitPrice },
    {
      headers: {
        "x-access-token": accessToken,
      },
    }
  );

  return response.status;
}

async function getCart() {//get cart details, including products,if any
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(cartServiceEndpoint + "/getCart", {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error("Error fetching cart details:", error);
    throw error;
  }
  <ToastContainer />;
}



async function changeDeliveryInfo(receiverName, mobile, address) {//change delivery info of cart receiver
  const accessToken = localStorage.getItem("accessToken");
  const response = await axios.post(
    cartServiceEndpoint + "/changeDeliveryInfo",
    { receiverName: receiverName, mobile: mobile, address: address },
    {
      headers: {
        "x-access-token": accessToken,
      },
    }
  );
  return response.data;
}

function changeCartItemQuantity(cardItemID, quantity) {
  const accessToken = localStorage.getItem("accessToken");
  return axios
    .put(
      cartServiceEndpoint + "/changeCartItemQuantity",
      { cartItem: cardItemID, quantity: quantity },
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    )
    .then((response) => {
      //console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error; // Rethrow the error to be caught in the calling function
    });
}
async function removeCartItem(cartItemId) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await axios.delete(cartServiceEndpoint + "/removeCartItem", {
    data: { cartItemID: cartItemId },
    headers: {
      "x-access-token": accessToken,
    },
  });
  return response.data;
}

async function CompletePayment(deliveryCharge) {
  const accessToken = localStorage.getItem("accessToken");
  const response = await axios.post(
    cartServiceEndpoint + "/checkout",
    {
      deliveryCharge: deliveryCharge,
    },
    {
      headers: {
        "x-access-token": accessToken,
      },
    }
  );
  //console.log(response.data);
  return response.data;
}

async function getReceiverDetails() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(cartServiceEndpoint + "/getReceiverDetails", {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error("Error fetching receiver details:", error);
    throw error;
  }
}

export {
  addProductToCart,
  getCart,
  changeDeliveryInfo,
  changeCartItemQuantity,
  removeCartItem,
  CompletePayment,
  getReceiverDetails,
};
