import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Cookies from "js-cookie";

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const token = Cookies.get('token'); 

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://api.ghtk.vn/partner/provinces', {
          headers: {
            'Token': "Bearer" +""+ token, // API Key của bạn
          },
        });
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error);
      }
    };

    fetchProvinces();
  }, []);

  // Khi chọn tỉnh/thành phố, cập nhật danh sách quận/huyện
  const handleProvinceChange = async (selectedOption) => {
    setSelectedProvince(selectedOption);
    setDistricts([]); // Reset danh sách quận/huyện
    setWards([]); // Reset danh sách phường/xã
    setSelectedDistrict(null);
    setSelectedWard(null);

    try {
      const response = await axios.get(`https://api.ghtk.vn/partner/districts?province_id=${selectedOption.value}`, {
        headers: {
          'Token': token, // API Key của bạn
        },
      });
      setDistricts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quận/huyện:', error);
    }
  };

  // Khi chọn quận/huyện, cập nhật danh sách phường/xã
  const handleDistrictChange = async (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setWards([]); // Reset danh sách phường/xã
    setSelectedWard(null);

    try {
      const response = await axios.get(`https://api.ghtk.vn/partner/wards?district_id=${selectedOption.value}`, {
        headers: {
          'Token': token, // API Key của bạn
        },
      });
      setWards(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phường/xã:', error);
    }
  };

  return (
    <div>
      <h2>Chọn Địa Chỉ</h2>
      
      {/* Dropdown Tỉnh/Thành phố */}
      <label>
        Tỉnh/Thành phố:
        <Select
          value={selectedProvince}
          onChange={handleProvinceChange}
          options={provinces.map((province) => ({
            value: province.Id,
            label: province.Name,
          }))}
          placeholder="Chọn Tỉnh/Thành phố"
        />
      </label>

      {/* Dropdown Quận/Huyện */}
      <label>
        Quận/Huyện:
        <Select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={districts.map((district) => ({
            value: district.Id,
            label: district.Name,
          }))}
          isDisabled={!selectedProvince}
          placeholder="Chọn Quận/Huyện"
        />
      </label>

      {/* Dropdown Phường/Xã */}
      <label>
        Phường/Xã:
        <Select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e)}
          options={wards.map((ward) => ({
            value: ward.Id,
            label: ward.Name,
          }))}
          isDisabled={!selectedDistrict}
          placeholder="Chọn Phường/Xã"
        />
      </label>

      {/* Hiển thị địa chỉ đã chọn */}
      <div>
        <h3>Địa chỉ đã chọn:</h3>
        <p>
          Tỉnh/Thành phố: {selectedProvince ? selectedProvince.label : 'Chưa chọn'}<br />
          Quận/Huyện: {selectedDistrict ? selectedDistrict.label : 'Chưa chọn'}<br />
          Phường/Xã: {selectedWard ? selectedWard.label : 'Chưa chọn'}
        </p>
      </div>
    </div>
  );
};

export default AddressForm;
