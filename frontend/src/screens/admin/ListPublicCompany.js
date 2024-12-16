import React, { useEffect, useState } from 'react'
import Loader from '../../componets/Loader';
import apiTag from '../../api/apiTag';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash ,FaPen,FaSave  } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import Swal from 'sweetalert2'
const ListPublicCompany = () => {
    const [publicCompany,setPublicCompany] = useState('');
    const [isLoading,setIsLoading] = useState(true);
    const [isRefresh, setIsRefresh] = useState(false);
    const [editRow, setEditRow] = useState('');
    const [updateRow, setUpdateRow] = useState('')
   
    useEffect(()=>{
        flechData()
    },[isRefresh])
    const flechData = async()=>{
        try {
            const responsive = await apiTag.getAllPublicCompany();
            setPublicCompany(responsive);
            setIsLoading(false);
        } catch (error) {
            
        }
    }
    const handleCreate =async()=>{
        try {
            setIsLoading(pre => !pre)
            await apiTag.addPublicCompany();
            toast.success('Tạo NXB thành công')
            setIsRefresh(pre => !pre)
        } catch (error) {
            toast.error(error?.response.data.message)
        }
    }
    const handleUpdate =async()=>{
        try {
            const dataPost = {publicCompanyName: updateRow};
            setIsLoading(pre => !pre)
            await apiTag.updatePublicCompany(editRow,dataPost);
            setEditRow('')
            setIsLoading(pre => !pre);
            setIsRefresh(pre => !pre);
            toast.success('Cập nhật thành công');
        } catch (error) {
            toast.error(error?.response.data.message)
        }
    }
    const handleInputChange = (e) => {
        setUpdateRow(e.target.value)
      };
    const handleSaveCick=(id,name)=>{
        setEditRow(id);
        setUpdateRow(name);
    }
    const handleCanle =async()=>{
        setEditRow('')
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
                await apiTag.deletePublicCompany(id);
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
        {isLoading ? (<Loader/>): 
        (<> 
           <div className="flex justify-end mb-2">
              <button className="flex items-center border-solid border-[1px] rounded-[7px] p-1 bg-[#1c7c3e] text-[15px] gap-x-1 text-end text-[#fff]" onClick={handleCreate}>
                <FaPlus/>
                Thêm NXB
              </button>
            </div>
            <div className='p-4 overflow-auto h-[310px]'>                         
                <table  class="table ">
                    <thead className="table-light">
                    <tr>  
                        <th className="capitalize leading-3 text-[17px]">Tên</th>
                        <th className="capitalize leading-3 text-[17px]"></th>
                    </tr>
                    </thead>
                    <tbody>
                        {publicCompany.map((item) =>(
                            <tr key={item._id}>    
                                           {editRow === item._id ?(<>
                                            <td className="align-middle">
                                            <input
                                            onChange={handleInputChange}
                                            value={updateRow}    
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
                                                {item.publicCompanyName}
                                            </td>
                                            <td className="align-middle w-[165px]">   
                                                <div className="border-solid border-[1px] rounded-[9px] bg-[#31bcf3] text-[#fff] flex justify-center items-center h-[25px] w-[50px] mb-1 cursor-pointer" onClick={()=>handleSaveCick(item._id, item.publicCompanyName)}>
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
        </>)}
    </>
  )
}

export default ListPublicCompany