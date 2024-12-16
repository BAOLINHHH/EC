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
export default function AddCoupon(props ) {
  
  const [code, setCode]= useState('');
  const [discount, setDiscount] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [day, setDay] = useState( dayjs());
  
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
      await couponApi.create(postData)
      props.isRefresh();
      props.handleClose();
      toast.success('Tạo coupon thành công')
    } catch (error) {
      toast.error(error?.response.data.message)
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
          <span className="text-[20px] text-[#fff]">Thêm Coupon</span>
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
                className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setCode(e.target.value)}
                placeholder="Tên Coupon"
              />
            </div>
            <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]">% giảm: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setDiscount(e.target.value)}   placeholder="Phần trăm giá giảm" />
              <span className=' input-group-text' id= 'icon-envelope'><FaPercentage/> </span>
            </div>
          </div> 
          <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]">Giá tối thiểu: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setMinPrice(e.target.value)}   placeholder="Giá tối thiểu" />
              <span className=' input-group-text' id= 'icon-envelope'><RiMoneyEuroCircleFill/> </span>
            </div>
          </div>
          <div className="flex items-center mb-3 gap-x-20">
            <span className="w-[250px]"> Giá tối đa: </span>
            <div className="input-group flex-fill mb-0">
              <input type="number" className=" w-[470px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" onChange={(e) =>setMaxDiscount(e.target.value)}   placeholder="Giá tối đa" />
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
