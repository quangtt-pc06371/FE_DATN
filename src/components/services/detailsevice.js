import axios from "axios";
const API_HOADON = 'http://localhost:8080/api/hoadon';
export const createhoadon = (hoadon) =>axios.post(API_HOADON,hoadon); 

export const listhoadonbyid = (id) =>axios.get(API_HOADON +'/'+id);
 
export const listallhoadonbyid = (id) =>axios.get(API_HOADON +'/allitem/'+id); 
export const listhoadonadmin =() =>axios.get(API_HOADON); 
export const updatehoadon = (id,hoadon) =>axios.put(API_HOADON +'/'+id,hoadon); 
// export const updatetaikhoan = (id,taikhoan) => axios.put(API_TAIKHOAN+ '/'+id , taikhoan);
export const deletehoadon = (id) =>axios.delete(API_HOADON +'/'+id);