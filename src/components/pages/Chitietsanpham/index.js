import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

export default function ChiTietSanPham() {
    const [data, setData] = useState({
        tenSanPham: '',
        moTa: '',
        shop: { idShop: '' },
        danhMuc: { idDanhMuc: '' }
    });
    const [skusList, setSkusList] = useState([]);
    const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
    const { id } = useParams();


    async function getSanPhamKhuyenMai() {
        const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
        setSanPhamKhuyenMaiForm(response.data);
    }

    async function getDataDisplayId() {
        const apiSanPham = 'http://localhost:8080/api/sanpham';
        const response = await axios.get(`${apiSanPham}/${id}`, data);

        setData({
            tenSanPham: response.data.tenSanPham,
            moTa: response.data.moTa,
            shop: { idShop: response.data.shop.idShop },
            danhMuc: { idDanhMuc: response.data.danhMuc.idDanhMuc }
        });

        setSkusList(
            response.data.skus.map((sku) => ({
                giaSanPham: sku.giaSanPham,
                soLuong: sku.soLuong,
                atributes: sku.tuyChonThuocTinhSkus.map((tuyChon) => ({
                    tieuDe: tuyChon.tuyChonThuocTinh.thuocTinh.ten,
                    noiDungTieuDe: tuyChon.tuyChonThuocTinh.giaTri,
                })),
                hinhanhs: sku.hinhanhs.map((image) => image.tenAnh) // Lấy tất cả ảnh từ hinhanhs
            }))
        );


    }
    console.log(skusList)
    useEffect(() => {
        if (id) {
            getDataDisplayId();
        }
        getSanPhamKhuyenMai();
    }, []);

    const giaGoc = skusList[0]?.giaSanPham || 0;

    const khuyenMaiData = sanPhamKhuyenMaiForm.find(
        (sanPhamKM) => sanPhamKM.sanPham.idSanPham === Number(id)
    );
    const now = new Date();

    let giaSauKhuyenMai = 0;
    let khuyenMaiConHieuLuc = false;
    if (khuyenMaiData) {
        const startDate = new Date(khuyenMaiData.khuyenMai.ngayBatDau);
        const endDate = new Date(khuyenMaiData.khuyenMai.ngayKetThuc);


        giaSauKhuyenMai = giaGoc - (giaGoc * (khuyenMaiData.khuyenMai.giaTriKhuyenMai / 100));


        khuyenMaiConHieuLuc = now >= startDate && now <= endDate;
    }
    // Tính tổng số lượng của sản phẩm
    const tongSoLuong = skusList.reduce((total, sku) => total + sku.soLuong, 0);

    const firstSku = skusList?.[0];
    const firstImage = firstSku?.hinhanhs?.[0];
    
    return (
        <div className="container mt-5 ">
            <div className="row my-3 m-5 border p-3 mb-5 shadow-sm">
                <div className="col-md-4">
                    <div className="card" style={{ width: '18rem' }}>
                        {firstImage ? (
                            <div className='card-header'>
                                <img
                                    src={firstImage}
                                    className="card-img-top"
                                    alt="Watch"
                                />
                            </div>
                        ) : (
                            <div className="img-placeholder">No Image Available</div>
                        )}
                        <div className="card-body">
                            <div className="d-flex justify-content-between mt-3">
                                {skusList.map(sku => (

                                    sku.hinhanhs.map(hinhAnh => (
                                        <img
                                            src={hinhAnh}
                                            alt="Thumbnail 1"
                                            className="img-thumbnail"
                                            width="80px"
                                            height="80px"
                                        />
                                    ))


                                ))}
                            </div>
                        </div>


                        <div className="card-footer text-muted">
                            <small>Xem thêm ưu điểm & lưu ý của sản phẩm</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <h2>🔥 NEW ARRIVAL 🔥</h2>
                    <hr />
                    <h3>{data.tenSanPham}</h3>


                    {khuyenMaiConHieuLuc ? (
                        <h1 className="text-muted" style={{ textDecoration: 'line-through' }}>
                            {`${giaGoc.toLocaleString()} VNĐ`}
                        </h1>
                    ) : (
                        <h1 className="text-danger" >
                            {`${giaGoc.toLocaleString()} VNĐ`}
                        </h1>
                    )}



                    {khuyenMaiConHieuLuc && (
                        <h1 className='text-danger'>
                            {`${giaSauKhuyenMai.toLocaleString()} VNĐ`}
                        </h1>
                    )}

                    <p>Còn: <strong>{tongSoLuong}</strong> sản phẩm | <strong>14,2k</strong> Đã Bán</p>
                    <hr />

                    <p>Vận Chuyển: Miễn phí vận chuyển</p>

                    {skusList.length > 0 ? (
                        <>
                            {/* Hiển thị từng nhóm thuộc tính */}
                            {skusList[0].atributes.map((attribute, attrIndex) => (
                                <div key={attrIndex}>
                                    <h5>{attribute.tieuDe}</h5>
                                    <div className="d-flex mb-3">
                                        {(() => {
                                            const displayedNoiDung = new Set(); // Set để lưu các giá trị đã hiển thị
                                            return skusList.map((sku) =>
                                                sku.atributes.map((attr, index) => (
                                                    attr.tieuDe === attribute.tieuDe && !displayedNoiDung.has(attr.noiDungTieuDe) && (
                                                        displayedNoiDung.add(attr.noiDungTieuDe), // Thêm giá trị vào Set sau khi hiển thị
                                                        <button
                                                            className="btn btn-outline-dark me-2"
                                                            key={index}
                                                        >
                                                            {attr.noiDungTieuDe}
                                                        </button>
                                                    )
                                                ))
                                            );
                                        })()}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>Chưa có tổ hợp nào được tạo.</p>
                    )}

                    <h5>Số lượng</h5>
                    <div className="input-group mb-3">
                        <button className="btn btn-secondary" type="button">-</button>
                        <input type="number" className="text-center" min="1" defaultValue="1" />
                        <button className="btn btn-secondary" type="button">+</button>
                    </div>
                    <button className="btn btn-danger me-2">Thêm Vào Giỏ Hàng</button>
                    <button className="btn btn-primary">Mua Ngay</button>
                </div>
            </div>
        </div>
    );
}
