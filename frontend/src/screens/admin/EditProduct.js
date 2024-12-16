import React, { useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { MdCancel } from "react-icons/md";
import images from "../../assets/indexImg";
import apiTag from "../../api/apiTag";
import { useEffect } from "react";
import { RiMoneyEuroCircleFill } from "react-icons/ri";
import Checkbox from "@mui/material/Checkbox";
import { toast } from "react-toastify";
import listProduct from "../../api/productsAPI";
export default function EditProduct(props) {
  const inputFileRef = useRef();
  const [image, setImage] = useState("");
  const [audio, setAudio] = useState("");
  const [pdf, setPdf] = useState("");
  const [audioPre, setAudioPre] = useState("");
  const [pdfPre, setPdfPre] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [category, setCategory] = useState("");
  const [publicCompany, setPublicCompany] = useState("");
  const [selectPublicCompany, setSelectPublicCompany] = useState("");
  const [form, setForm] = useState("");
  const [selectForm, setSelectForm] = useState("");
  const [language, setLanguage] = useState("");
  const [selectLanguage, setSelectLanguage] = useState("");
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookDetail, setBookDetail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [checked, setChecked] = useState("");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    flechData();
  }, []);

  useEffect(() => {
    // console.log("props.dataEdit.productId", props.dataProduct._id);
    if (props.dataProduct.category) {
      setSelectCategory(props.dataProduct.category._id);
    }
    if (props.dataProduct.form) {
      setSelectForm(props.dataProduct.form._id);
    }
    if (props.dataProduct.language) {
      setSelectLanguage(props.dataProduct.language._id);
    }
    if (props.dataProduct.publicCompany) {
      setSelectPublicCompany(props.dataProduct.publicCompany._id);
    }
    setProductId(props.dataProduct._id);
    setImage(props.dataProduct.bookImage);
    setAudio(props.dataProduct.audioUrl);
    setPdf(props.dataProduct.pdfUrl);
    setAudioPre(props.dataProduct.audioUrlPresent);
    setPdfPre(props.dataProduct.pdfUrlPresent);
    setBookName(props.dataProduct.bookName);
    setBookPrice(props.dataProduct.bookPrice);
    setQuantity(props.dataProduct.quantity);
    setAuthor(props.dataProduct.author);
    setPageNumber(props.dataProduct.pageNumber);
    setBookDetail(props.dataProduct.bookDetail);
    setChecked(props.dataProduct.ebook);
  }, [props]);

  const flechData = async () => {
    try {
      const responseCategory = await apiTag.getAllCategory();
      const responsePublicCompany = await apiTag.getAllPublicCompany();
      const responseForm = await apiTag.getAllForm();
      const responseLanguage = await apiTag.getAllLanguage();
      setCategory(responseCategory);
      setPublicCompany(responsePublicCompany);
      setForm(responseForm);
      setLanguage(responseLanguage);
    } catch (error) {}
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const response = await listProduct.uploadImg(formData);
    if (response) {
      setImage(response.image);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  const handleFileAudioUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    const response = await listProduct.uploadImg(formData);
    if (response) {
      setAudio(response.image);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
      }
    };
    reader.readAsDataURL(file);
  };
  const handleFileAudioPreUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    const response = await listProduct.uploadImg(formData);
    if (response) {
      setAudioPre(response.image);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
      }
    };
    reader.readAsDataURL(file);
  };
  const handleFilePdfPreUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    const response = await listProduct.uploadImg(formData);
    if (response) {
      setPdfPre(response.image);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
      }
    };
    reader.readAsDataURL(file);
  };
  const handleFilePdfUpload = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    const response = await listProduct.uploadImg(formData);
    if (response) {
      setPdf(response.image);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // if (!image || !audioPre || !pdfPre ) {
    //   alert("Vui lòng chọn File!");
    //   return;
    // };

    try {
      const payload = {
        bookImage: image,
        audioUrl: audio,
        pdfUrl: pdf,
        audioUrlPresent: audioPre,
        pdfUrlPresent: pdfPre,
        bookName,
        category: selectCategory,
        author,
        publicCompany: selectPublicCompany,
        language: selectLanguage,
        form: selectForm,
        pageNumber,
        bookPrice,
        quantity,
        bookDetail,
        ebook: checked,
      };

      await listProduct.updateProduct(productId, payload);
      toast.success("Cập nhật thành công");
      props.isRefresh();
      props.handleClose();
      setImagePreview("");
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectCategory(categoryId);
  };
  const handlePublicCompanyChange = (e) => {
    const publicCompanyId = e.target.value;
    setSelectPublicCompany(publicCompanyId);
  };
  const handleFormChange = (e) => {
    const formId = e.target.value;
    setSelectForm(formId);
  };
  const handleLanguageChange = (e) => {
    const languageId = e.target.value;
    setSelectLanguage(languageId);
  };
  const handleCheck = () => {
    setChecked(!checked);
  };
  const handlingCloseDialog = () => {
    props.handleClose();
    setImagePreview("");
  };

  return (
    <>
      <Dialog
        open={props.isOpen}
        onClose={handlingCloseDialog}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle className=" flex bg-[#2d3748] justify-center items-center relative">
          <span className="text-[20px] text-[#fff]">
            Chỉnh sửa sản phẩm sản phẩm
          </span>
          <div
            className="flex  absolute right-[5px] text-[#fff] cursor-pointer"
            onClick={handlingCloseDialog}
          >
            <MdCancel size={30} />
          </div>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="mb-3 flex">
              <span className="w-[250px]">Hình ảnh: </span>
              <div className="mt-2">
                <input
                  ref={inputFileRef}
                  onChange={handleFileUpload}
                  type="file"
                  accept="image/*"
                  id="uploadFile"
                  name="uploadFile"
                  style={{ display: "none" }}
                />
                {!imagePreview ? (
                  <img
                    src={image}
                    className="h-[150px] w-[150px] mb-2"
                    alt=""
                  />
                ) : (
                  <img
                    src={imagePreview}
                    className="h-[150px] w-[150px] mb-2"
                    alt=""
                  />
                )}
                <label
                  className="border-[1px] border-solid rounded-[5px] p-1 bg-[#ce3a1d] text-[#fff] cursor-pointer"
                  htmlFor="uploadFile"
                >
                  Chọn hình ảnh
                </label>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <span className="w-[250px]">Ebook</span>
              {/* <Checkbox
            checked={checked}
            onChange={(e)=> setChecked(e.target.checked) }
            inputProps={{ 'aria-label': 'controlled' }}
          />   */}

              <div>
                <input
                  class="form-check-input"
                  type="checkbox"
                  checked={checked}
                  id="flexCheckChecked"
                  onChange={handleCheck}
                />
              </div>
            </div>
            {checked ? (
              <>
                <div className="flex items-center mb-3">
                  <span className="w-[250px]">File Mp3 </span>
                  <input
                    type="file"
                    className=" w-[500px]   outline-none "
                    accept=".mp3"
                    onChange={handleFileAudioUpload}
                    placeholder="File audio book"
                  />
                </div>
                <div className="flex items-center mb-3">
                  <span className="w-[250px]">File PDF </span>
                  <input
                    type="file"
                    className=" w-[500px]  outline-none "
                    accept="application/pdf"
                    onChange={handleFilePdfUpload}
                    placeholder="File PDF book"
                  />
                </div>
              </>
            ) : (
              ""
            )}

            <div className="flex items-center mb-3">
              <span className="w-[250px]">File Mp3 xem trước </span>
              <input
                type="file"
                className=" w-[500px]   outline-none "
                accept=".mp3"
                onChange={handleFileAudioPreUpload}
                placeholder="File audio book"
              />
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">File PDF xem trước </span>
              <input
                type="file"
                className=" w-[500px]  outline-none "
                accept="application/pdf"
                onChange={handleFilePdfPreUpload}
                placeholder="File PDF book"
              />
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Tên sản phẩm: </span>
              <input
                value={bookName}
                type="text"
                className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setBookName(e.target.value)}
                placeholder="Tên sản phẩm"
              />
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Thể loại </span>
              {/* <input type="text" className=" w-[500px] outline-none h-[30px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"    placeholder="Tên sản phẩm" /> */}
              <select
                value={selectCategory}
                onChange={handleCategoryChange}
                className="outline-none h-[45px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-[500px] p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              >
                <option value="">-- Chọn Thể loại --</option>
                {category &&
                  category?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      selected="selected"
                      // disabled={!handleProvinceChange}
                    >
                      {item.categoryName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Nhà xuất bản </span>
              {/* <input type="text" className=" w-[500px] outline-none h-[30px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"    placeholder="Tên sản phẩm" /> */}
              <select
                value={selectPublicCompany}
                onChange={handlePublicCompanyChange}
                className="outline-none h-[45px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-[500px] p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              >
                <option value="">-- Chọn Nhà xuất bản --</option>
                {publicCompany &&
                  publicCompany?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      selected="selected"
                      // disabled={!handleProvinceChange}
                    >
                      {item.publicCompanyName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Hình thức sách</span>
              {/* <input type="text" className=" w-[500px] outline-none h-[30px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"    placeholder="Tên sản phẩm" /> */}
              <select
                value={selectForm}
                onChange={handleFormChange}
                className="outline-none h-[45px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-[500px] p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              >
                <option value="">-- Chọn Hình thức sách --</option>
                {form &&
                  form?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      selected="selected"
                      // disabled={!handleProvinceChange}
                    >
                      {item.form}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Ngôn ngữ</span>
              {/* <input type="text" className=" w-[500px] outline-none h-[30px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"    placeholder="Tên sản phẩm" /> */}
              <select
                value={selectLanguage}
                onChange={handleLanguageChange}
                className="outline-none h-[45px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px] w-[500px] p-[9px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
              >
                <option value="">-- Chọn Hình ngôn ngữ --</option>
                {language &&
                  language?.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      selected="selected"
                      // disabled={!handleProvinceChange}
                    >
                      {item.languageName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center mb-3 gap-x-20">
              <span className="w-[250px]">Giá sản phẩm: </span>
              <div className="input-group flex-fill mb-0">
                <input
                  value={bookPrice}
                  type="text"
                  className=" w-[500px] outline-none h-[50px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                  onChange={(e) => setBookPrice(e.target.value)}
                  placeholder="Giá sản phẩm"
                />
                {/* <span className=' input-group-text' id= 'icon-envelope'><RiMoneyEuroCircleFill/> </span> */}
              </div>
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Tên tác giả: </span>
              <input
                value={author}
                type="text"
                className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên tác giả"
              />
            </div>
            {!checked ? (
              <div className="flex items-center mb-3">
                <span className="w-[250px]">Số lượng: </span>
                <input
                  value={quantity}
                  type="number"
                  className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Số lượng"
                />
              </div>
            ) : (
              ""
            )}
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Số trang: </span>
              <input
                value={pageNumber}
                type="number"
                className=" w-[500px] outline-none h-[40px] border-[1px] border-[#32e9e9] border-solid text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="Số trang"
              />
            </div>
            <div className="flex items-center mb-3">
              <span className="w-[250px]">Sơ lược nội dung: </span>
              <textarea
                value={bookDetail}
                rows="7"
                cols="58"
                className="outline-none  border-[1px] border-[#32e9e9] text-[#0f0303]  text-[17px]  p-[10px] rounded-[5px]  focus:ring-[#9b3bea] focus:border-[#3e3bd5]"
                onChange={(e) => setBookDetail(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className=" border-solid w-[50px] rounded-[7px] bg-[#2d3748] text-[#fff]"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
