import React from 'react'
import { useState } from 'react';
import './Navbar.css'
import logo from '../Assets/logo.png'
import { MdOutlineShoppingCart } from "react-icons/md";

function Navbar() {
  const [menu, setMenu] = useState("home");
  return (
    <div className='navbar'>
      <div className='navbar_logo'>
        <img src={logo} alt='logo' style={{width:'10rem'}}/>
        <p>Welcome</p>
        <ul className='navbar_menu' >
          <li onClick={()=>{setMenu("home")}}>Home{menu==='home'?<hr/>:null}</li>
          <li onClick={()=>{setMenu("cosmetics")}}>Cosmetics{menu==='cosmetics'?<hr/>:null}</li>
          <li onClick={()=>{setMenu("toys")}}>Toys{menu==='toys'?<hr/>:null}</li>
          <li onClick={()=>{setMenu("about")}}>About us{menu==='about'?<hr/>:null}</li>
          <li onClick={()=>{setMenu("contact")}}>Contact{menu==='contact'?<hr/>:null}</li>
        </ul>  
        <div className='navbar_login_cart'>
          <button>Login</button>
          <MdOutlineShoppingCart style={{fontSize:'2rem'}}/>
          <div className="navbar_cart_count">0</div>
        </div>  
      </div>  
    </div>
  )
}

export default Navbar
