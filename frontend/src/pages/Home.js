import book5img from '../imageshome/tieuthuyet.jpg'
import book6img from '../imageshome/vanhoc.jpg'
import book7img from '../imageshome/thieunhis.jpg'
import book8img from '../imageshome/kinhte.jpg'
import book9img from '../imageshome/ngontinh.jpg'
import book10img from '../imageshome/tamli.jpg'
import book11img from '../imageshome/manga1.png'
import banner1 from '../imageshome/main_banner.png'
import images from '../assets/indexImg'
import HomeScreen from '../screens/HomeScreen'
import ProductCarousel from '../componets/ProductCarousel'
import { Link } from 'react-router-dom'
import {useNavigate} from "react-router-dom";
import { FaShippingFast } from "react-icons/fa";
import { BsShieldPlus } from "react-icons/bs";
import { BsBook } from "react-icons/bs";
import { BsTagsFill } from "react-icons/bs";
import NewProduct from '../componets/NewProduct'
import FlashSale from '../componets/FlashSale'
import TopProduct from '../componets/TopProduct'
import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css/pagination';
// import { Pagination } from 'swiper/modules';
import apiTag from '../api/apiTag'
import Loader from '../componets/Loader'
import 'swiper/css';
import { useEffect, useState } from 'react'
const Home = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    useEffect(()=>{
        flechData()
    },[])
   const flechData = async()=>{
        try {
            const response = await apiTag.getAllCategory();
            setCategory(response);
            setIsLoading(false);
        } catch (error) {
            
        }
        
   }
   const handleFitter=(id)=>{
    navigate(`/all-product?category=${id}`);
   }
     
    const categories = [{name:'Tiểu Thuyết',thumbnail:book5img},
    {name:'Văn Học',thumbnail:book6img},{name:'Thiếu Nhi',thumbnail:book7img},{name:'Kinh Tế',thumbnail:book8img},{name:'Ngôn Tình',thumbnail:book9img},{name:'Tâm Lí',thumbnail:book10img},{name:'Manga',thumbnail:book11img}]
    const setCategorys = (category) => {
        navigate(`/all-product?category=${category}`);
      };
  

    return (
    <>
    {/* <section className='home-wrapper-1 py-5'>
        <div className='container-xxl'> */}
            {/*  lan 2 <div className='row'>
                <div className='col-6'>
                    <div className='main-banner position-relative'> 
                        <img src={bookimg} className ="img-fuild rounded-3"alt='main banner' />
                    </div>
                </div>
                <div className='col-6'>
                <div className= 'd-flex flex-nowrap gap-10 justify-content-between align-items-center'>  
                        <div className='small-banner position-relative '> 
                            <img src={book2img} className ="img-fuild rounded-3"alt='main banner' />
                        </div>
                        <div className='small-banner position-relative '> 
                            <img src={book3img} className ="img-fuild rounded-3"alt='main banner' />
                        </div>
                        <div className='small-banner position-relative '> 
                            <img src={book4img} className ="img-fuild rounded-3"alt='main banner' />
                        </div>
                </div>
                </div>
            </div> */}
        
        {/* <ProductCarousel />
        </div>
    </section> */}

    <ProductCarousel />
    <section className='my-9'>
        <div className='container-sm py-5'>
            <div className='row g-4 '>
                <div class=" col-lg-3 ">
                    <div className='flex justify-center border-[#eee] rounded-[3px] border-[2px] border-solid w-[300px] h-[64px] '>
                        <div className='pe-3 pt-2  '>
                        <FaShippingFast size={30} />
                        </div>
                        <div className='pt-2'>
                            <h3 className='text-[19px] leading-none text-uppercase text-[#282828] font-[400] mb-1'>
                                Miễn phí vận chuyển
                            </h3>
                            <p className=" text-[16px] leading-none text-[#777]">
                                Đơn hàng trên 200.000đ .
                            </p> 
                        </div>
                    </div>
                </div>
                <div class=" col-lg-3">
                <div className='flex justify-center border-[#eee] rounded-[3px] border-[2px] border-solid w-[300px] h-[64px]'>
                        <div className='pe-3 pt-2'>
                        <BsShieldPlus size={30} />
                        </div>
                        <div className=" pt-2">
                            <h3 className='text-[19px] leading-none text-uppercase text-[#282828] font-[400] mb-1'>
                                An toàn khi thanh toán
                            </h3>
                            <p className=" text-[16px] leading-none text-[#777]">
                                100% bảo mật khi thanh toán.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                <div className='flex justify-center border-[#eee] rounded-[3px] border-[2px] border-solid w-[300px] h-[64px]'>
                        <div className='pe-3 pt-2'>
                        <BsBook  size= {30} />
                        </div>
                        <div className=" pt-2">
                            <h3 className='text-[19px] leading-none text-uppercase text-[#282828] font-[400] mb-1'>
                                Sản phẩm chính hãng
                            </h3>
                            <p className=" text-[16px] leading-none text-[#777]">
                                Nói không với sách lậu.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                <div className='flex justify-center border-[#eee] rounded-[3px] border-[2px] border-solid w-[300px] h-[64px]'>
                        <div className='pe-3 pt-2'>
                        <BsTagsFill size= {30} />
                        </div>
                        <div className=" pt-2">
                            <h3 className='text-[19px] leading-none text-uppercase text-[#282828] font-[400] mb-1'>
                                Ưu đãi hấp dẫn
                            </h3>
                            <p className=" text-[16px] leading-none text-[#777]">
                                Nhiều sự kiện khuyến mãi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </section>

        {isLoading ?( <Loader/>) :(
            <section className="my-9">
            <div className="container-sm">
                <div className="col-12 mb-3">
                    <h3 className="mb-[19px] text-[20px] capitalize leading-[28px] font-normal">Danh Mục Sảm Phẩm</h3>
                </div>
                <Swiper
                     slidesPerView={5}
                     spaceBetween={20}
                    //  pagination={{
                    //    clickable: true,
                    //  }}
                    //  modules={[Pagination]}
                     className="mySwiper"
                   >
                { category.map(item =>(
                  <SwiperSlide key={item._id}>
                <div className=" rounded-[5px] border-[3px] flex justify-center hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-[#faf1ff]">
                    <div className=" flex flex-col justify-items-center items-center rounded-[5px] bg-[#fff] w-[166px] h-[140px] pt-[10px] "onClick={() =>handleFitter(item._id) }>
                    <img className='w-[100px] h-[100px]' src={item.categoryImage}/>
                    <div>{item.categoryName}</div>
                    </div>
                </div>
                </SwiperSlide>
                ) )}
                  </Swiper>
                </div>
        </section>
        )}
    
    <NewProduct />
   
    <section className="my-9">
        <div className="container-sm">
            <div className="flex justify-center">
                <img  className="w-full h-[390px] rounded-[5px]" src={banner1} />
            </div>
        </div>
    </section>
    <FlashSale />
    <section className="my-9">
        <div className="container-sm">
            <div className="row">
                <img src={images.imgBanner2}/>
            </div>
        </div>
    </section>
    <TopProduct />
              
  
        {/* <Link to={ '/all-product'}>
    <button type="button" className="btn btn-primary d-flex justify-content-center ">Xem Thêm</button>
        </Link> */}
    {/* <section className='home-wrapper-2 py-5'>
        <div className='container-xxl'>
            <div className='col-12 categories'>
            <span className='header-tile' >Danh Mục Sản Phẩm</span>
            </div>
             <div className='row'>
                <div className='col-12'>
                    <div className='categories d-flex justify-content-between align-items-center'>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            
                            <div>
                                <h6 style={{marginLeft: "6px"}}>Tiểu Thuyết </h6>
                            </div>
                            <img src={book5img} alt='novel' />
                            
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "20px"}}>Văn Học </h6>
                            </div>
                            <img src={book6img} alt='literature' />
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "15px"}}>Thiếu Nhi</h6>
                            </div>
                            <img src={book7img} alt='child'/>
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "24px"}}>Kinh Tế</h6>
                            </div>
                            <img src={book8img} alt='economy' />
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "12px"}}>Ngôn Tình</h6>
                            </div>
                            <img src={book9img} alt='love' />
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "25px"}}>Tâm Lí</h6>
                            </div>
                            <img src={book10img} alt='mentality' />
                        </div>
                        <div className='fhs_nowrap_two fhs_center_center'>
                            <div>
                                <h6 style={{marginLeft: "25px"}}>Manga</h6>
                            </div>
                            <img src={book11img} alt='mentality' />
                        </div>  
                    </div>
                </div>
             </div>
           
        </div>
    </section> */}
    {/* <section className='home-wrapper-2 py-5'>
        <div className='container-xxl'>
        <div className='col-12 categories'>
            <span className='header-tile' >Danh Mục Sản Phẩm</span>
            </div>
             <div className='row'>
                <div className='col-12'>
                    <div className='categories d-flex justify-content-between align-items-center'>
                    {categories.map(item => (
                     <div className='item'>
                    <h6 style={{paddingLeft: '15px'}}>
                    {item.name}
                    </h6>
                    <div className='thumbnail'>
                        <img 
                        onClick={() => setCategorys(item.name)}
                         src={item.thumbnail }>
                        </img>
                    </div>
                    </div>
                ))} 
                    </div>
                </div>
             </div>
           
        </div>
    </section>
     <section className='list-products py-5 '>
            <div className='col-12 categories'>
                <div className='header-tile' >
                    <span className='header-tile-product'>Sản Phẩm</span>
                </div>
                <HomeScreen/>
            </div>
           
    <div className='col-12 button-home'>
        <Link to={ '/all-product'}>
    <button type="button" className="btn btn-primary d-flex justify-content-center ">Xem Thêm</button>
        </Link>
    </div>
    </section> */}
    {/* <section className='marque-wrapper py-5'>
        <div className='container-xxl'>
            <div className='row'>
                <div className='col-12'>
                    <div className='marque-inner-wrapper card-wrapper'>
                        <Marquee className='d-flex'>
                           <div className='max-4 w25'>
                            <img src={book12img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book13img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book14img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book15img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book16img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book17img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book18img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book19img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book20img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book21img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book22img} alt='brand'/>
                           </div>
                           <div className='max-4 w25'>
                            <img src={book23img} alt='brand'/>
                           </div>
                        </Marquee>
                    </div>
                </div>
            </div>
        </div>
    </section> */}
    </>
  );
}

export default Home