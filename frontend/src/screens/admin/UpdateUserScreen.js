import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form} from 'react-bootstrap';
import Message from '../../componets/Message';
import Loader from '../../componets/Loader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useGetUserDetailsQuery,useUpdateUserMutation } from '../../slices/usersApiSlice';

const UpdateUserScreen = () => {
    const { id: userId } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const {
        data: user,
        isLoading,
        error,
        refetch,
      } = useGetUserDetailsQuery(userId);
      useEffect(() => {
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setIsAdmin(user.isAdmin);
        }
      }, [user]);
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          await updateUser({ userId, name, email, isAdmin });
          toast.success('user updated successfully');
          refetch();
          navigate('/admin/userlist');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      };
    
  return (
    <>
         {loadingUpdate && <Loader />}
        {isLoading ? (
        <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
            <div className="row d-flex  justify-content-center">
            <div className="col-10 col-lg-5">
                    <h1 className="mb-4 d-flex justify-content-center">THÔNG TIN TÀI KHOẢN</h1>
                    <hr />
                <form onSubmit={submitHandler} >
                    
                    <div className="form-group py-2 ">
                    <label>Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        
                        />
                    </div>

                    <div className="form-group py-2 ">
                        <label >Email</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        
                        />
                    </div>

                    <div className="form-group py-2 ">
                        <label >Quyền Admin</label>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        ></Form.Check>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary " >Tiếp tục</button>
                    </div>
                </form>
            </div>
        </div>
        )}
    </>
  )
}

export default UpdateUserScreen