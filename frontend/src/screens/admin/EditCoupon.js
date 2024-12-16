import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { MdCancel } from "react-icons/md";
import { RiMoneyEuroCircleFill } from "react-icons/ri";
import { FaPercentage } from "react-icons/fa";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import couponApi from "../../api/couponApi";
export default function EditCoupon(props) {

    const [couponId, setCouponId]= useState('');
    const [code, setCode]= useState('');
    const [discount, setDiscount] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [day, setDay] = useState( '' );
  useEffect(() => {
    // console.log("props.dataCoupon.code", props.dataCoupon.code);
    // console.log("props.dataCoupon.discount", props.dataCoupon.discount);
    // console.log("props.dataCoupon.minOrderValue", props.dataCoupon.minOrderValue);
    // console.log("props.dataCoupon.maxDiscount", props.dataCoupon.maxDiscount);
    // console.log("props.dataCoupon.day", dayjs(props.dataCoupon.day));
    setCouponId(props.dataCoupon._id);
    setCode(props.dataCoupon.code);
    setDiscount(props.dataCoupon.discount);
    setMinPrice(props.dataCoupon.minOrderValue);
    setMaxDiscount(props.dataCoupon.maxDiscount);
    setDay( dayjs(props.dataCoupon.expirationDate))

  }, [props])

  const sumitHandle = async(e)=>{
    e.preventDefault();
    try {
      const valeDate = dayjs(day).format("MM-DD-YYYY")
      const postData =
       {
        code: code,
        discount: discount,
        minOrderValue: minPrice,
        maxDiscount: maxDiscount,
        expirationDate:valeDate
       }
      await couponApi.update(couponId ,postData)
      toast.success('Sửa coupon thành công');
      props.isRefresh();
      props.handleClose();
    } catch (error) {
      toast.error("Chỉnh sửa thất bại")
    }
  }
  const handlingCloseDialog = () => {
    props.handleClose();
  };

  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={handlingCloseDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle className=" flex bg-[#2d3748] justify-center items-center relative">
          <span className="text-[20px] text-[#fff]">Sửa Coupon</span>
          <div
            className="flex  absolute right-[5px] text-[#fff] cursor-pointer"
            onClick={handlingCloseDialog}
          >
            <MdCancel size={30} />
          </div>
        </DialogTitle>
        <DialogContent>
          <form  onSubmit={sumitHandle}>
           
            <div className="flex items-center my-2">
              <span className="w-[250px]">Tên Coupon: </span>
              <input
                type="text"
                value={code}
                className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Tên Coupon"
              />
            </div>
            <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]">% giảm: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" value={discount} className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setDiscount(e.target.value)}   placeholder="Phần trăm giá giảm" />
              <span className=' input-group-text' id= 'icon-envelope'><FaPercentage/> </span>
            </div>
          </div> 
          <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]">Giá tối thiểu: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" value={minPrice} className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setMinPrice(e.target.value)}   placeholder="Giá tối thiểu" />
              <span className=' input-group-text' id= 'icon-envelope'><RiMoneyEuroCircleFill/> </span>
            </div>
          </div>
          <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]"> Giá tối đa: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" value={maxDiscount} className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setMaxDiscount(e.target.value)}   placeholder="Giá tối đa" />
              <span className=' input-group-text' id= 'icon-envelope'><RiMoneyEuroCircleFill/> </span>
            </div>
          </div> 
          <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]"> Ngày hết hạn: </span>
            <div className="input-group flex-fill mb-0">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker
                    label="Controlled picker"
                    value={day}
                    onChange={(newDay) => setDay(newDay)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div> 

            <div className="flex justify-center">
              <button
              type="submit"
                className=" border-solid w-[50px] rounded-[7px] bg-[#2d3748] text-[#fff]"
              >
                Lưu
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
