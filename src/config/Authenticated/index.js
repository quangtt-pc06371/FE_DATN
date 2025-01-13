import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Đảm bảo import đúng
import Cookies from "universal-cookie";
import { getProfile } from "../../config/Auth";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const [error, setError] = useState('');
  useEffect(() => {
    const token = cookies.get("token");
    console.log("Token từ cookie:", token); // Log để kiểm tra giá trị token

    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode(token);
        console.log("Payload của token:", decoded); // Log payload
        // setRole(decoded.role[0]?.authority || null);
      
const roles = decoded.role?.map((r) => r.authority) || []; // Lấy tất cả các quyền
console.log("Quyền người dùng:", roles);
setRole(roles);
          // console.log("quyenf nguoi dung:",   decoded.role[0]?.authority);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        setRole(null);
        setIsAuthenticated(false);
      }
    } else {
      console.warn("Token không tồn tại hoặc không phải chuỗi");
      // setRole(null);
      setIsAuthenticated(false);
    }

    setLoading(false); // Hoàn tất xác thực
  }, []);
  useEffect(() => {
    // Chỉ gọi API lấy profile nếu người dùng đã đăng nhập
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const res = await getProfile(); // Gọi API lấy thông tin
          const roles = res.quyen?.map((r) => r.name) || []; // Lấy tất cả quyền
          console.log("Quyền người dùng:", roles);
          setRole(roles); // Lưu vai trò
        } catch (err) {
          console.error("Lỗi khi lấy profile:", err);
          setError(err.response?.data?.error || "Không thể lấy dữ liệu profile.");
        } finally {
          setLoading(false); // Dừng trạng thái loading
        }
      } else {
        setLoading(false); // Dừng loading nếu không đăng nhập
      }
    };

    fetchProfile();
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={{ role,isAuthenticated,  loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
