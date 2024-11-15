import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useCookies } from "react-cookie";
import axios from "axios";
import './register.css';

const Addtaikhoan = () => {
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [sdt, setSdt] = useState('');
  const [diachi, setDiachi] = useState('');
  const [cmnd, setCmnd] = useState('');
  const [file, setFile] = useState(null);
  const [cookies] = useCookies(['user']);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Khởi tạo đối tượng lỗi
    const newErrors = {};

    // Kiểm tra từng trường
    if (!hoTen) newErrors.hoTen = "Họ tên là bắt buộc";
    if (!email) newErrors.email = "Email là bắt buộc";
    if (!matKhau) newErrors.matKhau = "Mật khẩu là bắt buộc";
    if (!sdt) newErrors.sdt = "Số điện thoại là bắt buộc";
    // if (!diachi) newErrors.diachi = "Địa chỉ là bắt buộc";
    // if (!cmnd) newErrors.cmnd = "CMND là bắt buộc";
    // if (!file) newErrors.file = "Vui lòng chọn ảnh đại diện";

    // Nếu có lỗi, cập nhật state và không gửi form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const taiKhoan = {   
      hoTen,
      email,
      matKhau,
      sdt,
      diachi,
      cmnd,
      vaitro: { id: 1 }
    };

    try {
      const token = cookies?.token;
      if (!token) {
        setError('Token không tồn tại, vui lòng đăng nhập lại.');
        return;
      }   

      const taiKhoanResponse = await axios.post(
        `http://localhost:8080/api/taikhoan/user`, 
        taiKhoan, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (taiKhoanResponse.status === 201) {
        const maTK = taiKhoanResponse.data.id;
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await axios.post(
          `http://localhost:8080/api/taikhoan/upload/${maTK}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        if (uploadResponse.status === 200) {
          alert("Tài khoản và ảnh đã được tạo thành công!");
        }
      }
    } catch (error) {
      alert("Không thành công");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tạo Tài Khoản</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Họ tên</label>
          <input type="text" className="form-control" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
          {errors.hoTen && <p className="text-danger">{errors.hoTen}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" className="form-control" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} required />
          {errors.matKhau && <p className="text-danger">{errors.matKhau}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input type="text" className="form-control" value={sdt} onChange={(e) => setSdt(e.target.value)} required />
          {errors.sdt && <p className="text-danger">{errors.sdt}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input type="text" className="form-control" value={diachi} onChange={(e) => setDiachi(e.target.value)} required />
          {errors.diachi && <p className="text-danger">{errors.diachi}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">CMND</label>
          <input type="text" className="form-control" value={cmnd} onChange={(e) => setCmnd(e.target.value)} required />
          {errors.cmnd && <p className="text-danger">{errors.cmnd}</p>}
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh đại diện</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
          {errors.file && <p className="text-danger">{errors.file}</p>}
        </div>
        <button type="submit" className="btn btn-primary w-100">Tạo tài khoản</button>
      </form>
    </div>
  );
};

export default Addtaikhoan;
