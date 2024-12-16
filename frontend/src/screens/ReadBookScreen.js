import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoBook from "../imageshome/readspamle.pdf";
import Loader from "../componets/Loader";
import listProduct from "../api/productsAPI";
const ReadBookScreen = () => {
  const { id } = useParams();
  const [dataProduct, SetdataProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    flechData();
  }, []);
  const flechData = async () => {
    try {
      const responseProduct = await listProduct.getProductDetail(id);
      SetdataProduct(responseProduct);
      setIsLoading(false);
    } catch (error) {}
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="py-3">
          <div className="container">
            <iframe
              src={dataProduct.pdfUrl}
              className="h-[700px] w-[100%]"
            >
              {" "}
            </iframe>
          </div>
        </section>
      )}
    </>
  );
};

export default ReadBookScreen;
