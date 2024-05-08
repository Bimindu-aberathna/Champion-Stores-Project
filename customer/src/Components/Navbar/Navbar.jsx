import React, { useEffect } from "react";
import { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import { MdOutlineShoppingCart } from "react-icons/md";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({ onSearch }) {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const customerName = localStorage.getItem("customerName") || "Customer";
  const itemCount = localStorage.getItem("itemCount") || 0;
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("logged") || false
  );

  const handleSearch = () => {
    onSearch(searchTerm);
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleLogOut = () => {
    localStorage.removeItem("logged");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerID");
    setLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar_logo">
        <Link to={"/"}>
          <img src={logo} alt="logo" style={{ width: "10rem" }} />
          </Link>
          <p>Welcome</p>
        </div>
        <div className="navbar_search">
          <FormControl sx={{ m: 1 }} variant="outlined" className="searchForm">
            <OutlinedInput
              id="outlined-adornment-weight"
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <CiSearch />
                </InputAdornment>
              }
              placeholder="Explore Products"
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </div>
        <ul className="navbar_menu">
          <Link to={"/"}>
          <li
            onClick={() => {
              setMenu("home");
              setSearchTerm("");
            }}
          >
            Home{menu === "home" ? <hr /> : null}
          </li>
          </Link>
          <Link to={"/"}>
          <li
            onClick={() => {
              setMenu("cosmetics");
              setSearchTerm("cosmetics");
              
            }}
          >
            Cosmetics{menu === "cosmetics" ? <hr /> : null}
          </li>
          </Link>
          <Link to={"/"}>
          <li
            onClick={() => {
              setMenu("toys");
              setSearchTerm("toys");
            }}
          >
            Toys{menu === "toys" ? <hr /> : null}
          </li>
          </Link>
        </ul>
        <div className="navbar_login_cart">
          {!loggedIn ? (
            <Link to={"/login"}>
              <button>Login</button>
            </Link>
          ) : (
            <button onClick={handleLogOut}>Log out</button>
          )}
          {loggedIn ? (
            <Link to={"/cart"}>
              {" "}
              <MdOutlineShoppingCart style={{ fontSize: "2rem" }} />
            </Link>
          ) : (
            <MdOutlineShoppingCart style={{ fontSize: "2rem" }} />
          )}
          <div className="navbar_cart_count">{itemCount}</div>
          {loggedIn ? (
            <Link to={"/profile"}>
            <div
              className="userAccount"
            >
              <p>
                <FaRegUser style={{ fontSize: "1.8rem", marginTop: "10px" }} />
              </p>
              <div>
                <p style={{ fontSize: "14px", marginBottom: "-2px" }}>Hello</p>
                <p style={{ fontWeight: "bold", marginBottom: "-2px" }}>
                  {customerName}
                </p>
              </div>
            </div>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
