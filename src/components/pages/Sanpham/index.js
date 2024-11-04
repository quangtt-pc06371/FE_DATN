import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";
import { useLocation } from 'react-router-dom';

const SanPham = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [danhMucForm, setDanhMucForm] = useState([]);
    const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
    const [dataSanPhamTen, setDataSanPhamTen] = useState(false);
    const [sapXep, setSapXep] = useState('');
    const noiDungTimKiem = location.state?.noiDungTimKiem || '';

    async function getSanPhamKhuyenMai() {
        const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
        setSanPhamKhuyenMaiForm(response.data);
    }

    async function getDanhMuc() {
        const response = await axios.get('http://localhost:8080/api/danhmuc');
        setDanhMucForm(response.data);
    }

    async function hienThiSanPhamTheoDanhMuc(idDanhMuc) {
        const url = `http://localhost:8080/api/sanpham/danhmuc/${idDanhMuc}`;
        const response = await axios.get(url);
        setData(response.data);
    }

    async function hienThiSanPham() {
        const url = `http://localhost:8080/api/sanpham`;
        const response = await axios.get(url);
        setData(response.data);
    }

    async function hienThiSanPhamTheoTen() {
        const url = `http://localhost:8080/api/sanpham/timkiem?ten=${noiDungTimKiem}`;
        const response = await axios.get(url);
        setData(response.data);
    }

    function sapXepProducts(data) {
        const sapXepData = [...data];
        if (sapXep === 'asc') {
            sapXepData.sort((a, b) => a.skus[0].giaSanPham - b.skus[0].giaSanPham);
        } else if (sapXep === 'desc') {
            sapXepData.sort((a, b) => b.skus[0].giaSanPham - a.skus[0].giaSanPham);
        }
        setData(sapXepData);
    }

    useEffect(() => {
        getDanhMuc();
        getSanPhamKhuyenMai();
        if (noiDungTimKiem) {
            hienThiSanPhamTheoTen(noiDungTimKiem);
            setDataSanPhamTen(true);
        }
        if (dataSanPhamTen === false) {
            hienThiSanPham();
        }
    }, [noiDungTimKiem]);

    useEffect(() => {
        if (data.length > 0) {
            sapXepProducts(data);
        }
    }, [sapXep]);

    const findKhuyenMai = (sanPham) => {
        return sanPhamKhuyenMaiForm.find(
            (sanPhamKhuyenMai) => sanPhamKhuyenMai.sanPham.idSanPham === sanPham.idSanPham
        );
    };
 
   

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
                                    onClick={() => hienThiSanPham()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Tất cả
                                </li>
                                {danhMucForm.map((danhMuc) => (
                                    <li
                                        key={danhMuc.idDanhMuc}
                                        className="list-group-item d-flex align-items-center"
                                        onClick={() => hienThiSanPhamTheoDanhMuc(danhMuc.idDanhMuc)}
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
                    <Carousel className='my-4'>
                        <Carousel.Item>
                            <img className="d-block w-100" src="/img/e95b916999b2dd40b3a8e2af30e704e8.png" alt="First slide" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src="/img/95916a0bd08a84d64206ce6ef9e72010.png" alt="Second slide" />
                        </Carousel.Item>
                    </Carousel>

                    <hr />
                    <h5 className="card-title">Tìm kiếm theo giá</h5>
                    <div className='my-3'>
                        <select
                            className="form-select"
                            value={sapXep}
                            onChange={(e) => setSapXep(e.target.value)}
                        >
                            <option value="">Chọn thứ tự giá</option>
                            <option value="asc">Từ Thấp đến Cao</option>
                            <option value="desc">Từ Cao đến Thấp</option>
                        </select>
                    </div>

                    <div className="row">
                        {data.map((sanPham) => {
                            const khuyenMaiData = findKhuyenMai(sanPham);
                            const giaGoc = sanPham.skus?.[0]?.giaSanPham || 0;
                            const giaSauKhuyenMai = khuyenMaiData
                                ? giaGoc - (giaGoc * (khuyenMaiData.khuyenMai.giaTriKhuyenMai / 100))
                                : giaGoc;
                                console.log(khuyenMaiData) 
                            return (
                                <div key={sanPham.idSanPham} className="col-md-3 mb-3">
                                    <a href={`/chitietsanpham/${sanPham.idSanPham}`} className='text-white'>
                                        <div className="card">
                                            <img src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp" alt="Product" className="card-img-top" />
                                            <div className="card-body">
                                                <p className='card-text'>{sanPham.tenSanPham}</p>
                                                <p className="card-text text-danger fw-bold">
                                                    {khuyenMaiData ? (
                                                        <>
                                                            <span className="text-muted" style={{ textDecoration: 'line-through' }}>
                                                                {giaGoc} VNĐ
                                                            </span>
                                                            <br />
                                                            {giaSauKhuyenMai.toFixed(2)} VNĐ
                                                        </>
                                                    ) : (
                                                        `${giaGoc} VNĐ`
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SanPham;
