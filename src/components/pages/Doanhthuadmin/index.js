import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DoanhThu() {
    const [cthoadons, setcthoadon] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!startDate || !endDate) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/thong-ke/chitietdonhang", {
                params: {
                    startDate,
                    endDate,
                },
            });
            setcthoadon(response.data);
        } catch (err) {
            setError("Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại!");
            console.error(err);
        }
    };

    const groupedOrders = cthoadons.reduce((acc, item) => {
        const shopName = item.sanPhamEntity.shop.shopName;
        if (!acc[shopName]) acc[shopName] = [];
        acc[shopName].push(item);
        return acc;
    }, {});
    
    // Tính tổng tiền và triết khấu cho từng shop
    const shopDiscounts = Object.keys(groupedOrders).map((shopName) => {
        const totalAmount = groupedOrders[shopName].reduce((sum, order) => sum + order.tongTien, 0);
        const discount = totalAmount * 0.05; // 5% triết khấu
        const finalAmount = totalAmount - discount;
        

        return { shopName, totalAmount, discount, finalAmount };
    });
    const totalDiscount = shopDiscounts.reduce((sum, shop) => sum + shop.discount, 0);

    return (
        <div className="container my-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h2 className="text-center">Thống kê doanh thu theo thời gian</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="startDate" className="form-label">
                                    Ngày bắt đầu
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="form-control"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    // required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="endDate" className="form-label">
                                    Ngày kết thúc
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="form-control"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    // required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success mt-3 w-100">
                            <i className="fas fa-chart-line"></i> Thống kê
                        </button>
                    </form>
    
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
    
                    {/* Hiển thị tổng triết khấu */}
                    <div className="alert alert-info mt-4">
                        <h4>Tổng số tiền triết khấu: {totalDiscount.toLocaleString("vi-VN")} VNĐ</h4>
                    </div>
    
                    <div className="accordion mt-4" id="accordionExample">
                        {Object.keys(groupedOrders).map((shopName, index) => {
                            const shopData = shopDiscounts.find((shop) => shop.shopName === shopName);
    
                            return (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${index}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse-${index}`}
                                        >
                                            <strong>{shopName}</strong>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${index}`}
                                        className="accordion-collapse collapse show"
                                        aria-labelledby={`heading-${index}`}
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <p>
                                                <strong>Tổng tiền: </strong>
                                                {shopData.totalAmount.toLocaleString("vi-VN")} VNĐ
                                            </p>
                                            <p>
                                                <strong>Triết khấu (5%): </strong>
                                                -{shopData.discount.toLocaleString("vi-VN")} VNĐ
                                            </p>
                                            <p>
                                                <strong>Sau triết khấu: </strong>
                                                {shopData.finalAmount.toLocaleString("vi-VN")} VNĐ
                                            </p>
    
                                            <table className="table table-striped table-hover">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Số lượng</th>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Ảnh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupedOrders[shopName].map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>{idx + 1}</td>
                                                            <td>{item.soLuong}</td>
                                                            <td>{item.sanPhamEntity.tenSanPham}</td>
                                                            <td>{item.tongTien.toLocaleString("vi-VN")} VNĐ</td>
                                                            <td>
                                                                <img
                                                                    src={item?.skuEntity?.hinhAnh?.tenAnh}
                                                                    alt="Sản phẩm"
                                                                    className="img-thumbnail"
                                                                    style={{ width: "80px", height: "80px" }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
