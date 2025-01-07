import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import moment from 'moment';
export default function DanhSachkhuyenMai() {
    const [shop, setShop] = useState(null);
    const [dataKhuyenMai, setDataKhuyenMai] = useState([]);

    async function hienThiKhuyenMai() {
        try {
            const apiShop = 'http://localhost:8080/api/khuyenmai/shop';
            const response = await axios.get(apiShop + '/' + shop.id);
            setDataKhuyenMai(response.data);

        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteKhuyenMaiHetHan(id) {
        const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai/updatetrangthai';
        await axios.put(apiKhuyenMai + '/' + id);

    }

    function formatDateKeepUTC(dateString) {
        return moment.utc(dateString).format('DD/MM/YYYY');
    }

    async function handleDeleteKhuyenMai(id) {
        // Hiển thị thông báo xác nhận trước khi xóa
        const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        // Nếu người dùng xác nhận, thực hiện xóa
        if (result.isConfirmed) {
            const apiKhuyenMai = "http://localhost:8080/api/khuyenmai/updatetrangthai";
            try {
                await axios.put(`${apiKhuyenMai}/${id}`);
                Swal.fire({
                    icon: "success",
                    title: "Khuyến mãi đã được xóa",
                });
                hienThiKhuyenMai();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Đã xảy ra lỗi",
                    text: "Không thể xóa khuyến mãi. Vui lòng thử lại sau.",
                });
            }
        }
    }

    useEffect(() => {
        if (shop && shop.id) {
            hienThiKhuyenMai();
        }
    }, [shop]);

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

    return (
        <div className="container my-5 d-flex justify-content-center">
        <div className="card shadow w-100 mb-5">
            <div className="card-header bg-body-secondary  text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Danh Sách Khuyến Mãi</h2>
                    <a href="/quanlykhuyenmai" className="btn btn-success">Thêm Khuyến Mãi</a>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>STT</th>
                                <th>Tên Khuyến Mãi</th>
                                <th>Giá Trị (%)</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Ghi Chú</th>
                                <th>Shop</th>

                                <th className="text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataKhuyenMai.filter(khuyenMai => khuyenMai.active !== false).map((khuyenMai, filteredIndex) => {
                                const now = new Date();
                                // Chuyển đổi ngày bắt đầu và kết thúc của khuyến mãi thành đối tượng Date
                                const endDate = new Date(khuyenMai.ngayKetThuc);
                                console.log(now);
                                console.log(endDate);

                                // Kiểm tra nếu khuyến mãi còn hạn hay hết hạn
                                const khuyenMaiDaHetHan = now > endDate;
                                if (khuyenMaiDaHetHan) {
                                    handleDeleteKhuyenMaiHetHan(khuyenMai.idKhuyenMai);
                                }

                                return (
                                    <tr key={khuyenMai.idKhuyenMai}>
                                        <td>{filteredIndex + 1}</td> {/* Sử dụng filteredIndex để duy trì thứ tự liên tục */}
                                        <td>{khuyenMai.tenKhuyenMai}</td>
                                        <td>{khuyenMai.giaTriKhuyenMai}%</td>
                                        <td>{formatDateKeepUTC(khuyenMai.ngayBatDau)}</td>
                                        <td>{formatDateKeepUTC(khuyenMai.ngayKetThuc)}</td>
                                        <td>{khuyenMai.ghiChu}</td>
                                        <td>{khuyenMai.shop.shopName}</td>
                                        <td className="text-center">
                                            <a className="btn btn-warning me-2" href={`/quanlykhuyenmai/${khuyenMai.idKhuyenMai}`}>Sửa</a>
                                            <button className="btn btn-danger" onClick={() => handleDeleteKhuyenMai(khuyenMai.idKhuyenMai)}>Xóa</button>
                                           <div className="mt-3"> 
                                           <a className="btn btn-primary " href={`/sanphamkhuyenmai/${khuyenMai.idKhuyenMai}`}>Thêm Chương Trình Khuyến Mãi</a>
                                           </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );



};


