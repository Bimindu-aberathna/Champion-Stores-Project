import React, { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import { MdOutlineShoppingCart } from "react-icons/md";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar_logo">
          <img src={logo} alt="logo" style={{ width: "10rem" }} />
          <p>Welcome</p>

          <div className="navbar_search">
            <FormControl
              sx={{ m: 1 }}
              variant="outlined"
              className="searchForm"
            >
              <OutlinedInput
                id="outlined-adornment-weight"
                className="searchInput"
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
              <Button variant="contained" className="searchButton">
                Search
              </Button>
            </FormControl>
          </div>

          <ul className="navbar_menu">
            <li
              onClick={() => {
                setMenu("home");
              }}
            >
              Home{menu === "home" ? <hr /> : null}
            </li>
            <li
              onClick={() => {
                setMenu("cosmetics");
              }}
            >
              Cosmetics{menu === "cosmetics" ? <hr /> : null}
            </li>
            <li
              onClick={() => {
                setMenu("toys");
              }}
            >
              Toys{menu === "toys" ? <hr /> : null}
            </li>
          </ul>
          <div className="navbar_login_cart">
            <button>Login</button>
            <MdOutlineShoppingCart style={{ fontSize: "2rem" }} />
            <div className="navbar_cart_count">0</div>
          </div>
          <div className="mobile-menu" onClick={toggleMobileMenu}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7H26"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 15H26"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 23H26"
                stroke="#171717"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
