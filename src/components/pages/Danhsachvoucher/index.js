import React from "react";

const DanhSachVoucher = () => {
    const vouchers = [
        {
            idvoucher: 1,
            giamGia: 10,
            soLuong: 50,
            donToiThieu: 500000,
            ngayBatDau: "2025-01-01",
            ngayHetHan: "2025-02-01",
            nguoiDung: "Người dùng 1",
        },
        {
            idvoucher: 2,
            giamGia: 15,
            soLuong: 30,
            donToiThieu: 1000000,
            ngayBatDau: "2025-01-15",
            ngayHetHan: "2025-03-01",
            nguoiDung: "Người dùng 2",
        },
    ];

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="card shadow w-100 mb-5">
                <div className="card-header bg-body-secondary  text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Danh Sách Voucher</h2>
                    <a href="/quanlyvoucher" className="btn btn-success">Thêm Voucher</a>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Giảm Giá (%)</th>
                                <th>Số Lượng</th>
                                <th>Đơn Tối Thiểu (VNĐ)</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Hết Hạn</th>
                                <th>Người Dùng</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher, index) => (
                                <tr key={voucher.idvoucher}>
                                    <td>{index + 1}</td>
                                    <td>{voucher.giamGia}</td>
                                    <td>{voucher.soLuong}</td>
                                    <td>{voucher.donToiThieu.toLocaleString()}</td>
                                    <td>{voucher.ngayBatDau}</td>
                                    <td>{voucher.ngayHetHan}</td>
                                    <td>{voucher.nguoiDung}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2">Sửa</button>
                                        <button className="btn btn-danger btn-sm">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DanhSachVoucher;



