import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom"
import Rating from '@mui/material/Rating';
import {BsCart ,BsSuitHeart,BsEye  } from 'react-icons/bs';
import listProduct from "../api/productsAPI";
import Loader from "../componets/Loader";
import Message from "../componets/Message";
import {useNavigate, useSearchParams } from "react-router-dom";
import Paginate from "../componets/Paginate";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import CurrencyInput from 'react-currency-input-field';
import apiTag from "../api/apiTag";
import { transform, optionCurrency } from "../componets/money";
const ProductGridScreen = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedForm, setSelectedForm] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [selectedRate, setSelectedRate]= useState(null)
  const [searchParams] = useSearchParams()
  const [colorCategory, setColorCategory] = useState(null);
  


 
 
  // const { data: items, isLoading, error } = useGetProductsQuery();

    const [dataProduct, setDataProduct]= useState('');
    const [isLoading,setIsLoading] = useState(true);
    const [dataCategory,setDataCategory] = useState(''); 
    const [dataPublicCompany,setDataPublicCompany] = useState('');
    const [dataForm,setDataForm] = useState('');
    const [dataLanguage, setDataLanguage] = useState('');
    const [minState,setMinState] = useState('');
    const [maxState,setMaxState] = useState('');
    
    
    
    const keywordParam = searchParams.get("keyword")||"";
    const currentPageNumberParam = searchParams.get('pageNumber')||'';
    const [pageNumberParam,setPageNumberParam] = useState(currentPageNumberParam);
    const [categoryParam,setCategoryParam] = useState(searchParams.get("category") || ""); 
    const [publicCompanyParam, setPublicCompanyParam] = useState(searchParams.get("publicCompany") || "");
    const [minPriceParam,setMinPriceParam] = useState(searchParams.get("minPrice")||"");
    const [maxPriceParam,setMaxPriceParam] = useState(searchParams.get("maxPrice")||"");
    const [formParam, setFormParam]= useState(searchParams.get("form")||"");
    const [languageParam,setLanguageParam] = useState(searchParams.get("language")||"");
    const [rateParam, setRateParam] = useState(searchParams.get("language")||"");
    
    useEffect (()=> {
     if(currentPageNumberParam!==pageNumberParam ){
      setPageNumberParam(currentPageNumberParam);
     }
  }, [currentPageNumberParam]);

    useEffect (()=> {
      flechData()
  }, [keywordParam,categoryParam,pageNumberParam,publicCompanyParam,minPriceParam,maxPriceParam,formParam,rateParam]);



  const flechData = async() =>{
      try {
        const responseProducts = await listProduct.getAllProducts(keywordParam,pageNumberParam,categoryParam,publicCompanyParam,minPriceParam,maxPriceParam,formParam,languageParam,rateParam)
        setDataProduct(responseProducts)
        setIsLoading(false)
      } catch (error) {
      }
  }
  useEffect (()=>{
    flechDataTag();
  },[])
  const flechDataTag = async() =>{
    try {
      const responseTagCategorys = await apiTag.getAllCategory();
      const responseTagPublicCompany = await apiTag.getAllPublicCompany();
      const responseTagForm = await apiTag.getAllForm();
      const responseTagLanguage = await apiTag.getAllLanguage();
      setDataCategory(responseTagCategorys);
      setDataPublicCompany(responseTagPublicCompany);
      setDataForm(responseTagForm);
      setDataLanguage(responseTagLanguage);
      
    } catch (error) {
     
    }
  } 


  // const arrCategories =[];
  // for(let i = 0;  i<items.products.length; i++){
  //     arrCategories.push(items.products[i].category)
  // }
  // const fitterArrCategory = [...new Set(arrCategories)]
