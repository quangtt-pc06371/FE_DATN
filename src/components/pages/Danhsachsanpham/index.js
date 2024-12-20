import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Swal from "sweetalert2";
import Cookies from "js-cookie";
const DanhSachSanPham = () => {
  const [data, setData] = useState([]);
  console.log(data)
  const [shop, setShop] = useState(null);
  async function hienThiSanPham() {
    try {
      const apiShop = 'http://localhost:8080/api/sanpham/shop';
      const response = await axios.get(apiShop + '/' + shop.id);
      setData(response.data);

    } catch (error) {
      console.log(error)
    }

  }

  async function handleDeleteSanPham(id) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, thực hiện xóa
    if (result.isConfirmed) {
      const apiSanPham = "http://localhost:8080/api/sanpham/updatetrangthai";
      try {
        await axios.put(`${apiSanPham}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Xóa sản phẩm thành công",
        });
        hienThiSanPham(); // Load lại danh sách sản phẩm sau khi xóa
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        });
      }
    }
  }


  useEffect(() => {
    if (shop && shop.id) {
      hienThiSanPham();

    }
  }, [shop]);
  console.log(shop)

  useEffect(() => {
    const fetchShop = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get('http://localhost:8080/api/shops/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShop(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin shop:", error);
      }
    };
    fetchShop();
  }, []);


  return (
    <div className="container-fluid my-5">
      <div className="card shadow-sm w-100 mb-5">
        <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
          <h2>Danh Sách Sản Phẩm</h2>
          <a href='/quanlysanpham' className="btn btn-success">Thêm Sản Phẩm</a>
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Tên Sản Phẩm</th>
                <th>Mô Tả</th>
                <th>Shop</th>
                <th>Danh Mục</th>
                <th>Danh Sách Phiên Bản</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {data.filter(sanPham => sanPham.trangThai !== false).map((sanPham, index) => (
                <tr key={sanPham.idSanPham}>
                  <td>{index + 1}</td> {/* Duy trì chỉ số với sản phẩm không ẩn */}
                  <td>{sanPham.tenSanPham}</td>
                  <td>{sanPham.moTa}</td>
                  <td>{sanPham.shop.shopName}</td>
                  <td>{sanPham.danhMuc.tenDanhMuc}</td>
                  <td>
                    Số lượng phiên bản: {sanPham.skus.length}
                  </td>
                  <td>
                    <a href={`/sanpham/${sanPham.idSanPham}`} className="btn btn-warning me-2">Sửa</a>
                    <button onClick={() => handleDeleteSanPham(sanPham.idSanPham)} className="btn btn-danger">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DanhSachSanPham;
