import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DoanhThu() {
    const [shop, setShop] = useState([]);
    const [products, setProducts] = useState([]);
    const [cthoadons, setcthoadon] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalRevenue, setTotalRevenue] = useState([]);
    const [error, setError] = useState("");

    console.log(products)
    const shopId = shop.id;

    useEffect(() => {
        const fetchShop = async () => {
            const token = Cookies.get("token");
            try {
                const response = await axios.get("http://localhost:8080/api/shops/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setShop(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin shop:", error);
            }
        };
        fetchShop();
    }, []);

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
            const revenueResponse = await axios.get("http://localhost:8080/api/thong-ke", {
                params: { shopId, startDate, endDate },
            });
            setTotalRevenue(revenueResponse.data);

            const productsResponse = await axios.get("http://localhost:8080/api/thong-ke/hoadon", {
                params: { shopId, startDate, endDate },
            });
            setProducts(productsResponse.data);
        } catch (err) {
            setError("Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại!");
            console.error(err);
        }
    };

    const handleDetail = async (idDonHang) => {
        try {
            const response = await axios.get("http://localhost:8080/api/thong-ke/cthoadon", {
                params: { idDonHang },
            });
            setcthoadon(response.data);
        } catch (err) {
            setError("Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại!");
            console.error(err);
        }
    };
    console.log(products)
    return (
        <div className="container my-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white text-center">
                    <h2>
                        <i className="fas fa-chart-line me-2"></i>Thống kê doanh thu
                    </h2>
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
                                    required
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
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success mt-3 w-100">
                            <i className="fas fa-search"></i> Thống kê
                        </button>
                    </form>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {totalRevenue !== null && (
                        <div className="mt-4">
                            <h4 className="text-center text-success">
                                Tổng doanh thu: {totalRevenue.toLocaleString("vi-VN")} VNĐ
                            </h4>
                            <div className="table-responsive mt-3">
                                <h5>Danh sách hóa đơn:</h5>
                                <table className="table table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Tổng tiền</th>
                                            <th>Tên khách hàng</th>
                                            <th>Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products?.map((product, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{product?.chiTietDonHangs[0]?.tongTien.toLocaleString("vi-VN")} VNĐ</td>
                                                <td>{product?.taiKhoanEntity?.hoTen}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-info"
                                                        onClick={() => handleDetail(product?.idDonHang)}
                                                    >
                                                        Xem
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {cthoadons.length > 0 && (
                                <div className="table-responsive mt-4">
                                    <h5>Chi tiết hóa đơn:</h5>
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Số lượng</th>
                                                <th>Sản phẩm</th>
                                                <th>Tổng tiền</th>
                                                <th>Ảnh</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cthoadons.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
