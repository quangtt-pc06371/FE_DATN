import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const TransactionResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const orderData = JSON.parse(localStorage.getItem("order"));
  const shippingFeeID = JSON.parse(localStorage.getItem("shippingFeeID"))

  // Sử dụng useRef để tránh gọi API nhiều lần
  const isOrderSubmitted = useRef(false);

  useEffect(() => {
    // Lấy thông tin trạng thái thanh toán từ URL
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    setPaymentStatus(status);
    // Nếu trạng thái thanh toán thành công, gọi API lưu đơn hàng
    if (status === "success" && !isOrderSubmitted.current) {
      handleSubmitOrder();
      isOrderSubmitted.current = true; // Đánh dấu đã gửi yêu cầu
    }
  }, [location]);

  const handleSubmitOrder = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return;
      }

      const payload = {
        tongSoTien: orderData.totals.totalAmount,
        trangThaiThanhToan: "Đã thanh toán",      
        hinhThucThanhToan: true,
        ngayXuatDon: new Date().toISOString(), // Thiết lập ngày giờ hiện tại
        phiVanChuyen: shippingFeeID, // Lấy phí vận chuyển cho shop hiện tại
        trangThaiDonHang: 0,
        chiTietDonHangs: orderData.cartData.map((item) => {
          return {
            idSku: item.skuEntity.idSku,
            soLuong: item.soLuongMua,
            idVoucher: 2,
            tongTien:
              item.sanPhamEntity.skuEntities[0].giaSanPham * item.soLuongMua,
            sanPhamDTO: {
              idShop: item.sanPhamEntity.shop.id,
              tenSanPham: item.sanPhamEntity.tenSanPham,
              canNang: item.sanPhamEntity.canNang,
            },
          };
        }),
      };


      const response = await axios.post(
        "http://localhost:8080/api/order/create",
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );

      // Kiểm tra phản hồi từ server
      if (response.status === 200) {
        console.log("Lưu đơn hàng thành công");
      } else {
        alert("Đã có lỗi xảy ra khi tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      alert("Đã có lỗi xảy ra khi gửi đơn hàng.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4 w-75 w-md-50 w-lg-25">
        <div className="text-center mb-4">
          {paymentStatus === "success"  || paymentStatus === "tienMatSuccess" ? (
            <i
              className="bi bi-check-circle text-success"
              style={{ fontSize: "50px" }}
            ></i> // Icon dấu tích thành công
          ) : (
            <i
              className="bi bi-x-circle text-danger"
              style={{ fontSize: "50px" }}
            ></i> // Icon lỗi
          )}
        </div>
        <div className="text-center">
          {paymentStatus === "success" || paymentStatus === "tienMatSuccess" ? (
            <>
              <h2 className="mb-3">Giao dịch thành công!</h2>
              <p>Đơn hàng của bạn đã được xử lý thành công.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/user/bill")}
              >
                Xem Hóa Đơn
              </button>
            </>
          ) : (
            <>
              <h2 className="mb-3">Giao dịch thất bại!</h2>
              <p>Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</p>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/cart")}
              >
                Quay Lại Trang Chủ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionResult;
