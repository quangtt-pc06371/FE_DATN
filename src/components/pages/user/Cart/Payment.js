import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const navigate = useNavigate();
  const paymentSuccess = "tienMatSuccess";
  const paymentFail = "failure";
  const orderData = JSON.parse(localStorage.getItem("order"));
  const shippingFeeID = JSON.parse(localStorage.getItem("shippingFeeID"))
  const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
  const handlePaymentChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  async function getSanPhamKhuyenMai() {
    try {
      const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
      setSanPhamKhuyenMaiForm(response.data);
    } catch (error) {

    }
  }
  useEffect(() => {
    getSanPhamKhuyenMai();

  }, []);
  console.log(orderData)
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
        hinhThucThanhToan: selectedPaymentMethod === "chuyenKhoan",

        // Lấy phí vận chuyển từ orderData.shippingFees theo shopName
        phiVanChuyen: shippingFeeID, // Lấy phí vận chuyển cho shop hiện tại
        trangThaiDonHang: 0,
        ngayXuatDon: new Date().toISOString(), // Thiết lập ngày giờ hiện tại
        chiTietDonHangs: orderData.cartData.map((item) => {

          const giaGoc = item.skuEntity.giaSanPham || 0;

          const doiTuongSanPhamKM = sanPhamKhuyenMaiForm.find(
            (kmItem) => kmItem.sanPham.idSanPham === item.sanPhamEntity.idSanPham
          );

          let giaSauKhuyenMai = giaGoc;
          let khuyenMaiConHieuLuc = true;

          if (doiTuongSanPhamKM) {
            giaSauKhuyenMai = giaGoc - (giaGoc * (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai / 100));
            khuyenMaiConHieuLuc = true;
          }

          const tongTien = khuyenMaiConHieuLuc
            ? giaSauKhuyenMai * item.soLuongMua
            : giaGoc * item.soLuongMua;
          return {
            idSku: item.skuEntity.idSku,
            soLuong: item.soLuongMua,
            idVoucher: 2,
            tongTien: tongTien,
            sanPhamDTO: {
              idShop: item.sanPhamEntity.shop.id,
              tenSanPham: item.sanPhamEntity.tenSanPham,
              canNang: item.sanPhamEntity.canNang,
            },
          };
        }),
      };
      console.log(payload)
      const response = await axios.post(
        "http://localhost:8080/api/order/create",
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (response.status === 200) {
        navigate(`/transaction-result?status=${paymentSuccess}`);
      } else {
        setPaymentStatus("failure");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      navigate(`/transaction-result?status=${paymentFail}`);
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
