import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { format } from "date-fns";
const SanPham = () => {
    const location = useLocation();
    const [data, setData] = useState([]);
    const [dataOne, setDataOne] = useState([]);
    const [danhMucForm, setDanhMucForm] = useState([]);
    const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
    const [dataSanPhamTen, setDataSanPhamTen] = useState(false);
    const [sapXep, setSapXep] = useState('');
    const [danhMucDaChon, setDanhMucDaChon] = useState('');
    const noiDungTimKiem = location.state?.noiDungTimKiem || '';


    async function getSanPhamKhuyenMai() {
        const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
        setSanPhamKhuyenMaiForm(response.data);
    }

    async function getDanhMuc() {
        const response = await axios.get('http://localhost:8080/api/danhmuc');
        setDanhMucForm(response.data);
    }

    async function hienThiSanPhamTheoDanhMuc(idDanhMuc, tenDanhMuc) {
        const url = `http://localhost:8080/api/sanpham/danhmuc/${idDanhMuc}`;
        const response = await axios.get(url);
        setData(response.data);
        setDataOne(response.data)
        setDanhMucDaChon(tenDanhMuc);
    }

    async function hienThiSanPham() {
        const url = `http://localhost:8080/api/sanpham`;
        const response = await axios.get(url);
        setData(response.data);
        setDataOne(response.data)
        setDanhMucDaChon('')
    }

    async function hienThiSanPhamTheoTen() {
        const url = `http://localhost:8080/api/sanpham/timkiem?ten=${noiDungTimKiem}`;
        const response = await axios.get(url);
        setData(response.data);
        setDataOne(response.data)
    }

    function sapXepProducts(data) {

        const sapXepData = [...data];

        if (sapXep === '') {

            setData(dataOne);
            return;
        }

        sapXepData.sort((a, b) => {
            const giaGocA = a.skus?.[0]?.giaSanPham || 0;
            const khuyenMaiA = findKhuyenMai(a);
            const giaSauKhuyenMaiA = khuyenMaiA
                ? giaGocA - (giaGocA * (khuyenMaiA.khuyenMai.giaTriKhuyenMai / 100))
                : giaGocA;

            const giaGocB = b.skus?.[0]?.giaSanPham || 0;
            const khuyenMaiB = findKhuyenMai(b);
            const giaSauKhuyenMaiB = khuyenMaiB
                ? giaGocB - (giaGocB * (khuyenMaiB.khuyenMai.giaTriKhuyenMai / 100))
                : giaGocB;

            return sapXep === 'asc'
                ? giaSauKhuyenMaiA - giaSauKhuyenMaiB
                : giaSauKhuyenMaiB - giaSauKhuyenMaiA;
        });

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

console.log(danhMucDaChon)

    return (
        <main style={{ background: 'rgb(245,245,250)' }}>
            <div className='container' >
                <div className='row'>
                    <div className='col-3 my-3'>
                        <div className="card rounded-3 p-1 border shadow-sm" >
                            <div className="card-body">
                                <h5 className="card-title text-center text-primary">Danh mục</h5>
                                <ul className="list-group list-group-flush">
                                    <li
                                        className="list-group-item d-flex align-items-center danh-muc-item"
                                        onClick={() => hienThiSanPham()}
                                    >
                                        Tất cả
                                    </li>
                                    {danhMucForm.map((danhMuc) => (
                                        <li
                                            key={danhMuc.idDanhMuc}
                                            className="list-group-item d-flex align-items-center danh-muc-item"
                                            onClick={() => hienThiSanPhamTheoDanhMuc(danhMuc.idDanhMuc, danhMuc.tenDanhMuc)}
                                        >
                                            {danhMuc.tenDanhMuc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className='col-9'>

                        {danhMucDaChon && (
                            <div className='card border shadow-sm rounded-3 mt-3'>
                                <div className='card-body'>
                                    <h2>{danhMucDaChon}</h2>
                                </div>
                            </div>
                        )}
                        <div className='card border shadow-sm rounded-3 mt-3'>
                            <div className='card-body'>
                                <Carousel >
                                    <Carousel.Item>
                                        <img className="d-block w-100" src="/img/e95b916999b2dd40b3a8e2af30e704e8.png" alt="First slide" />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img className="d-block w-100" src="/img/95916a0bd08a84d64206ce6ef9e72010.png" alt="Second slide" />
                                    </Carousel.Item>
                                </Carousel>
                            </div>

                        </div>



                        <div className='card mb-3 p-1 mt-3 border shadow-sm'>
                            <div className='card-body'>
                                <h5 className="card-title">Tìm kiếm theo giá</h5>
                                <div className=''>
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
                            </div>
                        </div>


                        <div className="row">
                            {data.map((sanPham) => {
                                
                                const khuyenMaiData = findKhuyenMai(sanPham);
                                const now = new Date();
                                const giaGoc = sanPham.skus?.[0]?.giaSanPham || 0;

                                let giaSauKhuyenMai = 0;
                                let khuyenMaiConHieuLuc = false;


                                if (khuyenMaiData) {
                                    const startDate = new Date(khuyenMaiData.khuyenMai.ngayBatDau);
                                    const endDate = new Date(khuyenMaiData.khuyenMai.ngayKetThuc);


                                    giaSauKhuyenMai = giaGoc - (giaGoc * (khuyenMaiData.khuyenMai.giaTriKhuyenMai / 100));


                                    khuyenMaiConHieuLuc = now >= startDate && now <= endDate;
                                }
                                const firstSku = sanPham.skus?.[0];
                                const firstImage = firstSku?.hinhanhs?.[0];
                                return (
                                     sanPham.trangThai === false ? null : (
                                    <div key={sanPham.idSanPham} className="col-md-3 mb-3">
                                        <a href={`/chitietsanpham/${sanPham.idSanPham}`} className='text-white'>
                                            <div className="card border rounded-3 shadow-sm">
                                                <div className="card-img">
                                                    {firstImage ? (
                                                        <img
                                                            src={firstImage.tenAnh}
                                                            alt={`Product ${sanPham.tenSanPham} - Main Image`}
                                                            className="img-fluid"
                                                        />
                                                    ) : (
                                                        <div className="img-placeholder">No Image Available</div>
                                                    )}
                                                </div>
                                                <div className="card-body">
                                                    <p className='card-text'>{sanPham.tenSanPham}</p>
                                                    <p className="card-text text-danger fw-bold">
                                                        {khuyenMaiConHieuLuc ? (
                                                            <>
                                                                <span className="text-muted" style={{ textDecoration: 'line-through' }}>
                                                                    {giaGoc} VNĐ
                                                                </span>
                                                                <br />
                                                                {giaSauKhuyenMai.toFixed(2)} VNĐ
                                                            </>
                                                        ) : (
                                                            `${giaGoc.toLocaleString()} VNĐ`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                     )
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </main>

    );
};

export default SanPham;