import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Select from 'react-select';

const QuanLySanPhamKhuyenMai = () => {
  const [formData, setFormData] = useState({
    sanPham: [], // Lưu danh sách các sản phẩm được chọn
  });
  const [sanPhamData, setSanPhamData] = useState([]);
  const [khuyenMaiData, setKhuyenMaiData] = useState([]);
  const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
  const [shopData, setShopData] = useState({});
  const token = Cookies.get('token');
  const { idSanPhamKhuyenMai } = useParams();

  useEffect(() => {
    layShop();
    laySanPhamKhuyenMai();
  }, []);

  useEffect(() => {
    if (shopData.id) {
      laySanPham();
      layKhuyenMai();
    }
  }, [shopData]);

  async function layShop() {
    try {
      const response = await axios.get('http://localhost:8080/api/shop/nguoidung', {
        headers: { 'Authorization': token },
      });
      setShopData(response.data);
    } catch (error) {
      Swal.fire("Lỗi", "Vui lòng đăng nhập!", "error");
    }
  }

  async function laySanPham() {
    try {
      const response = await axios.get(`http://localhost:8080/api/sanpham/shop/${shopData.id}`);
      setSanPhamData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  }

  async function layKhuyenMai() {
    try {
      const response = await axios.get(`http://localhost:8080/api/khuyenmai/shop/${shopData.id}`);
      setKhuyenMaiData(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
    }
  }

  async function laySanPhamKhuyenMai() {
    try {
      const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
      setSanPhamKhuyenMaiForm(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm khuyến mãi:", error);
    }
  }

  function handleResetData() {
    setFormData({ sanPham: [] }); // Làm trống danh sách sản phẩm
  }

  async function handleAdd() {
    if (!formData.sanPham || formData.sanPham.length === 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn ít nhất một sản phẩm!', 'warning');
      return;
    }

    const dataToSent = {
      sanPhams: formData.sanPham.map((sp) => sp.idSanPham),
      idKhuyenMai: parseInt(idSanPhamKhuyenMai),
    };

    try {
      await axios.post('http://localhost:8080/api/sanphamkhuyenmai', dataToSent, {
        headers: { Authorization: token },
      });
      Swal.fire('Thành công', 'Tất cả sản phẩm đã được thêm khuyến mãi!', 'success');
      handleResetData();
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm khuyến mãi:', error);
      Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm sản phẩm khuyến mãi!', 'error');
    }
  }

  const sanPhamOptions = sanPhamData
    .filter((s) => 
      s.trangThai !== false &&
      !sanPhamKhuyenMaiForm.some((kmItem) => kmItem.sanPham.idSanPham === s.idSanPham)
    )
    .map((s) => ({
      value: s.idSanPham,
      label: s.tenSanPham,
    }));

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0">Quản Lý Sản Phẩm Khuyến Mãi</h2>
              <a href='/shop/shop-user' className="btn btn-primary ms-auto">
                Trở Về Quản Lý Shop
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Sản Phẩm:</label>
                  <Select
                    name="sanPham"
                    options={sanPhamOptions}
                    value={sanPhamOptions.filter((option) =>
                      formData.sanPham.some((sp) => sp.idSanPham === option.value)
                    )}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        sanPham: selectedOptions.map(option => ({
                          idSanPham: option.value,
                          tenSanPham: option.label,
                        })),
                      })
                    }
                    isMulti
                    placeholder="Chọn Sản Phẩm"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <button type="button" className="btn btn-primary me-2 form-control" onClick={handleAdd}>
                    Thêm Mới
                  </button>
                  <button type="button" className="btn btn-secondary form-control mt-2" onClick={handleResetData}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuanLySanPhamKhuyenMai;
