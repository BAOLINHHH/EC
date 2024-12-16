import {useState, useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import SidebarUser from './SidebarUser';
import Avatar from '@mui/material/Avatar';

const ProfileScreen = () => {
    const [name,setName]= useState("")
    const [ email, setEmail] = useState("")
    const [password, setPassword]= useState("")
    const [confirmPassword, setConfirmPassword]= useState("")

    const [ updateProfile]= useProfileMutation()

    const dispatch = useDispatch()
    const {userInfo} = useSelector((state)=>state.auth)
    useEffect(() =>{
        if (userInfo){
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [ userInfo,userInfo.name, userInfo.email])
    const submitHandler = async (e) =>{
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Mật khẩu xác nhận chưa đúng.')
        } else{
            try{
                const res = await updateProfile({ _id:userInfo._id,name,email,password}).unwrap();
                dispatch(setCredentials(res))
                toast.success('Cập nhật thông tin thành công')
            }catch (error){
                toast.error('Cập nhật thông tin thất bại') 
            }
        }
    }
  return (
    <>
        <section className="py-3 ">
        <div className="container ">
        <div className=" flex gap-[60px] ">
                <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)]  ">
                    <SidebarUser/>
                </div>
                <div className=" border-solid border-[1px] rounded-[6px] w-full bg-[#fff] shadow-[1px_1px_7px_rgba(#00000029)]">
                        <div className='w-full py-4'>
                            <h1 className="font-[600] text-[20px] p-[10px]">Ho so ca nhan</h1>
                        </div>
                        <div className='flex flex-col  items-center my-3 gap-y-5'>
                            <Avatar   sx={{ width: 60, height: 60 }}>M</Avatar>
                            <button className="btn btn-danger w-[150px]">chon file</button>
                        </div>
                        <div className='flex w-[550px] pb-3'>
                            <span className="w-[150px] p-[10px] ">Họ và tên</span>
                            <div className=" input-group ">
                            <input type="text" className="form-control"  placeholder="Tên người dùng" />
                            </div>
                        </div>
                        <div className='flex w-[550px] pb-3'>
                            <span className="w-[150px] p-[10px]">Số điên thoại</span>
                            <div className=" input-group">
                            <input type="text" className="form-control"  placeholder="Số điên thoại"/>
                            </div>
                        </div>
                        <div className='flex w-[550px] pb-3'>
                            <span className="w-[150px] p-[10px] ">Email</span>
                            <div className=" input-group ">
                            <input type="text" className="form-control"  placeholder="Email" />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button type="submit" className="btn btn-danger" >Cập nhật</button>
                        </div>
                </div>
        </div>
            {/* <div className="row d-flex justify-content-center align-items-center ">
                <div className="col-md-2">
                    <SidebarUser/>
                </div>
                <div className="col-md-10">
                <div className="card text-black" style={{borderRadius: '25px'}}>
                <div className="card-body p-md-5">
                    <div className="row justify-content-center">
                    <div className="col-md-5">

                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">THÔNG TIN CÁ NHÂN</p>

                        <form className="px-md-4" onSubmit= {submitHandler}>
                        <div className=" mb-4">
                            <label className='mb-2'>Tên người dùng: </label>
                            <div className=" input-group flex-fill mb-0">
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}  placeholder="Tên nguoi dung" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className='mb-2'>Email: </label>
                            <div className="input-group flex-fill mb-0">
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}  placeholder="Địa chỉ email" />
                            </div>
                        </div>

                        <div className=" mb-4">
                            <label className='mb-2'>Mật khẩu:</label>
                            <div className=" input-group form-outline flex-fill mb-0">
                            <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Mật khẩu" />
                            </div>
                        </div>

                        <div className=" mb-4">
                             <label className='mb-2'>Xác nhận mật khẩu:</label>
                            <div className="input-group flex-fill mb-0">
                            <input type="password"  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control"  placeholder="Nhập lại mật khẩu"/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary btn-lg" >Cập nhật</button>
                        </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
                </div>
            </div> */}
        </div>
        </section>
    </>
  )
}

export default ProfileScreen