import React from 'react';

const DoanhThuTable = ({ data }) => {
    if (data === null) {
        return <p>Chưa có dữ liệu.</p>;
    }

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>Loại Thống Kê</th>
                    <th>Doanh Thu</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Doanh thu</td>
                    <td>{data} VND</td>
                </tr>
            </tbody>
        </table>
    );
};

export default DoanhThuTable;
