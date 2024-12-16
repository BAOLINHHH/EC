
import { FaEdit, FaPlus, FaTrash ,FaEye,FaPen } from 'react-icons/fa';
import { Link, useParams,useSearchParams } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';
import { toast } from 'react-toastify';
import Loader from '../../componets/Loader';
// import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation} from '../../slices/productsApiSlice';
import { calculateRemainingDays } from '../../utils/calculateDayRemain';
import { useState } from 'react';
import { useEffect } from 'react';
import { optionCurrency,transform } from "../../componets/money"
import couponApi from '../../api/couponApi';
import dayjs from "dayjs";
import AddCoupon from './AddCoupon';
import EditCoupon from './EditCoupon';
import Swal from 'sweetalert2'
const CouponScreenAdmin = () => {
    const [coupon, setCoupon] = useState('');
    const [isOpenAddCoupontDialog, setIsOpenAddCouponDialog] = useState(false);
    const [isOpenEditCoupontDialog, setIsOpenEditCouponDialog] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const [isRefresh, setIsRefresh] = useState(false);
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const [dataEditCoupon, setDataEditCoupon] = useState('')
    useEffect(() =>{
        flechData();
    },[isRefresh])
   
    const flechData = async()=>{
        try {
            const response  =await couponApi.getAll();
            setCoupon(response)
            setIsLoading(false);
        } catch (error) {
        toast.error(error?.response.data.message)
        }
    } 
    const handleOpen=()=>{
      setIsOpenAddCouponDialog(true);
    };
    const handlingCloseAddCouponDialog = () => {
      setIsOpenAddCouponDialog(false);
    };
    const handleOpenEdit=(item)=>{
      setIsOpenEditCouponDialog(true)
      setDataEditCoupon(item)
    };
    const handlingCloseEditCouponDialog = () => {
      setIsOpenEditCouponDialog(false);
      setDataEditCoupon('')
    };
    const handleDelete = async(id)=>{
      Swal.fire({
        title: "Bạn có chắc chắn xóa?",
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then( async (result) => {
        if (result.isConfirmed) {
          await couponApi.delete(id);
          setIsLoading(pre => !pre)
          setIsRefresh(pre => !pre)
          toast.success('Xóa thành công')
          
        }else{
          toast.error('Xóa không thành công')
        }
      });
    }


  return (
    <>
     <div className='row'>
            <div className='col-md-2'>
                <SidebarAdmin />
            </div>
            {isLoading ? ( <Loader/>): (<> 
            <div className='col-md-10'>
              <div className="mb-5">
                <h1 className=" text-[20px] font-[700] mb-2">QUẢN LÝ COUPON</h1>
                <div className="flex justify-end">
                  <button className="flex items-center border-solid border-[1px] rounded-[7px] p-1 bg-[#1c7c3e] text-[15px] gap-x-1 text-end text-[#fff]" onClick={handleOpen}>
                  <FaPlus />
                  Thêm Coupon
                  </button>
                </div>
                <AddCoupon 
                 isOpen = {isOpenAddCoupontDialog}
                 handleClose={handlingCloseAddCouponDialog}
                 isRefresh={flechData}
                />
                <EditCoupon
                isOpen= {isOpenEditCoupontDialog}
                handleClose= {handlingCloseEditCouponDialog}
                dataCoupon = {dataEditCoupon}
                isRefresh={flechData}
          
                />
              </div>
              <table  class="table  border-[1px] border-solid">
                    <thead className="table-light">
                    <tr>  
                      <th className="capitalize leading-3 text-[17px]">Tên </th>
                      <th className="capitalize leading-3 text-[17px]">Giá giảm</th>
                      <th className="capitalize leading-3 text-[17px]">Đơn từ</th>
                      <th className="capitalize leading-3 text-[17px]">Giảm tối đa</th>
                      <th className="capitalize leading-3 text-[17px]">Ngày tạo</th>
                      <th className="capitalize leading-3 text-[17px]">Ngày hết hạn</th>
                      <th className=""></th>
                    </tr>
                  </thead>
                  <tbody>
                  {coupon && coupon.map((item)=>(
                     <tr>
                     <td className="align-middle  ">
                        <p className=' text-[17px] text-[#100707]'>{item.code}</p> 
                     </td>
                     <td className="align-middle">
                      {item.discount}%
                     </td>
                     <td className="align-middle">
                      <p className=' text-[#c13422]'>
                      {transform (item.minOrderValue,optionCurrency)}
                      </p>
                                            
                     </td>
                     <td className="align-middle">
                     { transform(item.maxDiscount,optionCurrency)}
                     </td>
                     <td className="align-middle">
                     {dayjs(item.createdAt).format("DD/MM/YYYY")}
                     </td>
                     <td className="align-middle">
                       <span className='bg-[#a6e157] text-[#fff] border-solid border-[1px] rounded-3xl p-2'>
                       {calculateRemainingDays(now,item.expirationDate)}
                        </span>
                     </td>  
                     <td className="align-middle">
                       <div className="border-solid border-[1px] rounded-[9px] bg-[#31bcf3] text-[#fff] flex justify-center items-center h-[25px] w-[50px] mb-1 cursor-pointer"  onClick={()=> handleOpenEdit(item)}>
                       <FaPen/>
                       </div>
                       <div className="border-solid border-[1px] rounded-[9px] bg-[#dc4f36] text-[#fff] flex justify-center items-center h-[25px] w-[50px] cursor-pointer " onClick={()=>handleDelete(item._id)}>
                         <FaTrash/>
                       </div>
                     </td>
                   </tr>  
                  ))}             
                  </tbody>
              </table>
            
            </div>
            </>) } 

        </div>

    </>
  )
}

export default CouponScreenAdmin