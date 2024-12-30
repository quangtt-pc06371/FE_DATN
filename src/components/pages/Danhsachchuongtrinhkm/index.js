import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import moment from 'moment';
import { useParams } from "react-router-dom";
const DanhSachSanPhamKM = () => {
  const [shop, setShop] = useState(null);
  const [dataSanPhamKhuyenMai, setDataSanPhamKhuyenMai] = useState([]);
 

  async function hienThiSanPhamKhuyenMai() {
    const apiShop = 'http://localhost:8080/api/sanphamkhuyenmai/shop';
    const response = await axios.get(apiShop + '/' + shop.id);
    setDataSanPhamKhuyenMai(response.data);
  }

  async function handleDeleteSanPhamKhuyenMai(id) {
    // Hiển thị thông báo xác nhận trước khi xóa
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm khuyến mãi này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    // Nếu người dùng xác nhận, thực hiện xóa
    if (result.isConfirmed) {
      const apiSanPhamKhuyenMai = "http://localhost:8080/api/sanphamkhuyenmai";
      try {
        await axios.delete(`${apiSanPhamKhuyenMai}/${id}`);
        Swal.fire({
          icon: "success",
          title: "Sản phẩm khuyến mãi đã được xóa",
        });
        hienThiSanPhamKhuyenMai(); // Load lại danh sách sản phẩm khuyến mãi sau khi xóa
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Không thể xóa sản phẩm khuyến mãi. Vui lòng thử lại sau.",
        });
      }
    }
  }

  async function handleDeleteSanPhamKhuyenMaiHetHan(id) {
    const apiSanPhamKhuyenMai = 'http://localhost:8080/api/sanphamkhuyenmai/updatetrangthai';
    await axios.put(apiSanPhamKhuyenMai + '/' + id);

  }

  useEffect(() => {
    if (shop && shop.id) {
      hienThiSanPhamKhuyenMai();
    }
  }, [shop]);

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


  function formatDateKeepUTC(dateString) {
    return moment.utc(dateString).format('DD/MM/YYYY');
  }
  
  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow w-100 mb-3">
        <div className="card-header  bg-body-secondary d-flex justify-content-between align-items-center" >
          <h2>Danh Sách Chương Trình Khuyến Mãi</h2>
          
        </div>
        <div className="card-body">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Sản Phẩm</th>
                <th>Giá Gốc</th>
                <th>Khuyến Mãi</th>
                <th>Giá Sau Khuyến Mãi</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Kết Thúc</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {dataSanPhamKhuyenMai.filter(sanPhamKhuyenMai => sanPhamKhuyenMai.trangThai !== false).map((sanPhamKhuyenMai, filteredIndex) => {
                const now = new Date();

                const endDate = new Date(sanPhamKhuyenMai.khuyenMai.ngayKetThuc);

                console.log(now)
                console.log(endDate)

                const giaGoc = sanPhamKhuyenMai.sanPham.skus[0]?.giaSanPham || 0;
                const khuyenMai = sanPhamKhuyenMai.khuyenMai.giaTriKhuyenMai || 0;
                const giaSauKhuyenMai = giaGoc - (giaGoc * (khuyenMai / 100));
                const khuyenMaiConHieuLuc = now > endDate;
                const hieuLucKhuyenMai = sanPhamKhuyenMai.khuyenMai.active;
                const chuongTrinhKhuyenMai = sanPhamKhuyenMai.trangThai;

                if (khuyenMaiConHieuLuc || hieuLucKhuyenMai === false) {
                  // Gọi các hàm xóa trạng thái khi khuyến mãi hết hiệu lực
                  handleDeleteSanPhamKhuyenMaiHetHan(sanPhamKhuyenMai.idSanPhamKM);
                }

                return (
                  <tr key={sanPhamKhuyenMai.idSanPhamKM}>
                    <td>{filteredIndex + 1}</td> {/* Duy trì chỉ số STT sau khi lọc */}
                    <td>{sanPhamKhuyenMai.sanPham.tenSanPham}</td>
                    <td> {`${giaGoc.toLocaleString('vi-VN')} VNĐ`} </td>
                    <td>{sanPhamKhuyenMai.khuyenMai.tenKhuyenMai} ({khuyenMai}%)</td>
                    <td>
                      {chuongTrinhKhuyenMai === true ? (
                        <span className="text-danger fw-bold">{`${giaSauKhuyenMai.toLocaleString('vi-VN')} VNĐ`}</span>
                      ) : (
                        <span></span>
                      )}
                    </td>
                    <td>{formatDateKeepUTC(sanPhamKhuyenMai.khuyenMai.ngayBatDau)}</td>
                    <td>{formatDateKeepUTC(sanPhamKhuyenMai.khuyenMai.ngayKetThuc)}</td>
                    <td className="text-center">
                      <button className="btn btn-danger" onClick={() => handleDeleteSanPhamKhuyenMai(sanPhamKhuyenMai.idSanPhamKM)}>Xóa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default DanhSachSanPhamKM;
