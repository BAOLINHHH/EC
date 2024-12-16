import React, { useState } from 'react'
import SidebarUser from './SidebarUser';
import { toast } from 'react-toastify';
import userApi from '../api/userApi';

import CircularProgress from '@mui/material/CircularProgress';
import UserPasswordToggle from '../componets/UserPasswordToggle';
import ChangePassword from '../componets/ChangePassword';
const ChangePasswordScreen = () => {

    return (
    
    <>
    <section>
        <div className="container">
        <div className=" flex gap-[60px] ">
                <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)]">
                    <SidebarUser/>
                </div>
                <div className=" border-solid border-[1px] rounded-[6px] w-full bg-[#fff] shadow-[1px_1px_7px_rgba(#00000029)]">
                    <ChangePassword/>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default ChangePasswordScreen