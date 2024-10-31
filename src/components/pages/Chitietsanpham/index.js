import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useEffect } from "react";
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

    const { id } = useParams();

    async function getDataDisplayId() {

        const apiSanPham = 'http://localhost:8080/api/sanpham';
        const response = await axios.get(apiSanPham + '/' + id, data);

        setData({
            tenSanPham: response.data.tenSanPham,
            moTa: response.data.moTa,
            shop: { idShop: response.data.shop.idShop },
            danhMuc: { idDanhMuc: response.data.danhMuc.idDanhMuc }
        })

        setSkusList(
            response.data.skus.map((sku) => ({
                giaSanPham: sku.giaSanPham,
                soLuong: sku.soLuong,
                atributes: sku.tuyChonThuocTinhSkus.map((tuyChon) => ({
                    tieuDe: tuyChon.tuyChonThuocTinh.thuocTinh.ten,
                    noiDungTieuDe: tuyChon.tuyChonThuocTinh.giaTri,
                })),
            }))
        );
    }

    useEffect(() => {
        if (id) {
            getDataDisplayId();
        }
    }, []);

    return (
        <div className="container mt-5 ">
            <div className="row my-3 m-5">
                <div className="col-md-4">
                    <div className="card" style={{ width: '18rem' }}>
                        <div className='card-header'>
                            <img
                                src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp"
                                className="card-img-top"
                                alt="Watch"
                            />
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mt-3">
                                <img
                                    src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp"
                                    alt="Thumbnail 1"
                                    className="img-thumbnail"
                                    width="80px"
                                    height="80px"
                                />
                                <img
                                    src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp"
                                    alt="Thumbnail 2"
                                    className="img-thumbnail"
                                    width="80px"
                                    height="80px"
                                />
                                <img
                                    src="/img/e13cbafd569195b491a654c5ce34922a.jpg.webp"
                                    alt="Thumbnail 3"
                                    className="img-thumbnail"
                                    width="80px"
                                    height="80px"
                                />

                            </div>
                        </div>
                        <div className="card-footer text-muted">
                            <small>Xem thêm ưu điểm & lưu ý của sản phẩm</small>
                        </div>
                    </div>



                </div>
                <div className="col-md-8">
                    <h2>🔥 NEW ARRIVAL 🔥</h2>

                    <p>{data.tenSanPham}</p>
                    <div className="mb-2">
                        <span className="text-danger h4"></span>

                        <span className="badge bg-danger ms-2">50% GIẢM</span>
                    </div>
                    <p>Còn: <strong>32</strong> sản phẩm | <strong>14,2k</strong> Đã Bán</p>
                    <hr />
                    <div className="d-flex mb-3">
                        <button className="btn btn-outline-secondary me-2">Giảm ₫5k</button>
                        <button className="btn btn-outline-secondary">Giảm ₫10k</button>
                    </div>
                    <p>Vận Chuyển: Miễn phí vận chuyển</p>
                    {/* {skusList.length > 0 ? (
                        <>
                            <hr />
                            {skusList[0].atributes.map((attribute, attrIndex) => (
                                <h5 key={attrIndex}>{attribute.tieuDe}</h5>
                            ))}

                            {skusList.map((sku, index) => (

                                <div className="d-flex mb-3" key={index}>
                                    {sku.atributes.map((attribute, attrIndex) => (
                                        <button className="btn btn-outline-dark me-2" key={attrIndex}>{attribute.noiDungTieuDe}</button>
                                    ))}
                                </div>


                            ))}

                            <h5>Kích Thước</h5>
                            <div className="d-flex mb-3">
                                <button className="btn btn-outline-dark me-2">M</button>
                                <button className="btn btn-outline-dark me-2">L</button>
                                <button className="btn btn-outline-dark">XL</button>
                            </div>

                        </>
                    ) : (
                        <p>Chưa có tổ hợp nào được tạo.</p>
                    )} */}
                    {skusList.length > 0 ? (
                        <>
                            {/* Hiển thị từng nhóm thuộc tính */}
                            {skusList[0].atributes.map((attribute, attrIndex) => (
                                <div key={attrIndex}>
                                    <h5>{attribute.tieuDe}</h5>
                                    <div className="d-flex mb-3">
                                        {skusList.map((sku, index) => (
                                            sku.atributes.map((attr, attrIndex) => (
                                                attr.tieuDe === attribute.tieuDe && (
                                                    <button
                                                        className="btn btn-outline-dark me-2"
                                                        key={attrIndex}
                                                    >
                                                        {attr.noiDungTieuDe}
                                                    </button>
                                                )
                                            ))
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Kích thước ví dụ */}
                            <h5>Kích Thước</h5>
                            <div className="d-flex mb-3">
                                <button className="btn btn-outline-dark me-2">M</button>
                                <button className="btn btn-outline-dark me-2">L</button>
                                <button className="btn btn-outline-dark">XL</button>
                            </div>
                        </>
                    ) : (
                        <p>Chưa có tổ hợp nào được tạo.</p>
                    )}

                    <h5>Số lượng</h5>
                    <div className="input-group mb-3">
                        <button className="btn btn-secondary" type="button">-</button>
                        <input type="number" className=" text-center" min="1" defaultValue="1" />
                        <button className="btn btn-secondary" type="button">+</button>
                    </div>
                    <button className="btn btn-danger me-2">Thêm Vào Giỏ Hàng</button>
                    <button className="btn btn-primary">Mua Ngay</button>
                </div>








            </div>
        </div>
    );
};

