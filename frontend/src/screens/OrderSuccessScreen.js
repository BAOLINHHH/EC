import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import orderApi from "../api/orderApi";

const OrderSuccessScreen = () => {
  const [orderDetail, setOrderDetail] = useState(null);
  const { id: orderId } = useParams(); // Lấy biến id từ URL
  const navigate = useNavigate();

  const handleGetOrderById = async () => {
    const response = await orderApi.getOrderById(orderId);
    console.log("response", response);
    setOrderDetail(response);
  };

  useEffect(() => {
    handleGetOrderById();
  }, [orderId]);

  return (
    <Container className="my-5 text-center">
      <Row>
        <Col>
          <div className="d-flex justify-content-center mb-4">
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
          </div>
          <h2 className="mb-3">Cảm ơn bạn đã mua hàng!</h2>
          <p className="mb-4">
            {orderDetail?.paymentMethod === "COD" ? (
              "Thanh toán COD: Shop đã lên đơn hàng cho bạn, vui lòng chuẩn bị đầy đủ số tiền trên đơn để nhận sách nhé!"
            ) : (
              <></>
            )}

            {orderDetail?.paymentMethod === "vnpay" &&
            orderDetail?.isPaid === true ? (
              "Thanh toán VNPay: Shop đã lên đơn hàng cho bạn, vui lòng chú ý điện thoại từ đơn vị vận chuyển đến lúc nhận được hàng nhé!"
            ) : (
              <></>
            )}

            {orderDetail?.paymentMethod === "vnpay" &&
            orderDetail?.isPaid === false ? (
              <>
                <div className="text-warning mb-2">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="me-2"
                  />
                  Bạn cần hoàn thành thanh toán
                </div>
                Shop đã lên đơn hàng cho bạn, bạn vui lòng thanh toán đơn hàng
                để shop gửi hàng cho bạn nhé!
              </>
            ) : (
              <></>
            )}
          </p>
          <p>
            Mã đơn hàng:{" "}
            <span
              className="text-primary text-decoration-underline cursor-pointer"
              onClick={() => navigate(`/order/${orderId}`)}
              style={{ cursor: "pointer" }}
            >
              #{orderId}
            </span>
          </p>
          <div className="mt-4">
            <Button
              variant="outline-primary"
              className="mr-3"
              onClick={() => {
                navigate("/order/" + orderId);
              }}
            >
              XEM ĐƠN HÀNG CHI TIẾT
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                navigate("/");
              }}
            >
              TIẾP TỤC MUA SẮM
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccessScreen;
