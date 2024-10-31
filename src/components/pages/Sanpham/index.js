import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";

const SanPham = () => {
    const [data, setData] = useState([]);
    const [danhMucForm, setDanhMucForm] = useState([]);
    const [selectedDanhMuc, setSelectedDanhMuc] = useState({ id: null, name: "Tất cả sản phẩm" });

    async function getDanhMuc() {
        const response = await axios.get('http://localhost:8080/api/danhmuc');
        setDanhMucForm(response.data);
    }

    async function hienThiSanPham(idDanhMuc) {
        const url = idDanhMuc
            ? `http://localhost:8080/api/sanpham/danhmuc/${idDanhMuc}`
            : `http://localhost:8080/api/sanpham`;

        const response = await axios.get(url);
        setData(response.data);
    }

    useEffect(() => {
        getDanhMuc();
        if (selectedDanhMuc !== null) {
            hienThiSanPham(selectedDanhMuc.id); // Gọi API để hiển thị sản phẩm theo danh mục
        } else {
            hienThiSanPham(null);
        }
    }, [selectedDanhMuc]);

    

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-3 my-3'>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title ">Danh mục</h5>
                            <ul className="list-group list-group-flush">
                                <li
                                    className="list-group-item d-flex align-items-center"
                                    onClick={() => setSelectedDanhMuc({ id: null, name: "Tất cả sản phẩm" })} // Chọn tất cả sản phẩm
                                    style={{ cursor: 'pointer' }}
                                >
                                    Tất cả
                                </li>
                                {danhMucForm.map((danhMuc) => (
                                    <li
                                        key={danhMuc.idDanhMuc}
                                        className="list-group-item d-flex align-items-center"
                                        onClick={() => setSelectedDanhMuc({ id: danhMuc.idDanhMuc, name: danhMuc.tenDanhMuc })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {danhMuc.tenDanhMuc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='col-9'>
                    <h3 className='my-3'> {selectedDanhMuc.name}</h3>

                    <Carousel className='my-4'>
                        <Carousel.Item>
                            <img className="d-block w-100" src="/img/e95b916999b2dd40b3a8e2af30e704e8.png" alt="First slide" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src="/img/95916a0bd08a84d64206ce6ef9e72010.png" alt="Second slide" />
                        </Carousel.Item>
                    </Carousel>

                    <div className="row">
                        {data.map((sanPham) => (
                            <div key={sanPham.idSanPham} className="col-md-3 mb-3">
                                <a href={`/chitietsanpham/${sanPham.idSanPham}`} className='text-white'>
                                    <div className="card">
                                        <img src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp" alt="Product 1" className="card-img-top" />
                                        <div className="card-body">
                                            <p className='card-text'>{sanPham.tenSanPham}</p>
                                            <p className="card-text text-danger fw-bold">
                                                {sanPham.skus?.[0]?.giaSanPham ? `${sanPham.skus[0].giaSanPham} VNĐ` : 'Giá không có sẵn'}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SanPham;
