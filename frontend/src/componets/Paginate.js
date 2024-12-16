// import { Pagination } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
import React from "react";
import { useNavigate,useLocation} from 'react-router-dom';
// import Pagination from '@mui/material/Pagination';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
const Paginate = ({pages, isAdmin = false, keyword = '',pageNumberParamTest=' ' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  // const currentPageNumberParam = queryParams.get('pageNumber')||'';
  // const [pageNumberParam,setPageNumberParam] = useState(currentPageNumberParam)

  // const queryParams = new URLSearchParams('?pageNumber=${pageNumber}');
  //  const currentPage = Number(queryParams.get("pageNumber")) || 1;
  // const [setPage] =useState(1);
  const handleChange= (event, value) =>{
    const currentPage = value
    if(!isAdmin){
      queryParams.set("pageNumber", currentPage);
      navigate({ search: queryParams.toString() });
    }else{
      navigate(`/admin/productlist?pageNumber=${currentPage}`)
    }
    
  }
  return (
  <Stack spacing={2}>
      {/* <Pagination count={pages} page={page} 
     onChange={handleChange} 
    /> */}
    <Pagination

    count={pages} 
    onChange={handleChange}
    />
  </Stack>
  );
  
};

export default Paginate;
