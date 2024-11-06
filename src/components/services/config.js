// import axios from "axios";
// import { Cookies } from "react-cookie";

// const BASE_URL = "http://localhost:8080";

// const request = async ({
//   method = "GET",
//   path = "",
//   data = {},
//   headers = {},
// }) => {
//     console.log(data);
//   try {
//     const cookie = new Cookies();
//     const token = cookie.get("token");

//     const res = await axios({
//       method: method,
//       baseURL: BASE_URL,
//       url: path,
//       data: data,
//       headers: {
//         ...headers,
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("API request: ", res);

//     return res.data;
//   } catch (error) {
//     console.log(error);
//     alert(error?.response?.data?.message || "Error");
//     return null;
//   }
// };

// export default request;
