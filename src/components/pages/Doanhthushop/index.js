import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DoanhThu() {

    const [shop, setShop] = useState([]);
    const [doanhThu, setDoanhThu] = useState([]);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [error, setError] = useState("");
    const [year, setYear] = useState("");
    const [result, setResult] = useState(null);
    const [result2, setResult2] = useState(null);
    const [year2, setYear2] = useState("");
    const [month, setMonth] = useState("");

    const shopId = shop.id
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (!startDate || !endDate) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/thong-ke", {
                params: {
                    shopId,
                    startDate,
                    endDate,
                },
            });
            console.log(response)
            setTotalRevenue(response.data);
        } catch (err) {
            setError("Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại!");
            console.error(err);
        }
    };

    console.log(shop)
    console.log(doanhThu)
    useEffect(() => {
        const fetchShop = async () => {
            const token = Cookies.get("token");
            try {
                const response = await axios.get('http://localhost:8080/api/shops/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setShop(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin shop:", error);
            }
        };
        fetchShop();

    }, []);

    // useEffect(() => {
    //     if (shop) {
    //         const hienThiDoanhThu = async () => {
    //             try {
    //                 const apiDoanhThu = 'http://localhost:8080/api/shops/total-amount';
    //                 const response = await axios.get(`${apiDoanhThu}/${shop.id}`);
    //                 setDoanhThu(response.data);
    //             } catch (err) {
    //                 alert("Không hiển thị được doanh thu.");
    //             }
    //         };
    //         hienThiDoanhThu();
    //     }
    // }, [shop]);

    const handleSubmit2 = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.get("http://localhost:8080/api/thong-ke/nam", {
                params: { shopId, year },
            });
            setResult(response.data);
            console.log(response)
        } catch (err) {
            setError("Không thể lấy dữ liệu, vui lòng kiểm tra thông tin nhập vào.");
        }
    };
    const handleSubmit3 = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.get("http://localhost:8080/api/thong-ke/nam-thang", {
                params: { shopId, year2, month },
            });
            setResult2(response.data);
        } catch (err) {
            setError("Không thể lấy dữ liệu, vui lòng kiểm tra thông tin nhập vào.");
        }
    };
    return (
        <div className="container my-5">
            <div className="card mt-3">
                <div className="card-header">
                    <h2 className="text-center">Thống kê doanh thu theo thời gian</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
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
                        <div className="mb-3">
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
                        <button type="submit" className="btn btn-primary">
                            Thống kê
                        </button>
                    </form>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                    {totalRevenue !== null && (
                        <div className="mt-4">
                            <h3 className="text-success">Kết quả thống kê</h3>
                            <p>
                                Tổng doanh thu từ <strong>{startDate}</strong> đến{" "}
                                <strong>{endDate}</strong>:{" "}
                                <strong>{(totalRevenue || 0).toLocaleString()} VNĐ</strong>
                            </p>
                        </div>
                    ) }
                </div>
            </div>



            <div className="card mt-3">
                <div className="card-header">
                    <h1 className="text-center">Thống Kê Theo Năm</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit2}>
                        <div className="mb-3">
                            <label htmlFor="yearInput" className="form-label">
                                Năm:
                            </label>
                            <input
                                type="number"
                                id="yearInput"
                                className="form-control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Thống kê
                        </button>
                    </form>
                    {result !== null && (
                        <div className="mt-4">
                            <h2>Kết quả:</h2>
                            <p className="fs-5">{result}</p>
                        </div>
                    )}
                    {error && <p className="text-danger mt-3">{error}</p>}
                </div>
            </div>

            <div className="card mt-3">
                <div className="card-header">
                    <h1 className="text-center">Thống Kê Theo Năm Và Tháng</h1>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit3}>
                        <div className="mb-3">
                            <label htmlFor="yearInput2" className="form-label">
                                Năm:
                            </label>
                            <input
                                type="number"
                                id="yearInput2"
                                className="form-control"
                                value={year2}
                                onChange={(e) => setYear2(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="monthInput" className="form-label">
                                Tháng:
                            </label>
                            <input
                                type="number"
                                id="monthInput"
                                className="form-control"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                required
                                min="1"
                                max="12"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Thống kê
                        </button>
                    </form>
                    {result2 !== null && (
                        <div className="mt-4">
                            <h2>Kết quả:</h2>
                            <p className="fs-5">{result2}</p>
                        </div>
                    )}
                    {error && <p className="text-danger mt-3">{error}</p>}
                </div>
            </div>


            {/* <div className="card shadow-sm border-1">
                <div className="card-header  text-white d-flex justify-content-between align-items-center">
                    <h2 className="text-center">Doanh Thu Của Shop</h2>
                </div>
                <div className="card-body">
                    <table className="table table-hover table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Doanh Thu</th>

                            </tr>
                        </thead>
                        <tbody>


                            <tr >

                                <td>
                                    <h3>{doanhThu}</h3>

                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
}
