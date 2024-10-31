import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const ShopRegistration = () => {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [cookies] = useCookies(['token']); // Lấy token từ cookie
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setShopImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("shopName", shopName); // Giả sử bạn đã khai báo `shopName`
    formData.append("shopDescription", shopDescription); // Giả sử bạn đã khai báo `shopDescription`

    if (shopImage) {
        formData.append("shopImage", shopImage); // Giả sử bạn đã khai báo `shopImage`
    }

    const token = cookies.token; // Lấy token từ cookie
    if (!token) {
        console.error("Token is missing");
        alert("Vui lòng đăng nhập để tiếp tục.");
        return; // Dừng việc gửi yêu cầu nếu không có token
    }

    try {
        const response = await axios.post("http://localhost:8080/api/shops/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}` // Thêm Authorization header với token
            }
        });
        console.log("Shop created successfully:", response.data);
        // Reset form sau khi thành công
        setShopName("");
        setShopDescription("");
        setShopImage(null);
        navigate("/"); // Chuyển hướng người dùng về trang khác sau khi đăng ký thành công
    } catch (error) {
        console.error("Error creating shop:", error.response?.data || error.message);
        alert("Lỗi khi tạo shop: " + (error.response?.data?.error || "Vui lòng kiểm tra lại thông tin."));
    }
};

  return (
    <div className="container mt-5">
      <h2 className="text-center">Đăng Ký Shop</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Tên Shop:</label>
          <input
            type="text"
            className="form-control"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô Tả Shop:</label>
          <textarea
            className="form-control"
            rows="3"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh Shop:</label>
          <input type="file" className="form-control" onChange={handleImageChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Đăng Ký Shop</button>
      </form>
    </div>
  );
};

export default ShopRegistration;
