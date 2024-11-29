import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VoucherForm.css';

function VoucherForm({ voucherToEdit, onSave, onCancel }) {
    const [voucher, setVoucher] = useState({
        tenVoucher: '', // Thêm trường Tên Voucher
        giamGia: '',
        soLuong: '',
        ngaybatdau: '',
        ngayHetHan: '',
        donToiThieu: '',
        user: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (voucherToEdit) {
            setVoucher(voucherToEdit);
        }
    }, [voucherToEdit]);

    const handleChange = (e) => {
        setVoucher({ ...voucher, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các điều kiện hợp lệ
        if (!voucher.tenVoucher.trim()) {
            setError('Tên voucher không được để trống');
            return;
        }
        if (voucher.giamGia > 50) {
            setError('Giảm giá không được vượt quá 50%');
            return;
        }
        if (voucher.donToiThieu <= 0) {
            setError('Đơn tối thiểu phải lớn hơn 0');
            return;
        }

        setError(''); // Xóa lỗi nếu hợp lệ

        try {
            onSave(voucher);
            toast.success(voucherToEdit ? 'Cập nhật voucher thành công!' : 'Thêm voucher thành công!');
            setVoucher({
                tenVoucher: '',
                giamGia: '',
                soLuong: '',
                ngaybatdau: '',
                ngayHetHan: '',
                donToiThieu: '',
                user: ''
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xử lý voucher!');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="text-center my-4 fw-bold text-primary">QUẢN LÝ VOUCHER</h2>
                <fieldset className="fieldset-section">
                    <legend>Thông tin voucher</legend>
                    <input
                        type="text"
                        name="tenVoucher"
                        placeholder="Tên voucher"
                        value={voucher.tenVoucher}
                        onChange={handleChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="number"
                        name="giamGia"
                        placeholder="Giảm giá (%)"
                        value={voucher.giamGia}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="soLuong"
                        placeholder="Số lượng"
                        value={voucher.soLuong}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="donToiThieu"
                        placeholder="Đơn tối thiểu (VND)"
                        value={voucher.donToiThieu}
                        onChange={handleChange}
                    />
                    <div className="date-container">
                        <div className="date-field">
                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="ngaybatdau"
                                value={voucher.ngaybatdau}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="date-field">
                            <label>Ngày hết hạn</label>
                            <input
                                type="date"
                                name="ngayHetHan"
                                value={voucher.ngayHetHan}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        name="user"
                        placeholder="ID khách hàng"
                        value={voucher.user}
                        onChange={handleChange}
                    />
                </fieldset>

                <div className="button-container">
                    <button type="submit">{voucherToEdit ? 'Cập nhật' : 'Thêm'}</button>
                    <button
                        type="button"
                        onClick={() => (onCancel ? onCancel() : navigate('/voucher-list'))}
                        style={{ marginLeft: '10px' }}
                    >
                        Danh sách Voucher
                    </button>
                </div>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="light"
            />
        </div>
    );
}

export default VoucherForm;
