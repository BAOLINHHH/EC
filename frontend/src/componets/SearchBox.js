import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate,useSearchParams, useLocation } from 'react-router-dom';
import {BsSearch} from 'react-icons/bs';

const SearchBox = () => {
  const navigate = useNavigate();
  // const queryParams = new URLSearchParams('?keyword=${keyword}');
  // const [keywordParam, setKeywordParam] = useState(queryParams.get("keyword"));
  //  const queryParams = new URLSearchParams('?keyword=${keyword}');
  const [keywordParam, setKeywordParam] = useState('');
  
  const submitHandler = (e) => {
    
    e.preventDefault();
    
  
    navigate(`/all-product?keyword=${keywordParam}`);
   
    // if (!!filterValue) {
    //   console.log('keyword',filterValue)
    //   navigate(`/all-product?keyword=${filterValue}`);
      
    
    //   console.log('keyword2',filterValue)
    //   setFilterValue("")
    // }
  };
  // const { keyword: urlKeyword } = useParams();
  // const [keyword, setKeyword] = useState(urlKeyword || '');

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   if (keyword) {
  //     navigate(`/all-product?keyword=${keyword}`);
  //     setKeyword('');
  //   } else {
  //     navigate('/');
  //   }
  // };
  return (
    <>
    <form onSubmit={submitHandler}>
     <div className="input-group "  style={{width: '600px'}}>
        <input type="text" className="form-control"  onChange={(e) => setKeywordParam(e.target.value)} value={keywordParam} placeholder="Nhập tên sách" aria-label="Nhập tên sách" aria-describedby="basic-addon2"/>
        <button className="btn btn-danger" type="submit" id="button-addon2"> <BsSearch size={15}/> </button>
    </div>
    </form> 
    </>
  )
}

export default SearchBox