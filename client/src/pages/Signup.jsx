import React,{useState} from 'react'
import Form from "react-bootstrap/Form";
import Col from 'react-bootstrap/esm/Col';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row"
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Component/Loader';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../feature/users/CurrentUser';




const Signup = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
    const [validated,setValidated] = useState(false);
    const[loading,setLoading] =useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector((state)=>state.currentUser);
    const [formdata,setFormData] = useState({
      username:"",
      email:"",
      password:"",
      profession:"",
      charge:null,
      education:""
    })
    const navigate  = useNavigate();


    const handlInputChange = (e)=>{
              e.preventDefault();
              setFormData((prev)=>{
                return {
                  ...prev,[e.target.name]:e.target.value
                }
              })
    }
 
  


    // handling signup detail submit

    const handleSubmit = async(event)=>{
        try{
          
          const form = event.currentTarget;
          event.preventDefault();
          if(form.checkValidity() === false){
             event.stopPropagation();
             setValidated(true);
             return false;
            
          }

          
          setValidated(true);
         
          console.log(formdata);
          setLoading(true)
          const response = await fetch(`${URL}/CareerBridge/user/signup`,{
           method:"post",
            credentials: "include",
            mode: "cors",
            headers: {
             "Content-Type": "application/json",
         },
           body:JSON.stringify(formdata)
          });
 
          const result = await response.json();
          console.log("thisiis the signup result",result);
 
         
          if(result.error){
              toast.error(result.message);
                setLoading(false);
              navigate("/signup")
          }else{
           localStorage.setItem("userId",result.data._id);
           dispatch(setCurrentUser(result.data));
           toast.success(result.message);
           setLoading(false);
           navigate("/")
          }
        }catch(e){
          toast.error(e.message || "unexpected error")
          setLoading(false);
        }
      
         
    }

  
    
  return (
    <div className='container mt-5  flex justify-center items-center  '>
   {loading && 
      <Loader />
     }
     
      <div className='singupHeading text-primary  '><h4>SignUp For CareerBridge !</h4></div>
      
      <div className='row justify-content-center primary position-relative '>
    
        <Form noValidate validated={validated} onSubmit={handleSubmit} >
          <Row className='col-lg-12 mb-4'>
            <Form.Group controlId='validationCustom01' as={Col} lg={6} className='col-12 mb-3'>
              <Form.Label >Username</Form.Label>
              <Form.Control
                type='text'
                required
                placeholder='Enter Your Name'
                name='username'
                value={formdata.username}
                onChange={handlInputChange}
                
               >
                  
              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                Username is a required field
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='validationCustom02' as={Col} lg={6} className='col-12 mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                required
                placeholder='Enter Your Email'
                name='email'
                value={formdata.email}
                onChange={handlInputChange}
                >
                  
              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                Email is a required field
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='validationCustom03' as={Col} lg={6} className='col-12 mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                required
                placeholder='Create A Password'
                name='password'
                value={formdata.password}
                onChange={handlInputChange}
                minLength={4}
                >
              </Form.Control>
              <Form.Control.Feedback type='invalid'>
                Password is a required field
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='validationCustom04' as={Col} lg={6} className='col-12 mb-3'>
            <Form.Label>Profession</Form.Label>
            <Form.Control
              type='text'
              required
              placeholder='Choose Your Profession Or Type'
              list='professionList'
              name='profession'
              value={formdata.profession}
              onChange={handlInputChange} 
            />
            <Form.Control.Feedback type='invalid'>
              Profession is a required field
            </Form.Control.Feedback>

            {/* Datalist with profession options */}
            <datalist id='professionList'>
              <option value='Doctor' />
              <option value='Engineer' />
              <option value='Teacher' />
              <option value='Designer' />
              <option value='Developer' />
              <option value='Artist' />
              <option value='Manager' />
            </datalist>
          </Form.Group>

          <Form.Group controlId='validationCustom05' as={Col} lg={6} className='col-12 mb-3'>
            <Form.Label>Charges</Form.Label>
            <Form.Control
              type='number'
              required
              placeholder='Set Your Charges For Per min'
              
              name='charge'
              value={formdata.charge}
              onChange={handlInputChange} 
            />
            </Form.Group>
             <Form.Group controlId='validationCustom06' as={Col} lg={6} className='col-12 mb-3'>
            <Form.Label>Education</Form.Label>
            <Form.Control
              type='text'
              required
              placeholder='Please Enter Your College Name'
             
              name='education'
              value={formdata.education}
              onChange={handlInputChange} 
            />
            </Form.Group>

          </Row>

         
         

          <Row className='col-lg-12'>
           
              <Button type='submit' className='bg-primary'  lg={12}>SignUp</Button>
         
          </Row>
         <Row className='col-lg-12'>
         <div className='flex justify-center items-center  col-lg-6 '>
            <Link to="/login" className='text-decoration-none  ' lg={6}>Already A User? <span>Login</span> </Link>
          </div>
         
         
         </Row>
        </Form>

  </div>
    {loading && <Loader/> }
</div>

  )
}

export default Signup
