import React, { useState } from 'react';

const ThongKeForm = ({ onSubmit }) => {
    const [shopId, setShopId] = useState('');
    const [dateType, setDateType] = useState('day');
    const [ngay, setNgay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ shopId, dateType, ngay, month, year });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Shop ID: </label>
                <input type="number" value={shopId} onChange={(e) => setShopId(e.target.value)} required />
            </div>
            <div>
                <label>Thống kê theo: </label>
                <select value={dateType} onChange={(e) => setDateType(e.target.value)}>
                    <option value="day">Ngày</option>
                    <option value="month">Tháng</option>
                    <option value="year">Năm</option>
                </select>
            </div>
            {dateType === 'day' && (
                <div>
                    <label>Ngày: </label>
                    <input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} required />
                </div>
            )}
            {dateType === 'month' && (
                <div>
                    <label>Tháng: </label>
                    <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} required />
                    <label>Năm: </label>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                </div>
            )}
            {dateType === 'year' && (
                <div>
                    <label>Năm: </label>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
                </div>
            )}
            <button type="submit">Thống kê</button>
        </form>
    );
};

export default ThongKeForm;
