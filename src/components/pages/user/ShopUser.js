import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const ShopUser = () => {
  const [shop, setShop] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedShop, setUpdatedShop] = useState({});
  const [shopImage, setShopImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Tải thông tin cửa hàng
  useEffect(() => {
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
        setUpdatedShop(fetchedShop);
        setIsApproved(fetchedShop.isApproved);
        setImagePreviewUrl(fetchedShop.shopImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
        setLoading(false); 
        if (error.response && error.response.status === 403) {
          Swal.fire("Lỗi", "Bạn chưa có cửa hàng", "error");
        } else {
          Swal.fire("Lỗi", "Không thể lấy thông tin cửa hàng", "error");
        }
      });
  }, [navigate]);

  // Xử lý khi chỉnh sửa thông tin cửa hàng
  const handleEditShopInfo = () => {
    setEditMode(true);
  };

  // Hủy chỉnh sửa và trở về thông tin gốc
  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedShop(shop); // Khôi phục lại dữ liệu gốc
    setImagePreviewUrl(shop.shopImage); // Đặt lại ảnh gốc
    setShopImage(null); // Xóa ảnh đã chọn
  };

  // Lưu thay đổi thông tin cửa hàng
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    // Hiển thị xác nhận trước khi lưu
    const result = await Swal.fire({
      title: "Xác nhận lưu thay đổi",
      text: "Bạn có chắc muốn lưu các thay đổi không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const token = Cookies.get("token");
      const formData = new FormData();
    
      // Thêm JSON dưới dạng chuỗi
      const shopData = {
        shopName: updatedShop.shopName,
        shopDescription: updatedShop.shopDescription,
      };
      formData.append("shop", JSON.stringify(shopData));
    
      // Thêm file ảnh nếu có
      if (shopImage) {
        formData.append("shopImageFile", shopImage);
      }try {
        const response = await axios.put(
          `http://localhost:8080/api/shops/user/${shop.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShop(response.data);
        setEditMode(false);
        Swal.fire("Thành công", "Cập nhật thông tin cửa hàng thành công", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật cửa hàng:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật cửa hàng", "error");
      }
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh cửa hàng
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setShopImage(file);
    setImagePreviewUrl(URL.createObjectURL(file)); // Cập nhật ảnh xem trước
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center my-4 fw-bold text-primary">QUẢN LÝ CỬA HÀNG</h2>
  
      {loading ? (
        <div className="text-center">Đang tải thông tin cửa hàng...</div>
      ) : (
        <>
          {shop ? (
            <>
              {shop.isActive ? (
                <div className="alert alert-success text-center">
                  Cửa hàng của bạn đang <strong>HOẠT ĐỘNG</strong> và hiển thị với khách hàng.
                  <br />
                  Bạn có thể chỉnh sửa thông tin hoặc quản lý hoạt động của cửa hàng tại đây.
                </div>
              ) : (
                <div className="alert alert-danger text-center">
                  Cửa hàng của bạn đang bị <strong>ẨN</strong> và không hiển thị với khách hàng. 
                  <br />
                  Vui lòng liên hệ quản trị viên hoặc chỉnh sửa thông tin để yêu cầu kích hoạt lại.
                </div>
              )}
  
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
                      backgroundImage: `url(${imagePreviewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      margin: "0 auto",
                    }}
                  />
                  {editMode ? (
                    <div>
                      <input
                        type="text"
                        name="shopName"
                        value={updatedShop.shopName || ""}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Tên cửa hàng"
                      />
                      <textarea
                        name="shopDescription"
                        value={updatedShop.shopDescription || ""}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Mô tả cửa hàng"
                      />
                      <div className="mb-2">
                        <label className="form-label">Ảnh cửa hàng</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                      </div>
                      <button onClick={handleSaveChanges} className="btn btn-success">
                        Lưu
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-secondary ms-2">
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <>
                      <h5>{shop?.shopName}</h5>
                      <p>{shop?.shopDescription}</p>
                      <button onClick={handleEditShopInfo} className="btn btn-warning">
                        Chỉnh Sửa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="alert alert-warning text-center">
              Bạn chưa có cửa hàng hoặc cửa hàng của bạn chưa được xét duyệt.
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default ShopUser