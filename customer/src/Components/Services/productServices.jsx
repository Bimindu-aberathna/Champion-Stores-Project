import { getProductsEndpoint } from "../apiCalls";
import { React, useState } from "react";
import axios from "axios";

const categories = [
  {
    id: 1,
    name: "cosmetics",
    subcategories: [
      {
        id: 1,
        name: "lipstick",
      },
      {
        id: 2,
        name: "eyeshadow",
      },
      {
        id: 3,
        name: "foundation",
      },
      {
        id: 4,
        name: "mascara",
      },
    ],
  },
  {
    id: 2,
    name: "toys",
    subcategories: [
      {
        id: 1,
        name: "action figures",
      },
      {
        id: 2,
        name: "dolls",
      },
      {
        id: 3,
        name: "legos",
      },
      {
        id: 4,
        name: "board games",
      },
    ],
  },
];

export const getProducts = async () => {
  const response = await axios.get(getProductsEndpoint);
  return response.data;
};

function getCategories() {
  const returnItems = categories.map((category) => {
    return { id: category.id, name: category.name };
  });
  return returnItems;
}

function getSubcategories(categoryId) {
  const category = categories.find((category) => category.id === categoryId);
  return category.subcategories.map((subcategory) => {
    return {
      id: subcategory.id,
      name: subcategory.name,
    };
  });
}
export { getCategories, getSubcategories };
