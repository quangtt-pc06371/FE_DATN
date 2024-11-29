import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Đảm bảo import đúng
import Cookies from "universal-cookie";
// import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  useEffect(() => {
    
  const token = cookies.get("token");
  const decoded = jwtDecode(token);
      try {      
        setRole(decoded.role[0]?.authority || null);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token không hợp lệ:", error);
        setRole(null);
        setIsAuthenticated(false);
      }
      setLoading(false); 
  }, []); // Chỉ chạy khi component load

  return (
    <AuthContext.Provider value={{ role, isAuthenticated,loading  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
