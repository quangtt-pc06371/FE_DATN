import axios from "axios";
import request from "./config";
const API_TAIKHOAN = 'http://localhost:8080/api/taikhoan';
const create_TAIKHOAN = 'http://localhost:8080/api/taikhoan/user';
export const listtaikhoan = ()=> axios.get(API_TAIKHOAN+'/user');
export const createtaikhoan = (taikhoan) =>axios.post(create_TAIKHOAN,taikhoan);
export const gettaikhoan = ()=> axios.get(API_TAIKHOAN + '/userid');
export const updatetaikhoan = (id,taikhoan) => axios.put(API_TAIKHOAN+ '/update' , taikhoan);
// export const logintaikhoan = (maTK,matkhau) => axios.post(API_TAIKHOAN+'/login'+ {maTK,matkhau});
const loginApi = async ({ maTK, matKhau }) => {
    const res = await request({
      method: "POST",
      path: "/api/taikhoan/login",
      data: {
        email: maTK,
        matKhau: matKhau
       
      },
    });
  
    return res;
  };
  export { loginApi };