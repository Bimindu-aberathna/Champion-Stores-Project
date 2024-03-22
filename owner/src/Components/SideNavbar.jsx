import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDroprightCircle } from "react-icons/io";

function SideNavbar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="d-flex"
      style={{ position: "fixed", top: 0, left: 0, height: "100%" }}
    >
      <div
        className={`w-${
          open ? "65" : "22"
        } duration-300 h-screen bg-black position-relative`}
        style={{ height: "100%" }}
      >
        {open && (
          <img
            src={require("../assets/logo.png")}
            alt="profile"
            style={{ width: "auto", height: "10%", display: "flex" }}
          />
        )}
        
        <div
          style={{
            position: "absolute",
            width: "100%",
            color: "white",
            marginLeft: "75%",
            top:'5rem',
          }}
        >
          <IoIosArrowDroprightCircle style={{ fontSize: "2rem" ,border: "1px solid black",borderRadius:'25px'}} onClick={() => setOpen(!open)}/>
        </div>

        {open ? (
          <i className="bi bi-chevron-left"></i>
        ) : (
          <i className="bi bi-chevron-right"></i>
        )}

        <br />
        <ul className="pt-6">
          <Link to="/" className="text-decoration-none text-white">
            <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
              <img
                src={require("../assets/credit-card-machine.png")}
                alt="profile"
                className="w-10 h-10"
              />
              {open && <span>Transaction</span>}
            </li>
          </Link>
          <Link to="/orders" className="text-decoration-none text-white">
            <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
              <img
                src={require("../assets/logistics.png")}
                alt="profile"
                className="w-10 h-10"
              />
              {open && <span>Orders</span>}
            </li>
          </Link>
          <Link to="/inventory" className="text-decoration-none text-white">
            <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
              <img
                src={require("../assets/checklists.png")}
                alt="profile"
                className="w-10 h-10"
              />
              {open && <span>Inventory</span>}
            </li>
          </Link>
          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
            <img
              src={require("../assets/delivery-cancelled.png")}
              alt="profile"
              className="w-10 h-10"
            />
            {open && <span>Low Stocks</span>}
          </li>
          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
            <img
              src={require("../assets/report.png")}
              alt="profile"
              className="w-10 h-10"
            />
            {open && <span>Reports</span>}
          </li>
          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2">
            <img
              src={require("../assets/return.png")}
              alt="profile"
              className="w-10 h-10"
            />
            {open && <span>Product Returns</span>}
          </li>

          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-5">
            <img
              src={require("../assets/logout.png")}
              alt="profile"
              className="w-8 h-8"
            />
            {open && <span>Log Out</span>}
          </li>
        </ul>
      </div>
      <div className=""></div>
    </div>
  );
}

export default SideNavbar;
