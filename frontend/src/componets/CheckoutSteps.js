import React from 'react'
import { Link } from 'react-router-dom'

const CheckoutSteps = ({ shippingAndPayment,confiOrder ,placeOrder}) => {
  return (
    <div className="checkout-progress d-flex justify-content-center">

    {shippingAndPayment ? <Link to='/shipping' className="float-right">
        <div className="triangle2-active"></div>
        <div className="step active-step">Địa Chỉ Và Phương Thức Thanh Toán</div>
        <div className="triangle-active"></div>
    </Link> : <Link to="/" disabled>
            <div className="triangle2-incomplete"></div>
            <div className="step incomplete">Địa Chỉ Và Phương Thức Thanh Toán</div>
            <div className="triangle-incomplete"></div>
        </Link>}

    {confiOrder ? <Link to='/payment' className="float-right">
        <div className="triangle2-active"></div>
        <div className="step active-step">Xác Nhận Đơn Hàng</div>
        <div className="triangle-active"></div>
    </Link> : <Link to="/payment" disabled>
            <div className="triangle2-incomplete"></div>
            <div className="step incomplete">Xác Nhận Đơn Hàng</div>
            <div className="triangle-incomplete"></div>
        </Link>}

        
    {/* {placeOrder ? <Link to={`/order/{$order._id}`} className="float-right">
        <div className="triangle2-active"></div>
        <div className="step active-step">Thanh Toán Đơn Hàng</div>
        <div className="triangle-active"></div>
    </Link> : <Link to={`/order/{$order._id}`} disabled>
            <div className="triangle2-incomplete"></div>
            <div className="step incomplete">Thanh Toán Đơn Hàng</div>
            <div className="triangle-incomplete"></div>
        </Link>} */}

    </div>
  )
}

export default CheckoutSteps