import { cartServiceEndpoint, addToCartEndpoint } from "../apiCalls";
import axios from "axios";

async function addProductToCart(productID, quantity = 1, unitPrice) {
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

async function getCart(customerID) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await axios.get(cartServiceEndpoint + "/getCart", {
    headers: {
      "x-access-token": accessToken,
    },
  });
  //console.log(response.data);
  return response.data;
}
async function changeDeliveryInfo(receiverName, mobile, address) {
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
  const response = await axios.delete(
    cartServiceEndpoint + "/removeCartItem",
    {
      data: { cartItemID: cartItemId },
      headers: {
        "x-access-token": accessToken,
      },
    }
  );
  console.log("hello world");
  console.log(response.data);
  return response.data;
}

async function CompletePayment(cartID, cardNumber, expiryDate, cvc) {
    const accessToken = localStorage.getItem("accessToken");
    console.log(cartID, cardNumber, expiryDate, cvc);
    const response = await axios.post(
      cartServiceEndpoint + "/checkout",
      {
        cartID: cartID,
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvc: cvc,
      },
      {
        headers: {
          "x-access-token": accessToken,
        },
      }
    )
    //console.log(response.data); 
    return response.data;
  }

export {
  addProductToCart,
  getCart,
  changeDeliveryInfo,
  changeCartItemQuantity,
  removeCartItem,
  CompletePayment,
};
