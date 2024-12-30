import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import thư viện js-cookie

function VoucherModal({ totalDonHang, onTotalUpdate }) {
  const [vouchers, setVouchers] = useState([]); // Lưu danh sách các voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Lưu voucher đã chọn
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị modal
  const [isVoucherApplied, setIsVoucherApplied] = useState(false); // Trạng thái khi voucher đã được áp dụng
  const [updatedTotal, setUpdatedTotal] = useState(totalDonHang); // Tổng tiền sau khi áp dụng

  // Hàm lấy danh sách voucher từ API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          alert("Vui lòng đăng nhập.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/voucherbills/list",
          {
            headers: { Authorization: `${token}` },
          }
        );

        setVouchers(response.data.vouchers); // Lưu danh sách voucher vào state
      } catch (err) {
        console.error("Lỗi khi lấy danh sách voucher:", err.message);
        alert("Không thể tải danh sách khuyến mãi.");
      }
    };

    fetchVouchers();
  }, []); // Chạy chỉ một lần khi component mount

  // Xử lý khi chọn voucher
  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
  };

  // Xử lý áp dụng voucher
  const handleApplyVoucher = async () => {
    if (!selectedVoucher) {
      alert("Vui lòng chọn voucher.");
      return;
    }

    // Kiểm tra điều kiện voucher
    if (totalDonHang < selectedVoucher.donToiThieu) {
      alert("Tổng đơn hàng không đủ điều kiện áp dụng voucher.");
      return;
    }

    try {
      // Cập nhật tổng tiền sau khi giảm giá
      const discountedTotal = totalDonHang * (vouchers.giamGia / 100);
      setUpdatedTotal(discountedTotal > 0 ? discountedTotal : 0);

      // Cập nhật lại tổng tiền cho component cha (updatedTotal)
      if (updatedTotal) {
        onTotalUpdate(discountedTotal > 0 ? discountedTotal : 0);
      }

      // Đánh dấu voucher đã được áp dụng
      setIsVoucherApplied(true);
      setShowModal(false); // Đóng modal

      // Lưu thông tin đơn hàng vào localStorage
      const existingOrder = JSON.parse(localStorage.getItem("order")) || {};
      const updatedOrder = {
        ...existingOrder,
        voucher: selectedVoucher.idvoucher, // Lưu thông tin voucher đã áp dụng
      };
      localStorage.setItem("order", JSON.stringify(updatedOrder));

      alert("Voucher đã được áp dụng thành công!");
    } catch (err) {
      console.error("Lỗi khi áp dụng voucher:", err.message);
      alert("Voucher không hợp lệ hoặc đã hết hạn.");
    }
  };

  return (
    <div className="container">
      {/* Nút để mở modal */}
      {selectedVoucher ? (
        <button className="btn btn-success" disabled>
          Đã áp dụng voucher - {selectedVoucher.idvoucher}
        </button>
      ) : (
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Chọn Voucher
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className={`modal fade show`}
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="voucherModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn Voucher</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {vouchers.length > 0 ? (
                  <ul className="list-group">
                    {vouchers.map((voucher) => (
                      <li
                        key={voucher.idvoucher}
                        className={`list-group-item ${
                          voucher.idvoucher === selectedVoucher?.idvoucher
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleVoucherSelect(voucher)}
                      >
                        <strong>{voucher.idvoucher}</strong> - Giảm{" "}
                        {voucher.giamGia}% | Đơn tối thiểu:{" "}
                        {voucher.donToiThieu.toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có voucher nào.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApplyVoucher}
                >
                  Áp Dụng Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherModal;
