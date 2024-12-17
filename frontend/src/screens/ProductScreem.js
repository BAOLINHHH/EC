import { useParams, useNavigate, Link } from "react-router-dom";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Image, ListGroup, Button, Form, Spinner } from "react-bootstrap";
import { BsCart, BsSuitHeart } from "react-icons/bs";
import Loader from "../componets/Loader";
import Message from "../componets/Message";
import { FaStar } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

import { Swiper, SwiperSlide } from 'swiper/react';

import {Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import "swiper/css/grid";


import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { optionCurrency, transform } from "../componets/money";
import { FaHeart } from "react-icons/fa";
import favoriteApi from "../api/favoriteApi";
import listProduct from "../api/productsAPI";
import orderApi from "../api/orderApi";
const ProductScreem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const [dataProduct, SetdataProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { userInfo } = useSelector((state) => state.auth);
  // const [createReview, { isLoading: loadingProductReview }] =useCreateReviewMutation();
  const [isLoadingProductReview, setIsLoadingProductReview] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [qty, setQuantity] = useState(1);
  const [isinFavorite, setIsinFavorite] = useState("");
  // const {id: productId}= useParams();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false)
  const [recommenData, setRecommenData ] = useState('') 
  // const { data : product,isLoading, refetch, error }= useGetProductDetailQuery(productId);

  useEffect(() => {
    flechData();
    flechDataFavorite();
  }, [isRefresh]);

  const flechData = async () => {
    try {
      const responseProduct = await listProduct.getProductDetail(id);
      const responseRecommen = await listProduct.getrecommen(id);
      setRecommenData(responseRecommen);
      SetdataProduct(responseProduct);
      setLoading(false);
      console.log("responseProduct", responseProduct);
    } catch (error) {}
  };
  const flechDataFavorite = async () => {
    try {
      const responseFavoriteProduct = await favoriteApi.checkFavorite(id);
      setIsinFavorite(responseFavoriteProduct.isInWishlist);
    } catch (error) {}
  };
  const removeFavoriteHandler = async () => {
    try {
      await favoriteApi.deleteFavorite(id);
      flechDataFavorite();
      toast.success("Xóa sản phẩm yêu thích thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xóa sản phẩm yêu thích thất bại");
    }
  };
  const addToFavoriteHandler = async () => {
    try {
      await favoriteApi.addFavorite(id);
      flechDataFavorite();
      toast.success("Thêm sản phẩm yêu thích thành công");
    } catch (error) {
      console.log(error);
      toast.error("Thêm sản phẩm yêu thích thất bại");
    }
  };

  const handlogin = () => {
    toast.info("Đăng nhập để thêm sản phẩm yêu thích");
    navigate("/login");
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };
  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber > dataProduct.bookQuaranty) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };


  const addToCartHandler = () => {
    dispatch(addToCart({ ...dataProduct, qty }));
    showToastMessage();
  };
 
  const addToBuyNowHandler = async () => {
    try {
      setIsLoading(false);
      const payload2 = {
        amount: dataProduct.bookPrice,
        orderDescription: "Thanh toan ebook: #" + id,
        orderType: "billpayment",
        language: "vn",
      };
      const responseVNPay = await orderApi.createPaymentUrlVNPay(payload2);
      if (responseVNPay) {
        const { vnpUrl } = responseVNPay;
        // Chuyển hướng tới VNPAY
        window.open(vnpUrl, "_blank");
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);

      if (error.response.status === 400) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
      // Hiển thị thông báo lỗi cho người dùng
      // alert(error.message || "Đã có lỗi xảy ra");
    }
  };

 
  const showToastMessage = () => {
    toast.success("Thêm sản phẩm vào giỏi hàng thành công !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const showToastMessageFavorite = () => {
    toast.success("Thêm sản phẩm danh sách yêu thích !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const postData = { rating: rating, comment: comment };
      await listProduct.createReview(id, postData);
      setIsRefresh(pre =>!pre)
      toast.success("Đánh giá thành công");
    } catch (err) {
      toast.error("Tài khoản đã đánh giá sản phẩm");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="mb-5">
            <div className="container-sm">
              <div className="row">
                <div className=" col-6 flex flex-col">
                  <div className="max-h-[390px] max-w-[390px]  border-[1px] border-solid border-[#e9e9e9] bg-[#f7f7f8] rounded-[5px] relative left-[150px]">
                    <Image className="h-[390px] w-[390px]"
                      src={dataProduct.bookImage}
                      alt={dataProduct.bookName}
                      fluid
                    />
                  </div>
                  <div className=" flex justify-evenly mt-3">
                    {dataProduct?.audioUrlPresent ? (<>
                      <Link to={`/audio/${dataProduct._id}`}>
                    <Button
                      className=" bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                      type="button"
                     
                    >
                      Nghe thử
                    </Button>
                    </Link>
                    </>): (<>
                    </>) }
                      {dataProduct?.pdfUrlPresent ? (<>
                        <Link to ={`/readsample/${dataProduct._id}`} >
                      <Button
                        className=" bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                        type="button"
                      >
                        Đọc thử
                      </Button>
                    </Link>
                      </>): (<>
                      
                      </>) }  
              
                  </div>
                </div>

                <div className="col-6 pl-[20px]">
                  <h3 className="text-[#04070a] text-[22px] mb-[20px] leading-[35px] captitalize">
                    {dataProduct.bookName}
                  </h3>

                  <div className="flex items-center mb-[15px]">
                    <Rating
                      className="mr-[15px] text-[15px]"
                      name="half-rating-read"
                      defaultValue={dataProduct.rating}
                      precision={0.5}
                      readOnly
                    />
                    <p className="text-[#7a7a7a] text-[15px] leading-[1.75]">
                      ({dataProduct.rating} đánh giá)
                    </p>
                  </div>
                  <div className>
                    <span className="text-[#4b5966] text-[22px] font-bold mr-[7px]">
                      {transform(dataProduct.bookPrice, optionCurrency)}
                    </span>
                  </div>
                  <div className="mb-[15px]">
                    <ul>
                      <li className="flex my-[10px] capitalize">
                        <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">
                          Thể loại <span>:</span>
                        </label>

                        {dataProduct?.category ? (
                          <>{dataProduct.category.categoryName}</>
                        ) : (
                          " "
                        )}
                      </li>
                      <li className="flex my-[10px] capitalize">
                        <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">
                          Tên tác giả <span>:</span>
                        </label>
                        {dataProduct.author}
                      </li>
                      <li className="flex my-[10px] capitalize">
                        <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">
                          Nhà xuất bản <span>:</span>
                        </label>

                        {dataProduct?.publicCompany ? (
                          <>{dataProduct.publicCompany.publicCompanyName}</>
                        ) : (
                          ""
                        )}
                      </li>
                      <li className="flex my-[10px] capitalize">
                        <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">
                          Hình thức <span>:</span>
                        </label>
                        {dataProduct.form ? <>{dataProduct.form.form}</> : " "}
                      </li>
                      <li className="flex items-center my-[10px] capitalize">
                        <label className="min-w-[100px] mr-[10px] text-[#2b2b2d] font-semibold flex justify-between">
                          Trạng thái<span>:</span>
                        </label>
                        <label className=" text-[#a6e157] font-semibold ">
                          {dataProduct?.ebook == false ? (<>
                            {dataProduct?.bookQuaranty > 0
                            ? "Còn Hàng"
                            : "Hết Hàng"}
                          </> ): <>Ebook</> }
                        
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center">
                    {dataProduct.ebook == false ? (
                      <>
                        <div className="input-group w-[150px] h-[40px] m-[5px]">
                          <button
                            className="btn btn-outline-secondary px-3 "
                            type="button"
                            onClick={decreaseQty}
                          >
                            <AiOutlineMinus />
                          </button>
                          <input
                            type="number"
                            className="form-control count text-center border border-secondary"
                            value={qty}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary px-3 "
                            type="button"
                            onClick={increaseQty}
                          >
                            <AiOutlinePlus />
                          </button>
                        </div>

                        <div className="m-[5px] h-[40px] flex ">
                          <Button
                            className=" mx-2 bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                            type="button"
                            disabled={dataProduct.bookQuaranty === 0}
                            onClick={addToCartHandler}
                          >
                            <BsCart />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    {dataProduct.ebook == true ? (
                      <>
                        <Button
                          className="mr-3 text-[14px] h-[35px]"
                          variant={isLoading ? "secondary" : "outline-success"} // Thay đổi màu sắc khi đang tải
                          onClick={addToBuyNowHandler}
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Đang xử lý...
                            </>
                          ) : (
                            "Mua ngay"
                          )}
                        </Button>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className=" flex h-[40px]">
                      {!userInfo ? (
                        <>
                          <Button
                            className="bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                            onClick={handlogin}
                            type="button"
                          >
                            <BsSuitHeart />
                          </Button>
                        </>
                      ) : isinFavorite ? (
                      
                        <Button
                          className="bg-[#fff] text-[#d91612] text-[14px] border-[2px] border-[#f40b0b] border-solid transition-all duration-[0.3s] ease-in-out hover:text-[#44c2c0] hover:bg-[#fff] hover:border-[#d91612]"
                          onClick={removeFavoriteHandler}
                          type="button"
                        >
                          <FaHeart />
                        </Button>
                       
                      ) : (
                       
                        <Button
                          className=" bg-[#fff] text-[#44c2c0] text-[14px] border-[2px] border-[#f40b0b] border-solid transition-all duration-[0.3s] ease-in-out  hover:text-[#d91612]  hover:bg-[#fff] hover:border-[#d91612]"
                          onClick={addToFavoriteHandler}
                          type="button"
                        >
                          <FaHeart />
                        </Button>
                      
                      )}
                      {/* <Button className='bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]'
                                        onClick={addToFavoriteHandler}
                                        type='button'
                                      >
                                      <BsSuitHeart/>             
                                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="container-sm">
              <div className="row">
                <div className="col-12">
                  <TabContext value={value}>
                    <TabList
                      onChange={handleChange}
                      className="border-b-[1px] border-solid border-[#dfe2e1]"
                    >
                      <Tab value="1" label="Mô tả sản phẩm" />
                      <Tab value="2" label="Thông tin chi tiết" />
                      <Tab value="3" label=" Đánh giá sản phẩm" />
                    </TabList>
                    <TabPanel value="1">
                      <div className="detail-product py-3 ">
                        <h3 className="text-[#04070a] text-[22px] mb-[10px] leading-[35px] captitalize">
                          {dataProduct.bookName}
                        </h3>
                        <p className="text-[#666] text-[15px] font-semibold text-left leading-[26px]">
                          {dataProduct.bookDetail}
                        </p>
                      </div>
                    </TabPanel>
                    <TabPanel value="2">
                      <div className="information-product">
                        <div className="col-12">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th>Mã Hàng</th>
                                <td> {dataProduct._id} </td>
                              </tr>
                              <tr>
                                <th>Tên tác giả</th>
                                <td>{dataProduct.author}</td>
                              </tr>
                              <tr>
                                <th>Nhà xuất bản</th>
                                <td>
                                  {dataProduct.publicCompany ? (
                                    <>
                                      {
                                        dataProduct.publicCompany
                                          .publicCompanyName
                                      }
                                    </>
                                  ) : (
                                    " "
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Thể loại</th>
                                <td>
                                  {dataProduct?.category ? (
                                    <>{dataProduct.category.categoryName}</>
                                  ) : (
                                    " "
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Hình thức</th>
                                <td>
                                  {dataProduct?.form ? (
                                    <>{dataProduct.form.form}</>
                                  ) : (
                                    " "
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Ngôn Ngữ</th>
                                <td>
                                  {dataProduct.language ? (
                                    <>{dataProduct.language.languageName}</>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Số trang</th>
                                <td>{dataProduct.pageNumber}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="3">
                      <div className="review-product">
                        <div className="row">
                          {dataProduct.reviews.length === 0 && (
                            <Message>Không có đánh giá</Message>
                          )}
                          <ListGroup variant="flush">
                            {dataProduct.reviews.map((review) => (
                              <ListGroup.Item key={review._id}>
                                <div className="flex flex-col gap-y-1">
                                  <strong>{review.name}</strong>
                                  <Rating value={review.rating} />
                                  <p>{review.createdAt.substring(0, 10)}</p>
                                  <p>{review.comment}</p>
                                </div>
                              </ListGroup.Item>
                            ))}

                            <ListGroup.Item>
                              <div className="d-flex ">
                                <h3>VIẾT ĐÁNH GIÁ SẢN PHẨM</h3>
                              </div>
                           

                              <Form onSubmit={submitHandler}>
                                <Form.Group className="my-2" controlId="rating">
                                  <Form.Label>Đánh giá</Form.Label>
                                  <Form.Control
                                    as="select"
                                    required
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                  >
                                    <option value="">Lược chọn...</option>
                                    <option value="1">1 - Kém</option>
                                    <option value="2">2 - Khá</option>
                                    <option value="3">3 - Tốt</option>
                                    <option value="4">4 - Rất tốt</option>
                                    <option value="5">5 - Xuất sác</option>
                                  </Form.Control>
                                </Form.Group>
                                <Form.Group
                                  className="my-2"
                                  controlId="comment"
                                >
                                  <Form.Label>Bình luận</Form.Label>
                                  <Form.Control
                                    as="textarea"
                                    row="3"
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                  ></Form.Control>
                                </Form.Group>
                                <Button
                                  // disabled={loadingProductReview}
                                  type="submit"
                                  variant="primary"
                                >
                                  Gửi đánh giá
                                </Button>
                              </Form>
                            </ListGroup.Item>
                          </ListGroup>
                         
                        
                                                    
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                 
                                    
                </div>
                <div className="col-12">
                <div className="mb-3 flex justify-center bg-[#f2f2f2]">
                        <h2 className=" text-[25px] font-semibold text-[#4b5966] capitalize leading-[1]">Sản phẩm liên quan</h2>
                    </div>
                    <div>
                        <Swiper
                        slidesPerView={5}
                        spaceBetween={20}
                     
                        modules={[Navigation]}
                       
                        navigation={true}
                        style={
                          {
                            '--swiper-navigation-color': '#ff00ff',
                            '--swiper-pagination-color': '#ff00ff',
                          //   '--swiper-pagination-bullet-inactive-color': '#ff00ff',
                          }
                        }
                       >
                        { recommenData && recommenData?.map((product)=>(
                            <SwiperSlide key={product._id} >
                            <div className="flex flex-col group">
                                <div className=" flex justify-center relative">
                                    <img className="w-[150px] h-[150px]" src={product.bookImage} alt='bookImg' />
                                </div>  
                                <div className="py-1"> 
                                    <h2 className="font-normal text-[17px] w-[250px] pt-1  line-clamp-1 mb-[5px] leading-[28px] text-[#4b5966] capitalize hover:text-[#5caf90]">
                                    {product.bookName}
                                    </h2>
                                </div>
                                <div className="flex items-center  gap-2">
                                    <span className="  flex justify-center text-[22px] items-center h-[40px] text-[#f52525] "><  FaStar style={{color:'#f8e825',fontSize:'25px', paddingRight: '3px'}} />{product.rating} </span>
                                    <span className="text-[#4b5966] text-[22px] font-bold  ">{product.bookPrice}</span>
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

        </>
      )}
     
    </>
  );
};

export default ProductScreem;
