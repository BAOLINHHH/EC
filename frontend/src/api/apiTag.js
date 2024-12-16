

import AddCategory from "../screens/admin/AddCategory";
import { updateCart } from "../utils/cartUtils";
import axios  from "./axios";

const apiTag =  {
    getAllCategory (){
        const url = 'categories';
        return axios.get(url);
    },
    getAllPublicCompany(){
        const url = 'publiccompanies';
        return axios.get(url);
    },
    getAllForm(){
        const url = 'forms';
        return axios.get(url)
    },
    getAllLanguage(){
        const url = 'languages';
        return axios.get(url);
    },
    addPublicCompany(){
        const url = 'publiccompanies';
        return axios.post(url);
    },
    addForm(){
        const url = 'forms'
        return axios.post(url);
    },
    addLanguage(){
        const url = 'languages'
        return axios.post(url);
    },
    AddCategory(data){
        const url = 'categories';
        return axios.post(url,data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
    updataCategory(id,data){
        const url = `categories/${id}`
        return axios.put(url,data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
    deleteCategory(id){
        const url = `categories/${id}`
        return axios.delete(url);
    },
    updatePublicCompany(id,data){
        const url = `publiccompanies/${id}`
        return axios.put(url,data)
    },
    deletePublicCompany(id){
        const url = `publiccompanies/${id}`;
        return axios.delete(url)
    },
    updateForm(id,data){
        const url = `forms/${id}`
        return axios.put(url,data)
    },
    deleteForm(id){
        const url = `forms/${id}`
        return axios.delete(url)
    },
    updateLanguage(id,data){
        const url = `languages/${id}`
        return axios.put(url,data)
    },
    deleteLanguage(id){
        const url = `languages/${id}`
        return axios.delete(url)
    }
};
export default apiTag

