import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
const QuanLyKhuyenMai = () => {
    const [formData, setFormData] = useState({
        tenKhuyenMai: '',
        giaTriKhuyenMai: '',
        ngayBatDau: '',
        ngayKetThuc: '',
        active: true,
        ghiChu: '',
        shop: { id: '' }
    }
    );
    const [shopForm, setShopForm] = useState([]);
    const { idKhuyenMai } = useParams();
    const [edit, setEdit] = useState(true);



    async function layShop() {
        const response = await axios.get('http://localhost:8080/api/shop');
        setShopForm(response.data);
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
        layShop();
    }, [idKhuyenMai]);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleAdd() {
        const dataToSent = {
            tenKhuyenMai: formData.tenKhuyenMai,
         
            giaTriKhuyenMai: formData.giaTriKhuyenMai,
            ngayBatDau: formData.ngayBatDau,
            ngayKetThuc: formData.ngayKetThuc,
            active: true,
            ghiChu: formData.ghiChu,
            shop: { id: parseInt(formData.shop) }
        }
        const addData = await axios.post('http://localhost:8080/api/khuyenmai', dataToSent);
        alert('Thêm thành công', addData.data);
        handleResetData();


    }
console.log(shopForm)
    async function handleUpdate() {
        const dataToUpdate = {
            tenKhuyenMai: formData.tenKhuyenMai,
            giaTriKhuyenMai: formData.giaTriKhuyenMai,
            ngayBatDau: formData.ngayBatDau,
            ngayKetThuc: formData.ngayKetThuc,
            active: true,
            ghiChu: formData.ghiChu,
            shop: { id: parseInt(formData.shop.id) }
        }
        console.log(dataToUpdate)
        const apiKhuyenMai = 'http://localhost:8080/api/khuyenmai';
        await axios.put(apiKhuyenMai + '/' + idKhuyenMai, dataToUpdate);
        alert('Sửa thành công');
        handleResetData();
    }

    function handleResetData() {
        setFormData({
            tenKhuyenMai: '',
            soLuongKhuyenMai: '',
            giaTriKhuyenMai: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            ghiChu: '',
            shop: { id: '' }
        })
    }
    function getFormatDate(dateString) {
        if (!dateString) return ""; // Kiểm tra nếu không có giá trị
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; // Kiểm tra nếu không phải là ngày hợp lệ
        return format(date, 'yyyy-MM-dd');
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
                                    href="/danhsachkhuyenmai"
                                >
                                    Danh Sách Khuyến Mãi
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
                                <div className="mb-3">
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
                                <div className="mb-3">
                                    <label htmlFor="">Shop khuyến mãi:</label>
                                    <select
                                        className="form-control"
                                        name="shop"
                                        value={formData.shop.id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn Shop</option>
                                        {shopForm.map((s) => (
                                            <option key={s.id} value={s.id}>{s.shopName}</option>
                                        ))}
                                    </select>
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
