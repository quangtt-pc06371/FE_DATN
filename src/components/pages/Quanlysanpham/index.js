// src/components/QuanlySanPham.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from 'date-fns';
import { useParams } from 'react-router-dom';
import { id } from 'date-fns/locale';
const QuanlySanPham = () => {
  const [formData, setFormData] = useState({
    tenSanPham: '',
    moTa: '',
    shop: { idShop: parseInt('') },
    danhMuc: { idDanhMuc: parseInt('') }
  }
  )

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
  const [files, setFiles] = useState([]);

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
    //  console.log(skusList);
    // Cập nhật giá trị cho trường name
    updatedSkus[index][name] = value;
    // console.log(skusList);
    setSkusList(updatedSkus);

  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "shop") {
      setFormData({
        ...formData,
        shop: { idShop: parseInt(value) }
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
  const files = Array.from(event.target.files);

  setSkusList((prevSkusList) => {
    return prevSkusList.map((sku, i) => {
      if (i === index) {
        let updatedHinhanhs;
        
        // Nếu hinhanhs trống, khởi tạo mảng mới với các file được chọn
        if (sku.hinhanhs.length === 0) {
          updatedHinhanhs = files.map((file) => ({ file }));
        } else {
          updatedHinhanhs = sku.hinhanhs.map((hinhanh, j) => ({
            ...hinhanh,
            file: files[j] || hinhanh.file, // Cập nhật file nếu có, giữ lại file cũ nếu không có file mới
          }));
        }

        return { ...sku, hinhanhs: updatedHinhanhs };
      }
      return sku;
    });
  });
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
      soLuong: 0,
      giaSanPham: 0,
      hinhanhs: []
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
      shop: { idShop: response.data.shop.idShop },
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
        hinhanhs: sku.hinhanhs.map((image) => ({
          idHinhAnh: image.idHinhAnh,
          tenAnh: image.tenAnh,
        })),
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
      shop: { idShop: '' },
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
        const sku = skusList[i]; // Lấy thông tin SKU tương ứng từ skusList
        console.log(sku)
        console.log(idSku)
        
        if (sku.hinhanhs && sku.hinhanhs.length > 0) {
          console.log('Hinhanhs: ', sku.hinhanhs);
          const formData = new FormData();

          // Append các file ảnh của SKU vào FormData
          sku.hinhanhs.forEach((hinhAnh) => {
            formData.append('file', hinhAnh.file);
          });

          console.log(`Uploading images for SKU ID: ${idSku}`);

          // Gửi request để upload ảnh cho SKU với đúng idSku
          await axios.post(`http://localhost:8080/api/sanpham/upload/${idSku}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }else{
          console.log('Không có ảnh để tải lên');
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
        console.log(skuData);
        // Kiểm tra nếu có ảnh trong `hinhanhs`
        if (skuData.hinhanhs && skuData.hinhanhs.length > 0) {
          for (let j = 0; j < skuData.hinhanhs.length; j++) {
            const image = skuData.hinhanhs[j]; // Ảnh hiện tại từ danh sách ảnh của SKU
            console.log(image);
            
            // Kiểm tra xem file ảnh đã thay đổi hay chưa (ví dụ kiểm tra nếu có file mới)
            if (image.file) {
              const formData = new FormData();
              formData.append('file', image.file); // Đảm bảo `file` là File hoặc Blob đã chọn
  
              console.log(`Uploading image for SKU ID: ${skuData.idSku}, Image ID: ${image.idHinhAnh}`);
  
              // Gửi yêu cầu để upload ảnh cho SKU với đúng idSku và idAnh
              await axios.put(
                `http://localhost:8080/api/sanpham/update/${skuData.idSku}/${image.idHinhAnh}`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
            }
          }
        }
      }
      alert('Upload ảnh thành công');
    } catch (error) {
      console.error('Lỗi khi upload ảnh:', error);
      alert('Có lỗi xảy ra khi upload ảnh');
    }
  };
  
  




  async function handleAddSanPham() {
    if (!formData.tenSanPham.trim() || !formData.moTa || !formData.shop.idShop || !formData.danhMuc.idDanhMuc) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }
    for (const sku of skusList) {
      if (parseFloat(sku.giaSanPham) <= 0) {
        alert("Giá sản phẩm phải lớn hơn 0 !");
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
    }
    if (skusList.length === 0) {
      alert("Chưa có danh sách biến thể sản phẩm!");
      return;
    }
    const newData = {
      tenSanPham: formData.tenSanPham,
      moTa: formData.moTa,
      shop: {
        idShop: parseInt(formData.shop.idShop),
      },
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
        hinhanhs: sku.hinhanh || [],
      })),
    };

    // Log dữ liệu ra console trước khi gửi
    console.log('Dữ liệu gửi đi:', newData);

    try {
      const addData = await axios.post('http://localhost:8080/api/sanpham', newData);
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

    const newData = {
      tenSanPham: formData.tenSanPham,
      moTa: formData.moTa,
      shop: {
        idShop: parseInt(formData.shop.idShop),
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
        hinhanhs: sku.hinhanh || [],
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
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="card-header bg-body-secondary d-flex justify-content-between align-items-center">
          <h2>Thêm Sản Phẩm</h2>
          <a href='/danhsachsanpham' type="button" className="btn btn-primary ms-auto">
            Danh Sách Sản Phẩm
          </a>
        </div>
        <div className="card-body">
          <form>
            {/* Thông tin sản phẩm */}
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
            <div className="mb-3">
              <label htmlFor="">Shop khuyến mãi:</label>
              <select
                className="form-control"
                name="shop"
                value={formData.shop.idShop}
                onChange={handleChange}
              >
                <option value="">Chọn Shop</option>
                {shopForm.map((s) => (
                  <option key={s.idShop} value={s.idShop}>{s.shopName}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
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

            <h4 className="mt-4">Danh Sách SKU</h4>


            {skusList.length > 0 ? (
              <div className='border mb-3 p-3 rounded-3 shadow-sm row'>
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
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>STT</th>
                      {skusList[0].atributes.map((attribute, attrIndex) => (
                        <th key={attrIndex}>{attribute.tieuDe}</th>
                      ))}
                      <th>Giá Sản Phẩm</th>
                      <th>Số Lượng</th>
                      <th>Ảnh</th>
                      <th>Hành Động</th>
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
                            className="form-control"
                            name="giaSanPham"
                            value={sku.giaSanPham}
                            onChange={(e) => handleChangeSku(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="soLuong"
                            value={sku.soLuong}
                            onChange={(e) => handleChangeSku(e, index)}
                          />
                        </td>
                        <td>
                          <label htmlFor={`file-${index}`} className="form-label">Thêm ảnh cho SKU</label>
                          {/* Hiển thị ảnh cho SKU hiện tại */}
                          {sku.hinhanhs.map((hinhAnh, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={hinhAnh.tenAnh}  // Đảm bảo `tenAnh` là URL của ảnh
                              alt={`Thumbnail ${index + 1}`}
                              className="img-thumbnail"
                              width="80px"
                              height="80px"
                              
                            />
                          ))}
                          <input
                            type="file"
                            id={`file-${index}`}
                            className="form-control"
                            multiple
                            onChange={(e) => handleFileChange(e, index)} // Thêm file cho từng SKU
                          />
                        </td>
                        <td>
                          {skusList.length >= 1 && (
                            <button onClick={() => handleDeleteSku(index)} type="button" className="btn btn-danger">
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
  );
};

export default QuanlySanPham;
