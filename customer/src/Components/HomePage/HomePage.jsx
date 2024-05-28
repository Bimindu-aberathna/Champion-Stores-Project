import React, { useEffect, useState } from "react";
import FilterOptions from "../FilterOptions/FilterOptions";
import ProductGrid from "../productGrid/productGrid";

export default function HomePage({ searchTerm }) {
    const [minPrice, setMinPrice] = useState(0); //state for minimum price
    const [maxPrice, setMaxPrice] = useState(12000); //state for maximum price
    const [search, setSearch] = useState(""); //state for search

   
  
    return (
      <div>
        <FilterOptions //filter options component
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          search = {search}
          setSearch={setSearch}

        />
        <ProductGrid //product grid component
            searchTerm={searchTerm}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
    );
  }