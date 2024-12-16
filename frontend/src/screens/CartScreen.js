import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import imgicon from '../imageshome/empty-cart1.png'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {addToCart, removeFromCart} from '../slices/cartSlice'
import { BsFillTrashFill } from "react-icons/bs";
import { optionCurrency,transform } from "../componets/money";
const CartScreen = () => {
   
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const cart = useSelector ((state) => state.cart)
    const {cartItems} = cart;
    
  const increaseNewQty =  (product,qty,stock) => {
    
      const newQty = qty + 1;
      if (newQty > 3) return;
      qty = newQty;
      dispatch(addToCart({...product,qty}))
    
      
  }

  const decreaseNewQty = (product,qty) => {

      const newQty = qty - 1;
      if (newQty <= 0) return;
      qty = newQty;
      dispatch(addToCart({...product,qty}))
  }
  const removeCartItem = (id) =>{
    dispatch(removeFromCart(id))
  }
  const totalItem = {
    total: cartItems.reduce((acc,item) =>acc + item.qty *item.bookPrice ,0) || 0,
    totalcalc: 0,
  }
  totalItem.totalcalc = totalItem.total
  const checkoutHandler = () =>{
    // navigate('/login?redirect=/payment');
    navigate('/payment');
  }
  return (
    <>
     <section className='py-5'>
        <div className='container'>
        <div className="titile">
        </div>
        {cartItems.length===0 ?(
          <section className="py-5">
          <div className = "container-sm">
          <h1 className="fs-5 ">GIỎ HÀNG: <span>({cartItems.length} sản phẩm)</span></h1>
               <div className= "flex flex-col items-center border-[1px] border-solid rounded-[8px] shadow-[0px_0px_2px_rgba(0,0,0,0.1)]">
                
                    <div className="pt-5"> 
                      <img className src={imgicon} alt='empty cart' />
                    </div>
                    <div className="text-[#999] text-[14px] my-3">
                      <p>Chưa có sản phẩm trong giỏ hàng của bạn.</p>
                    </div>
                    <div className="pb-5">
                    <Link to = {"/"}>
                    <button type="button" className="btn btn-danger w-[150px] ">MUA SẮM NGAY</button>
                    </Link>
                    </div>
               </div>
          </div>
        </section>

        ): (
          <section className="py-5">
            <div className="container" >
               <div className="row d-flex justify-content-between">
                      <div className="col-lg-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-[#ffff] border-[1px] border-solid rounded-[16px] max-w-[950px]">
                        <div className=" border-b-[1px] border-solid h-[50px]">
                        <h1 className="leading-3 text-[20px] pt-4">GIỎ HÀNG: <span>({cartItems.length} sản phẩm)</span></h1>
                       </div>
                      {/* <h1 className="fs-5 border-b-[1px] border-solid mb-3 leading-3 text-[20px]">GIỎ HÀNG: <span>({cartItems.length} sản phẩm)</span></h1> */}
                            {cartItems.map((item) =>(
                              <div className="cart-item py-3 border-b-[1px] border-solid" key={item._id}>
                              <div className="row">
                              <div className="col-lg-2">
                              <Link to={`/product/${item._id}`}><img src={item.bookImage} alt="bookimg" height="115" width="115" /></Link>
                              </div>

                              <div className="col-5 col-lg-2">
                                  <Link to={`/product/${item._id}`}>
                                    {item.bookName}
                                    </Link>
                              </div>
                              <div className="col-lg-2 text-[#a03826] text-[20px] font-bold">
                                  <p id="card_item_price  " >{transform(item.bookPrice,optionCurrency)}</p>
                              </div>
                              <div className="col-lg-3  ">
                                      <div className='input-group ' >
                                        <button className="btn btn-outline-secondary px-3 " type="button" onClick={() => decreaseNewQty(item, item.qty)} >
                                            <AiOutlineMinus/>
                                        </button>
                                        <input type="number" className="form-control count input-cart" value={item.qty} readOnly/>
                                        <button className="btn btn-outline-secondary px-3 " type="button"  onClick={ () =>increaseNewQty(item,item.qty,item.quantity)}>
                                            <AiOutlinePlus/>
                                        </button>
                                      </div>
                              </div>
                              <div className="col-lg-1 text-[25px] pt-1">
                                <i onClick={() => removeCartItem(item._id)}> <BsFillTrashFill /> </i>
                              </div>

                              </div>
                              </div>
                              
                            
                            )) }
                          
                      </div>
                      <div className="col-lg-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] bg-[#ffff] border-[1px] border-solid rounded-[16px] p-[2rem] h-[230px] gx-2">
                                  <div className="mb-2">
                                  <h4>Chi tiết đơn hàng</h4>
                                  <hr/>
                                  </div>
                                  <div className="row">
                                    <div className="col-8 pb-1">
                                  <p>Thành tiền:  
                                  </p>
                                  </div>
                                  <div className="col-4 pb-1">
                                  <span>{ transform(totalItem.total,optionCurrency) } </span>
                                  </div>
                                  </div>
                                  {/* <div className="row">
                                    <div className="col-8 pb-1">
                                  <p>Phí vận chuyển:  
                                  </p>
                                  </div>
                                  <div className="col-4 pb-1">
                                  <span>{ transform(totalItem.ship,optionCurrency) } </span>
                                  </div>
                                  </div> */}
                                  <div className="row pb-1 font-bold" >
                                    <div className="col-8">
                                  <p>Tổng thanh toán:  
                                  </p>
                                  </div>
                                  <div className="col-4 text-[20px] text-[#9d1111]">
                                  <span>{ transform(totalItem.totalcalc,optionCurrency) } </span>
                                  </div>
                                  </div>
                                  <hr />
                                  <div className="d-flex justify-content-center pt-3">
                                  <button type="button"  onClick={checkoutHandler} className="btn btn-danger" >THANH TOÁN</button>
                                  </div>
                              
                        </div>
               </div>
            </div>
        </section>
          
        ) 
         }
        </div>
    </section>
    </>
  )
}

export default CartScreen