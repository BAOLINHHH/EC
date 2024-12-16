import React, {useEffect, useState} from 'react'
import Loader from '../componets/Loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/grid";
import {Navigation, Grid  } from 'swiper/modules';
import { FaStar } from "react-icons/fa6";
import images from '../assets/indexImg';
import listProducts from '../api/productsAPI';
import { transform,optionCurrency } from './money';
import { Link } from "react-router-dom"
const FlashSale = () => {
  
    
    const [loading,setLoading] = useState(true);
    const [dataProduct,setDataProduct] = useState();


    useEffect (()=> {
        flechData()
    }, []);

    const flechData =async () =>{
        try {
            const responseProducts = await listProducts.getEbookProducts()
            setDataProduct(responseProducts.products)
            setLoading(false)
          } catch (error) {
          }
    }
   
  return (
    
    <>
    {loading ? (
        <Loader />
    ) : (<>
        {/* <section className="my-8">
            <div className="container-sm">
                <div className="grid justify-items-center">
                    <div className="col-span-12 ">
                            <div className="flex flex-col">
                            <h3 className="font-[600] text-[#333333] text-[20px]  leading-[50px]  relative text-center">Sieu sale trong tuan</h3>
                            <div className="flex flex-row gap-4 w-full ">
                                <div className="">
                                    <span className='text-[50px]'>30</span>
                                    <span>day</span>
                                </div>
                                <div className="">
                                    <span className="text-[50px]">30</span>
                                    <span>phut</span>
                                </div>
                                <div className="">
                                    <span className="text-[50px]">30</span>
                                    <span>phut</span>
                                </div>
                            </div>
                            </div> 
                    </div>
                </div>
                <Swiper
                    slidesPerView={2}
                    loop= {'true'}
                    spaceBetween={30}
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: true,
                  }}
                  autoplay={{
                    delay: 300,
                    disableOnInteraction: false,
                  }}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev',
                      clickable: true,
                    }}
                    modules={[EffectCoverflow, Navigation]}
                    className="mySwiper">
                 
                        {data.products.slice(0,10).map((product)=>(
                        <SwiperSlide>
                        <div className=" card flex flex-row border-[2px] w-[450px] ">
                            <div className="basis-[150px] "> 
                                <img src={product.bookImage} />
                            </div>
                            <div className="w-[calc(100%-150px)] basis-[calc(100%-150px)] pl-3">  */}
                                {/*  lan 2 <div className="flex flex-row ">
                                    <h6 className=" flex-auto flex justify-center items-center h-[40px] w-[40px] bg-[#a6c7f2] border-[1px] border-solid rounded-[5px] text-[#4c43cc] ">{product.category}</h6> 
                                    <span className=" flex-auto flex justify-center items-center h-[40px] w-[40px] ml-5 bg-[#c48d20]  border-[1px] border-solid rounded-[5px] text-[#f8e825] "><  FaStar style={style} />{product.rating} </span>
                                </div> */}
                                {/* <div className="flex flex-row ">
                                    <div className="basis-[100px] ">
                                        <h6 className="  flex justify-center items-center h-[40px] bg-[#a6c7f2] border-[1px] border-solid rounded-[5px] text-[#4c43cc] ">{product.category}</h6> 
                                    </div>
                                    <div className="basis-[100px] ">
                                        <span className="  flex justify-center items-center h-[40px] ml-5 bg-[#c48d20]  border-[1px] border-solid rounded-[5px] text-[#f8e825] "><  FaStar style={style} />{product.rating} </span>
                                    </div>
                                </div>
                                <h2 className="font-normal text-[25px] h-[40px] pt-2 line-clamp-2 mb-[3px] leading-[28px] text-[#050c13] capitalize hover:text-[#5caf90]">{product.bookName}</h2>
                                <h6 className="font-normal text-[14px]  truncate mb-[10px] leading-[28px] text-[#4b5966] capitalize">{product.author}</h6>
                                <div> 
                                    <span className="text-[#5c3dcc] text-[25px] font-bold mr-[7px]">{product.bookPrice}</span>
                                    <span className="text-[14px] text-[#777] line-through mr-[7px]">7500</span>
                                    <span className=" hh-[30px] w-[30px]  text-[#eee] border-[1px] border-solid rounded-[5px] bg-red-500 ">25%</span>
                                </div>
                            </div>
                        </div>
                    
                        </SwiperSlide>
                        ))}
                 
                    
                </Swiper>
            </div>
        </section> */}
        <section className="my-9">
            <div className="container-sm">
                <div className="row ">
                <div className="col-4 ">
                    <img className='h-[650px]' src={images.imgBanner1}/> 
                </div>
                <div className=" col-8 mt-5 ">
                    <div className="mb-3 flex justify-center bg-[#f2f2f2]">
                        <h2 className=" text-[25px] font-semibold text-[#4b5966] capitalize leading-[1]">Sách Ebook của cửa hàng</h2>
                    </div>
                    <div className="mb-5">
                       <Swiper 
                          slidesPerView={2}
                          spaceBetween={30}
                          modules={[Navigation, Grid]}
                          grid={
                            {rows: 3, fill: 'row'}
                          }
                          navigation={true}
                          style={
                            {
                              '--swiper-navigation-color': '#ff00ff',
                              '--swiper-pagination-color': '#ff00ff',
                            //   '--swiper-pagination-bullet-inactive-color': '#ff00ff',
                            }
                          }
                        >
                        { dataProduct && dataProduct?.map((product)=>(
                        <SwiperSlide key={product._id} >
                        <div className=" flex border-[1px] group">
                            <div className="basis-[150px] relative">
                                <Link to={`${product._id}`}>
                                    <img className='w-[150px] h-[150px]' src={product.bookImage}  alt='bookImg'/>
                                </Link>
                            </div>
                            
                            <div className="w-[calc(100%-150px)] basis-[calc(100%-150px)] pl-3">                 
                                <div className="flex flex-row mb-2 ">
                                    <div className="basis-[100px] ">
                                    <h6 className="flex justify-center items-center h-[40px] bg-[#a6c7f2] border-[1px] border-solid rounded-[5px] text-[#4c43cc]">
                                    {product?.category ? ( 
                                            <>
                                        {product?.category?.categoryName}
                                        </>
                                        ) : ""}
                                        </h6>
                                    </div>
                                    <div className="basis-[100px] ">
                                        <span className="  flex justify-center items-center h-[40px] ml-5 bg-[#c48d20]  border-[1px] border-solid rounded-[5px] text-[#f8e825] "><  FaStar style={{ color:'#f8e825',fontSize:'21px', paddingRight: '3px'}} /> {product.rating} </span>
                                    </div>
                                </div>
                                <Link to={`${product._id}`}>
                                <h2 className="font-normal text-[25px] h-[40px] pt-2 line-clamp-2 mb-2 leading-[28px] text-[#050c13] capitalize hover:text-[#5caf90]">{product.bookName} </h2>
                                </Link>
                                {/* <h6 className="font-normal text-[14px]  truncate mb-[10px] leading-[28px] text-[#4b5966] capitalize"> {product.author.authorName} </h6> */}
                                <div className="flex  items-center"> 
                                <span className="text-[#4b5966] text-[24px] font-bold  ">
                                    {transform(product.bookPrice, optionCurrency)}
                                </span>
                                </div> 
                            </div>
                        </div>
                        </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                </div>
            </div>
        </section>
        </>) }
        </>
  )
}

export default FlashSale