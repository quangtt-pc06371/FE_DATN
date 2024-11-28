import axios from "axios";
import request from "./config";
const API_HOADONCT = 'http://localhost:8080/api/hoadonchitiet';
// export const chitiethoadon = (matk,mahd) => axios.post(API_TAIKHOAN+ '/'+matk +'/' +mahd);
export const chitiethoadon = (id) => axios.get(API_HOADONCT+ '/' +id);
// export const deleteall = () =>axios.delete(API_HOADON);
export const deletehoadonchitiet = (id) =>axios.delete(API_HOADONCT +'/all/'+id);