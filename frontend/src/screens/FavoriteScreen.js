import { useNavigate,useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { removeFromFavorite } from "../slices/favoriteSlice";
import heartImg from "../imageshome/heartImg.jpg"
import { BsFillTrashFill,BsCart } from "react-icons/bs";
import { useEffect, useState } from "react";
import favoriteApi from "../api/favoriteApi";
import Loader from "../componets/Loader";
import { toast } from "react-toastify";
import SidebarUser from './SidebarUser';
import { optionCurrency,transform } from "../componets/money"
const FavoriteScreen = () => {

  // const dispatch = useDispatch();
  // const favorite = useSelector ((state) => state.favorite)
  // const {favoriteItems} = favorite;
  const [data,setData] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

    useEffect(() =>{
        flechData();
    },[])

    const handleRemoveFavorite = async(id)=>{
       try {
        await favoriteApi.deleteFavorite(id);
        flechData();
        toast.success(" Xóa sản phẩm yêu thích thành công");
       } catch (error) {
        toast.error(" Xóa sản phẩm yêu thích thất bại");
       }
    }


    const flechData = async() =>{
     try {
      const responseData = await favoriteApi.getAllFavorite();
      setData(responseData.wishlistItems);
      setIsLoading(false);
     } catch (error) {
      
     }
    }
    // const removefavoriteItem = (id) =>{
    //     dispatch(removeFromFavorite(id))
    //   }
  return (
   
 
      <>
      <section className="pt-3">
      <div className="container-sm"> 

      <div className=" flex gap-[60px]">
                <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)] ">
                    <SidebarUser/>
                </div>
                <div className=" border-solid border-[1px] rounded-[6px] w-full bg-[#fff] shadow-[1px_1px_7px_rgba(#00000029)] ">
                {isLoading ? (
                  <Loader />
                ):( <>
                  <div className="px-[10px] py-[5px]">
                        <div className='w-full mb-[10px] flex items-center justify-between'>
                        <h1 className="leading-3 text-[20px] pt-4 capitalize">Danh sách yêu thích <span>({data.length} sản phẩm)</span></h1>
                        </div>
                  </div>
                  <div className="row mb-8">
            </div>
            {
              data.length === 0 ?
              (
                <section className="py-5">
                <div className = "container-sm">
                     <div className= "flex flex-col items-center">
                      
                          <div className="pt-5 w-[250px] h-[250px]"> 
                            <img className src={heartImg} alt='empty cart' />
                          </div>
                          <div className="text-[#999] text-[14px] my-3">
                            <p>Chưa có sản phẩm trong danh mục yêu thích của bạn.</p>
                          </div>
                          <div className="pb-5">
                          <Link to = {"/"}>
                          <button type="button" className="btn btn-danger w-[150px] ">MUA SẮM NGAY</button>
                          </Link>
                          </div>
                     </div>
                </div>
              </section>
              ) : (
                <>
                <div className="p-3">
              <div className=" border-[1px] border-solid rounded-[8px] shadow-[0px_0px_2px_rgba(0,0,0,0.1)]">
                <table  class="table">
                <thead className="table-light">
                  <tr>
                    <th> </th>
                    <th className="capitalize leading-3 text-[17px]">Sản phẩm</th>
                    <th className="capitalize leading-3 text-[17px]">Giá</th>
                    <th className="capitalize leading-3 text-[17px]">Trạng thái</th>
                    <th className="capitalize leading-3 text-[17px]"></th>
                    
                  </tr>
                </thead>
                <tbody>
                { data?.map((item) =>
                <tr  key={item._id}>
                  <td className="align-middle">
                    <Link to={`/${item.product._id}`}>
                    <img className="h-[80px] w-[80px]" src={item.product.bookImage} />
                    </Link>
                  </td>
                  <td className="align-middle">
                    <div>
                      <h6 className="font-normal text-[#999] text-[14px] leading-[1.2] capitalize">

                        {item.product.category ? (<> {item.product.category.categoryName}</> ):("") }
                        
                      </h6>
                      <Link to={`/${item.product._id}`}>
                      <h2 className="font-normal text-[17px] h-[50px] py-3 line-clamp-2  leading-[28px] text-[#4b5966] capitalize">{item.product.bookName}</h2>
                      </Link>
                      <p className="font-normal text-[#999] text-[14px] leading-[1.2] capitalize"> {item.product.author} </p>
                    </div> 
                  </td>
                  <td className="align-middle">
                    {transform(item.product.bookPrice,optionCurrency)}
                  </td>
                  <td className="align-middle">
                    <span class="badge bg-success font-normal text-[14px] leading-[1.2] capitalize"> {item.product.bookQuaranty > 0 ? 'Còn Hàng': 'Hết Hàng' }</span>
                    </td>
                  <td className="align-middle">
                    <div className="flex ">
                      <button className="bg-[#4b5966] ml-[15px] h-[43px] w-[46px] text-[#ffff] text-[14px] border-[1px]  border-solid rounded-lg transition-all duration-[0.3s] ease-in-out hover:bg-[#5caf90]" onClick={() =>handleRemoveFavorite(item.product._id)} ><BsFillTrashFill style={{marginLeft:'10px'}} size={'25px'}/></button>
                    </div>
                  </td>
                </tr>               
                ) 
                }
                </tbody>
                </table>
                </div>
                </div>
                </>
              )
            }
            </>
          )}
                </div>

        </div>
      </div>
    </section>
   
    </>

    
  )
  
}

export default FavoriteScreen