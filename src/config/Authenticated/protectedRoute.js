import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Authenticated/index";

const ProtectedRoute = ({ requiredRole }) => {
  console.log(requiredRole)
  const { role, isAuthenticated } = useAuth();
  // console.log(role)
  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />;
    // return   window.location.href = '/login';
  }

  if (requiredRole && role !== requiredRole) {
    // alert("vui lòng đăng nhập")
    //  window.location.href = '/login'
    // window.location.reload()
    return <h2>Bạn không có quyền truy cập vào trang này.</h2>;
    // alert("vui lòng đăng nhập")
  }

  return <Outlet />;
  // return   window.location.href = '/login';
};

export default ProtectedRoute;
