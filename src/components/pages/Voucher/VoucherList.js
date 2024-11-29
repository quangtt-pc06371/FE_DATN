import React, { useEffect, useState } from 'react';
import { getAllVouchers, addVoucher, updateVoucher, deleteVoucher } from '../Voucher/voucherService';
import VoucherForm from './VoucherForm';
import './VoucherList.css'; // Import file CSS mới

function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [editingVoucher, setEditingVoucher] = useState(null);

    const mockData = [
        {
            id: 1,
            tenvoucher: 'Giảm giá 10%',
            giamGia: 10,
            soLuong: 100,
            donToiThieu: 200000,
            ngaybatdau: '2024-01-01',
            ngayHetHan: '2024-01-31',
        },
        {
            id: 2,
            tenvoucher: 'Giảm giá 20%',
            giamGia: 20,
            soLuong: 50,
            donToiThieu: 300000,
            ngaybatdau: '2024-02-01',
            ngayHetHan: '2024-02-28',
        },
    ];

    useEffect(() => {
        fetchVouchers();
    }, []);

    useEffect(() => {
        setFilteredVouchers(
            vouchers.filter((voucher) =>
                voucher.tenvoucher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.giamGia.toString().includes(searchTerm) ||
                voucher.donToiThieu.toString().includes(searchTerm)
            )
        );
    }, [searchTerm, vouchers]);

    const fetchVouchers = async () => {
        try {
            const response = await getAllVouchers();
            setVouchers(response.data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setVouchers(mockData); // Sử dụng dữ liệu giả nếu API không phản hồi
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteVoucher(id);
            fetchVouchers();
        } catch (error) {
            console.error('Error deleting voucher:', error);
        }
    };

    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
    };

    const handleSave = async (voucher) => {
        try {
            if (editingVoucher) {
                await updateVoucher(editingVoucher.id, voucher);
            } else {
                await addVoucher(voucher);
            }
            fetchVouchers();
            setEditingVoucher(null);
        } catch (error) {
            console.error('Error saving voucher:', error);
        }
    };

    const handleCancel = () => {
        setEditingVoucher(null);
    };

    return (
        <div className="voucher-list-container">
            <h2 className="voucher-list-title">DANH SÁCH VOUCHER</h2>
            
            <input
                type="text"
                placeholder="Tìm kiếm voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="voucher-list-search-bar"
            />

            {editingVoucher ? (
                <VoucherForm voucherToEdit={editingVoucher} onSave={handleSave} onCancel={handleCancel} />
            ) : (
                <button onClick={() => setEditingVoucher({})} className="voucher-list-btn-add">
                    Thêm Voucher Mới
                </button>
            )}

            <table className="voucher-list-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Voucher</th>
                        <th>Giảm Giá</th>
                        <th>Số Lượng</th>
                        <th>Đơn Tối Thiểu</th>
                        <th>Ngày Bắt Đầu</th>
                        <th>Ngày Hết Hạn</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => (
                            <tr key={voucher.id}>
                                <td>{voucher.id}</td>
                                <td>{voucher.tenvoucher}</td>
                                <td>{voucher.giamGia}</td>
                                <td>{voucher.soLuong}</td>
                                <td>{voucher.donToiThieu}</td>
                                <td>{voucher.ngaybatdau}</td>
                                <td>{voucher.ngayHetHan}</td>
                                <td>
                                    <div className="voucher-list-action-buttons">
                                        <button className="voucher-list-btn-edit" onClick={() => handleEdit(voucher)}>
                                            Sửa
                                        </button>
                                        <button className="voucher-list-btn-delete" onClick={() => handleDelete(voucher.id)}>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Không có voucher nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default VoucherList;
