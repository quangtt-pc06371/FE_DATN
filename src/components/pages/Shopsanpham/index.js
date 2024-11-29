import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ShopSanPham() {
    const { idShopSanPham } = useParams();
    const [shopSanPham, setShopSanPham] = useState([]);
    const [data, setData] = useState([]);
    const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
    const [danhMucForm, setDanhMucForm] = useState([]);
    const [sapXep, setSapXep] = useState('');
    const [dataOne, setDataOne] = useState([]);
    const [danhMucDaChon, setDanhMucDaChon] = useState('');

    console.log(shopSanPham)
    async function getShopSanPhamId() {
        try {
            const apiShop = 'http://localhost:8080/api/shop';
            const response = await axios.get(apiShop + '/' + idShopSanPham);
            setShopSanPham(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu shop:", error);
        }
    }


    async function getSanPhamKhuyenMai() {
        try {
            const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
            setSanPhamKhuyenMaiForm(response.data);
        } catch (error) {

        }

    }

    async function hienThiSanPham() {
        try {
            const apiShop = 'http://localhost:8080/api/sanpham/shop';
            const response = await axios.get(apiShop + '/' + idShopSanPham);
            setData(response.data);
            setDataOne(response.data);
            setDanhMucDaChon('');
        } catch (error) {
            console.log(error)
        }

    }
    async function hienThiDanhMuc() {
        try {
            const apiShop = 'http://localhost:8080/api/sanpham/shop';
            const response = await axios.get(apiShop + '/' + idShopSanPham + '/danhmuc');
            setDanhMucForm(response.data);

        } catch (error) {
            console.log(error)
        }

    }
    async function hienThiSanPhamTheoDanhMuc(idDanhMuc, tenDanhMuc) {
        try {
            const apiShop = 'http://localhost:8080/api/sanpham/shop';
            const response = await axios.get(apiShop + '/' + idShopSanPham + '/danhmuc/' + idDanhMuc);
            setData(response.data);
            
            setDanhMucDaChon(tenDanhMuc);
        } catch (error) {
            console.log(error)
        }

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
        getSanPhamKhuyenMai();
        hienThiDanhMuc();
        if (idShopSanPham) {
            getShopSanPhamId();
            hienThiSanPham();
        }
    }, [idShopSanPham]);
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
    const findSanPhamKhuyenMaiShop = (sanPham) => sanPhamKhuyenMaiForm.filter(
        (item) => item.sanPham.idSanPham === sanPham.idSanPham
    );
    console.log(data)
    // Tính tổng số lượng SKU trong tất cả các sản phẩm
    const tongSanPham = dataOne.length
    
    console.log(tongSanPham)





    return (
        shopSanPham.isActive   && (
        <div className="container mt-5">
            <div className="card p-3 d-flex flex-row align-items-center">
                <img
                    src={shopSanPham.shopImage }
                    alt={shopSanPham.shopName }
                    className="rounded-circle border"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
                <div className="ms-3">
                    <h1 className="mb-2 fw-bold">{shopSanPham.shopName}</h1>
                    <p className="text-muted">{shopSanPham.shopDescription}</p>
                    <h4>Sản Phẩm: {tongSanPham}</h4>
                </div>
            </div>



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

                            const sanPhamKhuyenMaiDT = findSanPhamKhuyenMaiShop(sanPham);

                            const doiTuongSanPhamKM = sanPhamKhuyenMaiDT.find(
                                (promo) => promo.trangThai === true
                            );
                            
                            const giaGoc = sanPham.skus?.[0]?.giaSanPham || 0;

                            let giaSauKhuyenMai = 0;
                            let khuyenMaiConHieuLuc = false;


                            if (doiTuongSanPhamKM) {
                                const now = new Date();
                                const startDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayBatDau);
                                const endDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayKetThuc);


                                giaSauKhuyenMai = giaGoc - (giaGoc * (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai / 100));


                                khuyenMaiConHieuLuc = now > endDate;
                            }
                            const firstSku = sanPham.skus?.[0];
                            const firstImage = firstSku?.hinhanh;
                            return (
                                sanPham.trangThai === false ? null : (
                                    <div key={sanPham.idSanPham} className="col-md-3 mb-3">
                                        <a href={`/chitietsanpham/${sanPham.idSanPham}`} className='text-white'>
                                            <div className="card border rounded-3 shadow-sm h-100">
                                                <div className="card-header">
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
                                                        {khuyenMaiConHieuLuc === false ? (
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
        )
    );
}
