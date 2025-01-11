import React from "react";

export default function QuanLyVoucher() {
  return (
    <main className="container my-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0 text-primary">Thêm Voucher</h2>
              <a
                className="btn btn-primary"
                href="/shop/shop-user"
              >
                Trở Về Trang Shop
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="giamGia" className="form-label">
                    Giảm Giá (%)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="giamGia"
                    placeholder="Nhập giảm giá"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="soLuong" className="form-label">
                    Số Lượng
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="soLuong"
                    placeholder="Nhập số lượng"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="donToiThieu" className="form-label">
                    Đơn Tối Thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="donToiThieu"
                    placeholder="Nhập đơn tối thiểu"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ngayBatDau" className="form-label">
                    Ngày Bắt Đầu
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="ngayBatDau"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="ngayHetHan" className="form-label">
                    Ngày Hết Hạn
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="ngayHetHan"
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    Thêm Voucher
                  </button>
                  <button type="reset" className="btn btn-secondary">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
