import { useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import imgregister from '../imageshome/imgregister.jpg'
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaKey, FaEnvelope} from "react-icons/fa";
import userApi from '../api/userApi';
import CircularProgress from '@mui/material/CircularProgress';
import { TbPasswordUser } from "react-icons/tb";
import UserPasswordToggle from '../componets/UserPasswordToggle';
import { setToken } from '../utils/authToken';
const RegisterScreen = () => {
    const [ name, setName] = useState('')
    const [ email, setEmail] = useState('')
    const [ password, setPassword] = useState('')
    const [ confirmPassword, setconfirmPassword] = useState('')
    
    const [otp, setOtp] = useState('');
    const [countdownTimer,setCountdownTimer] = useState('');
    
    const [isLoading,setIsLoading] = useState(false);
    const [isLoadingLogin,setIsLoadingLogin] = useState(false);
    const [ newPasswordInputType,newPasswordToggleIcon] = UserPasswordToggle();
    const [ confirmPasswordInputType,confirmPasswordToggleIcon] = UserPasswordToggle();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const [ register, {isLoading}] = useRegisterMutation();

    const { userInfo} = useSelector((state)=> state.auth);
    const {search} = useLocation();
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'
    
    useEffect (() => {
        const timer = countdownTimer >0 && setInterval(() => setCountdownTimer(countdownTimer-1), 1000);
        return () => clearInterval(timer)
      }, [countdownTimer])
    useEffect (() => {
        if(userInfo){
          navigate(redirect)
        }
      }, [userInfo,redirect, navigate])
    
    const submitHandler = async(e) =>{
          e.preventDefault()
          if(password !== confirmPassword){
            toast.error('Mật khẩu xác nhận chưa đúng.')
          }else{
            try {
                setIsLoadingLogin(true);
                const response = await userApi.registerUser({name,email,password,otp})
                const {message} = response;
                toast.success(message);
                setIsLoadingLogin(false);           
                delete response.message;
                setToken(response.token)
                dispatch(setCredentials({...response}));
                navigate(redirect);
              } catch (err){
                setIsLoadingLogin(false);
                toast.error(err?.response.data.message)
              }
          }
      }
   
      const sendOtp = async(e)=>{
        e.preventDefault()
        if(email){
            try {
                setIsLoading(true);
                const responseMessage = await userApi.sendOtp({email});
                toast.success(responseMessage.message);
                setIsLoading(false);
                setCountdownTimer(60);
            } catch (err) {
                setIsLoading(false);
                toast.error(err?.response.data.message)
            }
        }else{
            toast.error('Thông tin không dược để trống')
        }
        
      }
  return (
    
    <>
        <section>
        <div className="container">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12">
                <div className="card text-black" style={{borderRadius: '25px'}}>
                <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                    <div className="col-md-5">

                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng Kí</p>    
                                <form>
                                <div className=" mb-2 px-md-3">
                                    <div className="input-group flex-fill mb-0 ">
                                        <span className=' input-group-text' id= 'icon-envelope'><FaEnvelope/> </span>
                                        <input type="email" className="h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[386px] p-[10px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5] outline-none" aria-describedby="icon-envelope" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Địa chỉ email"/>
                                        <div className="input-group-text pb-1">
                                        {/* <span className="text-[17px] text-[#313eed] relative" type="button" onClick={()=>handleSendOtp(email)} disabled={isLoading}>
                                            Giữ otp
                                        </span> */}
                                        {isLoading &&
                                        (
                                        <CircularProgress size={28} className="absolute right-[53px] z-[1]"/>
                                        )}
                                        <button className="text-[17px] text-[#313eed]  relative" disabled={isLoading} onClick={sendOtp}>Gửi otp</button>
                                        </div>                                      
                                    </div>
                                    <div className="flex justify-end  w-[490px] mt-1">
                                        <span className=" text-[17px]  ">
                                            Thời gian hiện hiệu lực: <span className="text-[#313eed]"> {countdownTimer} </span>
                                        </span>
                                    </div>
                                </div>
                                </form>
                            <form className="px-md-4"  >
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <div className="input-group flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-envelope'><TbPasswordUser/> </span>
                                        <input type="text" className=" outline-none h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[460px] p-[10px] rounded-r-[5px] focus:ring-[#9b3bea] focus:border-[#3e3bd5]" aria-describedby="icon-envelope" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Mã Otp" />
                                    </div>
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4">
                                     <div className=" input-group flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-user'><FaUser /> </span>  
                                        <input type="text" className="outline-none h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[460px] p-[10px] rounded-r-[5px] focus:ring-[#9b3bea] focus:border-[#3e3bd5]" aria-describedby="icon-user" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên tài khoản" />
                                    </div>
                                </div>


                                <div className="d-flex flex-row align-items-center mb-4">
                                    <div className=" input-group form-outline flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-lock'><FaLock/> </span>
                                        <div className='relative'>
                                            <input type={newPasswordInputType} value={password} aria-describedby="icon-lock" onChange={(e) => setPassword(e.target.value)} className=" outline-none h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[460px] p-[10px] rounded-r-[5px] focus:ring-[#9b3bea] focus:border-[#3e3bd5] " placeholder="Mật khẩu" />
                                            <span className="absolute top-[5px] left-[428px]">{newPasswordToggleIcon} </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-row align-items-center mb-4">
                                    <div className="input-group flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-key'><FaKey/> </span>
                                        <div className="relative">
                                            <input type={confirmPasswordInputType} value={confirmPassword} aria-describedby="icon-key" className="outline-none h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[460px] p-[10px] rounded-r-[5px] focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) => setconfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu"/>
                                            <span className="absolute top-[5px] left-[428px]">{confirmPasswordToggleIcon}</span>
                                        </div>
                                    </div>
                                </div>

{/* <div className="form-check d-flex justify-content-center mb-5">
    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
    <label className="form-check-label" for="form2Example3">
    I agree all statements in <a href="#!">Terms of service</a>
    </label>
</div> */}                      
                                
                                <div className="flex justify-center items-center">
                                    {isLoadingLogin &&
                                    (
                                        <CircularProgress size={35} className="absolute  z-[1]"/>
                                    )}
                                     <button  className="btn btn-primary btn-lg relative"  onClick={submitHandler} disabled={isLoadingLogin}  >Đăng ký</button>
                                </div>
                                </form>
                        
                        <div className="d-flex justify-content-center">
                        <p className="small fw-bold   mt-2 pt-1 mb-0">Bạn đã có tài khoản? <Link  className ="text-[#5b26e2]" to={redirect ? `/login?redirect=${redirect}`:'/login' }> Đăng nhập </Link></p>
                        </div>
                    </div>
                    <div className='col-md-1'></div>
                    <div className="col-md-6 d-flex align-items-center">

                        <img src={imgregister}
                        className="img-fluid" alt="Register img" />

                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    </>
  )
}

export default RegisterScreen  