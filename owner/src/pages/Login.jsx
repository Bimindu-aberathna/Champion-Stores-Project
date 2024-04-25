import Button from 'react-bootstrap/Button';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
// import bcrypt from 'bcryptjs';
import { useRef } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  function handleLoginForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    axios.post('http://localhost:5000/api/owner/accountServices/login', { email, password })
      .then((res) => {
        console.log(res.data);
        console.log("Login Successful!");
        if(res.data.success === true){
          window.location.href = "/transaction";
        } else {
          alert('Login Failed!'); 
        }

      })
      .catch(error => {
        alert('Login Error!');
      });
}


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div id='form-div' style={{ display: 'flex', width: window.innerWidth < 768 ? '100%' : '50%', justifyContent: 'center', alignItems: 'center' }}>
        <Form style={{ width: '50%' }} onSubmit={handleLoginForm}>
          <h1>Business<br />Account</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" ref={emailInputRef} />
            <Form.Text className="text-muted">
              
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" ref={passwordInputRef} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="fogotPasswordLink">
              <a href='#'>Fogot password</a>
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button  variant="dark" type="submit" style={{width:'100%'}}>
              Login
            </Button>
          </div>
        </Form>
      </div>
      <div className="col-lg-6 d-none d-lg-block" style={{ position: 'relative', width: '50%', height: '100%' }}>
        <img src={require('../assets/store.png')} alt="owner" style={{ width: '100%', height: '100%' }} />
        <div className="image-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center' }}>
          WELCOME TO
          <h1><b>CHAMPIONS</b></h1>
          <h2>STORES</h2>
        </div> 
      </div>
    </div>
  );
}

export default Login;
