import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

export default function ThongKeDanhMucShopNguoiDung() {
    const [tongDanhMuc, setTongDanhMuc] = useState(0);
    const [tongShop, setTongShop] = useState(0);
    const [tongNguoiDung, setTongNguoiDung] = useState(0);

    // Lấy tổng số lượng danh mục
    async function getThongKeDanhMuc() {
        try {
            const response = await axios.get("http://localhost:8080/api/danhmuc/count");
            setTongDanhMuc(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thống kê danh mục:", error);
        }
    }

    // Lấy tổng số lượng shop
    async function getThongKeShop() {
        try {
            const response = await axios.get("http://localhost:8080/api/shop/count");
            setTongShop(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thống kê shop:", error);
        }
    }

    // Lấy tổng số lượng người dùng
    async function getThongKeNguoiDung() {
        const response = await axios.get("http://localhost:8080/api/tongnguoidung/count");
        setTongNguoiDung(response.data);
    }

    console.log(tongNguoiDung)
    // Gọi API khi component được mount
    useEffect(() => {
        getThongKeDanhMuc();
        getThongKeShop();
        getThongKeNguoiDung();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Chi Tiết Thống Kê</h2>
            <table className="table table-bordered ">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Loại Thống Kê</th>
                        <th>Tổng Số Lượng</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Danh Mục</td>
                        <td>{tongDanhMuc}</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Shops</td>
                        <td>{tongShop}</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Người Dùng</td>
                        <td>{tongNguoiDung}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
