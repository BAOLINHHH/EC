import React, { useEffect, useState } from 'react'
import apiTag from '../../api/apiTag';
import Loader from '../../componets/Loader';
import {  FaPlus, FaTrash ,FaPen,FaSave  } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
const ListForm = () => {
    const [isLoading,setIsLoading] = useState(true);
    const [form,setForm]= useState('');
    const [editRow, setEditRow] = useState('');
    const [updateRow, setUpdateRow] = useState('')
    const [isRefresh, setIsRefresh] = useState(false);
    useEffect(()=>{
        flechData()
    },[isRefresh])
    const flechData = async()=>{
        try {
            const responsive = await apiTag.getAllForm();
            setForm(responsive);
            setIsLoading(false);
        } catch (error) {
            
        }
    }
    const handleCreate =async()=>{
        try {
            setIsLoading(pre => !pre)
            await apiTag.addForm();
            toast.success('Tạo hình thức thành công')
            setIsRefresh(pre => !pre)
        } catch (error) {
            
        }
    }
    const handleSaveCick =(id,name)=>{
        setEditRow(id);
        setUpdateRow(name)
    }
    const handleCanle =()=>{
        setEditRow('')
    }
    const handleInputChange = (e) => {
        setUpdateRow(e.target.value)
      };
    const handleUpdate=async()=>{


        try {
            const dataPost = {form: updateRow};
            setIsLoading(pre => !pre)
            await apiTag.updateForm(editRow,dataPost);
            setEditRow('')
            setIsLoading(pre => !pre);
            setIsRefresh(pre => !pre);
            toast.success('Cập nhật thành công');
        } catch (error) {
            toast.error(error?.response.data.message)
        }
    }
    const handleDelete =async(id)=>{


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
                try {
                    await apiTag.deleteForm(id);
                    setIsLoading(pre => !pre);
                    setIsRefresh(pre => !pre);
                    toast.success('Xoá thành công');
                } catch (error) {
                    toast.error(error?.response.data.message)
                }
            }
          });

            



      
    }
  return (
    <>
        {isLoading ? (<Loader/>) : (
        <>
            <div className="flex justify-end mb-2">
              <button className="flex items-center border-solid border-[1px] rounded-[7px] p-1 bg-[#1c7c3e] text-[15px] gap-x-1 text-end text-[#fff]" onClick={handleCreate}>
                <FaPlus/>
                Thêm hình thức
              </button>
            </div>
            <div className='p-3 overflow-auto h-[310px]'>                                
                <table  class="table ">
                <thead className="table-light">
                <tr>  
                    <th className="capitalize leading-3 text-[17px]">Tên</th>
                    <th className="capitalize leading-3 text-[17px]"></th>
                </tr>
                </thead>
                <tbody>
                    {form.map((item) =>(
                        <tr key={item._id}>
                            {editRow === item._id ? (
                            <>
                                <td className="align-middle">
                                    <input
                                    value={updateRow}
                                    onChange={handleInputChange}
                                    className='border-solid border-[1px] rounded-[5px] outline-none focus:ring-[#9b3bea] focus:border-[#3e3bd5] p-1'
                                    type='text'
                                    />                                      
                                </td>
                                <td className="align-middle w-[165px]">   
                                        <div className="border-solid border-[1px] rounded-[9px] bg-[#31bcf3] text-[#fff] flex justify-center items-center h-[25px] w-[50px] mb-1 cursor-pointer" onClick={handleUpdate} >
                                        <FaSave/>
                                        </div>
                                        <div className="border-solid border-[1px] rounded-[9px] bg-[#dc4f36] text-[#fff] flex justify-center items-center h-[25px] w-[50px] cursor-pointer" onClick={handleCanle}>
                                        <MdCancel/>
                                    </div>
                                </td>
                            </>):(
                            <>
                            <td className="align-middle">
                                {item.form}  
                            </td>
                                <td className="align-middle w-[165px]">   
                                    <div className="border-solid border-[1px] rounded-[9px] bg-[#31bcf3] text-[#fff] flex justify-center items-center h-[25px] w-[50px] mb-1 cursor-pointer" onClick={()=>handleSaveCick(item._id, item.form)}>
                                    <FaPen/>
                                    </div>
                                    <div className="border-solid border-[1px] rounded-[9px] bg-[#dc4f36] text-[#fff] flex justify-center items-center h-[25px] w-[50px] cursor-pointer" onClick={()=>handleDelete(item._id)} >
                                    <FaTrash/>
                                    </div>
                                </td>
                            </>)}
                            
                        </tr>
                    ))}                   
                </tbody>
                </table>  
            </div> 
        </>
        )}
    </>
  )
}

export default ListForm