import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div id='form-div' style={{ display: 'flex', width: window.innerWidth < 768 ? '100%' : '50%', justifyContent: 'center', alignItems: 'center' }}>
        <Form style={{ width: '50%' }}>
          <h1>Business<br />Account</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button  variant="dark" type="submit" style={{width:'100%'}}>
              Submit
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
