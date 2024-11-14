import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVoucher, updateVoucher } from '../../services/voucherService';
import './VoucherForm.css';

function VoucherForm({ voucherToEdit, onSave }) {
    const [voucher, setVoucher] = useState({
        giamGia: '',
        soLuong: '',
        ngaybatdau: '',
        ngayHetHan: '',
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

        // Kiểm tra nếu giảm giá vượt quá 50%
        if (voucher.giamGia > 50) {
            setError('Giảm giá không được vượt quá 50%');
            return;
        }

        setError(''); // Xóa lỗi nếu hợp lệ

        // Thêm hoặc cập nhật voucher
        if (voucherToEdit) {
            await updateVoucher(voucherToEdit.id, voucher);
        } else {
            await addVoucher(voucher);
        }

        onSave();
        setVoucher({ giamGia: '', soLuong: '', ngaybatdau: '', ngayHetHan: '', user: '' });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="text-center my-4 fw-bold text-primary">QUẢN LÝ VOUCHER</h2>
                <fieldset className="fieldset-section">
                    <legend>Điều kiện khuyến mãi</legend>
                    <input
                        type="number"
                        name="giamGia"
                        placeholder="Giảm giá"
                        value={voucher.giamGia}
                        onChange={handleChange}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="number"
                        name="soLuong"
                        placeholder="Số lượng"
                        value={voucher.soLuong}
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
                        onClick={() => navigate('/voucher-list')}
                        style={{ marginLeft: '10px' }}
                    >
                        Danh sách Voucher
                    </button>
                </div>
            </form>
        </div>
    );
}

export default VoucherForm;
