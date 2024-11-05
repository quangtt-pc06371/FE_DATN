import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

// Hàm kiểm tra xem token có hết hạn không
const checkTokenExpiry = () => {
  const token = Cookies.get('token');
  if (token==null) {
    console.error("Không tìm thấy token trong cookie.");
    return true; // Nếu không có token, cần làm mới
  }

  try {
    const decoded = jwtDecode(token); // Sử dụng jwtDecode thay vì jwt_decode
    const now = Date.now() / 1000; // Lấy thời gian hiện tại tính bằng giây

    return decoded.exp ? now >= decoded.exp : true; // Kiểm tra nếu token đã hết hạn
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return true; // Nếu lỗi khi giải mã, cần làm mới token
  }
};

// Hàm làm mới token
const refreshToken = async () => {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    console.error('Không tìm thấy refresh token');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
    const newAccessToken = response.data.token;

    // Cập nhật access token mới vào cookie, với thời gian hết hạn là 1 ngày
    Cookies.set('token', newAccessToken, { expires: 1 });
    console.log("Token đã được làm mới thành công");
  } catch (error) {
    console.error("Làm mới token thất bại:", error);
    // Điều hướng người dùng đến trang đăng nhập nếu token không thể làm mới
    window.location.href = '/login';
  }
};

// Thiết lập interval để tự động kiểm tra và làm mới token
const startTokenRefreshInterval = () => {
  setInterval(() => {
    if (checkTokenExpiry()) {
      refreshToken().catch(error => console.error('Lỗi làm mới token:', error));
    }
  }, 2 * 60 * 1000); // 2 phút
};

export { checkTokenExpiry, refreshToken, startTokenRefreshInterval };
