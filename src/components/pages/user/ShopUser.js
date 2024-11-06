import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

const ShopUser = () => {
  const [shop, setShop] = useState(null);
  const [isApproved, setIsApproved] = useState(false); // Trạng thái phê duyệt
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ cookie
    const token = Cookies.get("token");

    if (!token) {
      Swal.fire("Thông báo", "Bạn cần đăng nhập để truy cập trang này", "warning");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/shops/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedShop = response.data;
        setShop(fetchedShop);
        setIsApproved(fetchedShop.isApproved); // Cập nhật trạng thái phê duyệt từ phản hồi
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
        if (error.response && error.response.status === 403) {
          Swal.fire("Lỗi", "Bạn chưa có cửa hàng", "error");
        }
      });
  }, [navigate]);

  const imageUrl = shop?.shopImage
    ? `http://localhost:8080/api/shops/images/${shop.shopImage}`
    : "link_to_default_image"; // Đường dẫn ảnh mặc định nếu không có ảnh

  const handleEditShopInfo = () => {
    // Thêm logic chỉnh sửa thông tin cửa hàng ở đây
  };

  const handleAddProduct = () => {
    // Thêm logic thêm sản phẩm ở đây
  };

  const handleEditProduct = (productId) => {
    // Thêm logic chỉnh sửa sản phẩm ở đây
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center my-4 fw-bold text-primary">Quản Lý Cửa Hàng</h2>
      {isApproved ? (
        <>
          <div className="card mb-4">
            <div className="card-header text-center">Thông Tin Cửa Hàng</div>
            <div className="card-body text-center">
              <div
                className="image-preview mb-3"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "0 auto",
                }}
              />
              <h5>{shop?.shopName}</h5>
              <p>{shop?.shopDescription}</p>
              <button onClick={handleEditShopInfo} className="btn btn-warning">
                Chỉnh Sửa
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Sản Phẩm Trong Cửa Hàng</span>
              <button onClick={handleAddProduct} className="btn btn-success btn-sm">
                Thêm Sản Phẩm
              </button>
            </div>
            {/* Hiển thị danh sách sản phẩm ở đây */}
          </div>
        </>
      ) : (
        <div className="alert alert-warning text-center">
          Cửa hàng của bạn chưa được duyệt. Vui lòng chờ xét duyệt từ quản trị viên.
        </div>
      )}
    </div>
  );
};

export default ShopUser;
