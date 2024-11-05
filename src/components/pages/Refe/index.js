import axios from 'axios';
import { useCookies } from 'react-cookie';
import React,{ useEffect } from 'react';

const YourComponent = () => {
  const [cookies, setCookie] = useCookies(['user']);

  const refreshToken = async () => {
    const refreshToken = cookies.refreshToken;
    if (refreshToken==null) {
        alert("không timg thấy refresh token");
        window.location.href = '/login';
    //   throw new Error('Không tìm thấy refresh token');
    }

    const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
    const newAccessToken = response.data.token;
    console.log(response);

    // Lưu lại accessToken mới vào cookie
    setCookie('token', newAccessToken);

    alert("Token đã được làm mới thành công");
  };
  useEffect(() => {
    // Thiết lập interval để tự động làm mới token mỗi 15 phút
    const interval = setInterval(() => {
      refreshToken();
    }, 1 * 60 * 1000); // 15 phút

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(interval);
  }, []); // Mảng phụ thuộc rỗng để chỉ chạy một lần khi component mount

  return (
    <button onClick={refreshToken}>Làm mới Token</button>
  );
};

export default YourComponent;
