// src/components/DanhSachKhuyenMai.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
const DanhSachSanPhamKM = () => {

  const [data, setData] = useState([]);

  async function hienThi() {
    const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
    setData(response.data);
  }

  function getFormatDate(dateString) {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  }

  async function handleDelete(id) {
    const apiKhuyenMai = 'http://localhost:8080/api/sanphamkhuyenmai';
    await axios.delete(apiKhuyenMai + '/' + id);
    hienThi();
    alert("Xóa thành công")
  }

  useEffect(() => {
    hienThi();
  }, []);


  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="card-header text-white" style={{ backgroundColor: 'rgb(21,37,69)' }}>
          <h2>Danh Sách Chương Trình Khuyến Mãi</h2>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Sản Phẩm</th>
                <th>Khuyến Mãi</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Kết Thúc</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {/* Thêm các hàng dữ liệu từ API hoặc dữ liệu động tại đây */}
              {/* Ví dụ hàng trống để hiển thị */}
              {data.map(sanPhamKhuyenMai => (
                <tr>
                  <td>{sanPhamKhuyenMai.idSanPhamKM}</td>
                  <td>{sanPhamKhuyenMai.sanPham.tenSanPham}</td>
                  <td>{sanPhamKhuyenMai.khuyenMai.tenKhuyenMai}</td>
                  <td>{getFormatDate(sanPhamKhuyenMai.khuyenMai.ngayBatDau)}</td>
                  <td>{getFormatDate(sanPhamKhuyenMai.khuyenMai.ngayKetThuc)}</td>
                  <td className="text-center">
                    <div className="mb-1">                     <a className="btn btn-warning " href={`/sanphamkhuyenmai/${sanPhamKhuyenMai.idSanPhamKM}`}>Sửa</a></div>
                    <button className="btn btn-danger" onClick={() => handleDelete(sanPhamKhuyenMai.idSanPhamKM)}>Xóa</button>
                  </td>
                </tr>

              ))}


            </tbody>
          </table>
          <a className="btn btn-success mt-3" href='/sanphamkhuyenmai'>Thêm Chương Trình Khuyến Mãi Mới</a>
        </div>
      </div>
    </div>
  );
};

export default DanhSachSanPhamKM;
