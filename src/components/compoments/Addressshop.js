import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273"; // Thay bằng API Key của bạn

function AddressForm() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [detailAddress, setDetailAddress] = useState("");
  const [user, setuser] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [errors, setErrors] = useState({}); // Lưu lỗi

  useEffect(() => {
    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers: { Token: GHN_API_KEY },
      })
      .then((response) => setProvinces(response.data.data))
      .catch((error) => console.error("Lỗi khi lấy danh sách tỉnh:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
          headers: { Token: GHN_API_KEY },
          params: { province_id: selectedProvince },
        })
        .then((response) => {
          setDistricts(response.data.data);
          setWards([]);
          setSelectedDistrict("");
        })
        .catch((error) => console.error("Lỗi khi lấy danh sách quận/huyện:", error));
    }
  }, [selectedProvince]);

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
        .catch((error) => console.error("Lỗi khi lấy danh sách phường/xã:", error));
    }
  }, [selectedDistrict]);

  const validateForm = () => {
    const newErrors = {};
    if (!detailAddress.trim()) newErrors.detailAddress = "Vui lòng nhập địa chỉ chi tiết.";
    if (!selectedProvince) newErrors.selectedProvince = "Vui lòng chọn tỉnh/thành phố.";
    if (!selectedDistrict) newErrors.selectedDistrict = "Vui lòng chọn quận/huyện.";
    if (!selectedWard) newErrors.selectedWard = "Vui lòng chọn phường/xã.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;

    const token = Cookies.get("token");
    if (token && typeof token === "string") {
      const decoded = jwtDecode(token);
      console.log("Payload của token:", decoded); // Log payload
      setuser(decoded.id)  
      console.log(decoded.id );
    }
    if (!token) {
      alert("Bạn cần đăng nhập!");
      return;
    }

    const province = provinces.find((p) => p.ProvinceID === parseInt(selectedProvince));
    const district = districts.find((d) => d.DistrictID === parseInt(selectedDistrict));
    const ward = wards.find((w) => w.WardCode === selectedWard);

    const addressData = {
      provinceId: parseInt(selectedProvince),
      provinceName: province.ProvinceName,
      districtId: parseInt(selectedDistrict),
      districtName: district.DistrictName,
      wardCode: selectedWard,
      wardName: ward.WardName,
      // ID_NGUOIDUNG:user,
      detailAddress: detailAddress.trim(),
    };

    axios
      .post("http://localhost:8080/api/addresses/saveshop", addressData, {
        headers: { Authorization: `${token}` },
      })
      .then(() => {
        alert("Địa chỉ đã được lưu thành công!");
        // closeModal();
      })
      .catch((error) => {
        console.error("Lỗi khi lưu địa chỉ:", error);
      });
  };

  return (
    <div className="modal fade" id="addressModal" tabIndex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addressModalLabel">
              Thêm Địa Chỉ
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Địa chỉ chi tiết:</label>
                <input
                  type="text"
                  className={`form-control ${errors.detailAddress ? "is-invalid" : ""}`}
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết (số nhà, đường, ...)"
                />
                {errors.detailAddress && <div className="invalid-feedback">{errors.detailAddress}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Tỉnh/Thành phố:</label>
                <select
                  className={`form-select ${errors.selectedProvince ? "is-invalid" : ""}`}
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
                {errors.selectedProvince && <div className="invalid-feedback">{errors.selectedProvince}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Quận/Huyện:</label>
                <select
                  className={`form-select ${errors.selectedDistrict ? "is-invalid" : ""}`}
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
                {errors.selectedDistrict && <div className="invalid-feedback">{errors.selectedDistrict}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Phường/Xã:</label>
                <select
                  className={`form-select ${errors.selectedWard ? "is-invalid" : ""}`}
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
                {errors.selectedWard && <div className="invalid-feedback">{errors.selectedWard}</div>}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveAddress}>
              Lưu Địa Chỉ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
