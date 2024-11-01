import axios from 'axios';
import Cookies from 'js-cookie';

export const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('Không tìm thấy refresh token');
  }

  const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
  const newAccessToken = response.data.token;
console.log(response)
  // Lưu lại accessToken mới vào cookie
  Cookies.set('token', newAccessToken, 
    // { expires: 1 }
  ); // Hết hạn sau 1 ngày

 alert("Token đã được làm mới thành công");
};
