import React, { useEffect, useState } from 'react'
import SidebarAdmin from './SidebarAdmin'
import apiTag from '../../api/apiTag'
import Loader from '../../componets/Loader';
import { FaEdit, FaPlus, FaTrash ,FaEye,FaPen } from 'react-icons/fa';
import ListCategory from './ListCategory';
import ListPublicCompany from './ListPublicCompany';
import ListForm from './ListForm';
import ListLanguage from './ListLanguage';
const CategoryScreen = () => {
    // const [editRow, setEditRow] = useState("")
    // const handleSaveCick =(id)=>{
    //     setEditRow(id);
    // }
    
    
  return (
    <>
            
            <div className='row'>
                <div className='col-md-2'>
                <SidebarAdmin />
                </div>
                <div className='col-md-10'>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-6'>
                        <div className="border-[1px] shadow-lg rounded-[8px]">
                            <div className='p-3'>
                                <h3 className='text-[20px] font-[700] mb-2'>Thông tin thể loại</h3>
                                <hr className='mb-3'/>
                                <ListCategory/>
                            </div>
                        </div>
                        <div className="border-[1px] shadow-lg rounded-[8px]">
                            <div className='p-3'>
                                <h3 className='text-[20px] font-[700] mb-2'>Thông tin NXB </h3>
                                <hr className='mb-3'/>
                                <ListPublicCompany/>
                            </div>
                        </div>
                        <div className="border-[1px] shadow-lg rounded-[8px]">
                            <div className='p-3'>
                                <h3 className='text-[20px] font-[700] mb-2'>Thông tin hình thức</h3>
                                <hr className='mb-3'/>
                                <ListForm />
                            </div>
                        </div>
                        <div className="border-[1px] shadow-lg rounded-[8px]">
                            <div className='p-3'>
                                <h3 className='text-[20px] font-[700] mb-2'>Thông tin ngôn ngữ</h3>
                                <hr className='mb-3'/>
                                <ListLanguage />
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
    </>
  )
}

export default CategoryScreen