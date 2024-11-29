import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
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
    const [soLuong, setSoLuong] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');
    const [giaTriDaChon, setGiaTriDaChon] = useState({});

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
                idSku: sku.idSku,
                giaSanPham: sku.giaSanPham,
                soLuong: sku.soLuong,
                atributes: sku.tuyChonThuocTinhSkus.map((tuyChon) => ({
                    tieuDe: tuyChon.tuyChonThuocTinh.thuocTinh.ten,
                    noiDungTieuDe: tuyChon.tuyChonThuocTinh.giaTri,
                })),
                hinhanhs: sku.hinhanhs.map((image) => image.tenAnh) // Lấy tất cả ảnh từ hinhanhs
            }))
        );
        if (response.data.skus.length > 0 && response.data.skus[0].hinhanhs.length > 0) {
            setSelectedImage(response.data.skus[0].hinhanhs[0].tenAnh); // Chọn ảnh đầu tiên của SKU đầu tiên
        }


    }
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
        console.log(token)

        if (!sku) {
            alert('Vui lòng chọn đầy đủ các tùy chọn thuộc tính trước khi thêm vào giỏ hàng.');
            return;
        }

        console.log(sku);

        if (!token) {
            alert('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng.');
            return;
        }

        const dataToSent = {
            soLuongMua: soLuong,
            giaMua: soLuong * sku.giaSanPham,
            trangThai: true,
            skuEntity: { idSku: sku.idSku }
        };

        console.log(dataToSent);

        try {

            const addData = await axios.post('http://localhost:8080/api/chitietgiohang', dataToSent, {
                headers: {
                    'Authorization': token
                }
            });
            alert('Thêm vào giỏ hàng thành công!', addData.data);
        } catch (error) {
            alert('Có lỗi xảy ra khi thêm vào giỏ hàng.');
            console.error(error);
        }
    }


    // console.log(skusList)
    useEffect(() => {
        if (id) {
            getDataDisplayId();
        }
        getSanPhamKhuyenMai();
    }, []);
    const skuGet = getSku();

    const giaGoc = skuGet ? skuGet.giaSanPham : skusList[0]?.giaSanPham || 0;

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


    const tongSoLuong = skuGet ? skuGet.soLuong : skusList[0]?.soLuong;






    const handleGiaTri = (tieuDe, noiDungTieuDe) => {
        setGiaTriDaChon(thuocTinhDaChon => ({
            ...thuocTinhDaChon,
            [tieuDe]: noiDungTieuDe
        }));
    };
    console.log(giaTriDaChon)

    const handleThumbnailClick = (image) => {
        setSelectedImage(image); // Cập nhật ảnh lớn khi người dùng click vào thumbnail
    };

    return (
        <div className="container mt-5 ">
            <div className="row my-3 m-5 border p-3 mb-5 shadow-sm">
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
                                {skusList.map((sku) => (
                                    sku.hinhanhs.map((hinhAnh, index) => (
                                        <img
                                            key={index}
                                            src={hinhAnh}  // URL của ảnh thumbnail
                                            alt={`Thumbnail ${index + 1}`}
                                            className="img-thumbnail me-2 hinh-anh-chi-tiet"
                                            style={{ width: '80px', height: '80px', display: 'inline-block' }}
                                            onClick={() => handleThumbnailClick(hinhAnh)} // Cập nhật ảnh lớn khi click vào thumbnail
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
                    <button className="btn btn-danger me-2" onClick={handleAddGioHang}>Thêm Vào Giỏ Hàng</button>
                    <button className="btn btn-primary">Mua Ngay</button>
                </div>
            </div>
        </div>
    );
}
