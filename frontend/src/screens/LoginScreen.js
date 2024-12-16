import { useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import loginimg from '../imageshome/loginimg.jpg'
import { BsFacebook } from "react-icons/bs";
import { BsGoogle } from "react-icons/bs";
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import userApi from '../api/userApi'
import { setToken } from '../utils/authToken';

const LoginScreen = () => {
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');
    const { userInfo} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    // useEffect (() => {
    //   if(userInfo){
    //     navigate(redirect)
    //   }
    // }, [userInfo,redirect, navigate])


    const submitHandler= async(e)=>{
      e.preventDefault()
      const dataLogin={email,password}
        try {
          const fetchLogin = await userApi.loginUser(dataLogin);
          if(!fetchLogin.isAdmin){
           
            navigate(redirect)
          } else {
    
            navigate('/admin/home')
          }
          setToken(fetchLogin.token)
          dispatch(setCredentials({...fetchLogin}));
        } catch (Error) {
          toast.error(Error?.response?.data?.message )
        }
      
      
          //     try {
    //       const res = await login({ email,password}).unwrap();
    //       dispatch(setCredentials({...res, }));
    //       navigate(redirect)
    //     } catch (err){
    //       console.log(err)
    //       toast.error(err?.data?.message || err.error)
    //     }

    }
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const [ login, {isLoading}] = useLoginMutation();
    // const { userInfo} = useSelector((state)=> state.auth);
    // const {search} = useLocation();
    // const sp = new URLSearchParams(search)
    // const redirect = sp.get('redirect') || '/'
    // useEffect (() => {
    //   if(userInfo){
    //     navigate(redirect)
    //   }
    // }, [userInfo,redirect, navigate])
    // const submitHandler = async(e) =>{
    //     e.preventDefault()
    //     try {
    //       const res = await login({ email,password}).unwrap();
    //       dispatch(setCredentials({...res,}));
    //       navigate(redirect)
    //     } catch (err){
    //       console.log(err)
    //       toast.error(err?.data?.message || err.error)
    //     }
    // }
  return (
    // <FormContainer>
    //     <h1>Đăng nhập</h1>
    //     <Form onSubmit>
    //         <Form.Group controlId='email' className='my-3'> 
    //             <Form.Label>email address</Form.Label>
    //             <Form.Control 
    //             type='email'
    //             placeholder='Enter email'
    //             value
    //             onChange>
    //             </Form.Control>
    //         </Form.Group>

    //         <Form.Group controlId='password' className='my-3'> 
    //             <Form.Label>password</Form.Label>
    //             <Form.Control 
    //             type='password'
    //             placeholder='Enter password'
    //             value
    //             onChange>
    //             </Form.Control>
    //         </Form.Group>
    //         <Button type='submit' variant='primary' className='my-3'>Đăng nhập</Button>
    //     </Form>
    //     <Row className='py-3'>
    //         <Col>
    //         khach hang moi?<Link to= '/register'>Đăng kí</Link>
    //         </Col>
    //     </Row>
    // </FormContainer>
   <>
   
   <section  style={{backgroundColor: 'white'}} className="vh-100">
  <div className="container-fluid h-custom">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-md-4">
        <img src={loginimg}
          className="img-fluid" alt="loginImg" style={{borderStyle: 'none'}}/>
      </div>
      <div className='col-md-2'></div>
      <div className="col-md-5">
        <form onSubmit={submitHandler} >
          {/* <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
            <p className="lead fw-normal mb-0 me-3">Đăng nhập bằng</p>
            <button type="button" className="btn btn-primary btn-floating mx-1">
              < BsFacebook/>
            </button>

            <button type="button" className="btn btn-primary btn-floating mx-1">
              <BsGoogle/>
            </button>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">HOẶC</p>
          </div> */}

          {/* <!-- Email input --> */}
          <div className="form-outline mb-4">
            <input type="email" id="email_field"  value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              placeholder="Nhập địa chỉ email" />
          </div>

          {/* <!-- Password input --> */}
          <div className="form-outline mb-3">
            <input type="password" id="password_field" value={password} onChange={(e) => setPassword(e.target.value)} className=" outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              placeholder="Nhập mật khẩu" />
          </div>

          <div className="d-flex justify-content-between align-items-center">
        <Link className="text-[#5b26e2]" to='/forgetpassword'> <p className="text-[17px]"> Quên mật khẩu </p> </Link>
            
          </div>

          <div className="text-center text-lg-start mt-4 pt-2">
            {/* <button type="submit" className="btn btn-primary btn-lg"
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}} disabled= {isLoading}>Đăng nhập
            </button> */}
            <button type="submit" className="btn btn-primary btn-lg"
              style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>Đăng nhập
            </button>
            
          </div>
          <p className="small fw-bold mt-2 pt-1 mb-0">Bạn chưa có tài khoản? <Link className="text-[#5b26e2]" to={redirect ? `/register?redirect=${redirect}`:'/register' }>Đăng ký</Link></p>
        </form>
      </div>
    </div>
  </div>
  </section>
   </>
  );
}

export default LoginScreen  