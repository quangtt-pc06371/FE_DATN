import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
export default function ChiTietSanPham() {

    const [data, setData] = useState({
        tenSanPham: '',
        moTa: '',
        shop: {},
        danhMuc: {}
    });


    const [sanPhamShop, setSanPhamShop] = useState([]);

    const [skusList, setSkusList] = useState([]);
    const [sanPhamKhuyenMaiForm, setSanPhamKhuyenMaiForm] = useState([]);
    const { id } = useParams();
    const [soLuong, setSoLuong] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [giaTriDaChon, setGiaTriDaChon] = useState({});
    const [shopData, setShopData] = useState([]);
    const token = Cookies.get('token');
    console.log(selectedImage)
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

        }


    }


    const tangSoLuong = () => {
        setSoLuong(prev => prev + 1);
    };

    const giamSoLuong = () => {
        setSoLuong(prev => (prev > 1 ? prev - 1 : 1));
    };

    async function getSanPhamKhuyenMai() {
        const response = await axios.get('http://localhost:8080/api/sanphamkhuyenmai');
        setSanPhamKhuyenMaiForm(response.data);
    }

    async function hienThiSanPham() {
        try {
            const apiShop = 'http://localhost:8080/api/sanpham/shop';
            const response = await axios.get(apiShop + '/' + data.shop.id);
            setSanPhamShop(response.data);

        } catch (error) {
            console.log(error)
        }
    }
    async function getDataDisplayId() {
        const apiSanPham = 'http://localhost:8080/api/sanpham';
        const response = await axios.get(`${apiSanPham}/${id}`, data);
        console.log(response)
        setData({
            tenSanPham: response.data.tenSanPham,
            moTa: response.data.moTa,
            shop: response.data.shop,
            danhMuc: response.data.danhMuc
        });

        setSkusList(
            response.data.skus.map((sku) => ({
                idSku: sku.idSku,
                giaSanPham: sku.giaSanPham,
                soLuong: sku.soLuong,
                atributes: sku.tuyChonThuocTinhSkus.map((tuyChon) => ({
                    tieuDe: tuyChon.tuyChonThuocTinh.thuocTinh.ten,
                    noiDungTieuDe: tuyChon.tuyChonThuocTinh.giaTri,
                })),
                hinhanh: sku.hinhAnh // Lấy một hình ảnh duy nhất
                    ? {
                        idHinhAnh: sku.hinhAnh.idHinhAnh,
                        tenAnh: sku.hinhAnh.tenAnh,
                    }
                    : null,
            }))
        );
        if (
            response.data.skus.length > 0 && // Có ít nhất 1 SKU
            response.data.skus[0].hinhAnh // SKU đầu tiên có hình ảnh
        ) {
            setSelectedImage(response.data.skus[0].hinhAnh.tenAnh); // Chọn ảnh đầu tiên của SKU đầu tiên
        }


    }
    console.log(skusList)
    const getSku = () => {
        return skusList.find(sku => {
            return sku.atributes.every(attr =>
                giaTriDaChon[attr.tieuDe] === attr.noiDungTieuDe
            );
        });
    };



    async function handleAddGioHang() {
        const sku = getSku();
        const token = Cookies.get('token');
        

        if (!sku) {
            Swal.fire('Vui lòng chọn đầy đủ các tùy chọn thuộc tính trước khi thêm vào giỏ hàng.');
            return;
        }



        if (!token) {
            Swal.fire('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
            return;
        }

        console.log("Token được gửi:", token);

        const dataToSent = new URLSearchParams();
        dataToSent.append('idSku', sku.idSku);
        dataToSent.append('quantity', soLuong);

        try {
            const addData = await axios.post(
                'http://localhost:8080/api/cart/addDetail',
                dataToSent,
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            Swal.fire('Thêm vào giỏ hàng thành công!');
        } catch (error) {
            Swal.fire('Có lỗi xảy ra khi thêm vào giỏ hàng!');
            console.error(error);
        }

    }


    // console.log(skusList)
    useEffect(() => {
        if (id) {
            getDataDisplayId();

        }
        if (token) {
            layShop();
        }

        getSanPhamKhuyenMai();
    }, [id]);
    useEffect(() => {
        if (data.shop?.id) {
            hienThiSanPham();
        }
    }, [data.shop?.id]);


    const skuGet = getSku();

    const giaGoc = skuGet ? skuGet.giaSanPham : skusList[0]?.giaSanPham || 0;


    const findSanPhamKhuyenMai = sanPhamKhuyenMaiForm.filter(
        (item) => item.sanPham.idSanPham === Number(id)
    );
    const doiTuongSanPhamKM = findSanPhamKhuyenMai.find(
        (promo) => promo.trangThai === true
    );
    console.log(findSanPhamKhuyenMai)
    console.log(doiTuongSanPhamKM)

    const now = new Date();

    let giaSauKhuyenMai = 0;
    let khuyenMaiConHieuLuc = true;
    if (doiTuongSanPhamKM) {
        const startDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayBatDau);
        const endDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayKetThuc);


        giaSauKhuyenMai = giaGoc - (giaGoc * (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai / 100));


        khuyenMaiConHieuLuc = now > endDate;
    }


    const tongSoLuong = skuGet ? skuGet.soLuong : skusList[0]?.soLuong;






    const handleGiaTri = (tieuDe, noiDungTieuDe) => {
        setGiaTriDaChon(thuocTinhDaChon => ({
            ...thuocTinhDaChon,
            [tieuDe]: noiDungTieuDe
        }));
    };


    const handleThumbnailClick = (image) => {
        setSelectedImage(image); // Cập nhật ảnh lớn khi người dùng click vào thumbnail
    };
    const findKhuyenMai = (sanPham) => {
        return sanPhamKhuyenMaiForm.find(
            (sanPhamKhuyenMai) => sanPhamKhuyenMai.sanPham.idSanPham === sanPham.idSanPham
        );
    };
    const findSanPhamKhuyenMaiShop = (sanPham) => sanPhamKhuyenMaiForm.filter(
        (item) => item.sanPham.idSanPham === sanPham.idSanPham
    );
    console.log(skusList)
    return (
        <main >
            <div className="container mt-5 " >
                <div className="row my-3 m-5 border p-3 mb-5 shadow-sm rounded-3">
                    <div className="col-md-4">
                        <div className="card" style={{ width: '18rem' }}>
                            <div className='card-header'>
                                <img
                                    src={selectedImage}  // Hiển thị hình ảnh lớn khi click vào thumbnail
                                    className="card-img-top"
                                    alt="Product"
                                    style={{ width: '100%' }}  // Tự động điều chỉnh kích thước cho phù hợp
                                />
                            </div>
                            <div className="card-body">
                                {/* overflowX: 'auto': Cho phép cuộn ngang khi nội dung vượt quá chiều rộng container */}
                                {/* whiteSpace: 'nowrap': Đảm bảo rằng các ảnh sẽ không xuống dòng mà nằm ngang trên một dòng duy nhất */}
                                <div className="d-flex justify-content-start mt-3 " style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                    {skusList.map((sku, index) => (

                                        <img
                                            key={index}
                                            src={sku.hinhanh.tenAnh}  // URL của ảnh thumbnail
                                            alt={`Thumbnail ${index + 1}`}
                                            className="img-thumbnail me-2 hinh-anh-chi-tiet"
                                            style={{ width: '80px', height: '80px', display: 'inline-block' }}
                                            onClick={() => handleThumbnailClick(sku.hinhanh.tenAnh)} // Cập nhật ảnh lớn khi click vào thumbnail
                                        />

                                    ))}
                                </div>

                            </div>



                            <div className="card-footer text-muted">
                                <small>Xem thêm ưu điểm & lưu ý của sản phẩm</small>
                            </div>


                        </div>

                        <div className="mt-3 card shadow-sm p-3 d-flex flex-row align-items-center gap-3" style={{ width: '18rem' }}>
                            <img
                                src={data.shop.shopImage}
                                alt={data.shop.shopImage}
                                className="rounded-circle border"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                                <h5 className="mb-2 fw-bold">{data.shop.shopName}</h5>
                                <a className="btn btn-outline-primary btn-sm" href={`/shopsanpham/${data.shop.id}`}>
                                    Xem Shop
                                </a>
                            </div>
                        </div>


                    </div>
                    <div className="col-md-8">
                        <h2>🔥 NEW ARRIVAL 🔥</h2>
                        <hr />
                        <h3>{data.tenSanPham}</h3>


                        {khuyenMaiConHieuLuc === false ? (
                            <h1 className="text-muted" style={{ textDecoration: 'line-through' }}>
                                <td>{`${giaGoc.toLocaleString('vi-VN')} VNĐ`}</td>
                            </h1>
                        ) : (
                            <h1 className="text-danger" >
                                <td>{`${giaGoc.toLocaleString('vi-VN')} VNĐ`}</td>
                            </h1>
                        )}

                        {khuyenMaiConHieuLuc === false && (
                            <h1 className='text-danger'>
                                {`${giaSauKhuyenMai.toLocaleString('vi-VN')} VNĐ`}
                            </h1>
                        )}

                        <p>Số lượng còn: <strong>{tongSoLuong}</strong> </p>
                        <hr />



                        {skusList.length > 0 ? (
                            <>

                                {skusList[0].atributes.map((attribute, attrIndex) => {
                                    const displayedNoiDung = new Set(); // Tập hợp để lưu các giá trị đã hiển thị

                                    return (
                                        <div key={attrIndex}>
                                            <h5>{attribute.tieuDe}</h5>
                                            <div className="d-flex mb-3">
                                                {skusList.flatMap((sku) =>
                                                    sku.atributes.filter((attr) =>
                                                        attr.tieuDe === attribute.tieuDe &&
                                                        !displayedNoiDung.has(attr.noiDungTieuDe)

                                                    ).map((attr, index) => {
                                                        displayedNoiDung.add(attr.noiDungTieuDe); // Thêm giá trị vào Set để tránh lặp lại
                                                        return (
                                                            <button
                                                                key={index}
                                                                className={`btn me-2 ${giaTriDaChon[attribute.tieuDe] === attr.noiDungTieuDe
                                                                    ? 'btn-primary'
                                                                    : 'border btn-light'
                                                                    }`}
                                                                onClick={() => handleGiaTri(attribute.tieuDe, attr.noiDungTieuDe)}
                                                            >
                                                                {attr.noiDungTieuDe}
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            </>
                        ) : (
                            <p>Chưa có tổ hợp nào được tạo.</p>
                        )}

                        <h5>Số lượng</h5>
                        <div className="input-group mb-3">
                            <div className="input-group mb-3">
                                <button className="btn btn-secondary" type="button" onClick={giamSoLuong}>-</button>
                                <input
                                    type="number"
                                    className="text-center"
                                    min="1"
                                    value={soLuong}
                                    onChange={(e) => setSoLuong(parseInt(e.target.value))}
                                />
                                <button className="btn btn-secondary" type="button" onClick={tangSoLuong}>+</button>
                            </div>

                        </div>
                        {shopData?.id !== data?.shop?.id && (
                            <button className="btn btn-danger me-2" onClick={handleAddGioHang}>Thêm Vào Giỏ Hàng</button>
                        )}



                    </div>
                </div>

                <div className="row my-3 m-5 border p-3 mb-5 shadow-sm rounded-3">
                    <h3 className='my-3'>Các Sản Phẩm Khác Của Shop</h3>
                    {sanPhamShop.map((sanPham) => {

                        const sanPhamKhuyenMaiDT = findSanPhamKhuyenMaiShop(sanPham)

                        const doiTuongSanPhamKM = sanPhamKhuyenMaiDT.find(
                            (promo) => promo.trangThai === true
                        );

                        console.log(doiTuongSanPhamKM)

                        const now = new Date();
                        const giaGoc = sanPham.skus?.[0]?.giaSanPham || 0;

                        let giaSauKhuyenMai = 0;
                        let khuyenMaiConHieuLuc = true;


                        if (doiTuongSanPhamKM) {
                            const startDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayBatDau);
                            const endDate = new Date(doiTuongSanPhamKM.khuyenMai.ngayKetThuc);


                            giaSauKhuyenMai = giaGoc - (giaGoc * (doiTuongSanPhamKM.khuyenMai.giaTriKhuyenMai / 100));

                            khuyenMaiConHieuLuc = now > endDate;
                        }
                        const firstSku = sanPham.skus?.[0];
                        const firstImage = firstSku?.hinhAnh;
                        console.log(firstSku)
                        return (
                            sanPham.trangThai === false ? null : (
                                <div key={sanPham.idSanPham} className="col-md-2 mb-3">
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
                                                                {`${giaGoc.toLocaleString('vi-VN')} VNĐ`}
                                                            </span>
                                                            <br />
                                                            {`${giaSauKhuyenMai.toLocaleString('vi-VN')} VNĐ`}
                                                        </>
                                                    ) : (
                                                        `${giaGoc.toLocaleString('vi-VN')} VNĐ`
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
        </main>

    );
}
