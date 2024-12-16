import { FaHome, FaUsers,FaArchive,FaReceipt  } from "react-icons/fa";
import { RiCoupon2Fill } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import {  TbPasswordUser } from "react-icons/tb";
import { BsFillWrenchAdjustableCircleFill, BsMinecartLoaded } from "react-icons/bs";
export const sidebarAdminData=[


    {
        title: 'Trang chủ',
        icon: <FaHome/>,
        path: '/admin/home',
    },
    {
        title: 'Quản lý Users',
        icon: <FaUsers/>,
        path: '/admin/userlist',
    },
    {
        title: 'Quản lý đơn hàng',
        icon: <BsMinecartLoaded/>,
        path: '/admin/orderlist',
    },
    {
        title: 'Quản lý sản phẩm',
        icon: <BsFillWrenchAdjustableCircleFill  />,
        path: '/admin/productlist',
    },
    {
        title: 'Quản lý danh mục',
        icon: <FaArchive/>,
        path: '/admin/Categorylist',
    },

     {
        title: 'Quản lý Coupon',
        icon: <RiCoupon2Fill/>,
        path: '/admin/coupon',
    },
    {
        title: 'Mật khẩu ',
        icon: <TbPasswordUser/>,
        path: '/admin/changePassword',
    },

   
]