import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const ShopRegistration = () => {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({}); // Trạng thái lưu lỗi
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setShopImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường và thiết lập thông báo lỗi
    const newErrors = {};
    if (!shopName) newErrors.shopName = "Vui lòng nhập tên cửa hàng.";
    if (!shopDescription) newErrors.shopDescription = "Vui lòng nhập mô tả cho cửa hàng.";
    if (!shopImage) newErrors.shopImage = "Vui lòng chọn ảnh cho cửa hàng.";
    setErrors(newErrors);

    // Nếu có lỗi, dừng quá trình gửi form
    if (Object.keys(newErrors).length > 0) return;

    const formData = new FormData();
    formData.append("shopName", shopName);
    formData.append("shopDescription", shopDescription);
    if (shopImage) {
      formData.append("shopImage", shopImage);
    }

    const token = cookies.token;
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Chưa đăng nhập',
        text: 'Vui lòng đăng nhập để tiếp tục.',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/shops/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công',
        text: 'Cửa hàng đã được đăng ký, vui lòng chờ xét duyệt!',
      });

      setShopName("");
      setShopDescription("");
      setShopImage(null);
      setPreviewUrl("");
      setErrors({});
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.error || "Vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-8 mx-auto">
        <h2 className="text-center my-4 fw-bold text-primary animated-title">ĐĂNG KÝ CỬA HÀNG</h2>
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="mb-3 text-center">
            <div
              className="image-preview"
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                margin: "0 auto",
              }}
            >
              {!previewUrl && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: "14px",
                  }}
                >
                  Chọn ảnh
                </div>
              )}
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {errors.shopImage && <div className="text-danger mt-2">{errors.shopImage}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng:</label>
            <input
              type="text"
              placeholder="Nhập tên cửa hàng của bạn"
              className="form-control"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
            {errors.shopName && <div className="text-danger mt-1">{errors.shopName}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Mô Tả cửa hàng:</label>
            <textarea
              placeholder="Nhập mô tả cho cửa hàng"
              className="form-control"
              rows="3"
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
            />
            {errors.shopDescription && <div className="text-danger mt-1">{errors.shopDescription}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Đăng Ký Shop</button>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistration;
