import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { format } from "date-fns";


export default function DanhSachkhuyenMai() {

    const [data, setData] = useState([]);

    async function hienThi() {
        const response = await axios.get('http://localhost:8080/api/khuyenmai');
        setData(response.data);
    }

    function getFormatDate(dateString) {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy');
    }

    async function handleDelete(id) {
        const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai';
        await axios.delete(apiKhuyenMai + '/' + id);
        hienThi();
        alert("Xóa thành công")
    }

    useEffect(() => {
        hienThi();
    }, []);

    return (
        <div className="container my-5 d-flex justify-content-center">
            <div className="card shadow" style={{ maxWidth: '900px', width: '100%' }}>
                <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Danh Sách Khuyến Mãi</h2>
                    <a href="/khuyenmai/them" className="btn btn-success">Thêm Khuyến Mãi</a>
                </div>
                <div className="card-body">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tên Khuyến Mãi</th>
                                <th>Số Lượng</th>
                                <th>Giá Trị (%)</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Ghi Chú</th>
                                <th>Shop</th>
                                <th>Hạn Sử Dụng</th>
                                <th className="text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(khuyenMai => (
                                <tr key={khuyenMai.idKhuyenMai}>
                                    <td>{khuyenMai.idKhuyenMai}</td>
                                    <td>{khuyenMai.tenKhuyenMai}</td>
                                    <td>{khuyenMai.soLuongKhuyenMai}</td>
                                    <td>{khuyenMai.giaTriKhuyenMai}%</td>
                                    <td>{getFormatDate(khuyenMai.ngayBatDau)}</td>
                                    <td>{getFormatDate(khuyenMai.ngayKetThuc)}</td>
                                    <td>{khuyenMai.ghiChu}</td>
                                    <td>{khuyenMai.shop.shopName}</td>
                                    <td>{khuyenMai.active ? "Còn hạn" : "Hết hạn"}</td>
                                    <td className="text-center">
                                        <div className="mb-1">                     <a className="btn btn-warning " href={`/khuyenmai/${khuyenMai.idKhuyenMai}`}>Sửa</a></div>
                                        <button className="btn btn-danger" onClick={() => handleDelete(khuyenMai.idKhuyenMai)}>Xóa</button>
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


