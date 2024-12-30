import React, { useState } from "react";
import axios from "axios";
import { BASE_URL, API, CART } from "./api";
import Cookies from "js-cookie";

const CartItem = ({ product, onSkuChange, onSelect, deleteDetail }) => {
  const [quantity, setQuantity] = useState(product.soLuongMua || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skuList, setSkuList] = useState(product.sanPhamEntity.skus);
  const [selectedSku, setSelectedSku] = useState(product.skuEntity.idSku);
  const [modalQuantity, setModalQuantity] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Xử lý khi chọn SKU
  const handleSkuSelect = (sku) => {
    setSelectedSku(sku.idSku); // Cập nhật SKU đã chọn
  };

  // Xử lý khi thay đổi số lượng sản phẩm
  const handleSkuChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onSkuChange(product.idDetail, newQuantity, selectedSku);
  };

  const handleIncrease = () => handleSkuChange(quantity + 1);
  const handleDecrease = () => handleSkuChange(quantity - 1);

  // Lưu SKU và số lượng
  const saveSku = async () => {
    if (!selectedSku || modalQuantity < 1) {
      alert("Vui lòng chọn SKU và số lượng hợp lệ.");
      return;
    }
    setQuantity(modalQuantity);
    setIsLoading(true);

    const payload = {
      detailId: product.idDetail,
      newQuantity: modalQuantity,
      newSkuId: selectedSku,
    };

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        return;
      }
      const response = await axios.put(
        `${BASE_URL}${API.Cart}${CART.Update}`,
        null,
        {
          params: payload,
          headers: { Authorization: `${token}` },
        }
      );

      console.log("Phản hồi từ Backend:", response.data);
      closeModal();
      handleSkuChange(modalQuantity); // Cập nhật số lượng sau khi lưu
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err.response?.data || err.message);
      setError("Không thể cập nhật. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); // Đặt lại lỗi khi đóng modal
  };

  // Xử lý thay đổi số lượng trong modal
  const handleModalQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setModalQuantity(value > 0 ? value : 1); // Đảm bảo số lượng tối thiểu là 1
  };

  return (
    <>
      {/* Dòng giỏ hàng chi tiết */}
      <div>
        <div className="card mb-3">
          <div className="row g-0 align-items-center px-3 py-2 bg-light">
            {/* Cột checkbox */}
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <input
                className="form-check-input border shadow-sm"
                type="checkbox"
                checked={product.isSelected || false} // Trạng thái của checkbox con
                onChange={() => onSelect(product.idDetail)} // Gọi hàm xử lý khi nhấn vào checkbox con
              />
            </div>

            {/* Hình ảnh sản phẩm */}
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <img
                // src={product.skuEntity.hinhAnh[0]?.tenAnh}
                src="https://dosi-in.com/images/detailed/42/CDL3_1.jpg"
                alt=""
                className="img-fluid"
                style={{ width: "80px", height: "80px" }} // Kích thước hình ảnh 80x80
              />
            </div>

            {/* Tên Sản Phẩm */}
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              {product.sanPhamEntity.tenSanPham}
            </div>

            {/* Nút tùy chọn */}
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <button
                onClick={openModal}
                className="btn btn-info btn-sm w-100 h-auto"
                style={{ minWidth: "120px", height: "40px" }}
              >
                {
                  product.skuEntity.tuyChonThuocTinhSku[0].tuyChonThuocTinh
                    .giaTri
                }{" "}
                -
                {
                  product.skuEntity.tuyChonThuocTinhSku[0].tuyChonThuocTinh
                    .thuocTinh.ten
                }
              </button>
            </div>

            {/* Đơn giá */}
            <div className="col-lg-3 d-flex align-items-center justify-content-center">
              <strong>
                {product.skuEntity.giaSanPham.toLocaleString()} VND{" "}
              </strong>
            </div>

            {/* Số lượng */}
            <div className="col-lg-2 d-flex align-items-center justify-content-center">
              <div className="d-flex align-items-center">
                <button
                  onClick={handleDecrease} // Đảm bảo số lượng tối thiểu là 1
                  className="btn btn-outline-secondary btn-sm-1"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  min="1"
                  onChange={(e) =>
                    handleSkuChange(parseInt(e.target.value, 10))
                  }
                  className="form-control mx-2"
                />
                <button
                  onClick={handleIncrease}
                  className="btn btn-outline-secondary btn-sm-1"
                >
                  +
                </button>
              </div>
            </div>

            {/* Thành tiền */}
            <div className="col-lg-2 d-flex align-items-center justify-content-center">
              <strong>
                {(product.skuEntity.giaSanPham * quantity).toLocaleString()} VND
              </strong>
            </div>

            {/*Xóa Detail*/}
            <div className="col-md-1 d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteDetail(product.idDetail)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal và các phần khác */}
      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn SKU</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {error && <p className="text-danger">{error}</p>}

                {/* Kiểm tra nếu skuList có giá trị */}
                {skuList && skuList.length > 0 ? (
                  <ul className="list-group">
                    {skuList.map((sku) => (
                      <li
                        key={sku.idSku}
                        className={`list-group-item ${
                          sku.idSku === selectedSku ? "active" : ""
                        }`}
                        onClick={() => handleSkuSelect(sku)}
                      >
                        {/* Hiển thị các tùy chọn thuộc tính SKU */}
                        {sku.tuyChonThuocTinhSku.map((tt) => (
                          <span key={tt.idTuyChonTtSku}>
                            {tt.tuyChonThuocTinh.giaTri} -
                            {tt.tuyChonThuocTinh.thuocTinh.ten}
                          </span>
                        ))}
                        <br />
                        Giá: {sku.giaSanPham.toLocaleString()} VND
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có SKU nào để chọn.</p>
                )}

                <div className="mt-3">
                  <label>Số lượng:</label>
                  <input
                    type="number"
                    value={modalQuantity}
                    min="1"
                    onChange={handleModalQuantityChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveSku}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang lưu..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
