import React, { useState } from 'react';
import './updateuse.css'; // Thêm import CSS

const UpdateUserForm = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi dữ liệu đến server
        console.log('Cập nhật thông tin:', formData);
    };

    return (
        <form className="update-user-form" onSubmit={handleSubmit}>
            <h2>Cập Nhật Thông Tin Tài Khoản</h2>

            <label htmlFor="fullname">Họ và Tên:</label>
            <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
            />

            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập địa chỉ email"
            />

            <label htmlFor="phone">Số Điện Thoại:</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại"
            />

            <label htmlFor="address">Địa Chỉ:</label>
            <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Nhập địa chỉ giao hàng"
            />

            <label htmlFor="password">Mật Khẩu Mới:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)"
            />

            <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu:</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
            />

            <button type="submit">Cập Nhật Thông Tin</button>
        </form>
    );
};

export default UpdateUserForm;
