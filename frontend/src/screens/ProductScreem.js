import { useParams, useNavigate, Link } from "react-router-dom";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Image, ListGroup, Button, Form, Spinner } from "react-bootstrap";
import { BsCart, BsSuitHeart } from "react-icons/bs";
import Loader from "../componets/Loader";
import Message from "../componets/Message";
import {
  useGetProductDetailQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";

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
import cartApi from "../api/cartApi";

import { addToDetailProduct } from "../slices/detailProductSlice";
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

  // const { data : product,isLoading, refetch, error }= useGetProductDetailQuery(productId);

  useEffect(() => {
    flechData();
    flechDataFavorite();
  }, []);

  const flechData = async () => {
    try {
      const responseProduct = await listProduct.getProductDetail(id);
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
  // const addToCartAndBuyHandler = () =>{
  //   dispatch (addToCart({...dataProduct, qty}));
  //   navigate ('/cart');
  // }

  // const checkoutHandler = ()=>{
  //   navigate('/login?redirect=/shipping');
  // }

  //   const addToCartHandler = async () =>{
  //     const cartItems={...dataProduct}
  //     await cartApi.add({...cartItems,qty});

  // }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...dataProduct, qty }));
    showToastMessage();
  };
  const handleReadSample = () => {
    // dispatch(addToDetailProduct({ ...dataProduct }));
    // navigate("/readsample");
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

  //   const addToFavoriteHandler = () =>{

  //     dispatch (addToFavorite({...product}))
  //     showToastMessageFavorite();

  // }
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
      // await createReview({
      //   productId,
      //   rating,
      //   comment,
      // }).unwrap();
      // refetch();
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
                  {/* <div className=" relative left-[100px]">
                                  <div className="max-h-[68px] max-w-[68px] border-[1px] border-solid border-[#e9e9e9] rounded-lg my-1"> 
                                    <Image src={dataProduct.bookImage} alt={dataProduct.bookName} fluid/>
                                  </div>
                                  <div className=" max-h-[68px] max-w-[68px] border-[1px] border-solid border-[#e9e9e9] rounded-lg my-1">
                                    <Image src={dataProduct.bookImage} alt={dataProduct.bookName} fluid/></div>
                                  <div className=" max-h-[68px] max-w-[68px] border-[1px] border-solid border-[#e9e9e9] rounded-lg my-1"> 
                                    <Image src={dataProduct.bookImage} alt={dataProduct.bookName} fluid/></div>
                                  <div className=" max-h-[68px] max-w-[68px] border-[1px] border-solid border-[#e9e9e9] rounded-lg my-1"> 
                                    <Image src={product.bookImage} alt={dataProduct.bookName} fluid/></div>
                                  <div className=" max-h-[68px] max-w-[68px] border-[1px] border-solid border-[#e9e9e9] rounded-lg my-1"> 
                                    <Image src={product.bookImage} alt={product.bookName} fluid/></div>
                                </div> */}
                  <div className="max-h-[390px] max-w-[390px]  border-[1px] border-solid border-[#e9e9e9] bg-[#f7f7f8] rounded-[5px] relative left-[150px]">
                    <Image className="h-[390px] w-[390px]"
                      src={dataProduct.bookImage}
                      alt={dataProduct.bookName}
                      fluid
                    />
                  </div>
                  <div className=" flex justify-evenly mt-3">
                    {/* <Link to="/audio" >
                                      <Button className=' bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]'
                                        type='button'
                                      >
                                      Nghe thử   
                                      </Button>
                                      </Link> */}
                      <Link to={`/audio/${dataProduct._id}`}>
                    <Button
                      className=" bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                      type="button"
                     
                    >
                      Nghe thử
                    </Button>
                    </Link>
                    <Link to ={`/readsample/${dataProduct._id}`} >
                      <Button
                        className=" bg-[#ffffff] text-[#0e0606] text-[14px] border-[2px] border-[#62ab00] border-solid transition-all duration-[0.3s] ease-in-out hover:bg-[#62ab00] hover:text-[#ffff] hover:border-[#63ae34]"
                        type="button"
                      >
                        Đọc thử
                      </Button>
                    </Link>
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
                          {dataProduct.bookQuaranty > 0
                            ? "Còn Hàng"
                            : "Hết Hàng"}
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
                  {/* <ul className="flex flex-row border-b-[5px] border-solid border-[#251f98] " >
                                          <li className="mr-4">
                                            <button className="nav-link active mb-[20px] text-[#04070a] text-[17px] leading-[35px] captitalize"
                                            type="button"

                                            >
                                               Mô tả sản phẩm 
                                            </button>
                                          </li>
                                          <li className="mr-4">
                                            <button className="mb-[20px] text-[#04070a] text-[17px] leading-[35px] captitalize active"
                                             id="information-tab"
                                             data-bs-toggle="tab"
                                             data-bs-target ="#information-tab-pane"
                                             type="button"
                                            
                                             aria-controls="information-tab-pane"
                                             aria-selected= "flase"
                
                                            >
                                              Thông tin chi tiết
                                            </button>
                                          </li>
                                          <li className="mr-4" >
                                            <button className="mb-[20px] text-[#04070a] text-[17px] leading-[35px] captitalize"
                                             id="detail-tab"
                                             data-bs-toggle="tab"
                                             data-bs-target =""
                                             type="button"
                                             aria-controls=""
                                             aria-selected= "true"
                                            >
                                              Đánh giá sản phẩm
                                            </button>
                                          </li>
                                        </ul> */}
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
                              {/* {loadingProductReview && <Loader />} */}

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
                          {/* <div className="col-12">   
                                                        <section className='home-wrapper-2'>
                     
                                                          {userInfo ? 
                                                          <div className='container'>
                                                          <div className='col-12 categories'>
                                                          <span className='header-tile' >ĐÁNH GIÁ SẢN PHẨM</span>
                                                        
                                                          </div>
                                                            <div className='categories'> 
                                                                  <div className='container'> 
                                                                   {dataProduct.reviews.length === 0 && <Message>Không có đánh giá</Message>}
                                                    <ListGroup variant='flush'>
                                                      {dataProduct.reviews.map((review) => (
                                                        <ListGroup.Item key={review._id}>
                                                          <strong>{review.name}</strong> */}
                          {/* 2222<Rating value={review.rating} /> */}
                          {/* <p>{review.createdAt.substring(0, 10)}</p>
                                                          <p>{review.comment}</p>
                                                        </ListGroup.Item>
                                                      ))}
                                                    
                                                      <ListGroup.Item>
                                                        <div className='d-flex '>
                                                        <h3>VIẾT ĐÁNH GIÁ SẢN PHẨM</h3>
                                                        </div>
                                                        {loadingProductReview && <Loader />}

                                                        
                                                          <Form onSubmit={submitHandler} >
                                                            <Form.Group className='my-2' controlId='rating'>
                                                              <Form.Label>Đánh giá</Form.Label>
                                                              <Form.Control
                                                                as='select'
                                                                required
                                                                value={rating}
                                                                onChange={(e) => setRating(e.target.value)}
                                                              >
                                                                <option value=''>Lược chọn...</option>
                                                                <option value='1'>1 - Kém</option>
                                                                <option value='2'>2 - Khá</option>
                                                                <option value='3'>3 - Tốt</option>
                                                                <option value='4'>4 - Rất tốt</option>
                                                                <option value='5'>5 - Xuất sác</option>
                                                              </Form.Control>
                                                            </Form.Group>
                                                            <Form.Group className='my-2' controlId='comment'>
                                                              <Form.Label>Bình luận</Form.Label>
                                                              <Form.Control
                                                                as='textarea'
                                                                row='3'
                                                                required
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                              ></Form.Control>
                                                            </Form.Group>
                                                            <Button
                                                              disabled={loadingProductReview}
                                                              type='submit'
                                                              variant='primary'
                                                            >
                                                              Gửi đánh giá
                                                            </Button>
                                                          </Form>
                                                  </ListGroup.Item>
                                                </ListGroup>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      
                                                                :
                                                        <Message>
                                                        Chỉ có thành viên mới có thể viết nhận xét.Vui lòng <Link to='/login'> đăng nhập </Link>hoặc <Link to='/register'> đăng kí</Link>
                                                        </Message>
                                                          }           
                                                        
                                                    </section> 
                                                    </div> */}
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                  {/* <div>
                                          <div className="detail-product py-3 tab-pane fade show active"  id="product-tab-pane" role aria-labelledby="product-tab" >
                                            <h3 className="text-[#04070a] text-[22px] mb-[10px] leading-[35px] captitalize">{product.bookName}</h3>
                                            <p className="text-[#666] text-[15px] font-semibold text-left leading-[26px]">{product.bookDetail}</p>
                                          </div>
                                          <div className="information-product">
                                            <div className="col-12">
                                              <table className="table">
                                                <tbody>
                                                  <tr>
                                                    <th>Mã Hàng</th>
                                                    <td>{product._id}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Tên tác giả</th>
                                                    <td>{product.author}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Nhà xuất bản</th>
                                                    <td>{product.publicCompany}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Thể loại</th>
                                                    <td>{product.category}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Hình thức</th>
                                                    <td>{product.form}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Ngôn Ngữ</th>
                                                    <td>{product.language}</td>
                                                  </tr>
                                                  <tr>
                                                    <th>Số trang</th>
                                                    <td>{product.pageNumber}</td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              </div>
                                          </div>
                                          <div className="review-product">
                                                <div className="row">
                                                    <div className="col-12">   
                                                        <section className='home-wrapper-2'>
                     
                                                          {userInfo ? 
                                                          <div className='container'>
                                                          <div className='col-12 categories'>
                                                          <span className='header-tile' >ĐÁNH GIÁ SẢN PHẨM</span>
                                                        
                                                          </div>
                                                            <div className='categories'> 
                                                                  <div className='container'> 
                                                                   {product.reviews.length === 0 && <Message>Không có đánh giá</Message>}
                                                    <ListGroup variant='flush'>
                                                      {product.reviews.map((review) => (
                                                        <ListGroup.Item key={review._id}>
                                                          <strong>{review.name}</strong>
                                                          <Rating value={review.rating} />
                                                          <p>{review.createdAt.substring(0, 10)}</p>
                                                          <p>{review.comment}</p>
                                                        </ListGroup.Item>
                                                      ))}
                                                    
                                                      <ListGroup.Item>
                                                        <div className='d-flex '>
                                                        <h3>VIẾT ĐÁNH GIÁ SẢN PHẨM</h3>
                                                        </div>
                                                        {loadingProductReview && <Loader />}

                                                        
                                                          <Form onSubmit={submitHandler} >
                                                            <Form.Group className='my-2' controlId='rating'>
                                                              <Form.Label>Đánh giá</Form.Label>
                                                              <Form.Control
                                                                as='select'
                                                                required
                                                                value={rating}
                                                                onChange={(e) => setRating(e.target.value)}
                                                              >
                                                                <option value=''>Lược chọn...</option>
                                                                <option value='1'>1 - Kém</option>
                                                                <option value='2'>2 - Khá</option>
                                                                <option value='3'>3 - Tốt</option>
                                                                <option value='4'>4 - Rất tốt</option>
                                                                <option value='5'>5 - Xuất sác</option>
                                                              </Form.Control>
                                                            </Form.Group>
                                                            <Form.Group className='my-2' controlId='comment'>
                                                              <Form.Label>Bình luận</Form.Label>
                                                              <Form.Control
                                                                as='textarea'
                                                                row='3'
                                                                required
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                              ></Form.Control>
                                                            </Form.Group>
                                                            <Button
                                                              disabled={loadingProductReview}
                                                              type='submit'
                                                              variant='primary'
                                                            >
                                                              Gửi đánh giá
                                                            </Button>
                                                          </Form>
                                                  </ListGroup.Item>
                                                </ListGroup>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      
                                                                :
                                                        <Message>
                                                        Chỉ có thành viên mới có thể viết nhận xét.Vui lòng <Link to='/login'> đăng nhập </Link>hoặc <Link to='/register'> đăng kí</Link>
                                                        </Message>
                                                          }           
                                                        
                                                    </section> 
                                                    </div>
                                                </div>
                                          </div>
                                     </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* <section className='home-wrapper-2 py-5'>
                          <div className='container'>
                            <div className='categories row'>
                                <div className='col-md-6'>
                                <Image src={product.bookImage} alt={product.bookName} fluid/>
                                </div>
                                <div className=' col-md-6'>
                                        <h3>{product.bookName}</h3>
                                          <div className='row row-cols-2 my-3'>
                                              <div className="col"><span>Thể loại: <span style={{ fontWeight: '600'}}>{product.category}</span></span></div>
                                              <div className="col"><span>Tên tác giả: <span style={{ fontWeight: '600'}}>{product.author}</span></span></div>
                                              <div className="col"><span>Nhà xuất bản: <span style={{ fontWeight: '600'}}>{product.publicCompany}</span></span></div>
                                              <div className="col"><span>Hình thức: <span style={{ fontWeight: '600'}}>{product.form}</span></span></div>
                                          </div>
                                          <div className='product-screem mb-3'>
                                            <div className='row '>
                                              <div className='col-sm-5'>
                                                  <Rating  value={product.rating} text={`(${product.rating} Đánh Giá)`}/>
                                              </div>
                                              <div className='col-sm-7'>
                                              <strong className='font-c-status'>
                                                        {product.bookQuaranty > 0 ? 'Còn Hàng': 'Hết Hàng' }
                                                </strong> 
                                              </div>
                                            
                                            </div>
                                          </div>  
                                          <div className='product-price mb-3'>
                                            <span>{transform(product.bookPrice,optionCurrency)}</span>
                                          </div>
                                          <div className='row mb-4'>
                                                <div className="col-sm-2 d-flex align-items-center"><label> Số Lượng: </label></div>
                                                <div className="col-sm-10 w-50">
                                                  <div className='input-group w-75' >
                                                    <button className="btn btn-outline-secondary px-3 " type="button" onClick={decreaseQty} >
                                                        <AiOutlineMinus/>
                                                    </button>
                                                    <input type="number" className="form-control count input-cart"  value={qty} readOnly/>
                                                    <button className="btn btn-outline-secondary px-3 " type="button" onClick={increaseQty}>
                                                        <AiOutlinePlus/>
                                                    </button>
                                                  </div>
                                                </div>
                                          </div>
                                          <div className='row row-cols-auto'>
                                              <div className='col'>
                                              <Button className='btn-block'
                                              type='button'
                                              disabled= {product.bookQuaranty === 0}
                                               onClick={addToCartHandler}
                                              >
                                                <span className='me-2 mb-10'><BsCart size={20}/></span>
                                                <span>Thêm Vào Giỏi Hàng</span>        
                                              </Button>
                                           
                                              </div>
                                              <div className='col'>
                                              <Button className='btn-block'
                                              type='button'
                                              disabled= {product.bookQuaranty === 0}
                                              onClick={addToCartAndBuyHandler}
                                              >
                                        
                                                <span>Mua Ngay</span>        
                                              </Button>
                                              </div>
                                              <div className='col'>
                                              <Button className='btn-block'
                                              onClick={addToFavoriteHandler}
                                              type='button'
                                              >
                                                <span className='me-2 '><BsFillHeartFill size={20}/></span>
                                                <span>Yêu Thích</span>        
                                              </Button>
                                              </div>
                                              
                                          </div>
                                </div>
                            </div>
                        </div>
              </section>
            <section className='home-wrapper-2 py-3'>
              <div className='container'>
                  <div className='col-12 categories'>
                  <span className='header-tile' >Thông tin sản phẩm</span>
                  </div>
                  
                    <div className='categories'> 
                          <div className='container'>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Nhà Xuất Bản</span></div>
                                <div className='col-sm-10'> {product.publicCompany}</div>
                            </div>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Tác Giả</span></div>
                                <div className='col-sm-10'>{product.author}</div>
                            </div>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Thể Loại</span></div>
                                <div className='col-sm-10'> {product.category}</div>
                            </div>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Ngôn Ngữ</span></div>
                                <div className='col-sm-10'>{product.language}</div>
                            </div>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Hình Thức</span></div>
                                <div className='col-sm-10'>{product.form}</div>
                            </div>
                            <div className='row mb-4'>
                                <div className='col-sm-2'><span>Số Trang</span></div>
                                <div className='col-sm-10'> {product.pageNumber}</div>
                            </div>
                          </div>
                        <hr/>
                        <div className='container'>
                              <h3 className='mb-4'>{product.bookName}</h3>
                            <div className='col-md-12'>
                                {product.bookDetail}
                            </div>  
                        </div>
                    </div>
              </div>
            </section>
                  <section className='home-wrapper-2'>
                     
                          {userInfo ? 
                          <div className='container'>
                          <div className='col-12 categories'>
                          <span className='header-tile' >ĐÁNH GIÁ SẢN PHẨM</span>
                         
                          </div>
                            <div className='categories'> 
                                  <div className='container'> */}
          {/* lan 2 <div className='col-12 d-flex justify-content-center'>
                                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#ratingModal">Viết nhận xét của bạn</button>
                                  </div> */}

          {/* {product.reviews.length === 0 && <Message>Không có đánh giá</Message>}
                  <ListGroup variant='flush'>
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                   
                    <ListGroup.Item>
                      <div className='d-flex '>
                      <h3>VIẾT ĐÁNH GIÁ SẢN PHẨM</h3>
                      </div>
                      {loadingProductReview && <Loader />}

                      
                        <Form onSubmit={submitHandler} >
                          <Form.Group className='my-2' controlId='rating'>
                            <Form.Label>Đánh giá</Form.Label>
                            <Form.Control
                              as='select'
                              required
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              <option value=''>Lược chọn...</option>
                              <option value='1'>1 - Kém</option>
                              <option value='2'>2 - Khá</option>
                              <option value='3'>3 - Tốt</option>
                              <option value='4'>4 - Rất tốt</option>
                              <option value='5'>5 - Xuất sác</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group className='my-2' controlId='comment'>
                            <Form.Label>Bình luận</Form.Label>
                            <Form.Control
                              as='textarea'
                              row='3'
                              required
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button
                            disabled={loadingProductReview}
                            type='submit'
                            variant='primary'
                          >
                            Gửi đánh giá
                          </Button>
                        </Form>
                </ListGroup.Item>
              </ListGroup>
                                </div>
                            </div>
                        </div>
                     
                              :
                      <Message>
                       Chỉ có thành viên mới có thể viết nhận xét.Vui lòng <Link to='/login'> đăng nhập </Link>hoặc <Link to='/register'> đăng kí</Link>
                      </Message>
                        }           
                      
                  </section> */}
          {/* <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">

                                                    <ul className="stars" >
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>
                                                    <textarea
                                                        name="review"
                                                        id="review" className="form-control mt-3"
                                                        
                                                    >
                                                    </textarea>
                                                    <button className="btn my-3 float-right review-btn px-4 text-white"  data-dismiss="modal" aria-label="Close">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                  </div> */}
        </>
      )}
      {/* <section className='home-wrapper-2 py-5'>
        <div className='container'>
                    <div className='categories row'>
                        <div className='col-md-6'>
                        <Image src={product.bookImage} alt={product.bookName} fluid/>
                        </div>
                        <div className=' col-md-6'>
                                <h3>{product.bookName}</h3>
                                  <div className='row row-cols-2 my-3'>
                                      <div className="col"><span>Thể loại: {product.category}</span></div>
                                      <div className="col"><span>Tên tác giả: {product.author}</span></div>
                                      <div className="col"><span>Nhà xuất bản: {product.publisher}</span></div>
                                      <div className="col"><span>Hình thức: {product.form}</span></div>
                                  </div>
                                  <div className='product-screem mb-3'>
                                    <div className='row '>
                                      <div className='col-sm-4'>
                                          <Rating  value={product.rating} text={`(${product.bookQuaranty} Đánh Giá)`}/>
                                       </div>
                                       <div className='col-sm-8'>
                                       <strong className='font-c-status'>
                                                {product.countInStock > 0 ? 'Còn Hàng': 'Hết Hàng' }
                                        </strong> 
                                       </div>
                                     
                                    </div>
                                  </div>  
                                  <div className='product-price mb-3'>
                                    <span>${product.bookPrice} </span>
                                  </div>
                                  <div className='row mb-4'>
                                        <div className="col-sm-8"><label> Số Lượng: </label></div>
                                        <div className="col-sm-4">col-sm-4</div>
                                  </div>
                                  <div className='row row-cols-auto'>
                                      <div className='col'>
                                       <Button className='btn-block'
                                       type='button'
                                       disabled= {product.countInStock === 0}
                                       >
                                        <span className='me-2 mb-10'><BsCart size={20}/></span>
                                        <span>Thêm Vào Giỏi Hàng</span>        
                                       </Button>
                                      </div>
                                      <div className='col'>
                                       <Button className='btn-block'
                                       type='button'
                                       disabled= {product.countInStock === 0}
                                       >
                                        <span>Mua Ngay</span>        
                                       </Button>
                                      </div>
                                      <div className='col'>
                                       <Button className='btn-block'
                                       type='button'
                                       >
                                        <span className='me-2 '><BsFillHeartFill size={20}/></span>
                                        <span>Yêu Thích</span>        
                                       </Button>
                                      </div>
                                  </div>
                        </div>
                    </div>
        </div>
    </section> */}
      {/* <section className='home-wrapper-2 py-5'>
        <div className='container'>
            <div className='col-12 categories'>
            <span className='header-tile' >Thông tin sản phẩm</span>
            </div>
             
              <div className='categories'> 
                    <div className='container'>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Nhà Xuất Bản</span></div>
                          <div className='col-sm-10'> Thai hoai</div>
                      </div>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Tác Giả</span></div>
                          <div className='col-sm-10'>{product.author}</div>
                      </div>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Thể Loại</span></div>
                          <div className='col-sm-10'> {product.category}</div>
                      </div>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Ngôn Ngữ</span></div>
                          <div className='col-sm-10'> Thai hoai</div>
                      </div>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Hình Thức</span></div>
                          <div className='col-sm-10'> Thai hoai</div>
                      </div>
                      <div className='row mb-4'>
                          <div className='col-sm-2'><span>Số Trang</span></div>
                          <div className='col-sm-10'> Thai hoai</div>
                      </div>
                    </div>
                  <hr/>
                  <div className='container'>
                        <h3 className='mb-4'>{product.bookName}</h3>
                      <div className='col-md-12'>
                          {product.bookDetail}
                      </div>  
                  </div>
              </div>
                  
        </div>
    </section> */}
    </>
  );
};

export default ProductScreem;
