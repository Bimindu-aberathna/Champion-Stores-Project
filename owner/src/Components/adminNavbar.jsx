import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './adminNavbar.css';

import 'primeicons/primeicons.css';

function TextLinkExample() {
  return (
    <Navbar expand="lg" className="custom-navbar" id='navbar' style={{ position: 'fixed'}}>
      <img src={require('../assets/logo.png')} alt="Logo" style={{ width: '220px', height: 'auto', marginLeft:'20px'}} />
      <Container>
        <Navbar.Brand href="#home"> </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Add your Nav and NavDropdown components here */}
        </Navbar.Collapse>
      </Container>
      <span className="pi pi-user" style={{ color: 'white' ,fontSize: '2.5rem'}}></span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div className='user'>
        <div className='businessAccount'><b>Business</b></div>
        <div className='businessAccount'>Account</div>
      </div>
    </Navbar>
  );
}

export default TextLinkExample;
