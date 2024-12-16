import React, { useEffect, useState } from 'react'

import Loader from '../componets/Loader';
import Rating from '@mui/material/Rating';
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Grid, Autoplay } from 'swiper/modules'
import listProducts from '../api/productsAPI';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import "swiper/css/grid";
import ActionButton from './ActionButton';
import apiTag from "../api/apiTag";
import { transform,optionCurrency } from './money';


const NewProduct = () => {
    // const {pageNumber } = useParams()
    
    const [loading,setLoading] = useState(true);
    const [dataProduct,setDataProduct] = useState('');
    const [dataCategory, setDataCategory] = useState('')
    const [colorCategory, setColorCategory] = useState(null);

    // const currentCategoryParam = searchParams.get("category") || "";
    // const [category, setCategory] = useState(currentCategoryParam);
    const [fitterCategory, setFitterCategory] = useState('');

    // const arrcategories = [
    //     'Tiểu Thuyết',
    //     'Văn Học',
    //     'Thiếu Nhi',
    //     'Kinh Tế',
    //     'Ngôn Tình',
    //     'Tâm Lí',
    //     "Manga",
    // ]
 
    useEffect (()=> {
        flechData()
    }, [fitterCategory]);

    
    useEffect (()=> {
        flechCatrgory()
    }, []);
    
    const flechCatrgory = async ()=>{
        try {
            const responseCategory = await apiTag.getAllCategory()
            setDataCategory(responseCategory);
        } catch (error) {
            
        }
    }

    const flechData= async() =>{
        try {
            const responseProducts = await listProducts.getAllNewProducts(fitterCategory);
            setDataProduct(responseProducts.products);
            setLoading(false);
        } catch (error) {  

        }
    }
    
    const setChangeCategory = (item)=>{

        setColorCategory(item);
        setFitterCategory(item);
        setLoading (pre=>!pre);
        // searchParams.set("category", item);
        // navigate({ search: searchParams.toString() });

    }

    // const {pageNumber } = useParams()
 
    // const {data , isLoading, error} = useGetProductsQuery();

    // const arrFitterCategory = []
    // for(let i=0;i<dataProduct?.length ;i++){
    //     arrFitterCategory.push(dataProduct[i].category)
    // }
    // const fitterCategory = [...new Set(arrFitterCategory)]

  return (
    <>
    {loading ? (
        <Loader />
    ) : (<>
     <section className="my-8">
        <div className="container-sm">
            <div className="row">
                <div className='col-12'>
                    <div className="flex flex-col mb-[19px] items-center">
                        <div className=" text-[25px] capitalize leading-[50px] font-normal text-[#333333]">
                            Sản Phẩm Mới
                        </div>
                        <div className="mt-3">
                            <ul className="flex flex-row ">   
                            {dataCategory && dataCategory?.map(items => (
                                <li className=" mr-[50px] text-[17px] capitalize leading-[28px] p-[4px] font-normal" onClick={()=> setChangeCategory(items._id)} 
                                style={{
                                cursor: 'pointer',
                                listStyleType: 'none',
                                color: colorCategory===items._id ? '#fff' : 'black',
                                border: colorCategory===items._id ? '1px solid white': '',
                                borderRadius: colorCategory===items._id ? '30px': '',
                                backgroundColor: colorCategory===items._id ? '#ff6162' : ''
                                }}
                                >{items.categoryName} </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        
            { dataProduct?.length>0 &&<Swiper  
          slidesPerView={5}
          spaceBetween={20}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, Autoplay, Grid]}
          grid={
            {rows: 2, fill: 'row'}
          }
        //   pagination={{
        //     enabled: true,
        //     dynamicBullets: true,
        //   }}
          navigation={true}
          loop={true}
          style={
            {
              '--swiper-navigation-color': '#ff00ff',
              '--swiper-pagination-color': '#ff00ff',
            //   '--swiper-pagination-bullet-inactive-color': '#ff00ff',
            }
          }
           className="mySwiper"
        >
             <div className=" flex flex-wrap">
                {loading ? (<Loader/>): (<>
                    { dataProduct && dataProduct?.map((item)=>( 
                <SwiperSlide key={item._id}>
                            <div className="card h-[430px]  group ">
                                <div className="flex justify-center relative ">
                                    <Link to={ `/${item._id}`}>
                                    <img className="max-h-[210px] w-[210px]" src={item.bookImage} alt='bookImg'/>
                                    </Link>
                                
                                </div>
                                
                                <div className='absolute z-[20] h-[45px] w-[45px] bg-[#fff] border-solid rounded-[100%] border-[#eee] left-[-70px] top-1 flex  justify-center border-[1px]'>
                                {/* <ActionButton props={item} /> */}
                                </div>
                    
                            <div className="card-body border-t-[1px] ">
                                <h6 className="font-normal text-[#999] text-[14px] mb-[10px] leading-[1.2] capitalize">

                                {item?.category ? (                                                                 
                                <>                                   
                                    {item?.category?.categoryName}
                                </>
                                    
                                ) : ""}
                                </h6>
                                <Link to={`product/${item._id}`}>
                                <h2 className="font-normal text-[17px] h-[70px] pt-2  line-clamp-2 mb-[10px] leading-[28px] text-[#4b5966] capitalize hover:text-[#5caf90]">
                                {item.bookName}
                                </h2>
                                </Link>
                                <Rating name="half-rating-read mb-[10px]" defaultValue={item.rating} precision={0.5} readOnly />
                                <div> 
                                    <span className="text-[#4b5966] text-[18px] font-bold mr-[7px]">
                                        {transform(item.bookPrice, optionCurrency)}
                                    </span>
                                    {/* <span className="text-[14px] text-[#777] line-through mr-[7px]">7500</span> */}
                                </div>             
                            </div>
                            </div>
                  
                </SwiperSlide>
                
            ))}
                
                </>) }
           
            </div>
        </Swiper>}
        </div>
        
        
    </section>
        
        </>) }
        </>
  )
}

export default NewProduct