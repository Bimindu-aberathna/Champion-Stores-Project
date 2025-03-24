import React, { useState } from "react";
import { Link } from "react-router-dom";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { useNavigate } from "react-router-dom";
import "./SideNavbar.css";

function SideNavbar({ selected }) {
  const [open, setOpen] = useState(false);//State for opening and closing the side navbar
  const navigate = useNavigate();//Navigation hook for redirecting to another page

  const handleLogout = () => {//Function to handle the logout
    try {
      localStorage.removeItem("accessToken");//Remove the access token from local storage
    } catch (error) {
      console.log(error);
    }
    navigate("/", { replace: true });//Redirect to the login page
  };

  return (
    <div
      className="d-flex"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "20%",
        zIndex: open ? 999 : 1,
      }}
    >
      <div
        className={`h-screen bg-black position-relative`}
        style={{
          height: "100%",
          width: open ? "60%" : "20%",
          transition: "width 0.5s",
          zIndex: open ? 999 : 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
        }}
      >
        
        <div style={{ height: "15%" }}></div>
        {/*Icon for opening and closing the side navbar*/}
        <div
          style={{
            position: "absolute",
            width: "100%",
            color: "white",
            marginLeft: "75%",
            top: "5rem",
          }}
        >
          <ArrowCircleRightOutlinedIcon
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

        {open ? (
          <i className="bi bi-chevron-left"></i>
        ) : (
          <i className="bi bi-chevron-right"></i>
        )}

        <br />
        <ul
          className="pt-6"
          style={{
            marginTop: open ? "auto" : "5rem",
            height: "100%",
            paddingLeft: 0,
          }}
        >
          {/*All the options in the side navbar*/}
          {/*Transaction Option*/}
          <Link to="/transaction" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor: selected === "Transaction" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/credit-card-machine.png")}
                alt="profile"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Transaction</span>}
            </li>
          </Link>
          {/*Orders Option*/}
          <Link to="/orders" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor: selected === "Orders" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/logistics.png")}
                alt="profile"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Orders</span>}
            </li>
          </Link>
          {/*Inventory Option*/}
          <Link to="/inventory" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor: selected === "Inventory" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/checklists.png")}
                alt="profile"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Inventory</span>}
            </li>
          </Link>
          {/*Low Stocks Option*/}
          <Link to="/lowstock" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor: selected === "Low Stocks" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/delivery-cancelled.png")}
                alt="profile"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Low Stocks</span>}
            </li>
          </Link>
          {/*Reports Option*/}
          <Link to="/reports" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor: selected === "Reports" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/report.png")}
                alt="profile"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Reports</span>}
            </li>
          </Link>
          {/*Product Returns Option*/}
          <Link to="/productreturn" className="text-decoration-none text-white">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor:
                  selected === "Product Returns" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/return.png")}
                alt="Return"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && <span className="iconDescription">Product Returns</span>}
            </li>
          </Link>
          <li></li>
          <li></li>
          <li></li>
          {/*Logout Option*/}    
          <li
            className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
            style={{ backgroundColor: "#474747",borderRadius:"10px",margin:'5px',cursor:'pointer'  }}
            onClick={handleLogout}
          >
            <img
              src={require("../assets/logout.png")}
              alt="profile"
              className="navBarIcon"
              style={{ width: open ? "24%" : "90%" }}
            />
            {open && <span className="iconDescription">Log Out</span>}
          </li>
          {/*Account Settings Option*/}
          <Link
            to="/accountsettings"
            className="text-decoration-none text-white"
          >
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2  rounded-md mt-2"
              style={{
                backgroundColor:
                  selected === "AccountSettings" ? "#474747" : "",
              }}
            >
              <img
                src={require("../assets/user.png")}
                alt="Settings"
                className="navBarIcon"
                style={{ width: open ? "24%" : "90%" }}
              />
              {open && (
                <span className="iconDescription">Account Settings</span>
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
