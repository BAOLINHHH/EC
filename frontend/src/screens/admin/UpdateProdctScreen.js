import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Message from '../../componets/Message';
import Loader from '../../componets/Loader';

import { toast } from 'react-toastify';
import { useUpdateProductMutation,useGetProductDetailQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice';

const UpdateProdctScreen = () => {
  const { id: productId } = useParams();

  const [bookName, setBookName] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [publicCompany, setPublicCompany] = useState('');
  const [language, setLanguage] = useState('');
  const [form, setForm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [bookPrice, setBookPrice] = useState(0);
  const [bookDetail, setBookDetail] = useState('');
  const [bookQuaranty, setBookQuaranty] = useState(0);
  const [bookImage, setBookImage] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
  useUploadProductImageMutation();
  const navigate = useNavigate();
//   const submitHandler = async (e) => {
//         e.preventDefault();

//       const updatedProduct ={
//         productId,
//         bookName,
//         category,
//         author,
//         publicCompany,
//         language,
//         form,
//         pageNumber,
//         bookPrice,
//         bookImage,
//         bookQuaranty,
//         bookDetail,
//       }
//       const result = await updateProduct(updatedProduct);
//       if(result.error)
//       {
//         toast.error(result.error)

//       }else{
//         toast.success('thang cong')
//         navigate('/admin/productlist')
//       }

//   };

const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
                productId,
                bookName,
                category,
                author,
                publicCompany,
                language,
                form,
                pageNumber,
                bookPrice,
                bookQuaranty,
                bookDetail,
                bookImage,
      });
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

    useEffect(() => {
    if (product) {
        setBookName(product.bookName);
        setCategory(product.category)
        setAuthor(product.author)
        setPublicCompany(product.publicCompany)
        setLanguage(product.language)
        setForm(product.form)
        setPageNumber(product.pageNumber)
        setBookPrice(product.bookPrice)
        setBookDetail(product.bookDetail)
        setBookImage(product.bookImage)
        setBookQuaranty(product.bookQuaranty)
    
    }
  }, [product]);
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setBookImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
   <>
        {/* <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link> */}
      
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
            <div className="row d-flex  justify-content-center">
            <div className="col-10 col-lg-5">
                    <h1 className="mb-4 d-flex justify-content-center">THÔNG TIN SẢN PHẨM</h1>
                    <hr />
                <form  encType="multipart/form-data" onSubmit={submitHandler} >
                    
                    <div className="form-group py-2 ">
                    <label>Tên sản phẩm</label>
                        <input
                            type="text"
                            className="form-control"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                        
                        />
                    </div>

                    <div className="form-group py-2 ">
                        <label >Thể loại</label>
                        <input
                            type="text"
                            className="form-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        
                        />
                    </div>

                    <div className="form-group py-2 ">
                        <label >Tác giả</label>
                        <input
                            type="text"
                            className="form-control"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        
                        />
                    </div>

                    <div className="form-group py-2 ">
                        <label >Công ti xuất bản</label>
                        <input
                            type="text"
                            value={publicCompany}
                            className="form-control"
                            onChange={(e) => setPublicCompany(e.target.value)}
                        
                        />
                    </div>
                    <div className="form-group py-2 ">
                        <label >Ngôn ngữ</label>
                        <input
                            type="text"
                            className="form-control"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        
                        />
                    </div>
                    <div className="form-group py-2 ">
                        <label >Hình thức</label>
                        <input
                            type="text"
                            className="form-control"
                            value={form}
                            onChange={(e) => setForm(e.target.value)}
                        
                        />
                    </div>
                    <div className="form-group py-2 ">
                        <label >Số trang</label>
                        <input
                            type="number"
                            className="form-control"
                            value={pageNumber}
                            onChange={(e) => setPageNumber(e.target.value)}
                            require
                        />  
                    </div>
                    <div className="form-group py-2 ">
                        <label >Giá tiền</label>
                        <input
                            type="number"
                            className="form-control"
                            value={bookPrice}
                            onChange={(e) => setBookPrice(e.target.value)}
                        />
                    </div>
                    <div className="form-group py-2 ">
                        <label >Hình ảnh sản phẩm</label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={bookImage}
                                onChange={(e) => setBookImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                label='Choose File'
                                onChange={uploadFileHandler}
                                type='file'
                            ></Form.Control>
                            {loadingUpload && <Loader />}
                    </div>
                    <div className="form-group py-2 ">
                        <label >Số lượng tồn kho</label>
                        <input
                            type="number"
                            className="form-control"
                            value={bookQuaranty}
                            onChange={(e) => setBookQuaranty(e.target.value)}
                        />
                    </div>
                    <div className="form-group py-2 ">
                    <label htmlFor="description_field">Mô tả</label>
                        <textarea className="form-control" rows="8" value={bookDetail} onChange={(e) => setBookDetail(e.target.value)}></textarea>
                      
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary " >Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
        )}
   </>
  )
}

export default UpdateProdctScreen