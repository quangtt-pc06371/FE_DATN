// src/components/QuanlySanPham.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from 'date-fns';
import { useParams } from 'react-router-dom';
import { id } from 'date-fns/locale';
import { postDucoment } from "../../../config/Auth";
import Cookies from "js-cookie";
const QuanlySanPham = () => {

  const [formData, setFormData] = useState({
    tenSanPham: '',
    moTa: '',
    weight: '', // Cân nặng (mặc định là chuỗi rỗng)
    length: '', // Chiều dài
    width: '', // Chiều rộng
    height: '', // Chiều cao
    shop: { id: parseInt('') },
    danhMuc: { idDanhMuc: parseInt('') }
  }
  )
  console.log(formData)

  const [shopForm, setShopForm] = useState([]);

  const [danhMucForm, setDanhMucForm] = useState([]);

  const [inputs, setInputs] = useState([{
    tieuDe: '',
    noiDung: [{
      noiDungTieuDe: ''
    }]
  }]);

  const [skusList, setSkusList] = useState([]);
  const { idSanPham } = useParams();

  const [giaSanPham, setGiaSanPham] = useState(0);
  const [soLuong, setSoLuong] = useState(0);
  const [edit, setEdit] = useState(true);


  function handleAddInput() {

    setInputs((prevState => (
      [...prevState, {

        noiDung: [{ noiDungTieuDe: '' }]
      }]
    )))
  }

  function handleAddNoiDungInput(i) {

    setInputs(prev => {
      const updateSection = {
        ...prev[i],
        noiDung: [
          ...prev[i].noiDung,
          { noiDungTieuDe: '' }
        ],
      };
      return prev.map((section, index) => {
        return index === i ? updateSection : section
      })
    })
  }

  function handleChangeInput(event, index) {
    let { name, value } = event.target;
    let onChangeValue = [...inputs];
    //onChangeValue[0]['tieuDe'] = 'Chất liệu';
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    // console.log(index, event.target.value)

  }

  function handleChangeNoiDungInput(index, i, event) {
    let { name, value } = event.target;
    let onChangeValue = [...inputs];
    onChangeValue[index].noiDung[i][name] = value;
    setInputs(onChangeValue);
    // console.log(index, event.target.name)
  }

  function handleChangeSku(event, index) {
    const { name, value } = event.target;
    const updatedSkus = [...skusList];

    // Cập nhật giá trị cho trường name
    updatedSkus[index][name] = value;
    // console.log(skusList);
    setSkusList(updatedSkus);
    console.log(skusList);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "shop") {
      setFormData({
        ...formData,
        shop: { id: parseInt(value) }
      });
    } else if (name === "danhMuc") {
      setFormData({
        ...formData,
        danhMuc: { idDanhMuc: parseInt(value) }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  }

  // const handleFileChange = (event, index) => {
  //   const files = event.target.files;
  //   const updatedSkus = [...skusList];
  //   updatedSkus[index].hinhanhs = Array.from(files); // Lưu các file ảnh vào thuộc tính `hinhanhs` của SKU
  //   setSkusList(updatedSkus);
  // };
  const handleFileChange = (event, index) => {
    const file = event.target.files[0]; // Chỉ lấy file đầu tiên
    console.log(file)
    setSkusList((prevSkusList) =>
      prevSkusList.map((sku, i) => {
        if (i === index) {
          return {
            ...sku,
            hinhanh: { file }, // Lưu một ảnh duy nhất
          };
        }
        return sku;
      })
    );
  };






  function handleDeleteInput(index) {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  }

  function handleDeleteNoiDungInput(index, i) {
    const newArray = [...inputs];
    newArray[index].noiDung.splice(i, 1);
    setInputs(newArray);
  }

  function handleDeleteSku(index) {
    const newArray = [...skusList];
    newArray.splice(index, 1);
    setSkusList(newArray);
  }

  function handleAddToHop() {
    for (const ip of inputs) {

      if (!ip.tieuDe.trim()) {
        alert("Vui lòng điền đầy đủ tiêu đề thuộc tính.");
        return;
      }

      for (const content of ip.noiDung) {
        if (!content.noiDungTieuDe.trim()) {
          alert("Vui lòng điền đầy đủ giá trị thuộc tính.");
          return;
        }
      }
    }


    const allCombinations = inputs.reduce((acc, input) => {
      return acc.map(combination => {
        return input.noiDung.map(content => {
          return [...combination, {
            tieuDe: input.tieuDe,
            noiDungTieuDe: content.noiDungTieuDe
          }];
        });
      }).flat();
    }, [[]]);

    const newSkus = allCombinations.map(combination => ({
      atributes: combination,
      soLuong: '',
      giaSanPham: '',
      hinhanh: null,
    }));

    setSkusList([...skusList, ...newSkus]);
  }

  function handleAddGiaSku() {
    setSkusList(skusList.map((sku) => ({
      ...sku, // Giữ nguyên các thuộc tính khác của SKU
      giaSanPham: giaSanPham // Cập nhật giá sản phẩm từ input
    })));
  }
  function handleAddSoLuongSku() {
    setSkusList(skusList.map((sku) => ({
      ...sku, // Giữ nguyên các thuộc tính khác của SKU
      soLuong: soLuong // Cập nhật giá sản phẩm từ input
    })));
  }



  async function getShop() {
    const response = await axios.get('http://localhost:8080/api/shop');
    setShopForm(response.data);
  }

  async function getDanhMuc() {
    const response = await axios.get('http://localhost:8080/api/danhmuc');
    setDanhMucForm(response.data);
  }
  async function getSanPhamId() {

    const apiSanPham = 'http://localhost:8080/api/sanpham';
    const response = await axios.get(apiSanPham + '/' + idSanPham, formData);

    setFormData({
      tenSanPham: response.data.tenSanPham,
      moTa: response.data.moTa,
      weight: response.data.weight,
      length: response.data.length,
      width: response.data.width,
      height: response.data.height,
      shop: { idShop: response.data.shop.id },
      danhMuc: { idDanhMuc: response.data.danhMuc.idDanhMuc }
    })

    setSkusList(
      response.data.skus.map((sku) => ({
        idSku: sku.idSku,
        giaSanPham: sku.giaSanPham,
        soLuong: sku.soLuong,
        atributes: sku.tuyChonThuocTinhSkus.map((tuyChon) => ({
          tieuDe: tuyChon.tuyChonThuocTinh.thuocTinh.ten,
          noiDungTieuDe: tuyChon.tuyChonThuocTinh.giaTri,
        })),
        hinhanh: sku.hinhanh // Lấy một hình ảnh duy nhất
          ? {
            idHinhAnh: sku.hinhanh.idHinhAnh,
            tenAnh: sku.hinhanh.tenAnh,
          }
          : null,
      }))
    );





  }


  useEffect(() => {
    getShop();
    getDanhMuc();
    if (idSanPham) {
      getSanPhamId();
      setEdit(false);
    }
  }, []);

  function handleResetData() {
    setFormData({
      tenSanPham: '',
      moTa: '',
      weight: '', 
      length: '', 
      width: '',  
      height: '',  
      shop: { id: '' },
      danhMuc: { idDanhMuc: '' },
    })
    setInputs([{
      tieuDe: '',
      noiDung: [{
        noiDungTieuDe: ''
      }]
    }]);
    setSkusList([]);
    setEdit(true);
  }

  console.log(skusList)

  const handleUploadAnh = async (skuIds) => {
    try {
      for (let i = 0; i < skuIds.length; i++) {
        const idSku = skuIds[i];
        const sku = skusList[i];

        if (sku.hinhanh && sku.hinhanh.file) {
          const formData = new FormData();
          formData.append('file', sku.hinhanh.file);

          console.log(`Uploading image for SKU ID: ${idSku}`);
          await axios.post(`http://localhost:8080/api/sanpham/upload/${idSku}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          console.log(`Không có ảnh để tải lên cho SKU ID: ${idSku}`);
        }
      }
      alert('Upload ảnh thành công');
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Có lỗi xảy ra khi upload ảnh');
    }
  };





  const handleUpdateAnh = async () => {
    try {
      for (let i = 0; i < skusList.length; i++) {
        const skuData = skusList[i]; // Lấy thông tin SKU hiện tại từ skusList
        console.log(skuData.hinhanh);

        // Kiểm tra nếu SKU có ảnh và file đã được chọn
        if (skuData.hinhanh && skuData.hinhanh.file) {
          const formData = new FormData();
          formData.append('file', skuData.hinhanh.file);

          console.log(`Uploading image for SKU ID: ${skuData.idSku}`);

          // Gọi API để upload ảnh
          await axios.put(
            `http://localhost:8080/api/sanpham/update/${skuData.idSku}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        }
      }
      alert('Upload ảnh thành công');
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Có lỗi xảy ra khi upload ảnh');
    }
  };


  async function handleAddSanPham() {
    if (
      !formData.tenSanPham.trim() ||
      !formData.moTa ||
      !formData.danhMuc.idDanhMuc ||
      !formData.weight ||
      !formData.length ||
      !formData.width ||
      !formData.height
    ) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    for (const sku of skusList) {
      if (parseFloat(sku.giaSanPham) < 1000) {
        alert("Giá sản phẩm phải lớn hơn 1000 !");
        return;
      }
      if (!sku.giaSanPham) {
        alert("Giá sản phẩm không được để trống !");
        return;
      }
      if (parseInt(sku.soLuong) <= 0) {
        alert("Số lượng sản phẩm phải lớn hơn 0 !");
        return;
      }
      if (!sku.soLuong) {
        alert("Số lượng sản phẩm không được để trống !");
        return;
      }
      if (!sku.hinhanh) {
        alert("Hình ảnh sản phẩm không được để trống !");
        return;
      }
    }
    if (skusList.length === 0) {
      alert("Chưa có danh sách biến thể sản phẩm!");
      return;
    }
    const token = Cookies.get('token');
    const newData = {
      tenSanPham: formData.tenSanPham,
      moTa: formData.moTa,
      weight: formData.weight, 
      length: formData.length, 
      width: formData.width,   
      height: formData.height,
      trangThai: true,

      danhMuc: {
        idDanhMuc: parseInt(formData.danhMuc.idDanhMuc),
      },

      skus: skusList.map((sku) => ({

        giaSanPham: sku.giaSanPham,
        soLuong: sku.soLuong,
        tuyChonThuocTinhSkus: sku.atributes.map((thuocTinh) => ({

          tuyChonThuocTinh: {

            giaTri: thuocTinh.noiDungTieuDe,
            thuocTinh: {

              ten: thuocTinh.tieuDe,
            },
          },
        })),
        hinhanh: null
      })),
    };

    // Log dữ liệu ra console trước khi gửi
    console.log('Dữ liệu gửi đi:', newData);

    try {
      // const addData = await postDucoment({newData

      // })
      // console.log(addData)
      const addData = await axios.post('http://localhost:8080/api/sanpham', newData, {
        headers: {
          'Authorization': token
        }
      });
      const addedSkuIds = addData.data?.skus.map(sku => sku.idSku); // Lấy toàn bộ idSku
      console.log("Danh sách ID của các SKU:", addedSkuIds);
      await handleUploadAnh(addedSkuIds); // Truyền danh sách ID SKU vào hàm handleUpload      
      //  console.log(addData.data?.skus[0]?.idSku)
      alert('Thêm thành công', addData.data);
      handleResetData();
      console.log(addData.data);
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm');
    }
  }

  async function handleUpdateSanPham() {
    if (
      !formData.tenSanPham.trim() ||
      !formData.moTa ||
      !formData.danhMuc.idDanhMuc ||
      !formData.weight ||
      !formData.length ||
      !formData.width ||
      !formData.height
    ) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    for (const sku of skusList) {
      if (parseFloat(sku.giaSanPham) < 1000) {
        alert("Giá sản phẩm phải lớn hơn 1000 !");
        return;
      }
      if (!sku.giaSanPham) {
        alert("Giá sản phẩm không được để trống !");
        return;
      }
      if (parseInt(sku.soLuong) <= 0) {
        alert("Số lượng sản phẩm phải lớn hơn 0 !");
        return;
      }
      if (!sku.soLuong) {
        alert("Số lượng sản phẩm không được để trống !");
        return;
      }
      if (!sku.hinhanh) {
        alert("Hình ảnh sản phẩm không được để trống !");
        return;
      }
    }
    const newData = {
      tenSanPham: formData.tenSanPham,
      moTa: formData.moTa,
      weight: formData.weight, 
      length: formData.length, 
      width: formData.width,   
      height: formData.height,
      shop: {
        id: parseInt(formData.shop.idShop),
      },
      danhMuc: {
        idDanhMuc: parseInt(formData.danhMuc.idDanhMuc),
      },
      skus: skusList.map((sku) => ({
        idSku: sku.idSku,
        giaSanPham: sku.giaSanPham,
        soLuong: sku.soLuong,
        tuyChonThuocTinhSkus: sku.atributes.map((thuocTinh) => ({
          idTuyChonTtSku: thuocTinh.idTuyChonTtSku,
          tuyChonThuocTinh: {
            idTuyChonThuocTinh: thuocTinh.idTuyChonThuocTinh,
            giaTri: thuocTinh.noiDungTieuDe,
            thuocTinh: {
              idThuocTinh: thuocTinh.idThuocTinh,
              ten: thuocTinh.tieuDe,
            },
          },
        })),

      })),
    };

    // Log dữ liệu ra console trước khi gửi
    console.log('Dữ liệu gửi đi:', newData);

    try {
      const apiSanPham = 'http://localhost:8080/api/sanpham';
      const response = await axios.put(apiSanPham + '/' + idSanPham, newData);
      await handleUpdateAnh();
      alert('Sửa thành công', response.data);
      handleResetData();

    } catch (error) {
      console.error('Lỗi khi sửa sản phẩm:', error);
      alert('Có lỗi xảy ra khi sửa sản phẩm');
    }
  }



  return (
    <main style={{ background: 'rgb(245,245,250)' }}>
      <div className="container d-flex justify-content-center">
        <div className="card border shadow-sm my-5" style={{ maxWidth: '800px', width: '100%' }}>
          <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
            <h2>Thêm Sản Phẩm</h2>
         
            <a href='/shopuser' type="button" className="btn btn-primary ms-auto">
              Trở Về Quản Lý Shop
            </a>
          </div>
          <div className="card-body">
            <form>

              <div className="mb-4">
                <label htmlFor="tenSanPham" className="form-label fw-bold">Tên Sản Phẩm</label>
                <input
                  name="tenSanPham"
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên sản phẩm"
                  value={formData.tenSanPham}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="moTa" className="form-label fw-bold">Mô Tả</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nhập mô tả sản phẩm"
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="weight" className="form-label fw-bold">Cân nặng</label>
                <input
                  type="number"
                  id="weight"
                  className="form-control"
                  placeholder="Nhập cân nặng"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="length" className="form-label fw-bold">Chiều dài</label>
                <input
                  type="number"
                  id="length"
                  className="form-control"
                  placeholder="Nhập chiều dài "
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="width" className="form-label fw-bold">Chiều rộng</label>
                <input
                  type="number"
                  id="width"
                  className="form-control"
                  placeholder="Nhập chiều rộng "
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="height" className="form-label fw-bold">Chiều cao</label>
                <input
                  type="number"
                  id="height"
                  className="form-control"
                  placeholder="Nhập chiều cao "
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                />
              </div>


              <div className="mb-4 fw-bold">
                <label htmlFor="">Danh Mục:</label>
                <select
                  className="form-control"
                  name="danhMuc"
                  value={formData.danhMuc.idDanhMuc}
                  onChange={handleChange}
                >
                  <option value="">Chọn Danh Mục</option>
                  {danhMucForm.map((s) => (
                    <option key={s.idDanhMuc} value={s.idDanhMuc}>{s.tenDanhMuc}</option>
                  ))}
                </select>
              </div>
              {edit === true ? (
                <>
                  <h4 className="mt-4">Danh Sách Thuộc Tính</h4>
                  <div className="border p-3 mb-4 rounded shadow-sm">
                    <h5 className="mt-3">Tùy Chọn Thuộc Tính</h5>
                    {inputs.map((item, index) => (
                      <div className='input_container border p-3 shadow-sm rounded-3 mt-3' key={index}>

                        <div className="mb-3">
                          <label className="form-label fw-bold">Tiêu Đề Thuộc Tính {index + 1}</label>
                          <input
                            name='tieuDe'
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên thuộc tính"
                            value={item.tieuDe}
                            onChange={(event) => handleChangeInput(event, index)}
                          />
                        </div>

                        {index === inputs.length - 1 && (
                          <button onClick={handleAddInput} type="button" className="btn btn-warning me-2">
                            Thêm Thuộc Tính
                          </button>
                        )}

                        {inputs.length > 1 && (
                          <button onClick={() => handleDeleteInput(index)} type="button" className="btn btn-danger">
                            Xóa Thuộc Tính
                          </button>
                        )}

                        {item.noiDung.map((items, i) => (
                          <>
                            <div className='row ' key={i}>
                              <div className="mb-3 mt-3 col-8" >
                                <label className="form-label fw-bold">Giá Trị Thuộc Tính {item.tieuDe}</label>
                                <input
                                  name='noiDungTieuDe'
                                  type="text"
                                  className="form-control"
                                  placeholder="Nhập giá trị thuộc tính"
                                  value={items.noiDungTieuDe}
                                  onChange={(event) => handleChangeNoiDungInput(index, i, event)}
                                />
                              </div>

                              <div className='col-4 mt-5'>

                                <button onClick={() => handleAddNoiDungInput(index)} type="button" className="btn btn-success me-2">
                                  +
                                </button>

                                {item.noiDung.length > 1 && (
                                  <button onClick={() => handleDeleteNoiDungInput(index, i)} type="button" className="btn btn-success">
                                    -
                                  </button>
                                )

                                }


                              </div>
                            </div>
                          </>
                        ))}

                      </div>

                    ))}

                    <button type='button' className='btn btn-primary mt-3' onClick={() => handleAddToHop()}>Thêm Tổ Hợp</button>
                  </div>
                </>

              ) : (
                <p></p>
              )

              }
              <h4 className="mt-4">Danh Sách SKU</h4>


              {skusList.length > 0 ? (
                <div className='border mb-3 p-3 rounded-3 shadow-sm row ' >
                  <div className='col-6'>
                    <label className='mb-3'>Thêm Giá Cho Toàn Bộ Sku</label>
                    <input
                      type="number"
                      className="form-control"
                      name="giaSanPham"
                      value={skusList.giaSanPham}
                      onChange={(e) => setGiaSanPham(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-success mt-3"
                      onClick={handleAddGiaSku}
                    >
                      Thêm Giá Cho Toàn Bộ SKU
                    </button>

                  </div>
                  <div className='col-6'>
                    <label className='mb-3'>Thêm Số Lượng Cho Toàn Bộ Sku</label>
                    <input
                      type="number"
                      className="form-control"
                      name="soLuong"
                      value={skusList.soLuong}
                      onChange={(e) => setSoLuong(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-success mt-3"
                      onClick={handleAddSoLuongSku}
                    >
                      Thêm Số Lượng Cho Toàn Bộ SKU
                    </button>

                  </div>
                </div>
              ) : (
                <p></p>
              )}




              <div>
                {skusList && skusList.length > 0 ? (
                  <table className="table table-hover table-bordered  shadow-sm ">
                    <thead className="table" >
                      <tr>
                        <th scope="col" className="text-center align-middle">STT</th>
                        {skusList[0].atributes.map((attribute, attrIndex) => (
                          <th key={attrIndex} scope="col" className="text-center align-middle">
                            {attribute.tieuDe}
                          </th>
                        ))}
                        <th scope="col" className="text-center align-middle">Giá Sản Phẩm</th>
                        <th scope="col" className="text-center align-middle">Số Lượng</th>
                        <th scope="col" className="text-center align-middle">Ảnh</th>
                        <th scope="col" className="text-center align-middle">Hành Động</th>
                      </tr>

                    </thead>
                    <tbody>
                      {skusList.map((sku, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          {sku.atributes.map((attribute, attrIndex) => (
                            <td key={attrIndex}>{attribute.noiDungTieuDe}</td>
                          ))}
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              name="giaSanPham"
                              value={sku.giaSanPham}
                              onChange={(e) => handleChangeSku(e, index)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              name="soLuong"
                              value={sku.soLuong}
                              onChange={(e) => handleChangeSku(e, index)}
                            />
                          </td>
                          <td>
                            <label htmlFor={`file-${index}`} className="form-label small">Thêm ảnh cho SKU</label>
                            {sku.hinhanh ? (
                              <img
                                src={sku.hinhanh.tenAnh} // Đường dẫn URL từ trường "tenAnh"
                                alt={`Thumbnail ${index + 1}`}
                                className="img-thumbnail me-2"
                                width="80px"
                                height="80px"
                              />
                            ) : (
                              <span>Không có hình ảnh</span> // Thông báo khi không có ảnh
                            )}
                            <input
                              type="file"
                              id={`file-${index}`}
                              className="form-control form-control-sm mt-2"

                              onChange={(e) => handleFileChange(e, index)}
                            />
                          </td>
                          <td>
                            {skusList.length >= 1 && (
                              <button onClick={() => handleDeleteSku(index)} type="button" className="btn btn-danger btn-sm ">
                                Xóa SKU
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                ) : (
                  <p>Chưa có tổ hợp nào được tạo.</p>
                )}

              </div>

              {edit ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary me-3 form-control"
                    onClick={handleAddSanPham}
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary form-control mt-3"
                    onClick={handleResetData}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary me-3 form-control"
                    onClick={handleUpdateSanPham}
                  >
                    Cập nhật
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary form-control mt-3"
                    onClick={handleResetData}
                  >
                    Hủy
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>

  );
};

export default QuanlySanPham;
