import Header from "./componets/Header";
import Footer from "./componets/Footer";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAddToCartMutation, useGetCartQuery } from "./slices/cartApiSlice";
import { setCartItems } from "./slices/cartSlice";

const App = () => {
  const dispatch = useDispatch();
  // Lấy đường dẫn hiện tại
  const location = useLocation();

  // Lấy trạng thái của giỏ hàng từ Redux store
  const cartData = useSelector((state) => state.cart);

  // Sử dụng useRef để lưu giá trị trước đó của cartData
  const previousCartDataRef = useRef();

  const [addToCart] = useAddToCartMutation(); // Hook thêm sản phẩm vào giỏ hàng
  const { data: cartDataDB, refetch, error } = useGetCartQuery();
  const isLoading = useSelector((state) => state.cart.isLoading);
  const { userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      refetch(); // Refetch cart data when user logs in
    }
  }, [userInfo, refetch]);

  useEffect(() => {
    // console.log("Redux store has finished loading!");
    if (cartDataDB && cartDataDB.cartItems) {
      // console.log("cartDataDB", cartDataDB);
      dispatch(setCartItems(cartDataDB));
    }
  }, [isLoading, cartDataDB, dispatch]);

  useEffect(() => {
    // Chỉ gọi addToCart khi đường dẫn là /product hoặc /cart
    if (cartData) {
      // Kiểm tra sự thay đổi của cartData
      if (
        previousCartDataRef.current &&
        previousCartDataRef.current !== cartData
      ) {
        // console.log("cartData đã thay đổi");
        // Gọi hàm cập nhật lên database tại đây
        const { reviews, ...filteredProduct } = cartData;

        try {
          const payload = {
            userId: userInfo._id,
            cartItems: filteredProduct.cartItems.map(item => ({ _id: item._id, qty: item.qty })),
            itemsPrice: !isNaN(filteredProduct.itemsPrice) ? Number(filteredProduct.itemsPrice) : 0,
            itemsShip: filteredProduct.itemsShip,
            paymentMethhod: filteredProduct.paymentMethhod,
          };

          addToCart(payload);
        } catch (error) {
          console.error("Failed to add item to cart:", error);
        }
      }

      // Cập nhật giá trị của previousCartDataRef sau khi so sánh
      previousCartDataRef.current = cartData;
    }
  }, [cartData, location.pathname, dispatch]); // Thêm location.pathname và dispatch vào mảng phụ thuộc

  return (
    <>
      {/* style={{backgroundColor:'#f5f5f7'}} */}
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
