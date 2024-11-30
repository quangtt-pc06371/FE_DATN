import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Checkout({ orders, totalDonHang }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Tạo navigate hook

  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === "") {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    if (selectedPaymentMethod === "chuyenKhoan") {
      // Nếu chọn chuyển khoản, xử lý với VnPay (hoặc API thanh toán chuyển khoản)
      handleVnPayPayment();
    } else if (selectedPaymentMethod === "tienMat") {
      // Nếu chọn tiền mặt, thực hiện thanh toán tiền mặt
      handleCashPayment();
    }
  };

  const handleVnPayPayment = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/order/vnpay", // API thanh toán VNPay
        { amount: totalDonHang, orderId: orders[0].idDonHang } // Dữ liệu cần gửi cho VNPay
      );

      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = response.data; // URL thanh toán VNPay trả về từ API
    } catch (err) {
      console.error("Lỗi khi thanh toán qua VnPay:", err);
      alert("Đã xảy ra lỗi trong quá trình thanh toán.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashPayment = () => {
    alert("Thanh toán tiền mặt thành công!");
    // navigate("/cart")
    // Xử lý thanh toán tiền mặt (có thể gọi API để cập nhật trạng thái đơn hàng)
  };

  return (
    <div>
      {/* Phương thức thanh toán */}
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

      {/* Nút thanh toán */}
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
