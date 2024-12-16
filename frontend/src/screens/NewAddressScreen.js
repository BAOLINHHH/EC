import React, { useEffect, useState } from 'react'
import SidebarUser from './SidebarUser';
import { AiFillBackward } from "react-icons/ai";
import {  Link} from 'react-router-dom';
import ghnApi from '../api/ghnApi';
import { toast } from 'react-toastify';
import addressApi from '../api/addressApi';
import Checkbox from '@mui/material/Checkbox';
const NewAddressScreen = () => {
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);

 

    const [selectProvince , setSelectProvince] = useState("");
    const [selectDistrict, setSelectDistrict] = useState("");
    const [selectward,setSelectward] = useState("");

    const [checked, setChecked] = useState(true);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [nameProvince, setNameProvince]= useState("");
    const [nameDistrict, setNameDistrict]= useState("");
    const [nameWard, setNameWard]= useState("");

    useEffect(()=>{
        flechProvince();
    }, [])

    const flechProvince = async() =>{
        try {
            const response = await ghnApi.getProvince()
           if (response) {
            const provincelist = response.map((items) =>({
                ProvinceID: items.ProvinceID,
                ProvinceName: items.ProvinceName,
            }));
            setProvince(provincelist)
           } else {
            toast.error("Dữ liệu Tỉnh/Thành phố đã bị lỗi")
           }
        } catch (error) {
        }
    }
    
    const handleChangeCheckbox =(e)=>{
            setChecked(e.target.checked)
    }
    const handleProvinceChange =(e) =>{
    const provinceId = e.target.value;
      const selectNameProvince = province.find((item) =>item.ProvinceID === Number(provinceId) ) ;
      
        setNameProvince(selectNameProvince)
        setSelectProvince(provinceId)
        setSelectDistrict('');
        flechDistrict(provinceId)
    }
    const handleDistrictChange=(e)=>{
        const districtID = e.target.value;
        const selectNameDistrict = district.find((item) =>item.DistrictID === Number(districtID));
        setNameDistrict(selectNameDistrict);
        setSelectDistrict(districtID);
        setSelectward("");
        flechward(districtID);
    }
    const handleWardChange =(e)=>{
        const wardID = e.target.value;
  
        const selectNameWard = ward.find((item) =>item.WardCode === wardID);
        setNameWard(selectNameWard);
        setSelectward(wardID);
    }
    const submitHandler= async(e)=>{
        e.preventDefault()

        const postData = {
            recipientName: name,
            phoneNumber: phone,
            ProvinceID:  nameProvince.ProvinceID,
            ProvinceName: nameProvince.ProvinceName,
            DistrictID: nameDistrict.DistrictID,
            DistrictName: nameDistrict.DistrictName,
            WardCode: nameWard.WardCode,
            WardName:  nameWard.WardName,
            addressDetails: address,
            isDefault: checked
        }

        try {
        const response = await addressApi.update(postData);
        if(response){
            toast.success("Thêm địa chỉ thành công");
        }else{
            toast.error("Thêm địa chỉ thất bại");
        }
        } catch (error) {
            toast.error(Error?.response?.data?.message )
        }
        
        

    }
  
    const flechDistrict =async (provinceId) =>{
        try {
            const province__id = Number(provinceId);
            const response = await ghnApi.getDistrict({province_id: province__id});
            if (response) {
                const Districtlist = response.map((items)=>({
                    DistrictID: items.DistrictID,
                    DistrictName: items.DistrictName,
                }))
                setDistrict(Districtlist);
            } else {
                toast.error("Dữ liệu Quận/Huyện đã bị lỗi");
            }
        } catch (error) {
            
        }
    }
    const flechward = async(districtID)=>{
        try {
            const district__iD = Number(districtID)
            const response = await ghnApi.getWard({district_id: district__iD});
            if (response) {
                const wardList = response.map((items)=>({
                    WardCode: items.WardCode,
                    WardName: items.WardName,
                }))
                setWard(wardList);
            } else {
                toast.error("Dữ liệu Xã/Phường đã bị lỗi")
            }
        } catch (error) {
            
        }
    } 

  return (
    <>
         <section className="py-3">
        <div className="container ">
        <div className=" flex gap-[60px]">
                <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)] ">
                    <SidebarUser/>
                </div>
                <div className=" border-solid border-[1px] rounded-[6px] w-full bg-[#fff] shadow-[1px_1px_7px_rgba(#00000029)] ">
                  <div className="px-[10px] py-[5px] ]">
                        <div className='w-full mb-[10px] flex items-center justify-between'>
                            <h1 className="font-[600] text-[20px] p-[10px]">Thêm địa chỉ</h1>
                        </div>
                        <div className="px-[20px]">
                            <form>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px] ">Họ tên</span>
                                    <div className=" input-group ">
                                    <input type="text" className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên người dùng" />
                                </div>
                                </div>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px]">Số điện thoại</span>
                                    <div className=" input-group">
                                    <input type="text" className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"  value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Số điện thoại" />
                                    </div>
                                </div>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px] ">Tỉnh/Thành phố</span>
                                    
                                    <select value={selectProvince} onChange={handleProvinceChange} className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]">
                                    <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                        {province?.map((item)=>(
                                              <option
                                              key={item.ProvinceID}
                                              value={ item.ProvinceID }
                                              selected="selected"
                                            >
                                              {item.ProvinceName}
                                            </option>
                                       ))}
                                    </select>
                                    
                                    {/* <div className=" input-group ">
                                    <input type="text" className="form-control"  placeholder="Tên nguoi dung" />
                                    </div> */}
                                </div>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px] ">Quận/Huyện</span>
                                    <select value={selectDistrict} onChange={handleDistrictChange} className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]">
                                    <option value="">-- Chọn Quận/Huyện --</option>
                                        {district?.map((item)=>(
                                              <option
                                              key={item.DistrictID}
                                              value={item.DistrictID}
                                              selected="selected"
                                              disabled={!handleProvinceChange}
                                            >
                                              {item.DistrictName}
                                            </option>
                                       ))}
                                    </select>
                                </div>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px] ">Xã/Phường</span>
                                    <select value={selectward} onChange={handleWardChange} className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]">
                                    <option value="">-- Chọn Xã/Phường --</option>
                                        {ward?.map((item)=>(
                                              <option
                                              key={item.WardCode}
                                              value={item.WardCode}
                                              selected="selected"
                                              disabled={!handleDistrictChange}
                                            >
                                              {item.WardName}
                                            </option>
                                       ))}
                                    </select>
                                </div>
                                <div className='flex w-[600px] pb-3'>
                                    <span className="w-[250px] p-[10px] ">Địa chỉ</span>
                                    <div className=" input-group ">
                                    <input type="text" className="outline-none h-[43px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-full p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]" value={address} onChange={(e)=>setAddress(e.target.value)}  placeholder="Địa chỉ" />
                                    </div>
                                </div>
                                <div className='flex w-[600px] pb-3 items-center'>
                                    <Checkbox checked={checked} onChange={handleChangeCheckbox}/>
                                    <p className="text-[17px]"> Địa chỉ thanh toán mặc định của tôi</p>
                                </div>
                                <div className="flex my-9">
                                    <Link to= '/address'>
                                    <div className="flex items-center ">
                                        <AiFillBackward className="text-[#4226e2]"/>
                                        <p className="text-[15px] text-[#4226e2] ">Quay lại</p>
                                    </div>
                                    </Link>
                                    <button type="button" class="btn btn-danger py-0 px-[20px] relative left-[400px] " onClick={submitHandler} >Lưu</button>
                                </div>
                                </form>
                            </div>    
                        
                  </div>
                  
                </div>

        </div>
          
        </div>
        </section>
    </>
  )
}

export default NewAddressScreen