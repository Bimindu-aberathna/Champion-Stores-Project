import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import storeIMG from '../Assets/store.png';
import './Login.css';



function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => { 
        alert('Login Successful\nEmail: ' + email + '\nPassword: ' + password + '\nRedirecting to Home Page...');
    }

  return (
    <MDBContainer fluid className="p-3 my-5" id='loginPage'>

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone image" />
        </MDBCol>

        <MDBCol col='4' md='6' className='loginColumn'>
        <div className='loginFormDiv'>
            <div id='loginHeader'>
            <h1>Log in</h1>
            </div>
        <form className='loginForm' action='handleLogin'>
          <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" onChange={(e) => setEmail(e.target.value)}/>
          <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" onChange={(e) => setPassword(e.target.value)}/>


          <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <MDBBtn type='submit' onClick={handleLogin} rounded className="mb-4 w-100" size="lg" id='signInBtn'>Sign in</MDBBtn>
        </form>
          </div>  

        </MDBCol>

      </MDBRow>

    </MDBContainer>
  );
}

export default Login;