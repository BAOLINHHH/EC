// import Cookies from 'js-cookie'
// const TOKEN_KEY = 'token';
// export const setToken=(token)=>{
//   Cookies.set(TOKEN_KEY,token);
// }
// export const getToken=()=>{
//     Cookies.get(TOKEN_KEY);
// }
  

const TOKEN_KEY = 'token';
export const setToken=(token)=>{
  localStorage.setItem(TOKEN_KEY, token)
}
export const getToken=()=>{
  return localStorage.getItem(TOKEN_KEY)
}
export const removeToken=()=>{
   localStorage.removeItem(TOKEN_KEY)
}
