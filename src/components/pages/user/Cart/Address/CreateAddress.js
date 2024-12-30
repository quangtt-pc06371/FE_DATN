import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import thư viện js-cookie

const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273"; // Thay bằng API Key của bạn

function CreateAddress() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddress, setDetailAddress] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: { Token: GHN_API_KEY },
        }
      )
      .then((response) => setProvinces(response.data.data))
      .catch((error) => console.error("Lỗi khi lấy danh sách tỉnh:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            headers: { Token: GHN_API_KEY },
            params: { province_id: selectedProvince },
          }
        )
        .then((response) => {
          setDistricts(response.data.data);
          setWards([]);
          setSelectedDistrict("");
        })
        .catch((error) =>
          console.error("Lỗi khi lấy danh sách quận/huyện:", error)
        );
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            headers: { Token: GHN_API_KEY },
            params: { district_id: selectedDistrict },
          }
        )
        .then((response) => {
          setWards(response.data.data);
          setSelectedWard("");
        })
        .catch((error) =>
          console.error("Lỗi khi lấy danh sách phường/xã:", error)
        );
    }
  }, [selectedDistrict]);

  const handleSaveAddress = () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Bạn cần đăng nhập!");
      return;
    }

    const province = provinces.find(
      (p) => p.ProvinceID === parseInt(selectedProvince)
    );
    const district = districts.find(
      (d) => d.DistrictID === parseInt(selectedDistrict)
    );
    const ward = wards.find((w) => w.WardCode === selectedWard);

    if (!province || !district || !ward) {
      alert("Vui lòng chọn đầy đủ thông tin!");
      return;
    }

    const addressData = {
      provinceId: parseInt(selectedProvince),
      provinceName: province.ProvinceName,
      districtId: parseInt(selectedDistrict),
      districtName: district.DistrictName,
      wardCode: selectedWard,
      wardName: ward.WardName,
      detailAddress: detailAddress.trim(),
    };

    axios
      .post("http://localhost:8080/api/addresses/save", addressData, {
        headers: { Authorization: `${token}` },
      })
      .then(() => {
        alert("Địa chỉ đã được lưu thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi lưu địa chỉ:", error);
      });
  };

  return (
    <>
        <div className="mb-3">
          <label className="form-label">Địa chỉ chi tiết:</label>
          <input
            type="text"
            className="form-control w-100"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="Nhập địa chỉ chi tiết (số nhà, đường, ...)"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tỉnh/Thành phố:</label>
          <select
            className="form-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Quận/Huyện:</label>
          <select
            className="form-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
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
        <div className="mb-3">
          <label className="form-label">Phường/Xã:</label>
          <select
            className="form-select"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
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
        <button className="btn btn-success"
          onClick={handleSaveAddress}
        >
          Thêm Địa Chỉ
        </button>
    </>
  );
}

export default CreateAddress;