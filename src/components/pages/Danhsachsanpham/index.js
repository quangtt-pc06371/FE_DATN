import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const DanhSachSanPham = () => {
  const [data, setData] = useState([]);
  console.log(data)

  async function hienThi() {
    const response = await axios.get('http://localhost:8080/api/sanpham');
    setData(response.data);
  }

  async function handleDelete(id) {
    const apiKhuyenMai = 'http://localhost:8080/api/sanpham/updatetrangthai';
    await axios.put(apiKhuyenMai + '/' + id);
    alert("Sản phẩm đã được Xóa");
    hienThi();
  }


  useEffect(() => {
    hienThi();
  }, []);

  return (
    <div className="container-fluid my-5">
      <div className="card shadow w-100">
        <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
          <h2>Danh Sách Sản Phẩm</h2>
          <a href='/quanlysanpham' className="btn btn-success">Thêm Sản Phẩm</a>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên Sản Phẩm</th>
                <th>Mô Tả</th>
                <th>Shop</th>
                <th>Danh Mục</th>
                <th>Danh Sách Phiên Bản</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {data.map(sanPham => (
                // Kiểm tra nếu sản phẩm có trong hiddenProducts thì không hiển thị
                sanPham.trangThai === false ? null : (
                  <tr key={sanPham.idSanPham}>
                    <td>{sanPham.idSanPham}</td>
                    <td>{sanPham.tenSanPham}</td>
                    <td>{sanPham.moTa}</td>
                    <td>{sanPham.shop.shopName}</td>
                    <td>{sanPham.danhMuc.tenDanhMuc}</td>
                    <td>
                      Số lượng phiên bản: {sanPham.skus.length}
                      {sanPham.skus.length > 0 && (
                        <ul className="list-unstyled">
                          <li>
                            <ul>
                              <li>Giá: {sanPham.skus[0].giaSanPham} VNĐ</li>
                              <li>Số lượng: {sanPham.skus[0].soLuong}</li>
                              {sanPham.skus[0].tuyChonThuocTinhSkus.map(tcSkus => (
                                <li key={tcSkus.idtuyChonThuocTinhSku}>
                                  {tcSkus.tuyChonThuocTinh.thuocTinh.ten}: {tcSkus.tuyChonThuocTinh.giaTri}
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      )}
                    </td>
                    <td>
                      <a href={`/sanpham/${sanPham.idSanPham}`} className="btn btn-warning me-2">Sửa</a>
                      <button onClick={() => handleDelete(sanPham.idSanPham)} className="btn btn-danger">Xóa</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DanhSachSanPham;
