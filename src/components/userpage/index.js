import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import './css.css';
import { getProfile, loginApi } from "../../config//Auth";

const User = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['user']);
  const navigate = useNavigate();
  useEffect(() => {
    // Hàm để lấy dữ liệu profile từ API
    const fetchProfile = async () => {
      try {
     
        //  const token = cookies?.token;
    

        // Gửi yêu cầu đến API với token
        const res = await getProfile({
        
        })
        // console.log(res)
        // Lưu dữ liệu profile vào state
        
        setProfile(res);
        
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
       <button className="edit-profile-button"onClick={() => navigate('/user/updateuser')}>Chỉnh sửa hồ sơ</button>

       <ul className="profile-menu">
       {/* <a href="/user/profile"><li className="menu-item">Đăng ký shop</li></a> */}
       <li className="menu-item"> <button className="edit-profile-button"onClick={() => navigate('/user/profile')}> thông tin cá nhân</button></li>  
       <li className="menu-item"> <button className="edit-profile-button"onClick={() => navigate('/user/shop-user')}> đơn hàng</button></li>
         <li className="menu-item"> <button className="edit-profile-button"onClick={() => navigate('/user/shop-user')}> địa chỉ</button></li>
         <li className="menu-item"><button className="edit-profile-button"onClick={() => navigate('/user/shop-register')}>đăng kí shop</button> </li>
        <li className="menu-item"> <button className="edit-profile-button"onClick={() => navigate('/user/shop-user')}> shop</button></li>
       <li className="menu-item"> <button className="edit-profile-button"onClick={() => navigate('/user/shop-register')}>Đăng ký shop</button></li>

       </ul>
     </div>

     <div className="profile-content">
     <Outlet />
       {/* <h2>Thông tin cá nhân</h2>
       <div className="profile-info">
         <div className="info-row">
           <label>Tên:</label>
           <span>{profile.hoten}</span>
         </div>
         <div className="info-row">
           <label>Email:</label>
           <span> {profile.email}</span>
         </div>
         <div className="info-row">
           <label>Số điện thoại:</label>
           <span> {profile.sdt}</span>
         </div>
         <div className="info-row">
           <label>Địa chỉ:</label>
           <span> {profile.diachi}</span>
         </div>
         <div className="info-row">
           <label>căn cước công dân:</label>
           <span> {profile.cmnd}</span>
         </div>
       </div> */}
     </div>

   </div>
 
  );
};

export default  User