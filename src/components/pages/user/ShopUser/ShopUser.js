import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { getProfile } from "../../../../config/Auth";
import AddressFormshop from "../../../compoments/Addressshop";
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
    const apiShop = 'http://localhost:8080/api/sanphamkhuyenmai/shop';
    const response = await axios.get(apiShop + '/' + shop.id);
    setDataSanPhamKhuyenMai(response.data);
  }

  async function hienThiKhuyenMai() {
    try {
      const apiShop = 'http://localhost:8080/api/khuyenmai/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setDataKhuyenMai(response.data);

    } catch (error) {
      console.log(error)
    }
  }

  async function hienThiSanPham() {
    try {
      const apiShop = 'http://localhost:8080/api/sanpham/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setData(response.data);

    } catch (error) {
      console.log(error)
    }

  }
  async function handleDeleteSanPham(id) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, thực hiện xóa
    if (result.isConfirmed) {
      const apiSanPham = "http://localhost:8080/api/sanpham/updatetrangthai";
      try {
        await axios.put(`${apiSanPham}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Xóa sản phẩm thành công",
        });
        hienThiSanPham(); // Load lại danh sách sản phẩm sau khi xóa
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        });
      }
    }
  }


  async function handleDeleteKhuyenMaiHetHan(id) {
    const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai/updatetrangthai';
    await axios.put(apiKhuyenMai + '/' + id);

  }
  async function handleDeleteSanPhamKhuyenMaiHetHan(id) {
    const apiSanPhamKhuyenMai = 'http://localhost:8080/api/sanphamkhuyenmai/updatetrangthai';
    await axios.put(apiSanPhamKhuyenMai + '/' + id);

  }

  async function handleDeleteKhuyenMai(id) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, thực hiện xóa
    if (result.isConfirmed) {
      const apiKhuyenMai = "http://localhost:8080/api/khuyenmai/updatetrangthai";
      try {
        await axios.put(`${apiKhuyenMai}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Khuyến mãi đã được xóa",
        });
        hienThiKhuyenMai(); // Load lại danh sách khuyến mãi sau khi xóa
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Không thể xóa khuyến mãi. Vui lòng thử lại sau.",
        });
      }
    }
  }

  async function handleDeleteSanPhamKhuyenMai(id) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm khuyến mãi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, thực hiện xóa
    if (result.isConfirmed) {
      const apiSanPhamKhuyenMai = "http://localhost:8080/api/sanphamkhuyenmai/updatetrangthai";
      try {
        await axios.put(`${apiSanPhamKhuyenMai}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Sản phẩm khuyến mãi đã được xóa",
        });
        hienThiSanPhamKhuyenMai(); // Load lại danh sách sản phẩm khuyến mãi sau khi xóa
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Không thể xóa sản phẩm khuyến mãi. Vui lòng thử lại sau.",
        });
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
  function getFormatDate(dateString) {
    if (!dateString) return ""; // Kiểm tra nếu không có giá trị
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Kiểm tra nếu không phải là ngày hợp lệ
    return format(date, 'yyyy-MM-dd');
  }



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
              <div className="card shadow-sm w-100 mb-5">
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
          if (address.shop === null) {
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
</div>


              <div className="card shadow-sm w-100 mb-5">
                <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
                  <h2>Danh Sách Sản Phẩm</h2>
                  <a href='/quanlysanpham' className="btn btn-success">Thêm Sản Phẩm</a>
                </div>
                <div className="card-body">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>STT</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Mô Tả</th>
                        <th>Shop</th>
                        <th>Danh Mục</th>
                        <th>Danh Sách Phiên Bản</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((sanPham, index) => (
                        // Kiểm tra nếu sản phẩm có trong hiddenProducts thì không hiển thị
                        sanPham.trangThai === false ? null : (
                          <tr key={sanPham.idSanPham}>
                            <td>{index + 1}</td>
                            <td>{sanPham.tenSanPham}</td>
                            <td>{sanPham.moTa}</td>
                            <td>{sanPham.shop.shopName}</td>
                            <td>{sanPham.danhMuc.tenDanhMuc}</td>
                            <td>
                              Số lượng phiên bản: {sanPham.skus.length}
                              {/* {sanPham.skus.length > 0 && (
                                <ul className="list-unstyled">
                                  <li>
                                    <ul>
                                      <li>Giá: {sanPham.skus[0].giaSanPham} VNĐ</li>
                                      <li>Số lượng: {sanPham.skus[0].soLuong}</li>
                                      {sanPham.skus[0].tuyChonThuocTinhSkus.map(tcSkus => (
                                        <li key={tcSkus.idtuyChonThuocTinhSku}>
                                          {tcSkus.tuyChonThuocTinh.thuocTinh.ten}: {tcSkus.tuyChonThuocTinh.giaTri}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                </ul>
                              )} */}
                            </td>
                            <td>
                              <a href={`/sanpham/${sanPham.idSanPham}`} className="btn btn-warning me-2">Sửa</a>
                              <button onClick={() => handleDeleteSanPham(sanPham.idSanPham)} className="btn btn-danger">Xóa</button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card shadow w-100 mb-5">
                <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
                  <h2 className="mb-0">Danh Sách Khuyến Mãi</h2>
                  <a href="/quanlykhuyenmai" className="btn btn-success">Thêm Khuyến Mãi</a>
                </div>
                <div className="card-body">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>STT</th>
                        <th>Tên Khuyến Mãi</th>
                        <th>Giá Trị (%)</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Ghi Chú</th>
                        <th>Shop</th>
                        <th>Hạn Sử Dụng</th>
                        <th className="text-center">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataKhuyenMai.map((khuyenMai, index) => {
                        const now = new Date();
                        // Chuyển đổi ngày bắt đầu và kết thúc của khuyến mãi thành đối tượng Date
                        const startDate = new Date(khuyenMai.ngayBatDau);
                        const endDate = new Date(khuyenMai.ngayKetThuc);

                        // Kiểm tra nếu khuyến mãi còn hạn hay hết hạn
                        const khuyenMaiConHieuLuc = now >= startDate && now <= endDate;


                        if (!khuyenMaiConHieuLuc) {
                          handleDeleteKhuyenMaiHetHan(khuyenMai.idKhuyenMai)
                        }

                        return (
                          khuyenMai.active === false ? null : (
                            <tr key={khuyenMai.idKhuyenMai}>
                              <td>{index + 1}</td>
                              <td>{khuyenMai.tenKhuyenMai}</td>
                              <td>{khuyenMai.giaTriKhuyenMai}%</td>
                              <td>{getFormatDate(khuyenMai.ngayBatDau)}</td>
                              <td>{getFormatDate(khuyenMai.ngayKetThuc)}</td>
                              <td>{khuyenMai.ghiChu}</td>
                              <td>{khuyenMai.shop.shopName}</td>
                              <td>{khuyenMai.active ? "Còn hạn" : "Hết hạn"}</td>
                              <td className="text-center">
                                <a className="btn btn-warning me-2" href={`/quanlykhuyenmai/${khuyenMai.idKhuyenMai}`}>Sửa</a>
                                <button className="btn btn-danger" onClick={() => handleDeleteKhuyenMai(khuyenMai.idKhuyenMai)}>Xóa</button>
                              </td>
                            </tr>
                          )
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card shadow w-100 mb-3">
                <div className="card-header  bg-body-secondary d-flex justify-content-between align-items-center" >
                  <h2>Danh Sách Chương Trình Khuyến Mãi</h2>
                  <a className="btn btn-success mt-3" href='/sanphamkhuyenmai'>Thêm Chương Trình Khuyến Mãi Mới</a>
                </div>
                <div className="card-body">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Sản Phẩm</th>
                        <th>Giá Gốc</th>
                        <th>Khuyến Mãi</th>
                        <th>Giá Sau Khuyến Mãi</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Kết Thúc</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSanPhamKhuyenMai.map(sanPhamKhuyenMai => {
                        const now = new Date();
                        console.log(now)
                        const startDate = new Date(sanPhamKhuyenMai.khuyenMai.ngayBatDau);
                        const endDate = new Date(sanPhamKhuyenMai.khuyenMai.ngayKetThuc);

                        const giaGoc = sanPhamKhuyenMai.sanPham.skus[0]?.giaSanPham || 0;
                        const khuyenMai = sanPhamKhuyenMai.khuyenMai.giaTriKhuyenMai || 0;
                        const giaSauKhuyenMai = giaGoc - (giaGoc * (khuyenMai / 100));
                        const khuyenMaiConHieuLuc = now >= startDate && now <= endDate;
                        console.log(dataSanPhamKhuyenMai)
                        if (!khuyenMaiConHieuLuc) {
                          // Gọi các hàm xóa trạng thái khi khuyến mãi hết hiệu lực
                          handleDeleteSanPhamKhuyenMaiHetHan(sanPhamKhuyenMai.idSanPhamKM);

                        }
                        return (
                          sanPhamKhuyenMai.trangThai === false ? null : (
                            <tr key={sanPhamKhuyenMai.idSanPhamKM}>
                              <td>{sanPhamKhuyenMai.idSanPhamKM}</td>
                              <td>{sanPhamKhuyenMai.sanPham.tenSanPham}</td>
                              <td>{giaGoc.toFixed(2)} VNĐ</td>
                              <td>{sanPhamKhuyenMai.khuyenMai.tenKhuyenMai} ({khuyenMai}%)</td>
                              <td>
                                {khuyenMaiConHieuLuc ? (
                                  <span className="text-danger fw-bold">{giaSauKhuyenMai.toFixed(2)} VNĐ</span>
                                ) : (
                                  <span>{giaGoc.toFixed(2)} VNĐ</span>
                                )}
                              </td>
                              <td>{getFormatDate(sanPhamKhuyenMai.khuyenMai.ngayBatDau)}</td>
                              <td>{getFormatDate(sanPhamKhuyenMai.khuyenMai.ngayKetThuc)}</td>
                              <td className="text-center">

                                <button className="btn btn-danger" onClick={() => handleDeleteSanPhamKhuyenMai(sanPhamKhuyenMai.idSanPhamKM)}>Xóa</button>
                              </td>
                            </tr>
                          )

                        );
                      })}
                    </tbody>
                  </table>

                </div>
              </div>
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