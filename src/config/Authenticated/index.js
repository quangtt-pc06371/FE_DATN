import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";
 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Vai trò hiện tại
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Trạng thái đăng nhập
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token"); // Lấy token từ cookie
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log(decoded.role[0]?.authority)
        // console.log(decoded)
       
        setRole(decoded.role[0]?.authority); // Lấy vai trò từ token
     setIsAuthenticated(true);
      
      } catch (error) {
        console.error("Token không hợp lệ", error);
        setIsAuthenticated(false);
        cookies.remove("token"); // Xóa token nếu không hợp lệ
      }
    }
  }, []);

//   const logout = () => {
//     cookies.remove("token"); // Xóa token trong cookie
//     setRole(null);
//     setIsAuthenticated(false);
//   };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
