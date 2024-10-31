import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import './css.css';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['user']);
  
  useEffect(() => {
    // Hàm để lấy dữ liệu profile từ API
    const fetchProfile = async () => {
      try {
       
         const token = cookies?.token;
      console.log(cookies?.token)
        if (!token) {
          setError('Token không tồn tại, vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        // Gửi yêu cầu đến API với token
        const response = await axios.get('http://localhost:8080/api/taikhoan/profile', {
          headers: {
            Authorization: ` ${token}`,
          },
        
        });
        console.log(response.data)
        // Lưu dữ liệu profile vào state
        
        setProfile(response.data);
        
      } catch (err) {
        // Xử lý lỗi
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Không thể lấy dữ liệu profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Chỉ chạy một lần khi component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!profile) {
    return <div>Không có dữ liệu profile.</div>;
  }

  return (

  //   <div className="profile-container">
  //     <div className='row'>
  //     <h2>Thông Tin Cá Nhân</h2>
  //     <p><strong>ID:</strong> {profile.id}</p>
  //     <p><strong>Họ tên:</strong> {profile.hoten}</p>
  //     <p><strong>Email:</strong> {profile.email}</p>
  //     {/* <p><strong>quyền :</strong> {profile.quyen?.[0].name}</p> */}
  //     <div className="text-center zoom-wrapper">
  //   <img src={profile.anh} alt="Profile" width="300px" height="300px" />
  // </div>
  //     <div>
  //     <p><strong>Token:</strong> {profile.token}</p>
  //     </div>
  //     </div>
  //   </div>
     <div className="profile-container">
     <div className="profile-sidebar">
       <img
         src={profile.anh}
         alt="User Avatar"
         className="profile-avatar"
       />
       <h3 className="profile-name"> {profile.hoten}</h3>
       <button className="edit-profile-button">Chỉnh sửa hồ sơ</button>

       <ul className="profile-menu">
         <li className="menu-item active">Hồ sơ của tôi</li>
         <li className="menu-item">Đơn hàng</li>
         <li className="menu-item">Địa chỉ</li>
         <li className="menu-item">Mã giảm giá</li>
       </ul>
     </div>

     <div className="profile-content">
       <h2>Thông tin cá nhân</h2>
       <div className="profile-info">
         <div className="info-row">
           <label>Tên:</label>
           <span>Tên Người Dùng</span>
         </div>
         <div className="info-row">
           <label>Email:</label>
           <span>email@example.com</span>
         </div>
         <div className="info-row">
           <label>Số điện thoại:</label>
           <span>0123456789</span>
         </div>
         <div className="info-row">
           <label>Địa chỉ:</label>
           <span>123 Đường ABC, Phường XYZ</span>
         </div>
       </div>
     </div>
   </div>
 
  );
};

export default Profile;
