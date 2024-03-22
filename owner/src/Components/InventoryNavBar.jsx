import React, { useState } from "react";
import { FiChevronsRight } from "react-icons/fi";
import { BsFillCaretRightFill } from "react-icons/bs";
import { BsCardText } from "react-icons/bs";

function SideNavbar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="d-flex" style={{ position: "fixed", top: 0, right: 0, height: '100%' }}>
      <div className={`w-${open ? '65' : '22'} duration-300 h-screen bg-black position-relative`} style={{display:'flex'}} >
        <FiChevronsRight
          className={`position-absolute cursor-pointer rounded-circle start-0  border-2 border-dark ${!open && "rotate-180"}`}
          style={{ color: 'white', fontSize: '30px', backgroundColor: 'black',top:'5rem' }}
          onClick={() => setOpen(!open)}
        />
        <br />
        <ul className="pt-6 d-flex flex-column justify-content-center">
          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white" style={{ paddingTop: '1rem', cursor:'pointer' }}>
            <BsFillCaretRightFill className="w-12 h-12" />&nbsp;&nbsp;
            {open && <span>Alter<br />Category</span>}
          </li>
          <li className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 border-top border-bottom border-white" style={{ paddingTop: '1rem' ,cursor:'pointer'}}>
            <BsCardText className="w-12 h-12" />&nbsp;&nbsp;
            {open && <span>New<br />Product</span>}
          </li>
        </ul>
      </div>
      <div className=""></div>
    </div>
  );
}

export default SideNavbar;
