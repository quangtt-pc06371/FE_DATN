import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vouchers';

export const getAllVouchers = () => axios.get(API_URL);
export const addVoucher = (voucher) => axios.post(API_URL, voucher);
export const updateVoucher = (id, voucher) => axios.put(`${API_URL}/${id}`, voucher);
export const deleteVoucher = (id) => axios.delete(`${API_URL}/${id}`);

export const getVouchers = async () => {
    try {
        const response = await axios.get('/api/vouchers'); // Đường dẫn API cần thay đổi phù hợp
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error);
        return [];
    }
};