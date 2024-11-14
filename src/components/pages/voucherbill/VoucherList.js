import React, { useEffect, useState } from 'react';
import { getAllVouchers, deleteVoucher } from '../../services/voucherService';

function VoucherList({ onEdit }) {
    const [vouchers, setVouchers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Thêm trạng thái cho thanh tìm kiếm
    const [filteredVouchers, setFilteredVouchers] = useState([]);

    useEffect(() => {
        fetchVouchers();
    }, []);

    useEffect(() => {
        // Lọc danh sách voucher dựa trên từ khóa tìm kiếm
        setFilteredVouchers(
            vouchers.filter((voucher) =>
                voucher.id.toString().includes(searchTerm) ||
                voucher.giamGia.toString().includes(searchTerm) ||
                voucher.soLuong.toString().includes(searchTerm) ||
                voucher.ngaybatdau.includes(searchTerm) ||
                voucher.ngayHetHan.includes(searchTerm) ||
                voucher.user.toString().includes(searchTerm)
            )
        );
    }, [searchTerm, vouchers]);

    const fetchVouchers = async () => {
        // Dữ liệu mẫu (sử dụng khi chưa có API)
        const sampleData = [
            { id: 1, giamGia: 20, soLuong: 50, ngaybatdau: "2024-11-01", ngayHetHan: "2024-12-01", user: 101 },
            { id: 2, giamGia: 15, soLuong: 30, ngaybatdau: "2024-11-10", ngayHetHan: "2024-12-10", user: 102 },
            { id: 3, giamGia: 10, soLuong: 20, ngaybatdau: "2024-11-15", ngayHetHan: "2024-12-15", user: 103 }
        ];

        try {
            const response = await getAllVouchers();
            setVouchers(response?.data || sampleData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            setVouchers(sampleData);  // Nếu có lỗi, dùng dữ liệu mẫu
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteVoucher(id);
            fetchVouchers();  // Cập nhật danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa voucher:", error);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h2 className="text-center my-4 fw-bold text-primary">DANH SÁCH VOUCHER</h2>
            
            {/* Thanh tìm kiếm */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm voucher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>ID Voucher</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Giảm giá (%)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Số lượng</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Ngày bắt đầu</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Ngày hết hạn</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>ID người dùng</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => (
                            <tr key={voucher.id}>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.giamGia}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.soLuong}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.ngaybatdau}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.ngayHetHan}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{voucher.user}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => onEdit(voucher)} 
                                        style={{ marginRight: '5px', padding: '4px 8px', fontSize: '12px' }}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(voucher.id)} 
                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>Không tìm thấy voucher nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default VoucherList;
