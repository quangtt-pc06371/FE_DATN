import axios from "axios";
import Cookies from "js-cookie";
 
import {refreshToken, startTokenRefreshInterval } from "../../components/pages/Refresh";
const BASE_URL = 'http://localhost:8080';

const request = async ({
  method = "",
  path = "",
  data = {},
  headers = {},
}) => {
  try {
    // const cookie = new Cookies();
    
    const token = Cookies.get('token'); 
    // console.log(token);
    const res = await axios({
      method: method,
      baseURL: BASE_URL,
      url: path,
      data: data,
      headers: {
        ...headers,
        Authorization: `${token}`,
      },
    });

    console.log("API request: ", res.data);

    return res.data;
  } catch (error) {
    console.log(error);
   if(error.status == 401){
    // startTokenRefreshInterval();

    refreshToken()
    // return ;
   }
    // alert(error?.response?.data?.message || "Error");
    // return null;
  }
};

export default request;
