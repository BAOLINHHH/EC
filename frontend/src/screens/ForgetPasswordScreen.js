import React, { useState, useEffect } from 'react'
import forgetPasswordImg from '../imageshome/ForgotPassword.jpg'
import CircularProgress from '@mui/material/CircularProgress';
import { FaEnvelope,FaLock,FaKey} from "react-icons/fa";
import UserPasswordToggle from '../componets/UserPasswordToggle';
import { TbPasswordUser } from "react-icons/tb";
import userApi from '../api/userApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import { AiFillBackward } from "react-icons/ai";
const ForgetPasswordScreen = () => {
    const [countdownTimer,setCountdownTimer] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [isLoadingLogin,setIsLoadingLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isVerifyOtp,setIsVerifyOtp ] = useState(false);
    const [ password, setPassword] = useState('');
    const [ confirmPassword, setconfirmPassword] = useState('');
    const [ newPasswordInputType,newPasswordToggleIcon] = UserPasswordToggle();
    const [ confirmPasswordInputType,confirmPasswordToggleIcon] = UserPasswordToggle();

    useEffect (() => {
        const timer = countdownTimer >0 && setInterval(() => setCountdownTimer(countdownTimer-1), 1000);
        return () => clearInterval(timer)
      }, [countdownTimer])
    
      const submitHandler = async(e)=>{
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Mật khẩu xác nhận chưa đúng.')
          }else{
            try {
                setIsLoadingLogin(true);
                const responseMessage = await userApi.resetPassword({
                    token: otp,
                    newPassword: password})
                
                toast.success(responseMessage.message);
                setIsLoadingLogin(false);           
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
                const responseMessage = await userApi.forgetWord({email});
                console.log(responseMessage)
                toast.success(responseMessage.message);
                setIsLoading(false);
                setIsVerifyOtp(true);
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

        <section className>
            <div className="container">
            <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12">
                <div className="card text-black" style={{borderRadius: '25px'}}>
                <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                    <div className="col-md-5">
                                    {/* <Link to= '/login'>
                                    <div className="flex items-center ">
                                        <AiFillBackward className="text-[#4226e2]"/>
                                        <p className="text-[15px] text-[#4226e2] ">Quay lại</p>
                                    </div>
                                    </Link>  */}
                                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">QUÊN MẬT KHẨU</p>    
                               
                                    <div className=" mb-4 px-md-4">
                                    <div className="input-group flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-envelope'><FaEnvelope/> </span>
                                        <input type="email" className="h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[386px] p-[10px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5] outline-none" aria-describedby="icon-envelope" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Địa chỉ email"/>
                                        <div className="input-group-text pb-1">
                                      
                                        {isLoading &&
                                        (
                                        <CircularProgress size={28} className="absolute right-[30px] z-[1]"/>
                                        )}
                                        <button className="text-[17px] text-[#313eed] relative"  disabled={isLoading} onClick={sendOtp}>Giữ otp</button>
                                        </div>                                      
                                    </div>
                                    <div className="flex justify-end mt-1 ">
                                        <span className=" text-[17px] mr-5 ">
                                            Thời gian hiện hiệu lực: <span className="text-[#313eed]"> {countdownTimer} </span>
                                        </span>
                                    </div>
                                </div>
                               {isVerifyOtp && (
                            <form className="px-md-4"  >
                            <div className="d-flex flex-row align-items-center mb-4">
                                    <div className="input-group flex-fill mb-0">
                                        <span className=' input-group-text' id= 'icon-envelope'><TbPasswordUser/> </span>
                                        <input type="text" className=" outline-none h-[37px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[460px] p-[10px] rounded-r-[5px] focus:ring-[#9b3bea] focus:border-[#3e3bd5]" aria-describedby="icon-envelope" value={otp} onChange={(e)=>setOtp(e.target.value)} placeholder="Mã Otp" />
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
                                
                                <div className="flex justify-center items-center">
                                    {isLoadingLogin &&
                                    (
                                        <CircularProgress size={35} className="absolute  z-[1]"/>
                                    )}
                                     <button  className="btn btn-primary btn-lg relative"  onClick={submitHandler} >Đặt lại</button>
                                </div>
                                </form>
                                )}
                            
                        
                       
                    </div>
                    <div className='col-md-2'></div>
                    <div className="col-md-5 d-flex align-items-center">
                        <img  src={forgetPasswordImg}
                        className="h-[500px]" alt="Register img" />
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

export default ForgetPasswordScreen