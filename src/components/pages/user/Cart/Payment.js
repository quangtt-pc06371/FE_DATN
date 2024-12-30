import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const navigate = useNavigate();
  const orderData = JSON.parse(localStorage.getItem("order"));

  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleSubmitOrder = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return;
      }
      const payload = {
        tongSoTien: orderData.totals.totalAmount,
        trangThaiThanhToan:
          selectedPaymentMethod === "chuyenKhoan"
            ? "Đã thanh toán"
            : "Chưa thanh toán",
        trangThaiDonHang: false,
        hinhThucThanhToan: selectedPaymentMethod === "chuyenKhoan",
        idVoucher: 2,
        chiTietDonHangs: orderData.cartData.map((item) => {
          const shopName = item.sanPhamEntity.shop.shopName;
          const phiVanChuyen = orderData.shippingFees[shopName] || 0;
          return {
            soLuong: item.soLuongMua,
            phiVanChuyen: phiVanChuyen,
            tongTien:
              item.sanPhamEntity.skuEntities[0].giaSanPham * item.soLuongMua,
            skuDTO: {
              idSku: item.sanPhamEntity.skuEntities[0].idSku,
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

      if (response.status === 200) {
        // Chuyển hướng ngay lập tức sau khi đơn hàng được tạo thành công
        setPaymentStatus("success");
        // Trước khi điều hướng, đảm bảo paymentStatus không phải là null
        if (paymentStatus) {
          navigate(`/transaction-result?status=${paymentStatus}`);
        } else {
          console.log("paymentStatus không hợp lệ");
          // Có thể điều hướng đến trang khác nếu cần, ví dụ trang lỗi.
        }
      } else {
        setPaymentStatus("failure");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      setPaymentStatus("failure");
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    if (selectedPaymentMethod === "chuyenKhoan") {
      handleVnPayPayment();
    } else if (selectedPaymentMethod === "tienMat") {
      await handleSubmitOrder();
    }
  };

  const handleVnPayPayment = async () => {
    try {
      setIsLoading(true);

      // Random mã Order thanh toán VnPay
      const randomOrderInfo = `ORD_${Math.floor(
        Date.now() / 1000
      )}_${Math.floor(Math.random() * 100)}`;

      const response = await axios.post(
        "http://localhost:8080/api/order/createPayment",
        {
          amount: orderData.totals.totalAmount,
          orderInfo: randomOrderInfo,
        },
        {
          headers: { Authorization: `${Cookies.get("token")}` },
        }
      );

      if (response.status === 200) {
        window.location.href = response.data;
      } else {
        alert("Không thể thực hiện thanh toán qua VNPay.");
      }
    } catch (err) {
      console.error("Lỗi khi thanh toán qua VnPay:", err);
      alert("Đã xảy ra lỗi trong quá trình thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex border align-items-center px-3 py-2 bg-light">
        <i className="bi bi-credit-card-2-back-fill"></i>
        <strong className="ms-2 me-5">Phương thức thanh toán</strong>
        <select
          value={selectedPaymentMethod}
          onChange={handlePaymentChange}
          className="form-select"
          aria-label="Chọn phương thức thanh toán"
        >
          <option value="">Chọn phương thức thanh toán</option>
          <option value="tienMat">Tiền mặt</option>
          <option value="chuyenKhoan">Chuyển khoản (VnPay)</option>
        </select>
      </div>

      <div className="mt-3">
        <button
          className="btn btn-success"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Thanh toán"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;