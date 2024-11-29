import axios from 'axios';

const API_URL = 'http://localhost:8080/api/voucherbills';

// Thêm token vào header
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Token lưu trữ trong localStorage
    return { Authorization: `Bearer ${token}` };
};

// Lấy danh sách voucher
export const getAllVouchers = () => {
    return axios.get(API_URL, { headers: getAuthHeader() });
};

// Thêm voucher
export const addVoucher = (voucher) => {
    return axios.post(`${API_URL}/add`, voucher, { headers: getAuthHeader() });
};

// Cập nhật voucher
export const updateVoucher = (id, voucher) => {
    return axios.put(`${API_URL}/${id}`, voucher, { headers: getAuthHeader() });
};

// Xóa voucher
export const deleteVoucher = (id) => {
    return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
};
