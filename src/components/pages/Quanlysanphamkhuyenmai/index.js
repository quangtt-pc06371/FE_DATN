import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
const QuanLySanPhamKhuyenMai = () => {
  const [formData, setFormData] = useState({
    sanPham: { idSanPham: parseInt('') },
    khuyenMai: { idKhuyenMai: parseInt('') },
  });
  const [sanPhamData, setSanPhamData] = useState([]);
  const [khuyenMaiData, setKhuyenMaiData] = useState([]);
  const { idSanPhamKhuyenMai } = useParams();
  const [edit, setEdit] = useState(true);
  const [sanPhamKhuyenMaiData, setSanPhamKhuyenMaiData] = useState([]);
  const [shopData, setShopData] = useState([]);
  const token = Cookies.get('token');
  async function layShop() {
    try {
      const response = await axios.get('http://localhost:8080/api/shop/nguoidung', {
        headers: {
          'Authorization': token,
        },
      }
      );

      setShopData(response.data);
    } catch (error) {
      alert("Vui Lòng Đăng Nhập")
    }


  }
  console.log(shopData)
  console.log(khuyenMaiData)
  console.log(sanPhamData)
  async function laySanPham() {

    const apiShop = 'http://localhost:8080/api/sanpham/shop';
    const response = await axios.get(apiShop + '/' + shopData.id);
    setSanPhamData(response.data);


  }

  async function layKhuyenMai() {

    const apiShop = 'http://localhost:8080/api/khuyenmai/shop';
    const response = await axios.get(apiShop + '/' + shopData.id);
    setKhuyenMaiData(response.data);


  }

  async function getDataDisplayId() {

    const apiKhuyenMai = 'http://localhost:8080/api/sanphamkhuyenmai';
    const response = await axios.get(apiKhuyenMai + '/' + idSanPhamKhuyenMai, formData);
    setFormData(response.data);
    console.log(response.data);
  }
  async function laySanPhamKhuyenMai() {
    const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
    setSanPhamKhuyenMaiData(response.data);
  }

  useEffect(() => {
    // if (idSanPhamKhuyenMai) {
    //   getDataDisplayId();
    //   setEdit(false);
    // }


    layShop();

    laySanPhamKhuyenMai();
  }, []);
  useEffect(() => {
    if (shopData && shopData.id) {
      laySanPham();
      layKhuyenMai();
    }
  }, [shopData]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "sanPham") {
      setFormData({
        ...formData,
        sanPham: { idSanPham: parseInt(value) }
      });
    } else if (name === "khuyenMai") {
      setFormData({
        ...formData,
        khuyenMai: { idKhuyenMai: parseInt(value) }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  }


  async function handleAdd() {

    if (!formData.sanPham.idSanPham) {
      alert("Vui lòng chọn sản phẩm trước khi thêm!");
      Swal.fire('Vui lòng chọn sản phẩm trước khi thêm !');
      return;
    }


    if (!formData.khuyenMai.idKhuyenMai) {
      alert("Vui lòng chọn khuyến mãi trước khi thêm!");
      return;
    }


    const existingPromotion = sanPhamKhuyenMaiData.find(
      (item) => item.sanPham.idSanPham === formData.sanPham.idSanPham
    );

    if (existingPromotion) {
      alert('Sản phẩm này đã có khuyến mãi và không thể áp dụng thêm!');
      return;
    }


    const dataToSent = {
      trangThai: true,
      sanPham: { idSanPham: parseInt(formData.sanPham.idSanPham) },
      khuyenMai: { idKhuyenMai: parseInt(formData.khuyenMai.idKhuyenMai) }
    };

    try {

      const addData = await axios.post('http://localhost:8080/api/sanphamkhuyenmai', dataToSent, {
        headers: {
          'Authorization': token,
        },
      });
      alert('Thêm thành công', addData.data);
      handleResetData();
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm khuyến mãi:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm khuyến mãi');
    }
  }




  function handleResetData() {
    setFormData({
      sanPham: { idSanPham: '' },
      khuyenMai: { idKhuyenMai: '' }
    });
    setEdit(true);
  }
  console.log(khuyenMaiData)
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0">Quản Lý Sản Phẩm Khuyến Mãi</h2>
              <a href='/shop-user' type="button" className="btn btn-primary ms-auto">
                Trở Về Quản Lý Shop
              </a>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Sản Phẩm:</label>
                  <select
                    name="sanPham"
                    value={formData.sanPham.idSanPham}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Chọn Sản Phẩm</option>
                    {sanPhamData.map((s) => (
                      s.trangThai === false ? null : (
                        <option key={s.idSanPham} value={s.idSanPham}>
                        {s.tenSanPham}
                      </option>
                      )   
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Khuyến Mãi:</label>
                  <select
                    name="khuyenMai"
                    value={formData.khuyenMai.idKhuyenMai}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Chọn Khuyến Mãi</option>
                    {khuyenMaiData.map((s) => (
                      s.active === false ? null : (
                        <option key={s.idKhuyenMai} value={s.idKhuyenMai}>
                        {s.tenKhuyenMai}
                      </option>
                      )
                  
                    ))}
                  </select>
                </div>
                  
                <div className="">
                  {/* {edit ? ( */}
                  <button type="button" className="btn btn-primary me-2 form-control" onClick={handleAdd}>
                    Thêm Mới
                  </button>
                  {/* ) : ( 
                  {/* <button type="button" className="btn btn-primary me-2 form-control" onClick={handleUpdate}>
                      Cập Nhật
                    </button>
                  )} */}
                  <button type="button" className="btn btn-secondary form-control mt-2 " onClick={handleResetData}>
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
