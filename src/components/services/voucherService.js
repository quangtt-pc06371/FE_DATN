import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vouchers';

export const getAllVouchers = () => axios.get(API_URL);
export const addVoucher = (voucher) => axios.post(API_URL, voucher);
export const updateVoucher = (id, voucher) => axios.put(`${API_URL}/${id}`, voucher);
export const deleteVoucher = (id) => axios.delete(`${API_URL}/${id}`);
