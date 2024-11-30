/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API, ORDER } from "../assets/config/api"; // Cập nhật đường dẫn API theo dự án của bạn
import Cookies from "js-cookie"; // Import thư viện js-cookie
import Voucher from "./Voucher"; // Import component Voucher
import ShippingCalculator from "./Ship";
import Payment from "./Payment";
import AddressForm from "./index";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useLocation } from "react-router-dom";

function Order() {
  const [orders, setOrders] = useState([]); // Lưu danh sách đơn hàng
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showVoucherModal, setShowVoucherModal] = useState(false); // Hiển thị Modal Voucher
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Lưu voucher đã áp dụng
  const [totalDonHang, setTotalDonHang] = useState(100000); // Tổng tiền ban đầu
  const navigate = useNavigate(); // Tạo navigate hook
  const location = useLocation();
  const { selectedIds } = location.state || {};
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  console.log(selectedIds); // Danh sách các sản phẩm đã chọn

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Vui lòng đăng nhập.");
          return;
        }

        const response = await axios.get(
          `${BASE_URL}${API.Order}${ORDER.List}`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        setOrders(response.data.donHang || []); // Lấy danh sách đơn hàng từ API
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err.message);
        setError("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách đơn hàng...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  const groupedByShop = orders.reduce((acc, order) => {
    if (order.chiTietDonHangs && Array.isArray(order.chiTietDonHangs)) {
      order.chiTietDonHangs.forEach((item) => {
        const shopName = item.skuEntity.sanPhamEntity.shop.shopName;

        // Kiểm tra xem shopName đã có trong acc chưa, nếu chưa thì khởi tạo
        if (!acc[shopName]) {
          acc[shopName] = [];
        }

        // Thêm sản phẩm vào đúng shop
        acc[shopName].push(item);
      });
    }
    return acc;
  }, {});

  //Xử Lý Thanh Toán VNPay
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}${API.Order}${ORDER.VnPay}`,
        {
          amount: 100000, // Số tiền thanh toán (VND)
          orderInfo: "Thanh toán cho đơn hàng 12345",
        }
      );

      const paymentUrl = response.data; // URL thanh toán từ backend
      window.location.href = paymentUrl; // Chuyển hướng người dùng đến trang thanh toán VNPay
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
    }
  };

  const handleTotalUpdate = (newTotal) => {
    setTotalDonHang(newTotal); // Cập nhật tổng tiền sau khi áp dụng voucher
  };

  return (
    <>
      <div className="container my-5">
        <h1>Thanh Toán</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.idDonHang} className="card mb-3">
              {/* Form Thông Tin Khách Hàng */}
              <div className="card-header">
                <h5>Đơn hàng #{order.idDonHang}</h5>
              </div>
              <div className="card-body">
                <div className="d-flex mb-3">
                  <i className="bi bi-geo-alt-fill"></i>
                  <h6 className="ms-2">Địa chỉ nhận hàng</h6>
                </div>

                {order.taiKhoanEntity?.diaChiEntity?.length > 0 ? (
                  <ul className="list-group mb-3">
                    {order.taiKhoanEntity.diaChiEntity.map((address, index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="me-4 flex-grow-1">
                            <div>
                              <strong>Họ tên:</strong> {address.hoTen}
                            </div>
                            <div>
                              <strong>Số điện thoại:</strong>{" "}
                              {address.soDienThoai}
                            </div>
                            <div>
                              <strong>Địa chỉ:</strong> {address.diachiDetail},{" "}
                              {address.nameWard}, {address.nameDistrict},{" "}
                              {address.nameProvince}
                            </div>
                          </div>

                          {/* Nút Thay đổi luôn nằm bên phải */}
                          <div className="ms-3">
                            <button
                              className="btn btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#addressModal"
                            >
                              Thêm Địa Chỉ
                            </button>

                            <AddressForm />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có thông tin vận chuyển.</p>
                )}
              </div>

              {/* Form Thông Tin Sản Phẩm */}
              <div className="card-body">
                <h6>Chi tiết sản phẩm:</h6>
                <div className="row g-0 align-items-center px-3 py-2 bg-light mb-3">
                  <div className="col-md-4">
                    <strong>Sản Phẩm</strong>
                  </div>
                  <div className="col-md-3">
                    <strong>Đơn Giá</strong>
                  </div>
                  <div className="col-md-3">
                    <strong>Số Lượng</strong>
                  </div>
                  <div className="col-md-2">
                    <strong>Thành Tiền</strong>
                  </div>
                </div>
                {Object.keys(groupedByShop).map((shopName) => (
                  <div key={shopName} className="mb-4">
                    {/* Tên shop nằm trên cùng, chiếm hết chiều rộng */}
                    <div className="col-12 mb-2">
                      <i className="bi bi-shop"></i>
                      <strong className="ms-2">{shopName}</strong>
                    </div>

                    {/* Hiển thị sản phẩm của shop */}
                    {groupedByShop[shopName].map((item) => (
                      <div
                        key={item.idChiTietDonHang}
                        className="row g-0 align-items-center px-3 py-2 border-bottom"
                      >
                        <div className="col-md-2">
                          <img
                            // src={item.skuEntity.hinhAnh[0]?.tenAnh}
                            src="https://dosi-in.com/images/detailed/42/CDL3_1.jpg"
                            alt=""
                            className="img-fluid"
                            style={{ width: "80px", height: "80px" }} // Kích thước hình ảnh 80x80
                          />
                        </div>
                        <div className="col-md-2">
                          <p>{item.skuEntity.sanPhamEntity.tenSanPham}</p>
                        </div>
                        <div className="col-md-3">
                          {item.skuEntity.giaSanPham.toLocaleString()} VND
                        </div>
                        <div className="col-md-3">{item.soLuong}</div>
                        <div className="col-md-1">
                          {(
                            item.skuEntity.giaSanPham * item.soLuong
                          ).toLocaleString()}{" "}
                          VND
                        </div>
                      </div>
                    ))}

                    {/* Thêm phần thông tin vận chuyển */}
                    <div className="mt-3">
                      <h6>Thông Tin Vận Chuyển:</h6>

                      {/* {Gửi Request Tính Phí Vận Chuyển} */}
                      <ShippingCalculator order={orders} />
                    </div>
                  </div>
                ))}

                <div className="d-flex border align-items-center px-3 py-2 bg-light">
                  <i className="bi bi-ticket-perforated-fill"></i>{" "}
                  <strong className="ms-2 me-3">VoucherBill</strong>
                  {/* Modal Voucher */}
                  <Voucher
                    show={showVoucherModal}
                    onClose={() => setShowVoucherModal(false)}
                    idDonHang={orders}
                    onVoucherSelect={(voucher) => setSelectedVoucher(voucher)} // Cập nhật selectedVoucher từ VoucherModal
                    totalDonHang={totalDonHang}
                    onTotalUpdate={handleTotalUpdate}
                  />
                </div>
              </div>

              {/* Tổng Tiền & Thao Tác */}
              <div className="card-footer">
                <div>
                  <div className="mt-3">
                    {/* Tính tổng số lượng sản phẩm và tổng tiền */}
                    <div>
                      <strong>
                        Tổng Tiền (
                        {order.chiTietDonHangs.reduce(
                          (total, item) => total + item.soLuong,
                          0
                        )}{" "}
                        sản phẩm):
                      </strong>{" "}
                      {order.chiTietDonHangs
                        .reduce(
                          (total, item) => total + item.soLuong * item.tongTien,
                          0
                        )
                        .toLocaleString()}{" "}
                      VND
                    </div>
                  </div>
                  {/* Tính tổng phí vận chuyển */}
                  <div>
                    <strong>Tổng phí vận chuyển:</strong>{" "}
                    {order.chiTietDonHangs
                      .reduce(
                        (total, item) => total + (item.phiVanChuyen || 0),
                        0
                      )
                      .toLocaleString()}{" "}
                    VND
                  </div>
                  <div>
                    {/* Hiển thị giảm giá nếu voucher đã được áp dụng */}
                    {selectedVoucher && (
                      <p>
                        Giảm giá từ voucher:{" "}
                        {(
                          (order.tongSoTien * (selectedVoucher.giamGia || 0)) /
                          100
                        ).toLocaleString()}{" "}
                        VND
                      </p>
                    )}
                  </div>
                  <strong>Tổng thanh toán:</strong>{" "}
                  {order.tongSoTien.toLocaleString()} VND
                </div>
                <Payment orders={orders} totalDonHang={totalDonHang}></Payment>
              </div>
            </div>
          ))
        ) : (
          <p>Không có đơn hàng nào.</p>
        )}
      </div>
    </>
  );
}

export default Order;
