import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../componets/CheckoutSteps";
import { useCreateOrderMutation } from "../slices/ordersSlice";
import { clearCartItems } from "../slices/cartSlice";
import Loader from "../componets/Loader";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { optionCurrency, transform } from "../componets/money";
import logoHome from "../imageshome/home.png";
import logoOffice from "../imageshome/location.png";
import delivery from "../imageshome/truck.png";
import fastDelivery from "../imageshome/fast-delivery.png";
import moneyumg from "../imageshome/iconsmoney-100.png";
import momoimg from "../imageshome/momo_icon.png";
import vnpayimg from "../imageshome/Icon VNPAY-QR.png";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import addressApi from "../api/addressApi";
import orderApi from "../api/orderApi";
import couponApi from "../api/couponApi";
import {
  AiOutlineEnvironment,
  AiOutlineCar,
  AiOutlineCreditCard,
} from "react-icons/ai";
import ghnApi from "../api/ghnApi";
import { Form, Button, InputGroup } from "react-bootstrap";
const PaymentOrder = () => {
  // const { cartItems, shippingAddress, paymentMethhod,itemsPrice,itemsShip,totalPrice} = useSelector((state) => state.cart)
  const {
    cartItems,
    shippingAddress,
    paymentMethhod,
    itemsPrice,
    itemsShip,
    totalPrice,
  } = useSelector((state) => state.cart);
  // const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataAddress, setDataAddress] = useState("");
  const [selectedPaymentMethodValue, setSelectedPaymentMethodValue] = useState(
    "vnpay"
  );
  const [feeShip, setFeeShip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponId, setCouponId] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    flectDataAddress();
  }, []);

  const flectDataAddress = async () => {
    try {
      const responseAddress = await addressApi.getAll();
      const result = responseAddress.shippingAddress.find(
        (item) => item.isDefault === true
      );
      if (result) {
        setDataAddress(result);

        const district_id = result.DistrictID;
        const ward_code = result.WardCode;
        flectFeeShip(district_id, ward_code);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const handleRadio = (e) => {
    setSelectedPaymentMethodValue(e.target.value);
  };

  const handleCashOnDelivery = async () => {
    const payload = {
      orderItems: cartItems,
      shippingAddress: {
        city: dataAddress.ProvinceName,
        district: dataAddress.DistrictName,
        wards: dataAddress.WardName,
        address: dataAddress.addressDetails,
        phone: dataAddress.phoneNumber,
        recipientName: dataAddress.recipientName,
      },
      paymentMethod: selectedPaymentMethodValue,
      itemsPrice: totalItem.total,
      shippingPrice: feeShip,
      discountAmount: discountAmount,
      totalPrice: totalItem.totalcalc,
      couponId: couponId || null,
      ebook: false
    };

    try {
      const response = await orderApi.createOrders(payload);
      if (selectedPaymentMethodValue === "COD") {
        dispatch(clearCartItems());
        navigate("/order-success/" + response._id);
      } else {
        const payload = {
          amount: totalItem.totalcalc,
          orderDescription: "Thanh toan ma don hang: #" + response._id,
          orderType: "billpayment",
          language: "vn",
        };
        const responseVNPay = await orderApi.createPaymentUrlVNPay(payload);
        if (responseVNPay) {
          dispatch(clearCartItems());

          const { vnpUrl } = responseVNPay;
          navigate("/order-success/" + response._id);
          // Chuyển hướng tới VNPAY
          window.open(vnpUrl, "_blank");
        }
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

  const handleCheckOut = async () => {
    setIsLoading(true);
    handleCashOnDelivery(selectedPaymentMethodValue);
  };

  const flectFeeShip = async (districtID, WardCode) => {
    try {
      const response = await ghnApi.getFeeShip({
        from_district_id: 3695,
        from_ward_code: "90742",
        service_id: 53321,
        to_district_id: districtID,
        to_ward_code: WardCode,
        height: 10,
        length: 10,
        weight: 1000,
        width: 20,
        insurance_value: 10000,
        cod_failed_amount: 2000,
        coupon: null,
      });
      setFeeShip(response.total);
    } catch (error) {}
  };

  const totalItem = {
    total:
      cartItems.reduce((acc, item) => acc + item.qty * item.bookPrice, 0) || 0,
    ship:
      (cartItems.reduce((acc, item) => acc + item.qty * item.bookPrice, 0) >
      300000
        ? 150000
        : 30000) || 0,
    totalcalc: 0,
  };
  totalItem.totalcalc = totalItem.total + totalItem.ship - discountAmount;

  const handleApplyCoupon = async () => {
    if (coupon.trim() === "") {
      setDiscountAmount(0);
      toast.error("Vui lòng nhập mã giảm giá!");
    } else {
      try {
        const payload = {
          userId: userInfo._id,
          code: coupon,
          orderValue: totalItem.totalcalc,
        };
        const response = await couponApi.applyCoupon(payload);
        setDiscountAmount(response.discountAmount);
        setCouponId(response.couponId);
        // Thành công, hiển thị thông báo giảm giá được áp dụng
        toast.success("Mã giảm giá đã được áp dụng thành công!");
      } catch (error) {
        // Kiểm tra lỗi từ API
        if (error.response) {
          setDiscountAmount(0);
          const message = error.response.data.message;
          toast.error(message);
        } else {
          // Lỗi không xác định (ví dụ: không kết nối được API)
          toast.error(
            "Không thể kết nối đến hệ thống. Vui lòng kiểm tra mạng."
          );
        }
      }
    }
  };

  // useEffect (() => {
  //   if(!shippingAddress || !paymentMethhod){
  //       navigate('/shipping')
  //   }
  // }, [shippingAddress,paymentMethhod,navigate]);

  // const placeOrderHandler = async () => {
  //   try {

  //     const res = await createOrder({
  //       orderItems: cartItems,
  //       shippingAddress: shippingAddress,
  //       paymentMethod: paymentMethhod,
  //       itemsPrice: itemsPrice,
  //       shippingPrice: itemsShip,
  //       totalPrice: totalPrice,
  //     }).unwrap();
  //     dispatch(clearCartItems());
  //     navigate(`/order/${res._id}`);
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };
  return (
    <>
      {/* <CheckoutSteps shippingAndPayment confiOrder /> */}
      {/* <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">

                    <h4 className="mb-3">ĐỊA CHỈ GIAO HÀNG</h4>
                    <p><b>Tên: </b> {userInfo.name}</p>
                    <p><b>Số điện thoại:</b> {shippingAddress.phone}</p>
                    <p className="mb-4"><b>Địa chỉ:</b>{`${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.wards}, ${shippingAddress.address}`} </p>
                    <hr />

                    <h4>PHƯƠNG THỨC THANH TOÁN</h4>
                    <b>Phương thức: </b>
                    {paymentMethhod}
                   
                    <hr />

                    <h4 className="mt-4">ĐƠN HÀNG:</h4>

                    {cartItems.map(item => (
                       <>
                            <hr />
                            <div className="cart-item my-1" key={item._id}>
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.bookImage} alt="Laptop" height="45" width="65" />
                                    </div>

                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item._id}`}>{item.bookName}</Link>
                                    </div>


                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.qty} x {transform(item.bookPrice,optionCurrency)} = <b>{transform((item.qty * item.bookPrice),optionCurrency)}</b></p>
                                    </div>

                                </div>
                            </div>
                            <hr />
                            </>
                    ))}
                </div>
                <div className="col-12 col-lg-3 my-4">
                              <div id="order_summary">
                                  <h4>Chi tiết đơn hàng</h4>
                                  <hr />
                                  <div className="row">
                                    <div className="col-8">
                                  <p>Thành tiền:  
                                  </p>
                                  </div>
                                  <div className="col-4">
                                  <span>{ transform(totalItem.total,optionCurrency) } </span>
                                  </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-8">
                                  <p>Phí vận chuyển:  
                                  </p>
                                  </div>
                                  <div className="col-4">
                                  <span>{ transform(totalItem.ship,optionCurrency) } </span>
                                  </div>
                                  </div>
                                  <div className="row" style={{ fontWeight: '650'}}>
                                    <div className="col-8">
                                  <p>Tổng số tiền:  
                                  </p>
                                  </div>
                                  <div className="col-4" style={{ fontSize: '20px', color: 'red' }}>
                                  <span>{ transform(totalItem.totalcalc, optionCurrency) } </span>
                                  </div>
                                  </div>
                                  <hr />
                                  <div className="d-flex justify-content-center ">
                                  <button type='button'
                                    className='btn btn-danger w-75'
                                    disabled={cartItems === 0}
                                    onClick={placeOrderHandler} >THANH TOÁN
                                  
                                  </button>

                                  </div>
                                  <div className='d-flex justify-content-center'>
                                  {isLoading && <Loader />}
                                  </div>
                              </div>
                        </div>


        </div> */}

      <ToastContainer />

      <section>
        <div className="container-sm">
          <div className="row ">
            <div className="col-7">
              <div className="mb-3 ">
                {/* <Accordion> */}
                {/* <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <span className= "flex flex-row items-center text-[17px] capitalize leading-[28px] font-black "> < AiOutlineEnvironment style={{ marginRight : "10px"}} />  Dia chi </span>
                            </AccordionSummary>
                              <AccordionDetails>
                                <div className="row flex justify-evenly">
                                  <div className="card col-4 p-4  "> */}
                {/* <div className=" border-[1px] border-solid rounded-[5px] flex flex-row items-center">
                                        <span className="pr-2"><img className="w-[19px]" src={logoHome} /></span>
                                        <p className="text-[19px] leading-[28px] capitalize"> Nhà </p>
                                      </div> */}
                {/* {dataAddress && (
                                        <address className="my-2">
                                        <strong className="text-[17px] leading-[28px] mb-1">{dataAddress.recipientName} </strong>
                                        <p className="text-[17px] leading-[28px] mb-1"> {dataAddress.addressDetails} </p>
                                        <p className="text-[17px] leading-[28px] mb-1">{dataAddress.WardName}</p>
                                        <p className="text-[17px] leading-[28px] mb-1">{dataAddress.DistrictName}</p>
                                        <p className="text-[17px] leading-[28px] mb-1">{dataAddress.ProvinceName}</p>
                                        <p className="text-[17px] leading-[28px] "> {dataAddress.phoneNumber} </p>
                                      </address>
                                      )}
                                       */}
                {/* <span className="text-danger "  type='button'>Sua</span> */}
                {/* </div>
                                </div>
                              </AccordionDetails>
                      </Accordion> */}
                <div className="w-full border-solid border-[1px] rounded-[7px]">
                  <div className="h-[120px] p-3">
                    <h2 className="text-[19px] font-[700]">
                      Địa chỉ giao hàng
                    </h2>
                    <hr />
                    <div className="mt-1">
                      <div className="flex ">
                        <span className="font-normal">
                          {" "}
                          {dataAddress.recipientName}{" "}
                        </span>
                        <div className="border-solid border-r-[2px] border-[#ddd] mx-[8px]"></div>
                        <span className="font-normal">
                          {dataAddress.phoneNumber}
                        </span>
                      </div>
                      <div>
                        <span className="font-normal">
                          {" "}
                          {dataAddress.addressDetails}, {dataAddress.WardName},{" "}
                          {dataAddress.DistrictName}, {dataAddress.ProvinceName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="mb-3 ">
                          <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <span className='flex flex-row items-center text-[17px] capitalize leading-[28px] font-black '> < AiOutlineCar  style={{ marginRight : "10px"}}/>  Dia chi </span>
                            </AccordionSummary>
                            <AccordionDetails>
                            <div className="flex flex-row items-center ">
                            < Radio size="small"/>
                            <span className="mr-2"><img className="w-[18px]" src={delivery}/> </span>
                             <p className="text-[17px] leading-[28px] "> Giao hàng tiêu chuẩn </p> 
                            </div>
                            <div className="flex flex-row items-center">
                              < Radio size="small"/>
                              <span className=" mr-2"><img className="w-[18px]"  src={fastDelivery} /></span> 
                              <p className="text-[17px] leading-[28px]"> Giao hàng cấp tốc </p>
                            </div>
                           
                            </AccordionDetails>
                          </Accordion>
                    </div> */}
              <div>
                <div className="w-full border-solid border-[1px] rounded-[7px]">
                  <div className="h-[150px] p-3">
                    <h2 className="text-[19px] font-[700]">
                      Phương thức thanh toán
                    </h2>
                    <hr />
                    <div className="mt-1">
                      <div>
                        <RadioGroup
                          value={selectedPaymentMethodValue}
                          onChange={handleRadio}
                        >
                          <div className="flex flex-row items-center mb-3">
                            <Radio value={"vnpay"} />
                            <img
                              src={vnpayimg}
                              className="h-[30px] w-[35px] mr-3"
                            />
                            <p className="text-[17px] " con>
                              Ví VNPAY
                            </p>
                          </div>
                          <div className="flex flex-row items-center mb-3">
                            <Radio value={"COD"} />
                            <img
                              className="h-[30px] w-[35px] mr-3"
                              src={moneyumg}
                            />
                            <p className="text-[17px] ">
                              {" "}
                              Thanh toán khi nhận hàng
                            </p>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full border-solid border-[1px] rounded-[7px] mt-3">
                  <div className="h-[130px] p-3">
                    <h2 className="text-[19px] font-[700]">
                      Áp dụng mã giảm giá
                    </h2>
                    <hr />
                    <div className="mt-4">
                      <div>
                        <Form>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="Nhập mã giảm giá"
                              value={coupon}
                              onChange={(e) => setCoupon(e.target.value)}
                            />
                            <Button
                              variant="primary"
                              onClick={handleApplyCoupon}
                            >
                              Áp dụng
                            </Button>
                          </InputGroup>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <span className='flex flex-row items-center text-[17px] capitalize leading-[28px] font-black '> < AiOutlineCreditCard style={{ marginRight : "10px"}} />  Dia chi </span>
                            </AccordionSummary>
                            <AccordionDetails>
                           
                             <RadioGroup
                               
                                value={selectedValue}
                                onChange={handleRadio}
                                >
                              
                            <div className="flex flex-row items-center mb-3">
                         
                              
                              <Radio value={"vnpay"} />
                            <img src={vnpayimg} className="h-[30px] w-[35px] mr-3" />
                             <p className="text-[17px] " con>Ví VNPAY</p>
                             
                             </div>
                            <div className="flex flex-row items-center mb-3">
                        
                            <Radio value={"cash"} />
                            <img className="h-[30px] w-[35px] mr-3" src={moneyumg} />
                            <p className="text-[17px] "> Thanh toán khi nhận hàng</p>
                            </div>
                            </RadioGroup>
                            </AccordionDetails>
                          </Accordion> */}
              </div>
            </div>
            <div className=" col-lg-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-[#ffff] border-[1px] border-solid rounded-[16px] p-[2rem]  gx-2">
              <div className="mb-2">
                <h4 className="text-[17px] capitalize leading-[28px] font-black">
                  Chi tiết đơn hàng
                </h4>
                <hr />
              </div>
              {cartItems.map((item) => (
                <div className="flex flex-row items-center bg-[#ffffff] border-b-[1px] border-solid border-[#eee] p-[15px] mb-3 ">
                  <div className="basis-[100px]">
                    <img src={item.bookImage} />
                  </div>

                  <div className=" w-[calc(100%-100px)] basis-[calc(100%-100px)] pl-3">
                    <h2 className="font-normal  text-[17px] line-clamp-2 mb-[10px] leading-[28px] text-[#4b5966] capitalize hover:text-[#5caf90] ">
                      {item.bookName}
                    </h2>
                    <h6 className="font-normal text-[#999] text-[14px] mb-[10px] leading-[1.2] capitalize">
                      <span className="font-semibold">Số lượng:</span>{" "}
                      {item.qty}
                    </h6>
                    <span className="text-[#4b5966] text-[14px] font-bold mr-[7px]">
                      {transform(item.bookPrice, optionCurrency)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="row">
                <div className="col-8 pb-1">
                  <p>Thành tiền:</p>
                </div>
                <div className="col-4 pb-1">
                  <span>{transform(totalItem.total, optionCurrency)} </span>
                </div>
              </div>
              <div className="row">
                <div className="col-8 pb-1">
                  <p>Phí vận chuyển:</p>
                </div>
                <div className="col-4 pb-1">
                  {/* <span>{ transform(totalItem.ship,optionCurrency) } </span> */}
                  <span>{transform(feeShip, optionCurrency)} </span>
                </div>
              </div>
              {discountAmount > 0 ? (
                <div className="row">
                  <div className="col-8 pb-1">
                    <p>Đã áp dụng giảm giá:</p>
                  </div>
                  <div className="col-4 pb-1">
                    <span style={{ color: "rgb(157 17 17 / 78%)" }}>
                      -{transform(discountAmount, optionCurrency)}{" "}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="row pb-1 font-bold">
                <div className="col-8">
                  <p>Tổng thanh toán:</p>
                </div>
                <div className="col-4 text-[20px] text-[#9d1111]">
                  <span>{transform(totalItem.totalcalc, optionCurrency)} </span>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-center pt-3">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCheckOut}
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
                      ĐANG THANH TOÁN ...
                    </>
                  ) : (
                    "THANH TOÁN"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PaymentOrder;
