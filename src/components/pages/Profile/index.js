import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import './css.css';
import { getProfile } from "../../../config/Auth";
import AddressForm from "../../compoments/Addressuser";

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res); // Lưu dữ liệu profile vào state
        console.log("profile" ,res)
        const roles = res.quyen?.map((r) => r.name ) || []; // Lấy tất cả các quyền
        console.log("Quyền người dùng:", roles);
      } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Không thể lấy dữ liệu profile.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
    <div className="profile-container">
      <div className="profile-content">
        <h2>Thông tin cá nhân</h2>
        <div className="profile-info">
          <div className="info-row">
            <label>Tên:</label>
            <span>{profile.hoten}</span>
          </div>
          <div className="info-row">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="info-row">
            <label>Số điện thoại:</label>
            <span>{profile.sdt}</span>
          </div>
          <div className="info-row">
            <label>Căn cước công dân:</label>
            <span>{profile.cmnd}</span>

          </div>
        </div>

        {/* Bảng hiển thị thông tin địa chỉ */}
        <div className="address-container">
          {/* <h5 className='mt-3'>Thông Tin Địa Chỉ</h5> */}
          <div className="">
            <label className=" mt-2 ">địa chỉ:</label>
          </div>
          <table className="address-table-horizontal">

            <thead>
              <tr>
                <th>Stt</th>
                <th>Địa chỉ chi tiết</th>
                <th>Tỉnh/Thành phố</th>
                <th>Quận/Huyện</th>
                <th>Phường/Xã</th>
              </tr>
            </thead>
            <tbody>
              {profile?.diachi
                .filter(address => address.shop === null)
                .map((address, index) => {

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{address.diachiDetail}</td>
                      <td>{address.nameProvince}</td>
                      <td>{address.nameDistrict} </td>
                      <td>{address.nameWard} </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>


          {profile.sdt !== 'null'   ? (
            <>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addressModal"
              >
                Thêm Địa Chỉ
              </button>
              <AddressForm />
            </>
          ) : (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Vui lòng cập nhật số điện thoại trước khi thêm địa chỉ.
            </div>
          )}
        </div>



      </div>
    </div>
  );
};

export default Profile;
