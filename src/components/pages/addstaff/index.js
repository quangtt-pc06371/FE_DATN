import React, { useState } from "react";
import axios from "axios";
import './staff.css';

const GetTaiKhoan = () => {
  const [email, setEmail] = useState("");
  const [taikhoan, setTaiKhoan] = useState(null);
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const handleSearch = async () => {
    setError("");
    setTaiKhoan(null);

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/taikhoan/${email}`);
      setTaiKhoan(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Không tìm thấy tài khoản.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const addNhanVien = async (id) => {
    console.log(id)
    setError2("");

    try {
      const response = await axios.post(`http://localhost:8080/api/taikhoan/nhanvien/${id}`);
      alert("Thêm nhân viên thành công!");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError2("Thêm thất bại.");
      } else {
        setError2("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <main className="main-container">
      <div className="form-container">
        <h2 className="form-title">Tìm tài khoản bằng email</h2>
        <div className="form-input-group">
          <input
            type="email"
            className="form-input"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="form-button" onClick={handleSearch}>
            Tìm
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {taikhoan && (
          <div className="result-container row">
            <div className="col-6">
              <h3 className="result-title">Thông tin tài khoản:</h3>
              <p><strong>ID:</strong> {taikhoan.id}</p>
              <p><strong>Họ tên:</strong> {taikhoan.hoTen}</p>
              <p><strong>Email:</strong> {taikhoan.email}</p>
              <p><strong>Số điện thoại:</strong> {taikhoan.sdt}</p>
              <p><strong>CCCD:</strong> {taikhoan.cmnd}</p>
            </div>
            <div className="col-6">
              <strong>Ảnh:</strong>
              <img
                src={taikhoan.anh}
                alt="User Avatar"
                className="result-avatar"
              />
                 {error && <p className="error-message">{error2}</p>}
              <button
                type="button"
                className="btn btn-primary mb-1 offset-5 mt-4"
                onClick={() => addNhanVien(taikhoan.id)} // Dùng hàm anonymous để gọi addNhanVien khi nhấn nút
              >
                Thêm nhân viên
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default GetTaiKhoan;
