import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import slider1 from '../imageshome/slider1.jpg'

const ProductCarousel = () => {
    return (
      <>
      <section className="my-9">
        <div className="container">
          <div className="relative">
          <Image src={slider1}/>
            <div className=" absolute top-[25%] left-[10%]  " >
              <h1 className="text-[40px] capitalize leading-[1.5] text-[#ffff]">Đa dạng các loại sách</h1>
              
              <p className="text-[20px] mt-3 capitalize leading-[1.2] font-[400] "> Giá cả ưu đãi chỉ từ 55.000 đ</p>
              <div className="mt-3 text-[#ffff] border-[2px] border-[#d6681b] border-solid rounded-[5px] h-[50px] w-[90px] flex justify-around bg-[#f07c29] hover:bg-[#0a0909]"> 
                <Link to = '/all-product'><button>Mua Ngay</button></Link>
              </div>
            </div>
          </div>  
        </div>
      </section>
      </>
    )
}

export default ProductCarousel