import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Đảm bảo import đúng thư viện
import Cookies from "universal-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const cookies = new Cookies();

  // Kiểm tra token hết hạn
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now;
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return false;
    }
  };

  // Đăng xuất
  // const logout = () => {
  //   // cookies.remove("token"); // Xóa token
  //   setRole(null); // Xóa vai trò
  //   setIsAuthenticated(false); // Reset trạng thái
  // };

  useEffect(() => {
    const token = cookies.get("token");
    if (token && isTokenValid(token)) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded.role[0]?.authority)
        setRole(decoded.role[0]?.authority); // Đặt vai trò

        setIsAuthenticated(true); // Xác thực thành công
        // window.location.reload()
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        // logout();
      }
    } 
  }, [AuthContext]); // Theo dõi thay đổi của token

  return (
    <AuthContext.Provider value={{ role, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
