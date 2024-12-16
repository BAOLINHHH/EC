import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Message from '../../componets/Message';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Loader from '../../componets/Loader';
import SidebarAdmin from './SidebarAdmin';
import { toast } from 'react-toastify';
import { useGetUsersQuery,useDeleteUserMutation} from '../../slices/usersApiSlice';
import Checkbox from '@mui/material/Checkbox';
import userApi from '../../api/userApi';
import Swal from 'sweetalert2'
const ListUsersAminScreen = () => {
    const { data: users, refetch,  error} = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [dataUser ,setdatauser] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [pageNumber, setPageNumber] = useState('');
    const [checked, setChecked] = useState('');
    const [isRefresh, setIsRefresh] = useState(false);
    useEffect(() =>{
      flechData()
    },[isRefresh,pageNumber])
    const flechData = async() =>{
      try {
      const response = await userApi.getAll()  
      setdatauser (response);
      setIsLoading(false);
      } catch (error) {
        
      }
    }

    const handCheck = async(isAdmin,id)=>{

        const postData= { isAdmin: !isAdmin}
        try {
          setIsLoading(pre => !pre)
          await userApi.updata(id,postData)
          toast.success('Cập nhật thành công')
          setIsRefresh(pre => !pre)
        } catch (error) {
          toast.error('Cập nhật không thành công')
        }
    }
    const handlePaginate = (event,value) =>{
      const currentPage = value ; 
        setPageNumber(currentPage)
    }
    const handleDelete = async (id)=>{
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
            setIsLoading(pre => !pre)
            await userApi.delete(id);
            toast.success('Xóa thành công')
            setIsRefresh(pre => !pre)            
          } catch (error) {
            toast.error('Xóa không thành công')            
          }
        }
      });
    }
  return (
    <>
    <div className="row">
      <div className=" col-md-2">
        <SidebarAdmin />
      </div>
 
      <div className='col-md-10'>
            { isLoading ? ( <Loader />): (

              <>
                  <h1 className="mb-4 d-flex justify-content-center">THÔNG TIN TÀI KHOẢN</h1>
                  <table  class="table  border-[1px] border-solid">
                    <thead className="table-light">
                    <tr> 
                      <th className="capitalize leading-3 text-[17px]">Họ và tên</th>
                      <th className="capitalize leading-3 text-[17px]">Email </th>
                      <th className="capitalize leading-3 text-[17px]">Admin</th>
                      <th className="capitalize leading-3 text-[17px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataUser && dataUser.users.map((item)=>(
                      <tr>
                      <td className="align-middle">
                        {item.name}
                      </td>
                      <td className="align-middle">
                       {item.email}
                      </td>
                      <td className="align-middle">
                      {/* <Checkbox
                            defaultChecked={item.isAdmin}
                            onChange={(e)=>handCheck( e,item._id)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          /> */}
                          <div>
                            <input class="form-check-input" type="checkbox" id="checkboxNoLabel"  checked={item.isAdmin}  onChange={()=>handCheck(item.isAdmin,item._id)}  aria-label="..." />
                          </div>

{/* 

                      
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" checked={checked} id="flexCheckChecked"  /> */}
                          {/* <label class="form-check-label" for="flexCheckChecked">
                            Checked checkbox
                          </label> */}
                        {/* </div> */}
                      </td>
                      <td className="align-middle">
                      <div className="border-solid border-[1px] rounded-[9px] bg-[#dc4f36] text-[#fff] flex justify-center items-center h-[25px] w-[50px] cursor-pointer" onClick={()=>handleDelete(item._id)}>
                        <FaTrash />
                      </div>
                      </td>
                      </tr> 
                    ) )}              
                  </tbody>
                  </table> 
                  <div className='flex justify-center mt-3'>
                  <Stack spacing={2}>
                      <Pagination count={dataUser.pages} defaultPage={6} onChange={handlePaginate}/>
                  </Stack>
                </div>
              
              </>

            ) }
             
        {/* <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
            <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                    <>
                      <LinkContainer
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: '10px' }}
                      >
                        <Button variant='light' className='btn-sm'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}
      </div>
      
    </div>
    </>
  )
}

export default ListUsersAminScreen