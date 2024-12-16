import React, { useEffect, useState } from "react";
import apiTag from "../../api/apiTag";
import Loader from "../../componets/Loader";
import { FaPlus, FaTrash, FaPen, FaSave } from "react-icons/fa";
import AddCategory from "./AddCategory";
import { toast } from 'react-toastify';
import EditCategory from "./EditCategory";
import images from '../../assets/indexImg'
import Swal from 'sweetalert2'
const ListCategory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [isOpenAddProductDialog, setIsOpenAddProductDialog] = useState(false);
  const [isOpenEditProductDialog, setIsOpenEditProductDialog] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [dataEditCate, setDataEditCate] = useState('')
  useEffect(() => {
    flechData();
  }, [isRefresh]);
  const flechData = async () => {
    try {
      const responsive = await apiTag.getAllCategory();
      setCategory(responsive);
      setIsLoading(false);
    } catch (error) {}
  };
  const handleOpen = () => {
    setIsOpenAddProductDialog(true);
  };
  const handlingCloseAddProductDialog = () => {
    setIsOpenAddProductDialog(false);
  };
  const handleOpenEdit = (item)=>{
    setIsOpenEditProductDialog(true);
    setDataEditCate(item);
  }
  const handlingCloseEditProductDialog = () => {
    setIsOpenEditProductDialog(false);
    setDataEditCate('');
  };
  const handleDelete= async(id)=>{
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
      await apiTag.deleteCategory(id)
      setIsLoading(pre => !pre);
      setIsRefresh(pre => !pre);
      toast.success(' Xóa thành công');
     } catch (error) {
      toast.error(error?.response.data.message)
      }
      }
    });
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <button
              className="flex items-center border-solid border-[1px] rounded-[7px] p-1 bg-[#1c7c3e] text-[15px] gap-x-1 text-end text-[#fff]"
              onClick={handleOpen}
            >
              <FaPlus />
              Thêm thể loại
            </button>
          </div>
          <AddCategory
            isOpen={isOpenAddProductDialog}
            handleClose={handlingCloseAddProductDialog}
            isRefresh={flechData}
          />
          <EditCategory
          isOpen= {isOpenEditProductDialog}
          handleClose={handlingCloseEditProductDialog}
          dataCate = {dataEditCate}
          isRefresh={flechData}
          />
          <div className="p-3 overflow-auto h-[310px]">
            <table class="table ">
              <thead className="table-light">
                <tr>
                  <th className="capitalize leading-3 text-[17px]">
                    Hình ảnh
                  </th>
                  <th className="capitalize leading-3 text-[17px]">Tên</th>
                  <th className="capitalize leading-3 text-[17px]"></th>
                </tr>
              </thead>
              <tbody>
                {category?.map((item) => (
                  <tr>
                    <td className="align-middle">
                     { !item.categoryImage ? (
                        <img src={images.noImage} className='h-[80px] w-[80px] mb-2'  alt=""/>
                      ) : (
                        <img src={item.categoryImage} className='h-[80px] w-[80px] mb-2'  alt=""/>
                      )}
                    </td>
                    <td className="align-middle">{item.categoryName}</td>
                    <td className="align-middle ">
                      <div className="border-solid border-[1px] rounded-[9px] bg-[#31bcf3] text-[#fff] flex justify-center items-center h-[25px] w-[50px] mb-1 cursor-pointer" onClick={()=> handleOpenEdit(item)}>
                        <FaPen />
                      </div>
                      <div className="border-solid border-[1px] rounded-[9px] bg-[#dc4f36] text-[#fff] flex justify-center items-center h-[25px] w-[50px] cursor-pointer" onClick={()=>handleDelete(item._id)}>
                        <FaTrash />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ListCategory;