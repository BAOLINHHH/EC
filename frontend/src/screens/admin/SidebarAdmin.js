import React, { useState } from 'react'
import { Link, NavLink,useNavigate } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';
import { sidebarAdminData } from '../../utils/sidebarAdminData';
import { IoIosLogOut } from "react-icons/io";
import { useSelector, useDispatch} from 'react-redux'; 
import { FaUser } from "react-icons/fa";
import images from '../../assets/indexImg'
import { removeToken } from '../../utils/authToken';
import { logout } from '../../slices/authSlice';
const SidebarAdmin = () => {
  const { userInfo} = useSelector ((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout =()=>{
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
    <div className=" border-r-[0.5px] border-solid ">
      <div className="flex flex-col items-center mb-3">
      <span className="relative left-[100px] cursor-pointer" onClick={handleLogout} ><IoIosLogOut size={20}/></span>
        <Avatar className='mb-3' src={images.imgAvatarShop} > </Avatar>
        <span className='mb-1'>{userInfo.email}</span>
        <span >{userInfo.name}</span>
      </div>
      <hr />
      <div className="pl-[15px] mt-[10px]">
        <ul>
          {sidebarAdminData.map((item, index) =>(
            <NavLink to = {item.path}  className="active-Admin" key={index}
            >
            <li className="flex mb-[15px] items-center hover:bg-[#dc4f36] hover:text-[#fff]  w-[190px] rounded-[5px] pl-4">
              <span>  {item.icon} </span>
              <span className="ml-[10px] text-[17px] cursor-pointer">{item.title}</span>
            </li>
            </NavLink>
          ))}
      </ul>
      </div>
    </div>    
    </>
  )
}

export default SidebarAdmin