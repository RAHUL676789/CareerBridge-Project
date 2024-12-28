import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/esm/Col';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../feature/users/CurrentUser';


const Login = () => {
  const [validated, setValidated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    username: "",
    password: ""
  })
  const URL = import.meta.env.VITE_BACKEND_URL;

  const hanleInputChange = (e) => {
    e.preventDefault();
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })

  }



  // handle login detail submit function
  const handleSubmit = async (event) => {

    try {

      const form = event.currentTarget;
      event.preventDefault();
      if (form.checkValidity() === false) {
        event.stopPropagation();
        setValidated(true);
        return false;

      }
      setValidated(true);

      const response = await fetch(`${URL}/CareerBridge/user/login`, {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata)
      });

      const result = await response.json();
      if (result.error) {
        toast.error(result.message);

        navigate("/login");
      }
      else {
        localStorage.setItem("userId", result.data._id);
        toast.success(result.message);

        dispatch(setCurrentUser(result.data));

        navigate("/");
      }
    } catch (e) {
      toast.error(e);
    }

  }
  return (
    <div className='container primary mt-2'>
      <div className='singupHeading'><h4>Login For CareerBridge !</h4></div>
      <div className='row justify-content-center primary mt-3 '>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className='col-lg-12 mb-4'>
            <Form.Group controlId='customContol01' as={Col} lg={12} className='col-12 mb-3' >
              <Form.Label>
                Username
              </Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Your Username'
                required
                value={formdata.username}
                onChange={hanleInputChange}
                name='username'
              >

              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                Username is a required field
              </Form.Control.Feedback>

            </Form.Group>


            <Form.Group controlId='customContol02' as={Col} lg={12} className='col-12 mb-3' >
              <Form.Label>
                Password
              </Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Your Password'
                required
                value={formdata.password}
                onChange={hanleInputChange}
                name="password"
              >

              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                password is a required field
              </Form.Control.Feedback>

            </Form.Group>
          </Row>
          <Row>
            <Button type='submit '>
              Login
            </Button>
          </Row>
          <Row className='col-lg-12'>
            <div className='flex justify-center items-center  col-lg-6 '>
              <Link to="/signup" className='text-decoration-none  ' lg={6}>New User? <span>Signup</span> </Link>
            </div>


          </Row>

        </Form>
      </div>
    </div>
  )
}

export default Login
