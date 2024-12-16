import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaRegEye, FaTimes } from "react-icons/fa";
import Loader from "../../componets/Loader";
import Message from "../../componets/Message";
import Pagination from '@mui/material/Pagination';
import { transform,optionCurrency } from "../../componets/money";
import SidebarAdmin from "./SidebarAdmin";
import Stack from '@mui/material/Stack';
import orderApi from "../../api/orderApi";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
const ListOrderAdminScreen = () => {
  // const { data: orders, isLoading, error } = useGetOrderQuery();

  const [orders, setOrders] = useState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const handleGetOrder = async (currentPage = 1) => {
    const response = await orderApi.getOrder({ page: currentPage, pageSize });
    console.log("response", response);

    setOrders(response.orders);
    setPage(response.pagination.currentPage);
    setTotalPages(response.pagination.pageSize);
  };

  useEffect(() => {
    handleGetOrder(page);
  }, [page]);

  
  const handlePaginate = (event,value) =>{
    const currentPage = value ; 
    setPage(currentPage)
  }
  // const handlePageChange = (pageNumber) => {
  //   setPage(pageNumber);
  // };

  return (
    <>
      <section>
        <div className="container">
          <div className="flex gap-[60px]">
            <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)]">
              <SidebarAdmin />
            </div>
            <div className="border-solid border-[1px] rounded-[6px] w-full bg-[#fff] p-[20px] shadow-[1px_1px_7px_rgba(#00000029)]">
              <div className="w-full py-4">
                <h1 className="font-[600] text-[20px] p-[10px]">
                  Đơn hàng cửa hàng
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
                      <td className="align-middle">
                        {order.trackingCode }
                      </td>
                      <td className="align-middle">
                      {dayjs(order.createdAt).format("DD-MM-YYYY HH:m:s")}
            
                      </td>
                      <td className="align-middle">{order.orderStatus}</td>
                      <td className="align-middle">
                        <p className="text-[#c53533] text-[17px]">
                        {transform(order.totalPrice, optionCurrency)}
                        </p>
                        </td>
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
              <div className='flex justify-center mt-3'>
                  <Stack spacing={2}>
                      <Pagination count={totalPages} onChange={handlePaginate}/>
                  </Stack>
                </div>
              {/* Phân trang */}
              {/* {orders && totalPages > 1 && (
                <Pagination> */}
                  {/* Always show the first page */}
                  {/* <Pagination.Item
                    key={1}
                    active={1 === page}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </Pagination.Item> */}

                  {/* Ellipsis for skipped pages at the beginning */}
                  {/* {page > 3 && <Pagination.Ellipsis disabled />} */}

                  {/* Pages around the current page */}
                  {/* {Array.from({ length: 5 }, (_, index) => {
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
                  })} */}

                  {/* Ellipsis for skipped pages at the end */}
                  {/* {page < totalPages - 2 && <Pagination.Ellipsis disabled />} */}

                  {/* Always show the last page */}
                  {/* <Pagination.Item
                    key={totalPages}
                    active={totalPages === page}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Pagination.Item>
                </Pagination>
              )} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListOrderAdminScreen;