//   const arrcategories = [
//     'Tiểu Thuyết',
//     'Văn Học',
//     'Thiếu Nhi',
//     'Kinh Tế',
//     'Ngôn Tình',
//     'Tâm Lí',
//     "Manga",
// ]
// const arrPublicCompany = [
//   'NXB Kim Đồng',
//   'NXB Hội Nhà Văn',
//   'IPM',
//   'AZ Việt Nam',
//   'Nhã Nam',
//   'Trẻ',
//   'Dân Trí',
// ]
// const arrForm = [
//   'Bìa Cứng',
//   'Bìa Mềm',
//   'Bộ Hộp',
// ]
// const arrLanguage = [ 
//   'Tiếng Việt',
//   'Tiếng Anh',
//   'Tiếng Trung',
// ]
// const fiveStar = [ <FaStar/>,<FaStar/>,<FaStar/>,<FaStar/>,<FaStar/>];
// const fourStar = [ <FaStar/>,<FaStar/>,<FaStar/>,<FaStar/>,<FaRegStar/>];
// const threeStar = [ <FaStar/>,<FaStar/>,<FaStar/>,<FaRegStar/>,<FaRegStar/>];
// const twotar = [ <FaStar/>,<FaStar/>,<FaRegStar/>,<FaRegStar/>,<FaRegStar/>];
// const oneStar = [ <FaStar/>,<FaRegStar/>,<FaRegStar/>,<FaRegStar/>,<FaRegStar/>];
const arrStarRate = [
{name: '5',star: <Rating value={5} readOnly />}, {name: '4',star: <Rating value={4} readOnly />},{ name: '3', star: <Rating value={3} readOnly />}, {name: '2', star: <Rating value={2} readOnly />}, {name: '1', star: <Rating value={1} readOnly />}
]

//  const validateValueMin = (value) => {
//   setMinPriceParam(value);
//  }
//  const validateValueMax = (value) => {
//   setMaxPriceParam(value);
//  }




const setCategoryValue = (categoryValue) => {
    setColorCategory(categoryValue);
    if(categoryValue==='Tất cả các sách'){
        categoryValue='';
    }
    setCategoryParam(categoryValue);
    searchParams.set("category", categoryValue);
    navigate({ search: searchParams.toString() });
  };


  const handleCheckboxFormChange = (vaule)=>{
  const formcheck = vaule === selectedForm ? '': vaule;
  setSelectedForm(formcheck);
  setFormParam(formcheck)
  searchParams.set("form", formcheck);
  navigate({ search: searchParams.toString() });
}
  const submitPrie=(e) =>{
    e.preventDefault();

    const minPriceParam = minState;
    const maxPriceParam = maxState
    setMinPriceParam(minState);
    setMaxPriceParam(maxState);
    // searchParams.set("", categoryValue);
    // navigate({ search: searchParams.toString() });
    // searchParams.set("category", categoryValue);
    // navigate({ search: searchParams.toString() });


    searchParams.set("minPriceParam", minPriceParam);
    searchParams.set("maxPriceParam", maxPriceParam);
    navigate({ search: searchParams.toString() });
    // console.log("tttt",{ search: searchParams.toString()})
    // console.log("tttt",{search: searchParams.toString()

  
    // searchParams.set("minPrice",minPriceParam);
    // navigate(`/all-product?minPrice=${minPriceParam}&maxPrice=${maxPriceParam}`);
  }
  

  const handleCheckboxChange = (company)=>{
  const publicCompany = company===selectedCompany ? '': company
  setSelectedCompany(publicCompany);
  setPublicCompanyParam(publicCompany)
  searchParams.set("publicCompany", publicCompany);
  navigate({ search: searchParams.toString() });
};

