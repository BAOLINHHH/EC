import React, { useEffect, useRef } from "react";
import { Button, Card, CardHeader, CardTitle, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../utils/format";
import dateformat from "dateformat";
import orderApi from "../api/orderApi";
import productsAPI from "../api/productsAPI";
import { transform, optionCurrency } from "../componets/money";
import { useState } from "react";
import { toast } from "react-toastify";

const BillScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  // Lấy từng giá trị của params
  const amount = searchParams.get("vnp_Amount");
  const bankCode = searchParams.get("vnp_BankCode");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const transactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnpOrderInfo = searchParams.get("vnp_OrderInfo");
  const vnpPayDate = searchParams.get("vnp_PayDate");
  const orderId = vnpOrderInfo.split(": #")[1].trim(); // Lấy phần sau dấu ":"
  const productId = vnpOrderInfo.split(": #")[1].trim(); // Lấy phần sau dấu ":"
  const isEbook = vnpOrderInfo.includes("ebook"); // Chuỗi có chứa "ebook"
  const [newOrderId, setNewOrderId] = useState();
  const [transactionStatusError, setTransactionStatusError] = useState("");
  const hasCalledCreateOrder = useRef(false);  // useRef để kiểm soát việc gọi lại handleCreateOrder

  const handleUpdateOrderToPaid = async () => {
    const response = await orderApi.updateOrderToPaid(orderId);
    // if (response) {
    //   toast.success("Đơn hàng đã thanh toán thành công");
    // }
  };

  const handleCreateOrder = async () => {
    try {
      // Lấy chi tiết sản phẩm
      const productDetail = await productsAPI.getProductDetail(productId);

      // Tạo payload cho đơn hàng
      const payload = {
        orderItems: [{ ...productDetail, qty: 1 }],
        shippingAddress: {
          city: null,
          district: null,
          wards: null,
          address: null,
          phone: null,
          recipientName: null,
        },
        paymentMethod: "vnpay",
        itemsPrice: productDetail.bookPrice,
        shippingPrice: 0,
        discountAmount: 0,
        totalPrice: productDetail.bookPrice,
        couponId: null,
        ebook: true,
      };

      // Gửi yêu cầu tạo đơn hàng
      const response = await orderApi.createOrders(payload);
      if (response) {
        const response2 = await orderApi.updateOrderToPaid(response._id);
        if (response2) {
          setNewOrderId(response._id);
          // toast.success("Đơn hàng đã thanh toán thành công");

          const orderId = response._id;
          const payload = {
            orderId: orderId,
            newStatus: "Đơn hàng đã được giao"
          };
          await orderApi.updateOrderStatusUser(payload);
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    // Kiểm tra trạng thái giao dịch và chỉ gọi handleCreateOrder một lần
    if(!hasCalledCreateOrder.current);
    if (transactionStatus === "00" && isEbook === true) {
      if(!hasCalledCreateOrder.current) 
        handleCreateOrder();
        hasCalledCreateOrder.current = true;  // Đánh dấu là đã gọi hàm này
    }
    else if (transactionStatus === "00" && isEbook === false) {
      handleUpdateOrderToPaid();
    }
    else if (transactionStatus === "07") {
      setTransactionStatusError(
        "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)."
      );
    } else if (transactionStatus === "09") {
      setTransactionStatusError(
        "Giao dịch không thành công: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng."
      );
    } else if (transactionStatus === "10") {
      setTransactionStatusError(
        "Giao dịch không thành công: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần."
      );
    } else if (transactionStatus === "11") {
      setTransactionStatusError(
        "Giao dịch không thành công: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch."
      );
    } else if (transactionStatus === "12") {
      setTransactionStatusError(
        "Giao dịch không thành công: Thẻ/Tài khoản của khách hàng bị khóa."
      );
    } else if (transactionStatus === "13") {
      setTransactionStatusError(
        "Giao dịch không thành công: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch."
      );
    } else if (transactionStatus === "24") {
      setTransactionStatusError(
        "Giao dịch không thành công: Khách hàng hủy giao dịch."
      );
    } else if (transactionStatus === "51") {
      setTransactionStatusError(
        "Giao dịch không thành công: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch."
      );
    } else if (transactionStatus === "65") {
      setTransactionStatusError(
        "Giao dịch không thành công: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày."
      );
    } else if (transactionStatus === "75") {
      setTransactionStatusError("Ngân hàng thanh toán đang bảo trì.");
    } else if (transactionStatus === "79") {
      setTransactionStatusError(
        "Giao dịch không thành công: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch."
      );
    } else if (transactionStatus === "99") {
      setTransactionStatusError(
        "Giao dịch không thành công: Lỗi không xác định."
      );
    } else {
      setTransactionStatusError(
        "Giao dịch không thành công: Mã lỗi không xác định."
      );
    }
  }, [transactionStatus, isEbook, hasCalledCreateOrder.current]);  // Chạy lại khi transactionStatus hoặc isEbook thay đổi

  const formatVnpPayDate = (vnpPayDate) => {
    const dateString = `${vnpPayDate.slice(0, 4)}-${vnpPayDate.slice(
      4,
      6
    )}-${vnpPayDate.slice(6, 8)}T${vnpPayDate.slice(8, 10)}:${vnpPayDate.slice(
      10,
      12
    )}:${vnpPayDate.slice(12, 14)}`;
    return dateformat(new Date(dateString), "dd-mm-yyyy HH:MM:ss");
  };

  const handleNavigateBack = () => {
    // Điều hướng về trang trước đó hoặc một trang tùy ý
    if (isEbook === false) {
      navigate("/order-success/" + orderId);
    } else {
      navigate("/order-success/" + newOrderId);
    }
  };

  const handlePaymentCompletion = () => {
    // Điều hướng về trang hoàn thành thanh toán hoặc trang nào đó
    if (isEbook === false) {
      navigate("/order-success/" + orderId);
    } else {
      navigate("/order-success/" + newOrderId);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <Card>
          <CardHeader className="text-center text-muted d-flex justify-content-between align-items-center">
            <CardTitle>Hóa đơn thanh toán VNPAY</CardTitle>
            <Button
              variant="link"
              className="text-muted"
              onClick={handleNavigateBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Trở về
            </Button>
          </CardHeader>
          <Card.Body>
            <div className="d-flex justify-content-center mb-4">
              {transactionStatus == "00" ? (
                <>
                  <div
                    className="bg-success rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-white"
                      style={{ fontSize: "42px" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="bg-danger rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-white"
                      style={{ fontSize: "42px" }}
                    />
                  </div>
                </>
              )}
            </div>
            {transactionStatus == "00" ? (
              <>
                <h5 className="text-center mb-2 fw-bold">
                  Giao dịch thành công
                </h5>
              </>
            ) : (
              <>
                <h5 className="text-center mb-2 fw-bold">Giao dịch thất bại</h5>
              </>
            )}

            <p className="text-center mb-10">{transactionStatusError}</p>

            <Row className="mb-3">
              <Col>Mã giao dịch:</Col>
              <Col>{transactionNo}</Col>
            </Row>
            <Row className="mb-3">
              <Col>Ngân hàng giao dịch:</Col>
              <Col>{bankCode}</Col>
            </Row>
            <Row className="mb-3">
              <Col>Mô tả:</Col>
              <Col>{vnpOrderInfo}</Col>
            </Row>
            <Row className="mb-3">
              <Col>
                Số tiền {transactionStatus == "00" ? "được" : ""} thanh toán:
              </Col>
              <Col>
                {transform(amount / 100, optionCurrency)}
                {/* {formatCurrency(amount)} */}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="text-center text-muted d-flex justify-content-between align-items-center">
            <div>Ngày giao dịch: {formatVnpPayDate(vnpPayDate)} </div>

            {transactionStatus == "00" ? (
              <>
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={handlePaymentCompletion}
                >
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" />
                  Hoàn thành thanh toán
                </Button>
              </>
            ) : (
              <></>
            )}
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default BillScreen;
