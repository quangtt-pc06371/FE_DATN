import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Đảm bảo import đúng
import Cookies from "universal-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    console.log("Token từ cookie:", token); // Log để kiểm tra giá trị token

    if (token && typeof token === "string") {
      try {
        const decoded = jwtDecode(token);
        console.log("Payload của token:", decoded); // Log payload
        setRole(decoded.role[0]?.authority || null);
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

  return (
    <AuthContext.Provider value={{ role,  loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
