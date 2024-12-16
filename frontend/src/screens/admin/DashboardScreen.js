import React, { useEffect, useMemo } from "react";
import SidebarAdmin from "./SidebarAdmin";
import { useGetProducts1Query } from "../../slices/productsApiSlice";
import { useGetOrderQuery } from "../../slices/ordersSlice";
import Message from "../../componets/Message";
import Loader from "../../componets/Loader";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../../slices/usersApiSlice";
// import {  useDispatch,useSelector } from 'react-redux'
import { FaHandHoldingDollar } from "react-icons/fa6";
import { FaUsers, FaReceipt, FaCommentDots } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { IoPricetag } from "react-icons/io5";
import BookSalesChartfrom from "../../screens/admin/BookSalesChart";
import statsApi from "../../api/statsApi";
import { useState } from "react";
import { transform, optionCurrency } from "../../componets/money";

const DashboardScreen = () => {
  const { data: products, isLoading, error } = useGetProducts1Query();
  const { data: orders } = useGetOrderQuery();
  const { data: users } = useGetUsersQuery();
  const [statsData, setStatsData] = useState();

  const outOfStock = useMemo(() => {
    if (!products) return 0;

    let acc = 0;
    products.map((product) => {
      if (product.bookQuaranty === 0) {
        acc += 1;
      }
    });
    return acc;
  }, [products]);

  const totalAmount = useMemo(() => {
    if (!orders) return 0;

    let acc = 0;
    orders.map((order) => {
      if (order.isPaid) {
        acc += order.totalPrice;
      }
    });

    return acc;
  }, [orders]);

  const handleGetCountDashboard = async () => {
    const response = await statsApi.getCountDashboard();
    // console.log("response.data", response.data)
    setStatsData(response.data);
  };

  useEffect(() => {
    handleGetCountDashboard();
  }, []);

  return (
    <>
      <div className="row">
        <div className=" col-md-2">
          <SidebarAdmin />
        </div>
        <div className="col-md-10">
          <section>
            <div className=" container">
              <div className=" grid grid-cols-4 gap-x-3 mb-3">
                <div className="border-[1px] shadow-lg rounded-[8px] ">
                  <div className="flex justify-between p-[1.6em] ">
                    <div className="flex flex-col border-solid border-l-[5px] border-[#0052cc] pl-2">
                      <p className="text-[17px] mb-3">Tổng số người dùng</p>
                      <h2 className="text-[20px] font-bold leading-5 ">
                        {statsData ? statsData.totalUsers : 0}
                      </h2>
                    </div>

                    <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#e5e7eb] flex items-center justify-center text-[#0052cc]">
                      <FaUsers size={30} />
                    </span>
                  </div>
                </div>
                <div className="border-[1px] shadow-lg rounded-[8px] ">
                  <div className="flex justify-between p-[1.6em] ">
                    <div className="flex flex-col border-solid border-l-[5px] border-[#00baff] pl-2">
                      <p className="text-[17px] mb-3">Doanh thu</p>
                      <h2 className="text-[20px] font-bold leading-5 ">
                        {statsData
                          ? transform(statsData.totalRevenue, optionCurrency)
                          : 0}
                      </h2>
                    </div>

                    <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#e5e7eb] flex items-center justify-center text-[#00baff]">
                      <FaHandHoldingDollar size={30} />
                    </span>
                  </div>
                </div>
                <div className="border-[1px] shadow-lg rounded-[8px] ">
                  <div className="flex justify-between p-[1.6em] ">
                    <div className="flex flex-col border-solid border-l-[5px] border-[#ff9920] pl-2">
                      <p className="text-[17px] mb-3">Sản phẩm</p>
                      <h2 className="text-[20px] font-bold leading-5 ">
                        {statsData ? statsData.totalProducts : 0}
                      </h2>
                    </div>

                    <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#fff2e2] flex items-center justify-center text-[#ff9920] ">
                      <MdCategory size={30} />
                    </span>
                  </div>
                </div>
                <div className="border-[1px] shadow-lg rounded-[8px] ">
                  <div className="flex justify-between p-[1.6em] ">
                    <div className="flex flex-col border-solid border-l-[5px] border-[#0052cc] pl-2">
                      <p className="text-[17px] mb-3">Tổng số hóa đơn</p>
                      <h2 className="text-[20px] font-bold leading-5 ">
                        {statsData ? statsData.totalOrders : 0}
                      </h2>
                    </div>

                    <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#e5e7eb] flex items-center justify-center text-[#22cc00ee]">
                      <FaReceipt size={30} />
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 ">
                <div className="col-span-2">
                  <BookSalesChartfrom />
                </div>
                <div className="col-span-1 pl-9">
                  <div className="grid grid-rows-2 gap-y-5 ">
                    {/* <div className="border-[1px] shadow-lg rounded-[8px] ">
                      <div className="flex justify-between p-[1.6em] ">
                        <div className="flex flex-col border-solid border-l-[5px] border-[#00baff] pl-2">
                          <p className="text-[17px] mb-3">Tổng lượt dánh giá</p>
                          <h2 className="text-[20px] font-bold leading-5 ">
                            5432
                          </h2>
                        </div>

                        <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#e5e7eb] flex items-center justify-center text-[#00baff]">
                          <FaCommentDots size={30} />
                        </span>
                      </div>
                    </div> */}
                    <div className="border-[1px] shadow-lg rounded-[8px] ">
                      <div className="flex justify-between p-[1.6em] ">
                        <div className="flex flex-col border-solid border-l-[5px] border-[#eb4a3c] pl-2">
                          <p className="text-[17px] mb-3">
                            Tổng số Voucher khuyến mãi
                          </p>
                          <h2 className="text-[20px] font-bold leading-5 ">
                            {statsData ? statsData.totalCoupons : 0}
                          </h2>
                        </div>

                        <span className=" border-[1px] rounded-[100%] border-solid w-[60px] h-[60px] bg-[#ffeae5] flex items-center justify-center text-[#f35535] ">
                          <IoPricetag size={30} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="row">
              <div className="row pr-4">
                <div className="col-xl-12 col-sm-12 mb-3">
                  <div className="card text-white bg-primary o-hidden h-100">
                    <div className="card-body">
                      <div className="text-center card-font-size">
                        Tổng doanh thu
                        <br /> <b>{totalAmount} VND</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 mb-3">
                <div className="card text-white bg-success o-hidden h-100">
                  <div className="card-body">
                    <div className="text-center card-font-size">
                      Số Lượng Sách
                      <br /> <b>{products && products.length}</b>
                    </div>
                  </div>
                  <Link
                    className="card-footer text-white clearfix small z-1"
                    to="/admin/productlist"
                  >
                    <span className="float-left">Chi Tiết</span>
                    <span className="float-right">
                      <i className="fa fa-angle-right"></i>
                    </span>
                  </Link>
                </div>
              </div>

              <div className="col-xl-3  mb-3">
                <div className="card text-white bg-danger o-hidden h-100">
                  <div className="card-body">
                    <div className="text-center card-font-size">
                      Đơn Hàng
                      <br /> <b>{orders && orders.length}</b>
                    </div>
                  </div>
                  <Link
                    className="card-footer text-white clearfix small z-1"
                    to="/admin/orderlist"
                  >
                    <span className="float-left">Chi Tiết</span>
                    <span className="float-right">
                      <i className="fa fa-angle-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-xl-3 mb-3">
                <div className="card text-white bg-info o-hidden h-100">
                  <div className="card-body">
                    <div className="text-center card-font-size">
                      Người dùng
                      <br /> <b>{users && users.length}</b>
                    </div>
                  </div>
                  <Link
                    className="card-footer text-white clearfix small z-1"
                    to="/admin/userlist"
                  >
                    <span className="float-left">Chi Tiết</span>
                    <span className="float-right">
                      <i className="fa fa-angle-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="col-xl-3  mb-3">
                <div className="card text-white bg-warning o-hidden h-100">
                  <div className="card-body">
                    <div className="text-center card-font-size">
                      Số Lượng Sách Hết Hàng
                      <br /> <b>{outOfStock}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default DashboardScreen;
