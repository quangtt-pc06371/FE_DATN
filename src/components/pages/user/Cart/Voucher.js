import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import thư viện js-cookie

function VoucherModal({ idDonHang, totalDonHang, onVoucherSelect }) {
  const [vouchers, setVouchers] = useState([]); // Lưu danh sách các voucher
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Lưu voucher đã chọn
  const [setError] = useState(""); // Lỗi khi gọi API
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị modal
  const [setDiscount] = useState(0); // Giảm giá từ voucher
  const [setIsVoucherApplied] = useState(false); // Trạng thái khi voucher đã được áp dụng
  const [setUpdatedTotal] = useState(totalDonHang); // Tổng tiền sau khi áp dụng

  // Hàm lấy danh sách voucher từ API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("Vui lòng đăng nhập.");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/voucherbills/list",
          {
            headers: { Authorization: `${token}` },
          }
        );

        setVouchers(response.data); // Lưu danh sách voucher vào state
      } catch (err) {
        console.error("Lỗi khi lấy danh sách voucher:", err.message);
        setError("Không thể tải danh sách khuyến mãi.");
      }
    };

    fetchVouchers();
  });

  // Xử lý khi chọn voucher
  const handleVoucherSelect = (voucher) => {
    onVoucherSelect(voucher); // Gửi voucher đã chọn về component cha
    setSelectedVoucher(voucher);
  };

  // Xử lý áp dụng voucher
  const handleApplyVoucher = async () => {
    if (!selectedVoucher) {
      setError("Vui lòng chọn voucher.");
      return;
    }

    // Kiểm tra điều kiện voucher
    if (totalDonHang < selectedVoucher.donToiThieu) {
      setError("Tổng đơn hàng không đủ điều kiện áp dụng voucher.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/order/apply-voucher?donHangId=${idDonHang}&voucherId=${selectedVoucher.idvoucher}`,
        {},
        {
          headers: { Authorization: `${Cookies.get("token")}` },
        }
      );

      const { discountAmount } = response.data;
      setDiscount(discountAmount);

      // Cập nhật tổng tiền
      const discountedTotal = totalDonHang - discountAmount;
      setUpdatedTotal(discountedTotal > 0 ? discountedTotal : 0);

      // Đánh dấu voucher đã được áp dụng
      setIsVoucherApplied(true);
      setShowModal(false); // Đóng modal
    } catch (err) {
      console.error("Lỗi khi áp dụng voucher:", err.message);
      setError("Voucher không hợp lệ hoặc đã hết hạn.");
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
