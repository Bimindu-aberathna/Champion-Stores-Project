import React, { useEffect, useState } from "react";
import { FiChevronsLeft } from "react-icons/fi";
import { BsFillCaretRightFill } from "react-icons/bs";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { LuPackagePlus } from "react-icons/lu";
import { RiAccountCircleFill } from "react-icons/ri";
import { TbPackageOff } from "react-icons/tb";
import { GrHistory } from "react-icons/gr";
import { Link } from "react-router-dom";

function SideNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="d-flex"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        zIndex: open ? "1000" : "100",
        overflowX: "hidden",
      }}
    >
      <div
        className={`h-screen bg-black position-relative`}
        style={{
          display: "flex",
          width: "100%",
          transform: `translateX(${open ? "0" : "20%"})`,
          transition: "transform 0.5s",
        }}
      >
        <FiChevronsLeft
          className={`position-absolute cursor-pointer rounded-circle start-0 border-2 border-dark`}
          style={{
            color: "white",
            top: "5rem",
            fontSize: "2rem",
            border: "1px solid #474747",
            borderRadius: "25px",
            backgroundColor: "snow",
            color:"#474747",
            transform: open ? "rotate(180deg)" : "none",

          }}
          onClick={() => setOpen(!open)}
        />
        <br />
        <ul className="d-flex flex-column justify-content-center">
          <Link to="/altercategories">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white"
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              <BiSolidCategoryAlt
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && (
                <span>
                  Alter
                  <br />
                  Category
                </span>
              )}
            </li>
          </Link>
          <Link to="/addProduct">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white"
              style={{ paddingTop: "1rem", cursor: "pointer" }}
            >
              <LuPackagePlus
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && (
                <span>
                  New
                  <br />
                  Product
                </span>
              )}
            </li>
          </Link>
          <Link to="/purchasehistory">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white"
              style={{ paddingTop: "1rem", cursor: "pointer" }}
            >
              <GrHistory className="w-12 h-12" style={{ fontSize: "36px" }} />
              &nbsp;&nbsp;
              {open && (
                <span>
                  Purchase
                  <br />
                  History
                </span>
              )}
            </li>
          </Link>
          <Link to="/listsuppliers">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white"
              style={{ paddingTop: "1rem", cursor: "pointer" }}
            >
              <RiAccountCircleFill
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && <span>Suppliers</span>}
            </li>
          </Link>
          <Link to="/handleexpiredproducts">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white"
              style={{ paddingTop: "1rem", cursor: "pointer" }}
            >
              <TbPackageOff
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && (
                <span>
                  Expired
                  <br />
                  Products
                </span>
              )}
            </li>
          </Link>
        </ul>
      </div>
      <div className=""></div>
    </div>
  );
}

export default SideNavbar;
