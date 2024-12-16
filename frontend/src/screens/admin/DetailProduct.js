import React , { useState } from 'react'
import SidebarAdmin from './SidebarAdmin'
import logoaBook from '../admin/test/con-meo-day-hai-au-bay.jpg'
import Rating from '@mui/material/Rating';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Link, useParams } from "react-router-dom";
import { AiFillCaretLeft } from "react-icons/ai";
import listProduct from '../../api/productsAPI';
import Loader from '../../componets/Loader';
import { useEffect } from 'react';
import images from "../../assets/indexImg";
import ReadSampleScreen from '../ReadSampleScreen';
import ReadSampleAdmin from '../../componets/ReadSampleAdmin';
import AudioSampleAdmin from '../../componets/AudioSampleAdmin';
const DetailProduct = () => {
    const [value,setValue] = useState('1');
    const {id} = useParams()
    const [isLoading, SetIsLoading] = useState(true);
    const [product,setProduct] = useState('');
    useEffect(()=>{
        flechData()
    },[] )

    const flechData = async () =>{
      try {
        const response = await listProduct.getProductDetail(id);
        setProduct(response);
        SetIsLoading(false);
      } catch (error) {
        
      }
    }
    const handleChange = (event,newValue) => {
        setValue(newValue);
      };
  return (
    <>  
        <div className="row">
            <div className=" col-md-2">
                <SidebarAdmin />
            </div>
            <div className='col-md-10'>
            {isLoading ? ( <Loader/>): (<>
                <div>
                    <Link to = '/admin/productlist'>
                    <button className='h-[30px] cursor-pointer w-[40px] border-solid border-[1px] rounded-[5px] bg-[#2d3748] text-[#fff] flex justify-center items-center '> <AiFillCaretLeft  size={20}/> 
                    </button>
                    </Link>
                    <h1 className="mb-4 d-flex justify-content-center text-[20px] font-700">THÔNG TIN SẢN PHẨM</h1>
                </div> 
                <section>
                    <div className="container-sm">
                        <div className='grid grid-cols-2 gap-x-3'>
                            <div className='col-span-1'>
                                <div className="border-solid rounded-[7px] border-[1px] flex flex-col items-center w-[500px] mb-3">
                                    {product.bookImage ?
                                     (
                                      <div className="max-h-[300px] max-w-[300px] border-[1px] border-solid border-[#e9e9e9] bg-[#f7f7f8] rounded-[5px] mb-3"> 
                                      <img src={product.bookImage} alt fluid/>
                                      </div>  
                                     ): 
                                     ( 
                                      <div className="max-h-[300px] max-w-[300px] border-[1px] border-solid border-[#e9e9e9] bg-[#f7f7f8] rounded-[5px] mb-3"> 
                                        <img src={images.noImage} alt fluid/>
                                    </div>  
                                     ) }
                                    <p className="text-[#04070a] text-[22px] mb-[20px] leading-[35px] captitalize">
                                        {product.bookName}
                                    </p>
                                </div>
                                <div className="border-solid rounded-[7px] border-[1px] py-3 px-4">   
                                            <TabContext value={value}>
                                            <TabList onChange={handleChange} className="border-b-[1px] border-solid border-[#dfe2e1]">
                                              <Tab value='1' label="Mô tả sản phẩm" />
                                              <Tab value='2' label="Thông tin chi tiết" /> 
                                            </TabList>
                                            <TabPanel value='1'>
                                              <div className="detail-product py-3 " >
                                                {/* <h3 className="text-[#04070a] text-[22px] mb-[10px] leading-[35px] captitalize"></h3> */}
                                                <p className="text-[#666] text-[15px] font-semibold text-left leading-[26px]">{product.bookDetail}</p>
                                              </div>
                                            </TabPanel>
                                            <TabPanel value='2'>
                                              <div className="information-product">
                                                <div className="col-12">
                                                  <table className="table">
                                                    <tbody>
                                                      {/* <tr>
                                                        <th>Mã Hàng</th>
                                                        <td>  </td>
                                                      </tr> */}
                                                      <tr>
                                                        <th>Tên tác giả</th>
                                                        {/* {product.author ?
                                                          ( <p className='text-[17px] text-[#100707]'>{product.author.categoryName} </p> )
                                                          : "" } */}
                                                        <td> {product.author} </td>
                                                      </tr>
                                                      <tr>
                                                        <th>Nhà xuất bản</th>
                                                        <td>
                                                          {product.publicCompany ?
                                                           (
                                                            <p> {product.publicCompany?.publicCompanyName} </p>
                                                           ):
                                                          " "
                                                          }
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                        <th>Thể loại</th>
                                                        <td>
                                                        {product.category ?
                                                           (
                                                            <p> {product.category?.categoryName} </p>
                                                           ):
                                                          " "
                                                          }
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <th>Hình thức</th>
                                                        <td>
                                                        {product.form ?
                                                           (
                                                            <p> {product.form?.form} </p>
                                                           ):
                                                          " "
                                                          }
                                                          
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <th>Ngôn Ngữ</th>
                                                        <td>
                                                        {product.language ?
                                                           (
                                                            <p> {product.language.languageName} </p>
                                                           ):
                                                          " "
                                                          }
                                                          </td>
                                                      </tr>
                                                      <tr>
                                                        <th>Số trang</th>
                                                        <td>{product.pageNumber}</td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                  </div>
                                                </div>
                                            </TabPanel>
                                            </TabContext>
                                        
                                    </div>


                            </div>
                            <div className='col-span-1'>
                                <div className="border-solid rounded-[7px] border-[1px] py-3 px-4 mb-3" >
                                    <ul>
                                        <li className="flex my-[10px] capitalize">
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Thể loại <span>:</span> </label>
                                            {product.category ?
                                                           (
                                                            <p> {product.category?.categoryName} </p>
                                                           ):
                                                          " "
                                            }
                                        </li>
                                        <li className="flex my-[10px] capitalize"> 
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Tên tác giả <span>:</span></label>
                                            {product.author}
                                        </li>
                                        <li className="flex my-[10px] capitalize">
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Nhà xuất bản <span>:</span> </label>
                                            {product.publicCompany ?
                                                           (
                                                            <p> {product.publicCompany?.publicCompanyName} </p>
                                                           ):
                                                          " "
                                                          }
                                        </li>
                                        <li className="flex my-[10px] capitalize">
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Hình thức <span>:</span></label>
                                                  {product.form ?
                                                           (
                                                            <p> {product.form?.form} </p>
                                                           ):
                                                          " "
                                                          }
                                        </li>
                                                              
                                    </ul>
                                </div>
                                <div className="border-solid rounded-[7px] border-[1px] py-3 px-4 mb-3" >
                                    {/* <h3 className="text-[20px] font-[600]">Lượt bán</h3> */}
                                    <ul>
                                        <li className="flex my-[10px] capitalize">
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Số lượng tồn kho <span>:</span> </label>

                                            {product.quantity}
                                        </li>
                                        {/* <li className="flex my-[10px] capitalize"> 
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Lượt bán<span>:</span></label>
                                            3
                                        </li>                      */}
                                    </ul>
                                </div>
                                <div className="border-solid rounded-[7px] border-[1px] py-3 px-4 mb-3" >
                                    <h3 className="text-[20px] font-[600]">Đánh giá sản phẩm</h3>
                                    <ul>
                                        <li className="flex my-[10px] capitalize">
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Số sao<span>:</span></label>
                                            <Rating name="read-only" defaultValue={product.rating} precision={0.5}  readOnly />
                                        </li>
                                        <li className="flex my-[10px] capitalize"> 
                                            <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">Số lượng đánh giá<span>:</span></label>
                                            3
                                        </li>                     
                                    </ul>
                                </div>
                                <div className="border-solid rounded-[7px] border-[1px] py-3 px-4 mb-3" >
                                    <h3 className="text-[20px] font-[600]">Audio Boook</h3>
                                    <AudioSampleAdmin props={product}/>
                                </div>
                            </div>
                            
                        </div>
                        <div className='mt-5'>
                          <ReadSampleAdmin props ={product} />
                        </div>
                    </div>
                </section>
                </>
            )}
            </div>
        </div>
    </>
  )
}

export default DetailProduct