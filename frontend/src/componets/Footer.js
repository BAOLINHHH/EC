import React from "react";
import playstore from "../imageshome/playstore.png";
import appstore from "../imageshome/Appstore.png";
import { BsFacebook, BsInstagram } from "react-icons/bs";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="flex items-center justify-center bg-[#222121] text-[#fff]">
        <div
          style={{ width: "28%" }}
          className="flex flex-wrap justify-center "
        >
          <h4 className="m-0">Tải ứng dụng ngay</h4>
          <p>Ứng dụng có mặt trên Appstore và Playstore</p>
          <div className=" d-flex align-items-center mt-10">
            <img
              style={{ width: "10vmax" }}
              className="cursor-pointer"
              src={playstore}
              alt="playstore"
            />
            <img
              style={{ width: "10vmax" }}
              className="cursor-pointer"
              src={appstore}
              alt="appstore"
            />
          </div>
        </div>
        <div style={{ width: "40%" }} className="text-center">
          <h1
            style={{ fontSize: "2vmax", fontFamily: "Roboto" }}
            className="my-3 text-[#febd69]"
          >
            Book Store Future
          </h1>
          <p className="my-1">
            Số 9 Lê Văn Chí, phường Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh
          </p>
          <p className="my-1">
            Chất lượng và sự nhanh chống là ưu tiên của chúng tôi
          </p>
          <p className="my-1"> Book Store Future &copy; {currentYear}</p>
        </div>
        <div
          style={{ width: "20%" }}
          className="d-flex flex-column items-center"
        >
          <h4
            style={{
              fontSize: "1.4vmax",
              fontFamily: "Roboto",
              textDecoration: "underline",
            }}
          >
            Theo dỗi chúng tôi
          </h4>
          <div className="social_icons d-flex align-items-center gap-30 mt-[20px]">
            <a href="https://www.facebook.com/profile.php?id=100006635956508">
              <BsFacebook className="fs-4" style={{ marginRight: "1vmax" }} />
            </a>
            <a href="https://www.instagram.com/bao_linhu/">
              <BsInstagram className="fs-4" />
            </a>
          </div>
        </div>
      </footer>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.176425478!2d106.78011890000002!3d10.8450968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175270ddaa8cca1%3A0x496d0614ef91b494!2zTmjDoCBTw6FjaCBGQUhBU0EgUXXhuq1uIDk!5e0!3m2!1svi!2s!4v1724757761400!5m2!1svi!2s"
          width="100%"
          height="450"
          allow="geolocation"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>{" "}
      </div>
    </>
  );
};

export default Footer;
