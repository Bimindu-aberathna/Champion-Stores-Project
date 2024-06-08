// SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ items, onItemSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");//State for search term
  const [searchResults, setSearchResults] = useState([]);//State for search results
  const listRef = useRef(null);//Reference for the list of search results

  const handleChange = (event) => {//Function to handle the change in the search bar
    setSearchTerm(event.target.value);
    // Filter items based on search term
    const results = items.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);//Set the search results
  };

  const handleClickOutside = (event) => {//Function to handle the click outside the search results
    if (listRef.current && !listRef.current.contains(event.target)) {
      setSearchResults([]); // Clear search results when clicked outside the list
    }
  };

  const handleItemSelect = (item) => {//Function to handle the selection of an item
    onItemSelect(item); // Pass the selected item to the parent component
    setSearchResults([]); // Clear search results after selecting an item
  };

  useEffect(() => {//Use effect to add an event listener for click outside the search results
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "absolute",width:'50%'}}>
      {/* Search bar */}
      <InputGroup className="mb-3">
        <Form.Control
          aria-label="Amount (to the nearest dollar)"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleChange}
          style={{ borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px" }}
        />
        <InputGroup.Text style={{ backgroundColor: "black",borderTopRightRadius: "25px", borderBottomRightRadius: "25px"  }}>
          <SearchIcon style={{ color: "snow" }} />
        </InputGroup.Text>
      </InputGroup>
      {/* Search results */}
      <div ref={listRef}>
        <ul style={{ listStyleType: "none", backgroundColor: "white" }}>
          {searchResults.map((item) => (
            <li
              key={item.productID}
              onMouseOver={(event) => {
                event.target.style.backgroundColor = "#636363";
                event.target.style.color = "white";
              }}
              onMouseOut={(event) => {
                event.target.style.backgroundColor = "";
                event.target.style.color = "";
              }}
              onClick={() => handleItemSelect(item)} 
            >
              {item.productName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
