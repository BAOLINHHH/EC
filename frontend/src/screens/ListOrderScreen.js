import React, { useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetMyOrderQuery } from "../slices/ordersSlice";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../componets/Message";
import Loader from "../componets/Loader";

import { FaRegEye } from "react-icons/fa";
import { transform,optionCurrency } from "../componets/money";
import SidebarUser from "./SidebarUser";
import orderApi from "../api/orderApi";
import dayjs from "dayjs";
const ListOrderScreen = () => {
  // const {data: orders ,isLoading, error }= useGetMyOrderQuery();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handleGetMyOrders = async (currentPage = 1) => {
    try {
      const response = await orderApi.getMyOrders({
        page: currentPage,
        pageSize,
      });
      setOrders(response.orders);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    handleGetMyOrders(page);
  }, [page]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  

  return (
    <section>
      <div className="container">
        <div className="flex gap-[60px]">
          <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)]">
            <SidebarUser />
          </div>
          <div className="border-solid border-[1px] rounded-[6px] w-full bg-[#fff] p-[20px] shadow-[1px_1px_7px_rgba(#00000029)]">
            {/* { orders && totalPages ? (
            <> */}
                   <div className="w-full py-4">
              <h1 className="font-[600] text-[20px] p-[10px]">
                Đơn hàng của tôi
              </h1>
            </div>
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="align-middle">{order.trackingCode}</td>
                    <td className="align-middle">
                       {dayjs(order.createdAt).format("DD-MM-YYYY HH:m:s")}
                    </td>
                    <td className="align-middle">{order.isEbook === true ? "Đã thanh toán" : order.orderStatus }</td>
                    <td className="align-middle">{
                    transform(order.totalPrice, optionCurrency)
                    }</td>
                    <td className="align-middle">
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button>
                          <FaRegEye />
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* </>
            ):(
           
          <section className="py-5">
          <div className = "container-sm">
               <div className= "flex flex-col items-center gap-y-2">
                    <div className=" w-[250px] h-[250px]"> 
                      <img className src={images.imgNoOrder} alt='empty cart' />
                    </div>
                    <div className="text-[#0b0303] text-[20px] my-3">
                      <p>Chưa có hoá đơn nào trong danh mục hóa đơn của bạn.</p>
                    </div>
                    <div className="pb-5">
                    <Link to = {"/"}>
                    <button type="button" className="btn btn-danger w-[150px] ">MUA SẮM NGAY</button>
                    </Link>
                    </div>
               </div>
          </div>
        </section>
          ) } */}

         

            {/* Phân trang */}
            {orders && totalPages > 1 && (
              <Pagination>
                {/* Always show the first page */}
                <Pagination.Item
                  key={1}
                  active={1 === page}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Pagination.Item>

                {/* Ellipsis for skipped pages at the beginning */}
                {page > 3 && <Pagination.Ellipsis disabled />}

                {/* Pages around the current page */}
                {Array.from({ length: 5 }, (_, index) => {
                  const pageNumber = page - 2 + index;
                  if (pageNumber > 1 && pageNumber < totalPages) {
                    return (
                      <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === page}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    );
                  }
                  return null;
                })}

                {/* Ellipsis for skipped pages at the end */}
                {page < totalPages - 2 && <Pagination.Ellipsis disabled />}

                {/* Always show the last page */}
                <Pagination.Item
                  key={totalPages}
                  active={totalPages === page}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Item>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </section>

    // <section>
    // <div className="container">
    //     <div className="row d-flex justify-content-center align-items-center h-100">
    //     <div className="col-md-12">
    //         <div className="card text-black" style={{borderRadius: '25px'}}>
    //         <div className="card-body p-md-5">
    //             <div className="row justify-content-center">
    //             <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">THÔNG TIN ĐƠN HÀNG</p>
    //             {isLoading ? (
    //       <Loader />
    //     ) : error ? (
    //       <Message variant='danger'>
    //         {error?.data?.message || error.error}
    //       </Message>
    //     ) : (
    //       <Table striped hover responsive className='table-sm'>
    //         <thead>
    //           <tr>
    //             <th>ID</th>
    //             <th>Số lượng</th>
    //             <th>Tổng tiền</th>
    //             <th>Trạng thái thanh toán</th>
    //             <th>Trạng thái vận chuyển</th>
    //             <th></th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {orders.map((order) => (
    //             <tr key={order._id}>
    //               <td>{order._id}</td>
    //               <td>{order.orderItems.length}</td>
    //               <td>{order.totalPrice}</td>
    //               <td>
    //                 {order.isPaid ? (
    //                   <p> Đã thanh toán vào {order.paidAt.substring(0, 10)}</p>
    //                 ) : (
    //                   <FaTimes style={{ color: 'red' }} />
    //                 )}
    //               </td>
    //               <td>
    //                 {order.isDelivered ? (
    //                  <p> Đã vận chuyển vào {order.deliveredAt.substring(0, 10)} </p>
    //                 ) : (
    //                   <FaTimes style={{ color: 'red' }} />
    //                 )}
    //               </td>
    //               <td>
    //                 <LinkContainer to
    //                 ={`/order/${order._id}`}>
    //                   <Button className='btn-sm' variant='light'>
    //                     Chi tiết
    //                   </Button>
    //                 </LinkContainer>
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //         </Table>
    //         )}
    //         </div>
    //         </div>
    //         </div>
    //     </div>
    //     </div>
    // </div>
    // </section>
  );
};

export default ListOrderScreen;
