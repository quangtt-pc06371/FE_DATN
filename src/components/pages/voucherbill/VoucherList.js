import React, { useEffect, useState } from 'react';
import { getAllVouchers, deleteVoucher } from '../voucherService';

function VoucherList({ onEdit }) {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        const response = await getAllVouchers();
        setVouchers(response.data);
    };

    const handleDelete = async (id) => {
        await deleteVoucher(id);
        fetchVouchers();
    };

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Danh sách Voucher</h2>
            <ul>
                {vouchers.map(voucher => (
                    <li key={voucher.id}>
                        <span>{voucher.giamGia} - {voucher.soLuong}</span>
                        <button onClick={() => onEdit(voucher)}>Sửa</button>
                        <button onClick={() => handleDelete(voucher.id)}>Xóa</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VoucherList;
