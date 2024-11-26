import React, { useState, useEffect } from "react";
import axios from "axios";

const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273"; // Thay bằng API Key của bạn

function AddressForm() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddress, setDetailAddress] = useState(""); // State cho địa chỉ chi tiết

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: GHN_API_KEY },
      })
      .then((response) => {
        setProvinces(response.data.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      });
  }, []);

  // Lấy danh sách quận/huyện dựa vào tỉnh được chọn
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
          headers: { Token: GHN_API_KEY },
          params: { province_id: selectedProvince },
        })
        .then((response) => {
          setDistricts(response.data.data);
          setWards([]); // Reset phường/xã khi chọn tỉnh mới
          setSelectedDistrict("");
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách quận/huyện:", error);
        });
    }
  }, [selectedProvince]);

  // Lấy danh sách phường/xã dựa vào quận/huyện được chọn
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
          headers: { Token: GHN_API_KEY },
          params: { district_id: selectedDistrict },
        })
        .then((response) => {
          setWards(response.data.data);
          setSelectedWard("");
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách phường/xã:", error);
        });
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleSaveAddress = () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

  if (!token) {
    alert("Bạn cần đăng nhập!");
    return;
  }

    // Tìm tỉnh, quận, phường dựa trên ID đã chọn
    const province = provinces.find((province) => province.ProvinceID === parseInt(selectedProvince));
    const district = districts.find((district) => district.DistrictID === parseInt(selectedDistrict));
    const ward = wards.find((ward) => ward.WardCode === selectedWard);
  
    // Kiểm tra xem tất cả các trường có hợp lệ không
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      alert("Vui lòng chọn đầy đủ thông tin tỉnh, quận và phường!");
      return;
    }
  
    // Kiểm tra province có tồn tại và không phải undefined
    if (!province) {
      console.error("Tỉnh không hợp lệ:", province); // In ra thông báo lỗi vào console
      alert("Tỉnh không hợp lệ!");  // Hiển thị thông báo lỗi
      return;
    }
  
    // Kiểm tra district có tồn tại và không phải undefined
    if (!district) {
      console.error("Quận không hợp lệ:", district); // In ra thông báo lỗi vào console
      alert("Quận không hợp lệ!");  // Hiển thị thông báo lỗi
      return;
    }
  
    // Kiểm tra ward có tồn tại và không phải undefined
    if (!ward) {
      console.error("Phường không hợp lệ:", ward); // In ra thông báo lỗi vào console
      alert("Phường không hợp lệ!");  // Hiển thị thông báo lỗi
      return;
    }
  
    // Nếu tất cả đều hợp lệ, tiến hành lưu địa chỉ
    const addressData = {
      provinceId: parseInt(selectedProvince),  // ProvinceID của GHN
      provinceName: province.ProvinceName,  // Tên tỉnh
      districtId: parseInt(selectedDistrict),  // DistrictID của GHN
      districtName: district.DistrictName,  // Tên quận
      wardCode: selectedWard,  // WardCode của GHN
      wardName: ward.WardName,  // Tên phường xã
      detailAddress: detailAddress.trim() 
    };
  
    // Gửi yêu cầu POST về Backend để lưu địa chỉ
    axios.post('http://localhost:8080/api/addresses/save', addressData,{
      headers: { Authorization: `${token}` }, // Thêm token vào header
    }
    )
      .then((response) => {
        console.log('Địa chỉ đã được lưu:', response.data);
        alert('Địa chỉ đã được lưu thành công!');
      })
      .catch((error) => {
        console.error('Lỗi khi lưu địa chỉ:', error);
        alert('Lỗi khi lưu địa chỉ!');
      });
  };
  
  return (
    <form>
      <div>
        <label>Địa chỉ chi tiết:</label>
        <input
          type="text"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="Nhập địa chỉ chi tiết (số nhà, đường, ...)"
        />
      </div>

      <div>
        <label>Tỉnh/Thành phố:</label>
        <select value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">Chọn tỉnh/thành phố</option>
          {provinces.map((province) => (
            <option key={province.ProvinceID} value={province.ProvinceID}>
              {province.ProvinceName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Quận/Huyện:</label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/huyện</option>
          {districts.map((district) => (
            <option key={district.DistrictID} value={district.DistrictID}>
              {district.DistrictName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Phường/Xã:</label>
        <select
          value={selectedWard}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((ward) => (
            <option key={ward.WardCode} value={ward.WardCode}>
              {ward.WardName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button type="button" onClick={handleSaveAddress}>Lưu Địa Chỉ</button>
      </div>
    </form>
  );
}

export default AddressForm;
