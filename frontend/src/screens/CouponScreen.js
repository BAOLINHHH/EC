import React, { useEffect, useState } from "react";
import SidebarUser from "./SidebarUser";
import { RiCoupon2Fill } from "react-icons/ri";
import couponApi from "../api/couponApi";
import { optionCurrency, transform } from "../componets/money";
import { calculateRemainingDays } from "../utils/calculateDayRemain";
import dayjs from "dayjs";
import Loader from "../componets/Loader";
import { toast } from "react-toastify";
const CouponScreen = () => {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const [couponData, setCouponData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    flechData();
  }, []);

  const flechData = async () => {
    const response = await couponApi.getAll();
    setIsLoading(false);
    setCouponData(response);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Mã "${code}" đã được sao chép!`, {
      position: "top-center",
      autoClose: 3000, // Đóng sau 3 giây
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <>
      <section className="py-3">
        <div className="container ">
          <div className=" flex gap-[60px]">
            <div className="w-[280px] shadow-[1px_1px_7px_rgba(#00000029)] ">
              <SidebarUser />
            </div>
            <div className=" border-solid border-[1px] rounded-[6px] w-full bg-[#fff] shadow-[1px_1px_7px_rgba(#00000029)] ">
              <div className="px-[10px] py-[5px]">
                <div className="w-full mb-[10px] flex items-center justify-between">
                  <h1 className="font-[600] text-[20px] p-[10px]">
                    {" "}
                    Sổ tay vocher
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-y-3 px-8">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {couponData?.map((item) => (
                        <div className=" flex  w-[400px] gap-x-3 border-solid border-[1px] rounded-[7px] p-2">
                          <div className="flex items-center bg-[#28B928] text-[#fff] w-[100px] justify-center border-solid border-[1px] rounded-[7px]">
                            <RiCoupon2Fill size={50} />
                          </div>
                          <div>
                            <h3 className="tex-[20px] font-[700] mb-1">
                              {item.code}
                            </h3>
                            <p className="tex-[17px] mb-1">
                              {item.discount}% giảm giá
                            </p>
                            <p className="tex-[17px] mb-1">
                              Giảm giá tối đa{" "}
                              {transform(item.maxDiscount, optionCurrency)}
                            </p>
                            <p className="tex-[17px] mb-1">
                              Đơn hàng tối thiểu{" "}
                              {transform(item.minOrderValue, optionCurrency)}
                            </p>
                            <p className=" tex-[17px] mb-1 text-[#d0432d]">
                              {calculateRemainingDays(now, item.expirationDate)}
                            </p>
                            <button
                              className="bg-[#007bff] text-white px-3 py-1 rounded-[5px] text-[16px] hover:bg-[#0056b3] transition"
                              onClick={() => handleCopyCode(item.code)}
                            >
                              Sao chép mã
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CouponScreen;
