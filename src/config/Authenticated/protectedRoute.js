import {React ,useEffect}from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Authenticated/index";

const ProtectedRoute = ({ requiredRole }) => {
  // window.location.reload()

  const { role, isAuthenticated } = useAuth();
  console.log(requiredRole)
  console.log(role)
  console.log(isAuthenticated)
  // console.log(role)
  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />;
    // return   window.location.href = '/buyer/login';
    return <h2>Bạn chưa dăng nhập.</h2>;
  }

  if (requiredRole && role !== requiredRole) {
    // alert("vui lòng đăng nhập")
    //  window.location.href = '/login'
    return <h2>Bạn không có quyền truy cập vào trang này.</h2>;
    // alert("vui lòng đăng nhập")
  }

  return <Outlet />;
  // return   window.location.href = '/login';
};

export default ProtectedRoute;
