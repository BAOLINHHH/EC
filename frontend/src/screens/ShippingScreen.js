import {useState} from 'react'
import { Form } from "react-bootstrap";
import { useDispatch,useSelector } from 'react-redux';
import { saveShippingAddress } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../componets/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
const ShippingScreen = () => {
    const cart = useSelector((state) =>state.cart);
    const { shippingInfo} = cart;
    const [paymentMethod,setPaymentMethod] = useState('PayPal')
    const [city,setCity]= useState(shippingInfo?.city);
    const [ district,setDistrict] = useState(shippingInfo?.district);
    const [ wards, setWards] = useState(shippingInfo?.wards);
    const [ address,setAddress] = useState(shippingInfo?.address);
    const [phone,setPhone] = useState(shippingInfo?.phone);


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitShipping = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({city,district,wards,address,phone}));
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/payment')
    }
  return (
    <>
    <CheckoutSteps shippingAndPayment />
     <div className="row d-flex  justify-content-center">
                <div className=" col-lg-5">
                        <h1 className="mb-4 d-flex text-center justify-content-center">Địa Chỉ Và Phương Thức Thanh Toán</h1>
                        <hr />
                    <form  encType="multipart/form-data"  onSubmit={submitShipping}>
                        <div className="py-2 ">
                        <h5>Phương thức thanh toán:</h5> <Form.Check type='radio' label = 'PayPal Hoặc Creadit Card' id='PayPal' name='paymentMethod' value='PayPal' checked
                        onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                        </div>
                        <hr />
                        <div className="form-group py-2">
                        <h5>Địa chỉ giao hàng:</h5>
                        <label>Tỉnh/Thành phố</label>
                            <input
                                type="text"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group py-2 ">
                            <label >Quận/Huyện</label>
                            <input
                                type="text"
                                className="form-control"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group py-2 ">
                            <label >Phường/Xã</label>
                            <input
                                type="text"
                                className="form-control"
                                value={wards}
                                onChange={(e) => setWards(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group py-2 ">
                            <label >Địa chỉ nhận hàng</label>
                            <input
                                type="text"
                                value={address}
                                className="form-control"
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group py-2 ">
                            <label >Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary " >Tiếp tục</button>
                        </div>
                    </form>
                </div>
            </div>
    </>
  )
}

export default ShippingScreen