const handleCheckboxLanguageChange= (languageArr) =>{
  const languageFunction = languageArr === selectedLanguage ? '': languageArr
  setSelectedLanguage(languageFunction);
  setLanguageParam(languageFunction)

  searchParams.set('language', languageFunction);
  navigate({ search: searchParams.toString() });
};
const handleCheckboxStarChange = (value) => {
const rateFunction = value === selectedRate ? '': value
setSelectedRate(rateFunction);
setRateParam(rateFunction);
searchParams.set('rate', rateFunction);
navigate({ search: searchParams.toString()});
};

 
  return (
    <>
      <section className="my-8 ">
        <div className="container-sm">
          <div className="row">
            <div className="col-lg-3">
              {isLoading ?( <Loader/>):( <>
                <div>
                <div className="mb-3">
                  <div>
                    <h4 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2">
                      Thể Loại
                    </h4>
                    <h4 className="font-normal text-[#444] capitalize leading-[1] cursor-pointer mb-2"
                      style={{
                        color: colorCategory==='Tất cả các sách' ? '#ff6162' : 'black',
                        }}
                    onClick={() => setCategoryValue('Tất cả các sách')}>
                      Tất cả các loại sách
                    </h4>
                  </div>
                  <ul className="pl-[10px]">   
                    { dataCategory && dataCategory?.map(items => (      
                      <li className="max-w-[100px] flex justify-center "
                        style={{
                        cursor: 'pointer',
                        listStyleType: 'none',
                        color: colorCategory===items._id ? '#fff' : 'black',
                        border: colorCategory===items._id ? '1px solid white': '',
                        borderRadius: colorCategory===items._id ? '30px': '',
                        backgroundColor: colorCategory===items._id ? '#ff6162' : ''
                        }}
                        onClick={() => setCategoryValue(items._id)}
                        >
                        {items.categoryName }
                      </li>
                    ))}
                  </ul>
                  <hr/>
                </div>  
                  <div className="mb-3">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2">
                        Nhà xuất bản
                      </h2>
                    </div>
                      <div>
                        { dataPublicCompany && dataPublicCompany?.map(items =>(

                        <div key={items._id} class="form-check">
                          <input class="form-check-input" type="checkbox" checked={items._id===selectedCompany} onChange={()=>handleCheckboxChange(items._id)} />
                          <label class="form-check-label" for="flexCheckDefault">
                          {items.publicCompanyName}
                          </label>
                        </div>
                        ))} 
                      </div>
                    <hr/>
                  </div>
                  <div className="mb-3" >
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2" >
                        Giá
                      </h2>
                    </div>
                     <form onSubmit={submitPrie}>
                      <div >
                        <div className="row mb-3">
                          <div className="col-6">
                            <p className="mb-0">Nhỏ</p>
                            <div className="form-outline">
                              <input
                              type="number"
                              value={minState}
                              className="form-control"
                              onChange ={(e) =>setMinState(e.target.value)}
                              />
                              {/* <CurrencyInput    
                               allowDecimals={false}
                                defaultValue={minPriceParam}
                                className="form-control"
                             
                                // onValueChange={validateValueMin}
                                onChange ={(e) =>setMinState(e.target.value)}
                                // onChange={(e)=>setMinPriceParam(e.target.value)}
                              /> */}
                            </div>
                          </div>
                          <div className="col-6">
                            <p className="mb-0">Lớn</p>
                            <div className="form-outline">
                            <input
                              type="number"
                              value={maxState}
                              className="form-control"
                              onChange ={(e) =>setMaxState(e.target.value)}
                              />
                              {/* <CurrencyInput
                                
                                defaultValue={maxPriceParam}
                                // onValueChange={validateValueMax}
                                onChange ={(e)=>setMaxState(e.target.value)}
                                className="form-control"
                              /> */}
                            </div>
                          </div>
                          
                        </div >
                        <button
                            type="submit"
                            className="btn btn-outline-warning mb-3"
                          >
                            Chọn
                          </button>
                        </div>
      
                    </form>
                    <hr/>
                  </div>
                 <div className="mb-3">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2">
                        Hình thức
                      </h2>
                    </div>
                    <div>
                      {dataForm && dataForm?.map(items =>(
                      <div class="form-check"key={items._id} >
                        <input class="form-check-input" type="checkbox"  checked={items._id===selectedForm} onChange={()=>handleCheckboxFormChange(items._id)} />
                        <label class="form-check-label" for="flexCheckDefault">
                        {items.form}
                        </label>
                      </div>
                      ))} 
                    </div>
                    <hr/>
                  </div>
                  
                  <div className="mb-3">
                    <h2 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2" >
                      Ngôn Ngữ
                    </h2>   
                      <div>
                            { dataLanguage && dataLanguage?.map(items=>(
                            <div class="form-check" key={items._id}>
                              <input class="form-check-input" type="checkbox"  checked={items._id === selectedLanguage} onChange={()=>handleCheckboxLanguageChange(items._id)} />
                              <label class="form-check-label" for="flexCheckDefault">
                              {items.languageName}
                              </label>
                            </div>
                            ))} 
                      </div>
                      <hr/>
                  </div>
                  <div>
                    <h2 className="text-[20px] font-semibold text-[#444] capitalize leading-[1] mb-2">
                        Đánh giá
                    </h2>
                    <div>
                      <div>
                            {arrStarRate.map(starRate=>(
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" value={rateParam} checked={starRate.name ===selectedRate} onChange={()=>handleCheckboxStarChange(starRate.name)} />
                              <label class="form-check-label rating " for="flexCheckDefault">
                              <span>{starRate.star}</span>
                              </label>
                            </div>
                            ))} 
                      </div>
                    </div>
                  </div>
              </div>
              </>) }
            </div>
            <div className="col-lg-9">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="flex flex-wrap w-full gap-4">
                    {dataProduct && dataProduct?.products?.map((product) => (
                      <div className="w-[31.6%]" key={product._id}>
                      <div className=" card h-[430px]  group ">
                          <div className="flex justify-center relative">
                              <Link to={ `/${product._id}`}>
                              <img className="max-h-[210px] w-[210px]" src={product.bookImage}/>
                              </Link>
                          </div>
                          
                          {/* <div className="flex flex-row justify-center opacity-0 group-hover:!opacity-[1]  transition-all ease-in-out duration-[0.3s] group-hover:-translate-y-1  items-center">
                                  <button className=" mx-2 h-[30px] w-[30px] bg-[#fff] border-[1px] border-solid rounded-[5px] border-[#eee] flex justify-center items-center" > < BsSuitHeart /> </button>
                                  <button className=" mx-2 h-[30px] w-[30px] bg-[#fff] border-[1px] border-solid rounded-[5px] border-[#eee] flex justify-center items-center"><BsEye /> </button>
                                  <button className=" mx-2 h-[30px] w-[30px] bg-[#fff] border-[1px] border-solid rounded-[5px] border-[#eee] flex justify-center items-center"><BsCart /> </button>
                          </div> */}
                          <div className=" card-body border-t-[1px] ">
                          <h6 className="font-normal text-[#999] text-[14px] mb-[10px] leading-[1.2] capitalize">
                                  {product?.category ? (<>
                                  <>
                                  {product.category.categoryName}
                                  </>
                                  </>): ""}
                                  </h6>
                                  <Link to={`product/${product._id}`}>
                                  <h2 className="font-normal text-[17px] h-[70px] pt-2  line-clamp-2 mb-[10px] leading-[28px] text-[#4b5966] capitalize hover:text-[#5caf90]">
                                  {product.bookName}
                                  </h2>
                                  </Link>
                                  <Rating name="half-rating-read mb-[10px]" defaultValue={product.rating} precision={0.5} readOnly />
                              <div> 
                                  <span className="text-[#4b5966] text-[18px] font-bold mr-[7px]">{transform(product.bookPrice, optionCurrency)}</span>                                  
                              </div>             
                          </div>
                      </div>
                    </div>
                    ))}
                  </div>
                </>
              )}
              <div className="d-flex justify-content-center mt-3">
            <Paginate pages={dataProduct.pages}/>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductGridScreen;
