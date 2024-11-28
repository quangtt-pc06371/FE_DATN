import axios from "axios";
import request from "./config";
const API_SANPHAM = 'http://localhost:8080/api/sanpham';
export const listsanpham = ()=> axios.get(API_SANPHAM);
export const sanphamgbyid = (id) => axios.get(API_SANPHAM+ '/' + id);

