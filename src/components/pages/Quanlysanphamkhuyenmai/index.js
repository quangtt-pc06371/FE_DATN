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
    }  else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  }


  async function handleAdd() {
    if (!formData.sanPham.idSanPham) {
      Swal.fire('Lỗi', 'Vui lòng chọn sản phẩm trước khi thêm!', 'warning');
      return;
    }
  

    const existingPromotions = sanPhamKhuyenMaiData.filter(
      (item) => item.sanPham.idSanPham === formData.sanPham.idSanPham
    );
    
    // Kiểm tra nếu bất kỳ khuyến mãi nào đang hoạt động
    const hasActivePromotion = existingPromotions.some(
      (promo) => promo.trangThai === true
    );
    
    console.log(existingPromotions)
    console.log(hasActivePromotion)
    if (hasActivePromotion) {
      Swal.fire('Lỗi', 'Sản phẩm này đã có khuyến mãi đang hoạt động!', 'warning');
      return;
    }
  
    const dataToSent = {
      trangThai: true,
      sanPham: { idSanPham: parseInt(formData.sanPham.idSanPham) },
      khuyenMai: { idKhuyenMai: parseInt(idSanPhamKhuyenMai) },
    };
    console.log(dataToSent)
  
    try {
      const addData = await axios.post('http://localhost:8080/api/sanphamkhuyenmai', dataToSent, {
        headers: {
          Authorization: token,
        },
      });
      Swal.fire('Thành công', 'Đã thêm sản phẩm vào chương trình khuyến mãi!', 'success');
      handleResetData();
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm khuyến mãi:', error);
      Swal.fire('Lỗi', 'Có lỗi xảy ra khi thêm sản phẩm khuyến mãi', 'error');
    }
  }
  




  function handleResetData() {
    setFormData({
      sanPham: { idSanPham: '' },
      khuyenMai: { idKhuyenMai: '' }
    });
    setEdit(true);
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="card-title mb-0">Quản Lý Sản Phẩm Khuyến Mãi</h2>
              <a href='/user/shop-user' type="button" className="btn btn-primary ms-auto">
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
