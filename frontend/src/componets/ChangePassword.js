import React, { useState } from 'react'
import { toast } from 'react-toastify';
import userApi from '../api/userApi';

import CircularProgress from '@mui/material/CircularProgress';
import UserPasswordToggle from '../componets/UserPasswordToggle';
const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordInputType,toggleIcon] = UserPasswordToggle();
    const [ newPasswordInputType,newPasswordToggleIcon] = UserPasswordToggle();
    const [ confirmPasswordInputType,confirmPasswordToggleIcon] = UserPasswordToggle();
    const submitHandler= async(e)=>{
        e.preventDefault()
        if(newPassword !== confirmPassword){
            toast.error("Mật khẩu xác nhận chưa đúng");
        }else{
            try {
                setIsLoading(true)
                const responseMessage = await userApi.ChangePassword({oldPassword, newPassword})
                setIsLoading(false);
                toast.success(responseMessage.message);
                
            } catch (error) {
                setIsLoading(false);
                toast.error(error?.response?.data.message)
            }
        }
    }
  return (
  <>
    <div className='w-full py-4'>
                            <h1 className="font-[600] text-[20px] p-[10px]">Đổi mật khẩu</h1>
                        </div>
                        <form>
                        <div className="px-3">
                            <div className='flex w-[700px] pb-3 gap-x-[20px]'>
                                <span className="w-[200px] p-[9px]  text-[17px] ">Mật khẩu hiện tại</span>
                                <div className="relative ">
                                    <input type={passwordInputType}  className=" h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-[400px] p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]  outline-none" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder="Mật khẩu hiện tại" />
                                    <span className="absolute top-[5px] left-[360px]">{toggleIcon} </span>
                                </div>
                            </div>
                            <div className='flex w-[700px] pb-3 gap-x-[20px] text-[17px] '>
                                <span className="w-[200px] p-[9px]">Mật khẩu mới</span>
                                <div className="relative">
                                    <input type= {newPasswordInputType} className="h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303] text-[17px] w-[400px] p-[10px] rounded-[5px] focus:!ring-[#9b3bea] focus:!border-[#3e3bd5] outline-none"  value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="Mật khẩu mới" />
                                    <span className="absolute top-[5px] left-[360px]">{newPasswordToggleIcon} </span>
                                </div>
                            </div>
                            <div className='flex w-[700px] gap-x-[20px] pb-3 text-[16px] '>
                                <span className="w-[200px] p-[9px] ">Xác nhận mật khẩu mới</span>
                                <div className="relative">
                                    <input type= {confirmPasswordInputType} className="h-[43px] border-[1px] border-[#32e9e9] outline-none border-solid text-[#0f0303] text-[17px] w-[400px] p-[10px] rounded-[5px] focus:!ring-[#9b3bea] focus:!border-[#3e3bd5]" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" />
                                    <span className="absolute top-[5px] left-[360px]">{confirmPasswordToggleIcon} </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-center pb-3 relative">
                            {isLoading &&
                            (
                            <CircularProgress size={28} className="absolute z-[1] top-[4px] " />
                            )}
                            <button className="btn btn-danger  " onClick={submitHandler}  disabled={isLoading}>Cập nhật</button>
                        </div>
                        
                        </form>
  </>
  )
}

export default ChangePassword