import {React ,useEffect}from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Authenticated/index";
import Swal from "sweetalert2";

const ProtectedRoute = ({ requiredRoles }) => {
  const { role, isAuthenticated,loading  } = useAuth();
 
  
console.log(role)
console.log(requiredRoles)
console.log(isAuthenticated)
if (loading) {
  return <p>Đang kiểm tra quyền truy cập...</p>; // Hiển thị trạng thái loading
}

if (!isAuthenticated) {
  Swal.fire({
    title: "Yêu cầu đăng nhập",
    text: "Vui lòng đăng nhập để thực hiện thao tác này!",
    icon: "warning",
    confirmButtonText: "Đăng nhập",
  });
  // return <Navigate to="/buyer/login" replace />;
}

if (requiredRoles && !requiredRoles.some((requiredRole) => role.includes(requiredRole))) {
  return <h2>Bạn không có quyền truy cập vào trang này.</h2>;
}

return <Outlet />;
};

export default ProtectedRoute;
