import React, { useState, useEffect } from "react";
import axios from "axios";

const GHN_API_KEY = "39c8e057-ae7c-11ef-9083-dadc35c0870d"; // Thay bằng API Key của bạn
const SHOP_ID = "195516"; // Thay bằng Shop ID của bạn

function AddressForm() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [weight, setWeight] = useState(0);
  const [shippingFee, setShippingFee] = useState(null);

  // Lấy danh sách tỉnh thành
  useEffect(() => {
    axios
      .get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province", {
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
        .get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district", {
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
 // Lấy danh sách phường/xã dựa vào quận/huyện được chọn
useEffect(() => {
  if (selectedDistrict) {
    console.log(selectedDistrict)
    axios
      .get("https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        headers: { Token: GHN_API_KEY },
        params: { district_id: selectedDistrict }, // Sửa ở đây
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

console.log(wards)
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  // Tính phí vận chuyển
  const calculateShippingFee = () => {
    if (!selectedDistrict || !selectedWard || weight <= 0) {
      alert("Vui lòng chọn đủ thông tin và nhập trọng lượng hợp lệ!");
      return;
    }
  
    axios
      .post(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          from_district_id: 1574, // Mã quận/huyện của shop (cần chính xác)
          service_type_id: 2,     // Loại dịch vụ cần chính xác
          from_ward_code: 550304, // Mã phường của shop (cần chính xác)
          to_district_id: selectedDistrict,
          to_ward_code: selectedWard,
          weight: weight,
        },
        {
          headers: {
            Token: GHN_API_KEY,
            ShopId: SHOP_ID,
          },
        }
      )
      .then((response) => {
        if (response.data && response.data.data) {
          setShippingFee(response.data.data.total);
        } else {
          console.error("Dữ liệu trả về không hợp lệ", response);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tính phí vận chuyển:", error);
        alert("Có lỗi xảy ra khi tính phí vận chuyển!");
      });
  };
  

  // Xác nhận tạo đơn hàng
  const createOrder = () => {
    axios
      .post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
        {
          payment_type_id: 2, // 1: người nhận trả phí, 2: người gửi trả phí
          note: "Vận chuyển đơn hàng",
          required_note: "CHOTHUHANG",
          to_name: "toan",
          to_phone: "0123456789",
          to_address: "Địa chỉ nhận",
          to_ward_code: selectedWard,
          to_district_id: selectedDistrict,
          cod_amount: 0, // Tiền thu hộ nếu có
          weight: weight,
          length: 10, // Kích thước gói hàng
          width: 10,
          height: 10,
          service_id: 53320, // ID dịch vụ
          service_type_id: 2, // Loại dịch vụ
          from_district_id: 1442, // Mã quận/huyện của shop
          coupon: null,
        },
        {
          headers: {
            Token: GHN_API_KEY,
            ShopId: SHOP_ID,
          },
        }
      )
      .then((response) => {
        console.log("Tạo đơn hàng thành công:", response.data);
        alert("Tạo đơn hàng thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi tạo đơn hàng:", error);
        alert("Tạo đơn hàng thất bại!");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateShippingFee();
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>Trọng lượng (g):</label>
        <input type="number" value={weight} onChange={handleWeightChange} />
      </div>

      <div>
        <button type="submit">Tính phí vận chuyển</button>
        {shippingFee !== null && <p>Phí vận chuyển: {shippingFee} VND</p>}
      </div>

      <div>
        <button type="button" onClick={createOrder}>
          Xác nhận và tạo đơn hàng
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
