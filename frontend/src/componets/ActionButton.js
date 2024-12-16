import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import favoriteApi from '../api/favoriteApi';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
const ActionButton = ({props}) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [isinFavorite, setIsinFavorite] = useState('');
  useEffect (() => {
    if(userInfo){
      flechDataFavorite();
    }
},[userInfo]);
  const flechDataFavorite =async()=>{
    const response = await favoriteApi.checkFavorite(props?._id);
    setIsinFavorite(response.isInWishlist)
  }
  const handlogin =()=>{
    toast.info("Đăng nhập để thêm sản phẩm yêu thích");
    navigate('/login');
  }
  const removeFavoriteHandler = async()=>{
    try {
      await favoriteApi.deleteFavorite(props?._id);
      flechDataFavorite();
      toast.success('Xóa sản phẩm yêu thích thành công');
    } catch (error) {
      console.log(error)
      toast.error('Xóa sản phẩm yêu thích thất bại');
    }
  }
  const addToFavoriteHandler = async()=>{
    try {
      await favoriteApi.addFavorite(props._id);
      flechDataFavorite();
      toast.success('Thêm sản phẩm yêu thích thành công');
    } catch (error) {
      console.log(error)
      toast.error('Thêm sản phẩm yêu thích thất bại');
    } 
  }
  
  return (  
  <>
     {
      !userInfo ? (  
         <>
        <button className='bg-[#fff]  text-[#44c2c0] transition-all duration-[0.3s] ease-in-out  hover:text-[#d91612]  hover:bg-[#fff] '
          onClick={handlogin}
          >
          <FaHeart/>             
        </button>
        </>
          ): isinFavorite ? (
            <button className='bg-[#fff] text-[#d91612]  transition-all duration-[0.3s] ease-in-out hover:text-[#44c2c0] hover:bg-[#fff]'
              onClick={removeFavoriteHandler}
            >
             <FaHeart />             
              </button>
            ):( 
              <button className=' bg-[#fff] text-[#44c2c0]  transition-all duration-[0.3s] ease-in-out  hover:text-[#d91612]  hover:bg-[#fff] '
               onClick={addToFavoriteHandler}
               >
                 <FaHeart />             
               </button>
               )
              }
  </>
  )
}

export default ActionButton