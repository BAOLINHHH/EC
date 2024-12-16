import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import CheckoutSteps from "../componets/CheckoutSteps";
import { useCreateOrderMutation } from "../slices/ordersSlice";
import Loader from "../componets/Loader";
import Spinner from "react-bootstrap/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { optionCurrency, transform } from "../componets/money";
import orderApi from "../api/orderApi";
import { Button, Modal, Form, Nav } from "react-bootstrap";
import dayjs from "dayjs";
const PaymentOrder = () => {
  // const { cartItems, shippingAddress, paymentMethhod,itemsPrice,itemsShip,totalPrice} = useSelector((state) => state.cart)
  const { id: orderId } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataAddress, setDataAddress] = useState("");
  const [order, setOrder] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [shippingAddress, seTshippingAddress] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [cancelReason, setCancelReason] = useState(""); // State để lưu lý do hủy
  const [loading, setLoading] = useState(false); // State để hiển thị loading khi submit
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOder,setIsLoadingOder] =useState(true)
  const [selectedPaymentMethodValue, setSelectedPaymentMethodValue] = useState(
    "vnpay"
  );
  const [feeShip, setFeeShip] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);

  const handleGetOrderById = async () => {
    const response = await orderApi.getOrderById(orderId);
    setOrder(response);
    setOrderItems(response.orderItems);
    seTshippingAddress(response.shippingAddress);
    
    const orderStatus = response.orderStatus;
    console.log("orderStatus", orderStatus);
    setSteps([
      {
        label: "Đã tạo đơn đặt hàng",
        active: orderStatus === "Đã tạo đơn đặt hàng",
      },
      {
        label: "Đang chờ đơn vị vận chuyển",
        active: orderStatus === "Đang chờ đơn vị vận chuyển",
      },
      { label: "Đang vận chuyển", active: orderStatus === "Đang vận chuyển" },
      {
        label: "Đơn hàng đã được giao",
        active: orderStatus === "Đơn hàng đã được giao",
      },
    ]);
    setIsLoadingOder(false)
  };

  const handleUpdateOrderStatus = async () => {
    const activeIndex = steps.findIndex((step) => step.active) + 1;
    const data = {
      orderId: orderId,
      newStatus: steps[activeIndex].label,
    };
    const response = await orderApi.updateOrderStatus(data);
    if (response) {
      setIsReload(true);
    }
  };

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleCancelOrder = async () => {
    const data = {
      orderId: orderId,
      cancelReason: cancelReason,
    };
    const response = await orderApi.updateOrderStatus(data);
    if (response) {
      setIsReload(true);
    }
  };

  const handleSubmit = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      const data = {
        orderId: orderId,
        cancelReason: cancelReason,
      };

      const response = await orderApi.cancelOrder(data);

      if (response.status === 200) {
        toast.success("Hủy đơn hàng thành công!");

        setShow(false); // Đóng modal
        setIsReload(true);
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      toast.error("Đã xảy ra lỗi khi hủy đơn hàng.!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    const payload = {
      amount: parseInt(order?.totalPrice),
      orderDescription: "Thanh toán đơn hàng: #" + orderId,
      orderType: "billpayment",
      language: "vn",
    };
    const responseVNPay = await orderApi.createPaymentUrlVNPay(payload);
    if (responseVNPay) {
      const { vnpUrl } = responseVNPay;
      // Chuyển hướng tới VNPAY
      window.open(vnpUrl, "_blank");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetOrderById();
  }, []);

  useEffect(() => {
    if (isReload === true) {
      handleGetOrderById();
      setIsReload(false);
    }
  }, [isReload]);

  useEffect(() => {
    console.log("order", order);
  }, [order]);

  return (
    <>
      {isLoadingOder ? (<Loader/>):(<>
      
        <ToastContainer />
      {/* Modal for canceling order */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Lý do hủy đơn hàng:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập lý do hủy đơn hàng"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 className="text-[19px] font-[700] mb-4">Chi tiết đơn hàng</h2>

      <section>
        <div className="container-sm">
          <div className="row">
            <div className="w-full">
              <div className="h-[260px] p-3">
                <h2 className="text-[19px] font-[700]">Trạng thái đơn hàng</h2>
                Mã đơn hàng: #{order?.trackingCode} {" - "}
                Ngày tạo: {" ("}
                {/* {new Date(order?.createdAt)
                  .toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replace(",", "") // Loại bỏ dấu phẩy giữa thời gian và ngày
                  .replace(/\//g, "-")} */}
                  {dayjs(order?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                  
                  {" "}
                {/* Chuyển dấu "/" thành "-" */}
                {")"}
                {  (order.paymentMethod === "vnpay" && order?.isEbook === false ) && (
                  <>
                    {order?.isPaid === true ? (
                      <p style={{ color: "green" }}>
                        Đơn hàng đã được thanh toán
                      </p>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <p style={{ color: "red", marginRight: "4px" }}>
                          Đơn hàng chưa thanh toán
                        </p>
                            {userInfo.isAdmin === false ? (<>
                              <Nav.Link
                          className="text-primary"
                          onClick={handleCheckOut}
                        >
                          Thanh toán ngay
                        </Nav.Link>
                            </>) : <></>}
                        
                      </div>
                    )}
                  </>
                )}
                {order?.isEbook === false && (
                  <>
                    {order?.orderStatus === "Đã hủy" ? (
                      <div className="mt-4">
                        <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-lg">
                          <h3 className="text-lg font-bold mb-2">
                            Đơn hàng đã bị hủy
                          </h3>
                          <p className="text-sm">
                            <span className="font-semibold">Lý do: </span>
                            {order?.cancelReason || "Không có lý do cụ thể"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mt-4">
                          {steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                              <div className="flex flex-col items-center">
                                {/* Hiển thị số bước */}
                                <div
                                  className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${
                                    step.active ||
                                    index < steps.findIndex((s) => s.active)
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {index + 1}
                                </div>

                                {/* Hiển thị nhãn */}
                                <span
                                  className={`mt-2 text-sm ${
                                    step.active ||
                                    index < steps.findIndex((s) => s.active)
                                      ? "text-blue-600 font-semibold"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {step.label}
                                </span>
                                {index < 3 && userInfo.isAdmin === true ? (
                                  <span
                                    className={`mt-2 text-sm ${
                                      step.active
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {step.active ? (
                                      <>
                                        <button
                                          onClick={handleUpdateOrderStatus}
                                          className="btn btn-primary mt-2 mr-1"
                                        >
                                          Hoàn thành
                                        </button>
                                        <button
                                          onClick={handleShow}
                                          className="btn btn-danger mt-2"
                                        >
                                          Hủy đơn hàng
                                        </button>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>

                              {/* Gạch nối giữa các bước */}
                              {index !== steps.length - 1 && (
                                <div
                                  className={`h-[2px] w-[60px] ${
                                    index < steps.findIndex((s) => s.active)
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                  }`}
                                ></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            {order?.isEbook === false && (
              <div className="col-7">
                <div className="mb-3 ">
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
                            {shippingAddress.recipientName}{" "}
                          </span>
                          <div className="border-solid border-r-[2px] border-[#ddd] mx-[8px]"></div>
                          <span className="font-normal">
                            {shippingAddress.phone}
                          </span>
                        </div>
                        <div>
                          <span className="font-normal">
                            {" "}
                            {shippingAddress.address}, {shippingAddress?.wards},{" "}
                            {shippingAddress?.district}, {shippingAddress?.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className=" col-lg-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-[#ffff] border-[1px] border-solid rounded-[16px] p-[2rem]  gx-2">
              <div className="mb-2">
                <h4 className="text-[17px] capitalize leading-[28px] font-black">
                  Chi tiết đơn hàng
                </h4>
                <hr />
              </div>
              {orderItems?.map((item) => (
                <div className="flex flex-row items-center bg-[#ffffff] border-b-[1px] border-solid border-[#eee] p-[15px] mb-3 ">
                  <div className="basis-[100px]">
                    <img src={item?.bookImage} />
                  </div>

                  <div className=" w-[calc(100%-100px)] basis-[calc(100%-100px)] pl-3">
                    <h2 className="font-normal  text-[17px] line-clamp-2 mb-[10px] leading-[28px] text-[#4b5966] capitalize hover:text-[#5caf90] ">
                      {item?.bookName}
                    </h2>
                    {order?.isEbook === false ? (
                      <h6 className="font-normal text-[#999] text-[14px] mb-[10px] leading-[1.2] capitalize">
                        <span className="font-semibold">Số lượng:</span>{" "}
                        {item?.qty}
                      </h6>
                    ) : (
                      <h6 className="font-normal text-[#999] text-[14px] mb-[10px] leading-[1.2] capitalize">
                        <span className="font-semibold">Sách điện tử</span>
                      </h6>
                    )}
                    <span className="text-[#4b5966] text-[14px] font-bold mr-[7px]">
                      {transform(item?.bookPrice, optionCurrency)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="row">
                <div className="col-8 pb-1">
                  <p>Phương thức thanh toán:</p>
                </div>
                <div className="col-4 pb-1">
                  <span>
                    {order?.paymentMethod === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : "Thanh toán VNPay"}{" "}
                  </span>
                </div>
                <div className="col-8 pb-1">
                  <p>Thành tiền:</p>
                </div>
                <div className="col-4 pb-1">
                  <span>
                    {transform(parseInt(order?.itemsPrice), optionCurrency)}{" "}
                  </span>
                </div>
              </div>
              {order?.isEbook === false && (
                <div className="row">
                  <div className="col-8 pb-1">
                    <p>Phí vận chuyển:</p>
                  </div>
                  <div className="col-4 pb-1">
                    {/* <span>{ transform(totalItem.ship,optionCurrency) } </span> */}
                    <span>
                      {transform(
                        parseInt(order?.shippingPrice),
                        optionCurrency
                      )}{" "}
                    </span>
                  </div>
                </div>
              )}
              {order?.discountAmount > 0 ? (
                <div className="row">
                  <div className="col-8 pb-1">
                    <p>Đã áp dụng giảm giá:</p>
                  </div>
                  <div className="col-4 pb-1">
                    <span style={{ color: "rgb(157 17 17 / 78%)" }}>
                      -
                      {transform(
                        parseInt(order?.discountAmount),
                        optionCurrency
                      )}{" "}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="row pb-1 font-bold">
                <div className="col-8">
                  <p>Tổng thanh toán:</p>
                </div>
                <div className="col-4 text-[20px] text-[#9d1111]">
                  <span>
                    {transform(parseInt(order?.totalPrice), optionCurrency)}{" "}
                  </span>
                </div>
              </div>
              {(userInfo.isAdmin === false) && (order.paymentMethod === "vnpay" && order.isPaid === false) && (order.paymentMethod === "vnpay" && order?.isEbook === false) ? (
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
                      "THANH TOÁN NGAY"
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      
      
      
      </>) }
    </>
  );
};

export default PaymentOrder;
