import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { getProfile } from "../../../../config/Auth";
import AddressFormshop from "../../../compoments/Addressshop";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
const ShopUser = () => {
  const [shop, setShop] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedShop, setUpdatedShop] = useState({});
  const [shopImage, setShopImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  console.log(shop)
  const [data, setData] = useState([]);
  const [dataKhuyenMai, setDataKhuyenMai] = useState([]);
  const [dataSanPhamKhuyenMai, setDataSanPhamKhuyenMai] = useState([]);
  console.log(data)





  async function hienThiSanPhamKhuyenMai() {
    try {
      const apiShop = 'http://localhost:8080/api/sanphamkhuyenmai/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setDataSanPhamKhuyenMai(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Không có dữ liệu cho sản phẩm khuyến mãi.');
      } else {
        console.error('Lỗi khác:', error);
      }
    }
  }

  async function hienThiKhuyenMai() {
    try {
      const apiShop = 'http://localhost:8080/api/khuyenmai/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setDataKhuyenMai(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Không có dữ liệu cho khuyến mãi.');
      } else {
        console.error('Lỗi khác:', error);
      }
    }
  }

  async function hienThiSanPham() {
    try {
      const apiShop = 'http://localhost:8080/api/sanpham/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Không có dữ liệu cho sản phẩm.');
      } else {
        console.error('Lỗi khác:', error);
      }
    }
  }


  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res); // Lưu dữ liệu profile vào state
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Không thể lấy dữ liệu profile.');
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (shop && shop.id) {
      hienThiSanPham();
      hienThiKhuyenMai();
      hienThiSanPhamKhuyenMai();

    }
  }, [shop]);

  // Tải thông tin cửa hàng
  useEffect(() => {
    fetchProfile();
    const token = Cookies.get("token");
    console.log(token)
    if (!token) {
      Swal.fire("Thông báo", "Bạn cần đăng nhập để truy cập trang này", "warning");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8080/api/shops/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedShop = response.data;
        setShop(fetchedShop);
        setUpdatedShop(fetchedShop);
        setIsApproved(fetchedShop.isApproved);
        setImagePreviewUrl(fetchedShop.shopImage);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin cửa hàng:", error);
        setLoading(false);
        if (error.response && error.response.status === 403) {
          Swal.fire("Lỗi", "Bạn chưa có cửa hàng", "error");
        } else {
          Swal.fire("Lỗi", "Không thể lấy thông tin cửa hàng", "error");
        }
      });

  }, [navigate]);




  // Xử lý khi chỉnh sửa thông tin cửa hàng
  const handleEditShopInfo = () => {
    setEditMode(true);
  };

  // Hủy chỉnh sửa và trở về thông tin gốc
  const handleCancelEdit = () => {
    setEditMode(false);
    setUpdatedShop(shop); // Khôi phục lại dữ liệu gốc
    setImagePreviewUrl(shop.shopImage); // Đặt lại ảnh gốc
    setShopImage(null); // Xóa ảnh đã chọn
  };

  // Lưu thay đổi thông tin cửa hàng
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Hiển thị xác nhận trước khi lưu
    const result = await Swal.fire({
      title: "Xác nhận lưu thay đổi",
      text: "Bạn có chắc muốn lưu các thay đổi không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const token = Cookies.get("token");
      const formData = new FormData();

      // Thêm JSON dưới dạng chuỗi
      const shopData = {
        shopName: updatedShop.shopName,
        shopDescription: updatedShop.shopDescription,
      };
      formData.append("shop", JSON.stringify(shopData));

      // Thêm file ảnh nếu có
      if (shopImage) {
        formData.append("shopImageFile", shopImage);
      } try {
        const response = await axios.put(
          `http://localhost:8080/api/shops/user/${shop.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setShop(response.data);
        setEditMode(false);
        Swal.fire("Thành công", "Cập nhật thông tin cửa hàng thành công", "success");
      } catch (error) {
        console.error("Lỗi khi cập nhật cửa hàng:", error);
        Swal.fire("Lỗi", "Có lỗi xảy ra khi cập nhật cửa hàng", "error");
      }
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShop((prevShop) => ({
      ...prevShop,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh cửa hàng
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setShopImage(file);
    setImagePreviewUrl(URL.createObjectURL(file)); // Cập nhật ảnh xem trước
  };




  console.log(dataSanPhamKhuyenMai)
  return (
    <div className="container mt-5">
      <h2 className="text-center my-4 fw-bold text-primary">QUẢN LÝ CỬA HÀNG</h2>

      {loading ? (
        <div className="text-center">Đang tải thông tin cửa hàng...</div>
      ) : (
        <>
          {shop ? (
            <>
              {shop.isActive ? (
                <div className="alert alert-success text-center">
                  Cửa hàng của bạn đang <strong>HOẠT ĐỘNG</strong> và hiển thị với khách hàng.
                  <br />
                  Bạn có thể chỉnh sửa thông tin hoặc quản lý hoạt động của cửa hàng tại đây.
                </div>
              ) : (
                <div className="alert alert-danger text-center">
                  Cửa hàng của bạn đang bị <strong>ẨN</strong> và không hiển thị với khách hàng.
                  <br />
                  Vui lòng liên hệ quản trị viên hoặc chỉnh sửa thông tin để yêu cầu kích hoạt lại.
                </div>
              )}

              <div className="card mb-4">
                <div className="card-header text-center">Thông Tin Cửa Hàng</div>
                <div className="card-body text-center">
                  <div
                    className="image-preview mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      backgroundImage: `url(${imagePreviewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      margin: "0 auto",
                    }}
                  />
                  {editMode ? (
                    <div>
                      <input
                        type="text"
                        name="shopName"
                        value={updatedShop.shopName || ""}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Tên cửa hàng"
                      />
                      <textarea
                        name="shopDescription"
                        value={updatedShop.shopDescription || ""}
                        onChange={handleInputChange}
                        className="form-control mb-2"
                        placeholder="Mô tả cửa hàng"
                      />
                      <div className="mb-2">
                        <label className="form-label">Ảnh cửa hàng</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImageChange}
                        />
                      </div>
                      <button onClick={handleSaveChanges} className="btn btn-success">
                        Lưu
                      </button>
                      <button onClick={handleCancelEdit} className="btn btn-secondary ms-2">
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <>
                      <h5>{shop?.shopName}</h5>
                      <p>{shop?.shopDescription}</p>
                      <button onClick={handleEditShopInfo} className="btn btn-warning">
                        Chỉnh Sửa
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* <div className="card shadow-sm w-100 mb-5">
                <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
                  <h2>Địa chỉ</h2>
                  <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#addressModal"
                  >
                    Thêm Địa Chỉ
                  </button>
                  <AddressFormshop />
                </div>
                <div className="card-body">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>STT</th>
                        <th>Địa chỉ chi tiết</th>
                        <th>Tỉnh/Thành phố</th>
                        <th>Quận/Huyện</th>
                        <th>Phường/Xã</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.diachi.map((address, index) => {
                        if (address.id === null || address.id !== null) {
                          return null; // Bỏ qua địa chỉ có shop không null
                        }
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{address.diachiDetail}</td>
                            <td>{address.nameProvince} (ID: {address.provinceId})</td>
                            <td>{address.nameDistrict} (ID: {address.idDistrict})</td>
                            <td>{address.nameWard} (ID: {address.idWard})</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div> */}


              

              <Link to="/user/shop-user/danhsachsanpham" className="btn btn-danger">
                Danh sách sản phẩm
              </Link>
              <Link to="/user/shop-user/danhsachsanphamkhuyenmai" className="btn btn-success mx-3">
                Danh sách sản phẩm khuyến mãi
              </Link>
              <Link to="/user/shop-user/danhsachkhuyenmai" className="btn btn-info ">
                Danh sách khuyến mãi
              </Link>

              <Outlet />
            </>
          ) : (
            <div className="alert alert-warning text-center">
              Bạn chưa có cửa hàng hoặc cửa hàng của bạn chưa được xét duyệt.
            </div>
          )}
        </>
      )}

    </div>
  );

};

export default ShopUser