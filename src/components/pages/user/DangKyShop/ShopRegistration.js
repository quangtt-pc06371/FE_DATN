import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273";
const ShopRegistration = () => {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [detailAddress, setDetailAddress] = useState("");
    const [user, setuser] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
      const [shops, setShops] = useState([]);
    // const [errors, setErrors] = useState({}); // Lưu lỗi
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && allowedTypes.includes(file.type)) {
      setShopImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, shopImage: "" })); // Xóa lỗi ảnh nếu hợp lệ
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, shopImage: "Ảnh phải có định dạng .jpg, .jpeg hoặc .png" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra các trường
    const newErrors = {};
    if (!shopName) newErrors.shopName = "Vui lòng nhập tên cửa hàng.";
    if (!shopDescription) newErrors.shopDescription = "Vui lòng nhập mô tả cho cửa hàng.";
    if (!shopImage) newErrors.shopImage = "Vui lòng chọn ảnh cho cửa hàng.";
    if (!detailAddress.trim()) newErrors.detailAddress = "Vui lòng nhập địa chỉ chi tiết.";
    if (!selectedProvince) newErrors.selectedProvince = "Vui lòng chọn tỉnh/thành phố.";
    if (!selectedDistrict) newErrors.selectedDistrict = "Vui lòng chọn quận/huyện.";
    if (!selectedWard) newErrors.selectedWard = "Vui lòng chọn phường/xã.";

    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  
    // Tạo FormData để gửi
    const formData = new FormData();
    formData.append("shopName", shopName);
    formData.append("shopDescription", shopDescription);
    if (shopImage) formData.append("shopImage", shopImage);
  
    const token = cookies.token;
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Chưa đăng nhập",
        text: "Vui lòng đăng nhập để tiếp tục.",
        confirmButtonText: "Đăng nhập",
      }).then(() => navigate("/login"));
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8080/api/shops/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShopName("");
      setShopDescription("");
      setShopImage(null);
      setPreviewUrl("");
      setErrors({});
      if (response.status === 200 && response.data) {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
          text: "Cửa hàng đã được đăng ký. Vui lòng chờ xét duyệt!",
        });
        
        
      
  
       
        setShopName("");
        setShopDescription("");
        setShopImage(null);
        setPreviewUrl("");
        setErrors({});
      }
     

    } catch (error) {
      const errorMessage = error.response?.data?.error || "Đã xảy ra lỗi. Vui lòng thử lại.";
console.log(error)
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          errorMessage === "Bạn đã đăng ký cửa hàng trước đó"
            ? "Bạn đã đăng ký một cửa hàng. Vui lòng kiểm tra lại."
            : errorMessage,
      });
    }
    // const token = Cookies.get("token");
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
        // alert("Địa chỉ đã được lưu thành công!");
        // closeModal();
      })
      .catch((error) => {
        console.error("Lỗi khi lưu địa chỉ:", error);
      });
  };
  

  const fetchShops = async () => {
    const token = cookies.token;
    try {
      const response = await axios.get('http://localhost:8080/api/shops/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setShops(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cửa hàng:', error);
    }
    
  };
  useEffect(() => {
    fetchShops(); // Gọi hàm khi component mount
  }, []);
  console.log(shops?.isApproved)
  return (
    <div className="container mt-5">
      <div className="col-md-8 mx-auto">
        <h2 className="text-center my-4 fw-bold text-primary animated-title">ĐĂNG KÝ CỬA HÀNG</h2>
        {shops.isApproved === false || shops ===""  ? (
          <div className="text-center text-muted">
            <p>cửa hàng đang chờ xét duyệt</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-light">
          <div className="mb-3 text-center">
            <div
              className="image-preview"
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                margin: "0 auto",
              }}
            >
              {!previewUrl && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                    fontSize: "14px",
                  }}
                >
                  Chọn ảnh
                </div>
              )}
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {errors.shopImage && <div className="text-danger mt-2">{errors.shopImage}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Tên cửa hàng:</label>
            <input
              type="text"
              placeholder="Nhập tên cửa hàng của bạn"
              className="form-control"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
            {errors.shopName && <div className="text-danger mt-1">{errors.shopName}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Mô Tả cửa hàng:</label>
            <textarea
              placeholder="Nhập mô tả cho cửa hàng"
              className="form-control"
              rows="3"
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
            />
            {errors.shopDescription && <div className="text-danger mt-1">{errors.shopDescription}</div>}
          </div>
          {/* địa chỉ */}
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
          <button type="submit" className="btn btn-primary w-100">Đăng Ký Shop</button>

        </form>
        )}
      </div>
    </div>
    
  );
};

export default ShopRegistration;
