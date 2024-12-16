import React, { useState } from 'react'
import {BsPerson ,BsReceipt,BsChevronDown, BsSuitHeart } from 'react-icons/bs';
import { IoIosLogOut } from "react-icons/io";
import{ AiOutlineEnvironment  } from "react-icons/ai";
import { TbHandClick, TbPasswordUser } from "react-icons/tb";
import {  NavLink,useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import {  useDispatch} from 'react-redux'; 
import {logout} from '../slices/authSlice';
import { RiCoupon2Fill } from "react-icons/ri";
import { removeToken } from '../utils/authToken';

const SidebarUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall]= useLogoutMutation();
    const logoutHandler =  () =>{
        try {
            removeToken()
            dispatch(logout())
            navigate('/login')
        } catch (err){
            console.log(err)
       }
    }
    
  return (
    <>
        <div className="border-solid border-[1px] rounded-[6px] bg-[#fff] ">
            <ul >
              
                {/* {submitOpen &&(
                    <ul>
                        <li className="flex items-center px-2">thong tin ca nhan</li>
                        <li className="flex items-center px-2" >dia chi</li>
                        <li className="flex items-center px-2">mat khau</li>
                    </ul>
                )} */}
                <li className="pb-2">
                    <NavLink to = '/favorite'  className="flex items-center active-User">
                        <BsSuitHeart className="mx-2"/>
                        <span className="text-[17px]"> Danh sách yêu thích</span>
                    {/* <BsChevronDown className="pl-1 cursor-pointer " onClick={()=>setSubmitOpen(!submitOpen)} /> */}
                    </NavLink>
                </li>
                <li className="py-2" >
                    <NavLink to = "/changepassword" className="flex items-center active-User"> 
                        <TbPasswordUser  className="mx-2"/>
                        <span  className="text-[17px]">Mật khẩu</span>
                    </NavLink>
                </li>
                <li className="py-2">
                    <NavLink to = "/address" className="flex items-center active-User">     
                    <AiOutlineEnvironment className="mx-2" />
                    <span className="text-[17px]"> Địa chỉ</span>
                    </NavLink>
                </li>

            
                <li  className="py-2">
                    <NavLink to = "/listorder"  className=" flex items-center active-User">
                        <BsReceipt className="mx-2"/>
                        <span className="text-[17px]"> Đơn hàng của tôi</span>
                    </NavLink>
                </li>
                <li  className="py-2">
                    <NavLink to = "/listebook"  className=" flex items-center active-User">
                        <BsReceipt className="mx-2"/>
                        <span className="text-[17px]"> Ebook của tôi</span>
                    </NavLink>
                </li>
                <li  className="py-2">
                    <NavLink to = "/coupon"  className=" flex items-center active-User">
                        <RiCoupon2Fill className="mx-2"/>
                        <span className="text-[17px]"> Vocher của tôi</span>
                    </NavLink>
                </li>
                <li onClick={(logoutHandler)} className=" flex items-center py-2 cursor-pointer"> 
                    <IoIosLogOut className="mx-2" />
                    <span className="text-[17px]"> Đăng xuất</span>
                </li>
               
            </ul>
        </div>
    </>
  )
}

export default SidebarUser