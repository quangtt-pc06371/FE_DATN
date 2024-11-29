import React, { useEffect, useState } from 'react';
import { getAllVouchers, addVoucher, updateVoucher, deleteVoucher } from '../../services/voucherService';
import VoucherForm from './VoucherForm';
import './VoucherForm.css'; // Thêm file CSS tùy chỉnh

const mockVouchers = [
    {
        id: 1,
        tenvoucher: 'Voucher Giảm Giá 10%',
        giamGia: 10,
        soLuong: 100,
        donToiThieu: 50000,
        ngaybatdau: '2024-01-01',
        ngayHetHan: '2024-12-31',
    },
    {
        id: 2,
        tenvoucher: 'Voucher Miễn Phí Vận Chuyển',
        giamGia: 15,
        soLuong: 50,
        donToiThieu: 100000,
        ngaybatdau: '2024-01-01',
        ngayHetHan: '2024-12-31',
    },
];

function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [editingVoucher, setEditingVoucher] = useState(null);

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
            // Sử dụng dữ liệu giả nếu API thất bại
            setVouchers(mockVouchers);
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
                // Update voucher
                await updateVoucher(editingVoucher.id, voucher);
            } else {
                // Add new voucher
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
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h2 className="text-center my-4 fw-bold text-primary">DANH SÁCH VOUCHER</h2>
            
            <input
                type="text"
                placeholder="Tìm kiếm voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ddd' }}
            />

            {editingVoucher ? (
                <VoucherForm voucher={editingVoucher} onSave={handleSave} onCancel={handleCancel} />
            ) : (
                <button onClick={() => setEditingVoucher({})} className="btn-add">
                    Thêm Voucher Mới
                </button>
            )}

            <table className="voucher-table">
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
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleEdit(voucher)}>
                                            Sửa
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(voucher.id)}>
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