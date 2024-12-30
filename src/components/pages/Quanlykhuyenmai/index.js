import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import moment from 'moment';
const QuanLyKhuyenMai = () => {
    const [formData, setFormData] = useState({
        tenKhuyenMai: '',
        giaTriKhuyenMai: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        active: true,
        ghiChu: '',
        shop: { id: '' },
    });
    function clearTime(date) {
        date.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây và mili-giây về 0
        return date;
    }
   
    const { idKhuyenMai } = useParams();
    const [edit, setEdit] = useState(true);

    function getDefaultNgayBatDau() {
        const now = new Date();
        return format(now, "yyyy-MM-dd'T'HH:mm");
    }

    function getDefaultNgayKetThuc(ngayKetThuc) {
        const now = new Date(ngayKetThuc);
        now.setHours(23, 59, 0, 0); // Thiết lập giờ 23:59
        return format(now, "yyyy-MM-dd'T'HH:mm");
    }

    function getFormatDateTime(date) {
        const now = new Date(date);
        return format(now, "dd/MM/yyyy");
    }

    async function getDataDisplayId() {

        const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai';
        const response = await axios.get(apiKhuyenMai + '/' + idKhuyenMai, formData);
        setFormData(response.data);
    }

    useEffect(() => {
        if (idKhuyenMai) {
            getDataDisplayId();
            setEdit(false);
        }

    }, [idKhuyenMai]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const token = Cookies.get('token');
    async function handleAdd() {
        // Kiểm tra bỏ trống các trường
        if (
            !formData.tenKhuyenMai.trim() ||
            !formData.giaTriKhuyenMai ||
            !formData.ngayBatDau ||
            !formData.ngayKetThuc ||
            !formData.ghiChu.trim()
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng điền đầy đủ thông tin khuyến mãi!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        // Kiểm tra giá trị khuyến mãi nằm trong khoảng 0 - 100
        if (formData.giaTriKhuyenMai <= 0 || formData.giaTriKhuyenMai > 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Giá trị khuyến mãi phải nằm trong khoảng từ 1% đến 100!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        const ngayHienTai = clearTime(new Date()); // Ngày hiện tại, đã clear giờ
        const ngayBatDau = clearTime(new Date(formData.ngayBatDau)); // Ngày bắt đầu, đã clear giờ
        const ngayKetThuc = clearTime(new Date(formData.ngayKetThuc)); // Ngày kết thúc, đã clear giờ

        console.log(ngayBatDau)
        console.log(ngayHienTai)
        console.log(ngayKetThuc)

        if (ngayBatDau < ngayHienTai) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        if (ngayKetThuc < ngayHienTai) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày kết thúc không được nhỏ hơn ngày hiện tại!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }
        if (ngayBatDau > ngayKetThuc) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const dataToSent = {
                tenKhuyenMai: formData.tenKhuyenMai,
                giaTriKhuyenMai: formData.giaTriKhuyenMai,
                ngayBatDau: formData.ngayBatDau,
                ngayKetThuc: getDefaultNgayKetThuc(formData.ngayKetThuc),
                active: true,
                ghiChu: formData.ghiChu,
            };
            console.log(dataToSent)
            const addData = await axios.post('http://localhost:8080/api/khuyenmai', dataToSent, {
                headers: {
                    'Authorization': token,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Thêm thành công!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            handleResetData();
        } catch (error) {
            console.error('Lỗi khi thêm khuyến mãi:', error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra!',
                text: 'Không thể thêm khuyến mãi. Vui lòng thử lại sau.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
        }
    }


   
    async function handleUpdate() {
        // Kiểm tra bỏ trống các trường
        if (
            !formData.tenKhuyenMai.trim() ||
            !formData.giaTriKhuyenMai ||
            !formData.ngayBatDau ||
            !formData.ngayKetThuc ||
            !formData.ghiChu.trim()
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Vui lòng điền đầy đủ thông tin khuyến mãi!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        // Kiểm tra giá trị khuyến mãi nằm trong khoảng 0 - 100
        if (formData.giaTriKhuyenMai <= 0 || formData.giaTriKhuyenMai > 80) {
            Swal.fire({
                icon: 'warning',
                title: 'Giá trị khuyến mãi phải nằm trong khoảng từ 1% đến 100!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        const ngayHienTai = clearTime(new Date()); // Ngày hiện tại, đã clear giờ
        const ngayBatDau = clearTime(new Date(formData.ngayBatDau)); // Ngày bắt đầu, đã clear giờ
        const ngayKetThuc = clearTime(new Date(formData.ngayKetThuc)); // Ngày kết thúc, đã clear giờ

        if (ngayBatDau < ngayHienTai) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        if (ngayKetThuc < ngayHienTai) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày kết thúc không được nhỏ hơn ngày hiện tại!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        if (ngayBatDau > ngayKetThuc) {
            Swal.fire({
                icon: 'warning',
                title: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
            return;
        }

        try {
            const dataToUpdate = {
                tenKhuyenMai: formData.tenKhuyenMai,
                giaTriKhuyenMai: formData.giaTriKhuyenMai,
                ngayBatDau: formData.ngayBatDau,
                ngayKetThuc: getDefaultNgayKetThuc(formData.ngayKetThuc),
                active: true,
                ghiChu: formData.ghiChu,
                shop: { id: parseInt(formData.shop.id) }, // Kiểm tra nếu cần đảm bảo `formData.shop.id` là số
            };

            const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai';
            const response = await axios.put(`${apiKhuyenMai}/${idKhuyenMai}`, dataToUpdate, {
                headers: {
                    Authorization: token,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công!',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });

            handleResetData();
        } catch (error) {
            console.error('Lỗi khi cập nhật khuyến mãi:', error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra!',
                text: 'Không thể cập nhật khuyến mãi. Vui lòng thử lại sau.',
                showConfirmButton: true,
                confirmButtonText: 'OK',
            });
        }
    }


    function handleResetData() {
        setFormData({
            tenKhuyenMai: '',
            soLuongKhuyenMai: '',
            giaTriKhuyenMai: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ghiChu: '',

        })
    }
    function getFormatDate(dateString) {
        if (!dateString) return ""; // Kiểm tra nếu không có giá trị
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; // Kiểm tra nếu không phải là ngày hợp lệ
        return format(date, 'yyyy-MM-dd');
    }
    function formatDateForInput(dateString) {
        return moment.utc(dateString).format('YYYY-MM-DD'); // Chuyển đổi sang định dạng phù hợp
    }




    return (
        <>
            <main className="container my-4">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        <div className="card shadow-sm">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h2 className="card-title mb-0 text-primary">Quản lý Khuyến Mãi</h2>
                                <a
                                    className="btn btn-primary"
                                    href="/user/shop-user"
                                >
                                    Trở Về Trang Shop
                                </a>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="tenKhuyenMai" className="form-label">Tên Khuyến Mãi:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập tên khuyến mãi"
                                        name="tenKhuyenMai"
                                        value={formData.tenKhuyenMai}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="giaTriKhuyenMai" className="form-label">Giá Trị Khuyến Mãi (Giảm giá %):</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Nhập giá trị"
                                        name="giaTriKhuyenMai"
                                        step="0.1"
                                        value={formData.giaTriKhuyenMai}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label htmlFor="ngayBatDau" className="form-label">Ngày Bắt Đầu:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayBatDau"
                                        value={getFormatDate(formData.ngayBatDau)}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngayKetThuc" className="form-label">Ngày Kết Thúc:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayKetThuc"
                                        value={getFormatDate(formData.ngayKetThuc)}
                                        onChange={handleChange}
                                    />
                                </div> */}

                                <div className="mb-3">
                                    <label htmlFor="ngayBatDau" className="form-label">Ngày và Giờ Bắt Đầu:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayBatDau"
                                        value={formatDateForInput(formData.ngayBatDau)}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ngayKetThuc" className="form-label">Ngày và Giờ Kết Thúc:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="ngayKetThuc"
                                        value={formatDateForInput(formData.ngayKetThuc)}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="ghiChu" className="form-label">Ghi Chú:</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Nhập ghi chú"
                                        name="ghiChu"
                                        rows="3"
                                        value={formData.ghiChu}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div>
                                    {edit ? (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary me-3 form-control"
                                                onClick={() => handleAdd()}
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary form-control mt-2"
                                                onClick={handleResetData}
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-primary me-3 form-control"
                                                onClick={handleUpdate}
                                            >
                                                Cập nhật
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary form-control mt-2"
                                                onClick={handleResetData}
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
};

export default QuanLyKhuyenMai;
