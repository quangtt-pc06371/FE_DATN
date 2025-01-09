import axios from "axios";
import React, { useState, useEffect } from "react";

export default function DanhSachNguoiDung() {
    const [data, setData] = useState([]);
    const [currentPageNoShop, setCurrentPageNoShop] = useState(1);
    const [currentPageHasShop, setCurrentPageHasShop] = useState(1);
    const [searchNoShop, setSearchNoShop] = useState("");
    const [searchHasShop, setSearchHasShop] = useState("");
    const itemsPerPage = 10;

    async function hienThiNguoiDung() {
        try {
            const apiNguoiDung = "http://localhost:8080/api/taikhoan";
            const response = await axios.get(apiNguoiDung);
            setData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        hienThiNguoiDung();
    }, []);

    // Lọc dữ liệu
    const filteredNoShop = data
        .filter((user) => user.shop === null)
        .filter((user) => user.hoTen.toLowerCase().includes(searchNoShop.toLowerCase()));

    const filteredHasShop = data
        .filter((user) => user.shop !== null)
        .filter((user) => user.hoTen.toLowerCase().includes(searchHasShop.toLowerCase()));

    // Tính số trang
    const totalPagesNoShop = Math.ceil(filteredNoShop.length / itemsPerPage);
    const totalPagesHasShop = Math.ceil(filteredHasShop.length / itemsPerPage);

    // Lấy dữ liệu theo trang
    const paginatedNoShop = filteredNoShop.slice(
        (currentPageNoShop - 1) * itemsPerPage,
        currentPageNoShop * itemsPerPage
    );

    const paginatedHasShop = filteredHasShop.slice(
        (currentPageHasShop - 1) * itemsPerPage,
        currentPageHasShop * itemsPerPage
    );

    // Chuyển trang
    const handlePageChangeNoShop = (page) => setCurrentPageNoShop(page);
    const handlePageChangeHasShop = (page) => setCurrentPageHasShop(page);

    return (
        <div className="container my-5 justify-content-center">
            {/* Danh sách người dùng chưa có shop */}
            <div className="card shadow w-100 mb-5">
                <div className="card-header bg-body-secondary text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Danh Sách Người Dùng Chưa Có Shop</h2>
                </div>
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchNoShop}
                        onChange={(e) => setSearchNoShop(e.target.value)}
                    />
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>STT</th>
                                <th>Tên Người Dùng</th>
                                <th>Email</th>
                                <th>Số Điện Thoại</th>
                                <th className="text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNoShop.map((user, index) => (
                                <tr key={user.id}>
                                    <td>
                                        {(currentPageNoShop - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td>{user.hoTen}</td>
                                    <td>{user.email}</td>
                                    <td>{user.sdt}</td>
                                    <td className="text-center">
                                        <button className="btn btn-danger">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPageNoShop === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChangeNoShop(1)}
                                    >
                                        Trang đầu
                                    </button>
                                </li>
                                {[...Array(totalPagesNoShop)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${
                                            currentPageNoShop === index + 1 ? "active" : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChangeNoShop(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPageNoShop === totalPagesNoShop ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChangeNoShop(totalPagesNoShop)}
                                    >
                                        Trang cuối
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Danh sách người dùng có shop */}
            <div className="card shadow w-100 mb-5">
                <div className="card-header bg-body-secondary text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Danh Sách Người Dùng Có Shop</h2>
                </div>
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchHasShop}
                        onChange={(e) => setSearchHasShop(e.target.value)}
                    />
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>STT</th>
                                <th>Tên Người Dùng</th>
                                <th>Email</th>
                                <th>Số Điện Thoại</th>
                                <th>Shop</th>
                                <th className="text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedHasShop.map((user, index) => (
                                <tr key={user.id}>
                                    <td>
                                        {(currentPageHasShop - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td>{user.hoTen}</td>
                                    <td>{user.email}</td>
                                    <td>{user.sdt}</td>
                                    <td>{user.shop.shopName}</td>
                                    <td className="text-center">
                                        <button className="btn btn-danger">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${currentPageHasShop === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChangeHasShop(1)}
                                    >
                                        Trang đầu
                                    </button>
                                </li>
                                {[...Array(totalPagesHasShop)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${
                                            currentPageHasShop === index + 1 ? "active" : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChangeHasShop(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPageHasShop === totalPagesHasShop ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChangeHasShop(totalPagesHasShop)}
                                    >
                                        Trang cuối
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
