import React, { useState } from 'react';
import axios from 'axios';

const CreateShop = () => {
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createShop = async () => {
    const GHN_API_KEY = "0c610ff6-a1c5-11ef-9228-86dad1308bda"; // API key của bạn
    const url = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shop/register'; // Endpoint để tạo cửa hàng

    // Dữ liệu cửa hàng cần tạo
    const data = {
      name: shopName,
      address: shopAddress,
      phone: shopPhone,
      district_id: 1574,  // District ID cần được kiểm tra xem có đúng hay không
      ward_code: 550350,  // Ward code cần được kiểm tra
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Token: GHN_API_KEY,  // API Key của bạn
          'Content-Type': 'application/json',  // Đảm bảo gửi đúng content-type
        },
      });
      setSuccess('Cửa hàng đã được tạo thành công!');
      setError(null);
      console.log('Thông tin cửa hàng đã tạo:', response.data);
    } catch (err) {
      // Xử lý lỗi nếu có
      if (err.response && err.response.status === 401) {
        setError('Lỗi xác thực: API Key không hợp lệ.');
      } else {
        setError('Có lỗi khi tạo cửa hàng.');
      }
      setSuccess(null);
      console.error('Lỗi khi tạo cửa hàng:', err);
    }
  };

  return (
    <div>
      <h2>Tạo cửa hàng mới</h2>
      
      <div>
        <label>Tên cửa hàng:</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
      </div>
      
      <div>
        <label>Địa chỉ cửa hàng:</label>
        <input
          type="text"
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
        />
      </div>
      
      <div>
        <label>Số điện thoại cửa hàng:</label>
        <input
          type="text"
          value={shopPhone}
          onChange={(e) => setShopPhone(e.target.value)}
        />
      </div>

      <button onClick={createShop}>Tạo cửa hàng</button>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateShop;
