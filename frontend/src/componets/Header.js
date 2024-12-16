import { Link, useNavigate, NavLink } from 'react-router-dom';
import {Navbar,Nav,Container, NavDropdown} from 'react-bootstrap';
import { LinkContainer} from 'react-router-bootstrap'
import {BsCart,BsPerson ,BsSuitHeart } from 'react-icons/bs';
import logoBook from '../imageshome/pngwing.png'
import { useLogoutMutation } from '../slices/usersApiSlice';
import {logout} from '../slices/authSlice';
import SearchBox from './SearchBox';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { IoIosLogOut } from "react-icons/io";
import { useSelector, useDispatch} from 'react-redux'; 
import { useState } from 'react';
import { IoPersonOutline } from "react-icons/io5";
import { RiBillLine } from "react-icons/ri";
const Header = () => {
    const { cartItems} = useSelector((state) => state.cart );
   const { userInfo} = useSelector ((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [logoutApiCall]= useLogoutMutation();
//    const [anchorEl, setAnchorEl] = useState(null)
//    const open = '';
   const handleClick =(event) =>{
        navigate('/favorite')
        // setAnchorEl(event.currentTarget);
   };
//    const handleClose = () => {
//     setAnchorEl(null);
//   };
   const logoutHandler = async () =>{
    try {
        await logoutApiCall().unwrap()
        dispatch(logout())
        navigate('/login')
    } catch (err){
        console.log(err)
    
   }
}
  return (
    <header>
    <div className="container-sm">
          <div className="row align-items-sm-center">
       
                <div className="col-2 heard-logo">
                  {!userInfo || userInfo.isAdmin ===false ? (<Link to='/'>
                    <img className ="h-20" src={logoBook} alt='brand'/>
                  </Link>) : <></> }
{/* 
                  <Link to='/'>
                    <img className ="h-20" src={logoBook} alt='brand'/>
                  </Link> */}
              </div>
              <div className="col-6 serch-bar">
              {!userInfo || userInfo.isAdmin ===false ? ( <SearchBox/>) : <></> } 
              </div>
              <div className="col-4">
                  <div className="flex justify-content-end">    
                             {!userInfo  ? (

                            <>
                            <Link to = "/login">
                            <button className='text-[14px] text-[#fff] bg-[#592fd7] capitalize flex items-center p-[8px] gap-x-[6px] border-solid border-[1px] rounded-[6px] hover:shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]'>
                                <BsPerson size={20}/>
                                Đăng Nhập
                            </button>
                            </Link>
                            </> 
                        ) :  (
                            <>
                            {userInfo.isAdmin ===false ?(<> 
                                <div className="cart me-4">
                            <Link to = '/cart'>
                                
                              <Badge badgeContent={cartItems.length} color="primary">
                                <i className="text-[24px]"><BsCart/></i>
                              </Badge>
                            </Link>
                            </div>
                            <div className="order me-4">
                            <button
                                
                                onClick={handleClick}
                            >
                                <Avatar sx={{ width: 32, height: 32 }}><BsPerson /></Avatar>
                            </button>
                            </div>
                            </>):<> </>}
                            
                            </>
                        )
                            
                        }
                                        {/* comment lan 2 Admin Links */}
                  </div>
              </div>
          </div>

         
    </div>
    </header>
  )
}

export default Header