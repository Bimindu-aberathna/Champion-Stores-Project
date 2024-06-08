import React, { useEffect, useState } from "react";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import RestoreIcon from '@mui/icons-material/Restore';
import SchemaIcon from '@mui/icons-material/Schema';
import { Link } from "react-router-dom";
import "./InventoryNavBar.css";

function SideNavbar({ selected }) {
  const [open, setOpen] = useState(false);//State for opening and closing the side navbar

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
        {/*ICon for opening and closing the side navbar*/}
        <div
          style={{
            color: "white",
            top: "5rem",
            position: "absolute",
            marginLeft: open ? "15px" : "-15px",
          }}
        >
          <ArrowCircleLeftOutlinedIcon
            style={{
              fontSize: "2rem",
              border: "1px solid black",
              borderRadius: "25px",
              zIndex: 1000,
              backgroundColor: "#474747",
              transform: open ? "rotate(180deg)" : "none",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
          />
        </div>

        <br />
        <ul
          className="d-flex flex-column justify-content-center"
          id="optionList"
        >
          {/*All the options in the side navbar*/}
          <Link to="/altercategories">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor:
                  selected === "altercategories" ? "#474747" : "",
              }}
            >
              <SchemaIcon
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
          {/*Add Product option*/}
          <Link to="/addProduct">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor: selected === "addProduct" ? "#474747" : "",
              }}
            >
              <AddBoxIcon
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
          {/*Purchase History option*/}
          <Link to="/purchasehistory">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor:
                  selected === "purchasehistory" ? "#474747" : "",
              }}
            >
              <RestoreIcon
               className="w-12 h-12" style={{ fontSize: "36px" }} />
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
          {/*Suppliers option*/}
          <Link to="/listsuppliers">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor: selected === "listsuppliers" ? "#474747" : "",
              }}
            >
              <AssignmentIndIcon
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && <span>Suppliers</span>}
            </li>
          </Link>
          {/*Expired Products option*/}
          <Link to="/handleexpiredproducts">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor:
                  selected === "handleexpiredproducts" ? "#474747" : "",
              }}
            >
              <RestoreFromTrashIcon
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
