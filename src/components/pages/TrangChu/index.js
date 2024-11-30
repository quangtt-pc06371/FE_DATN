import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";

import { jwtDecode } from "jwt-decode";
const TrangChu = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [admin, setRoleadmin] = useState(null);
    const [noiDungTimKiem, setNoidungTimKiem] = useState('');
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies(['token', 'refreshToken'])
    console.log(typeof removeCookie);
    // window.location.reload()


    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/', { state: { noiDungTimKiem } });
    };



    const handleRemoveCookie = () => {

        const allCookies = Cookies.get(); // Lấy tất cả các cookie hiện tại
        Object.keys(allCookies).forEach((cookieName) => {
            Cookies.remove(cookieName); // Xóa từng cookie theo tên
        });
        removeCookie('token', { path: 'http://localhost:3000/' });
        removeCookie('refreshToken', { path: 'http://localhost:3000/' });
        console.log("Tất cả cookie đã bị xóa!");

        navigate('/buyer/login');
        window.location.reload()
    };


    useEffect(() => {


        const token = Cookies.get('token');
        if (token && typeof token === "string") {
            const decoded = jwtDecode(token);
            setRoleadmin(decoded.role[0]?.authority || null);
        }
        setIsLoggedIn(!!token);

    }, [Cookies.get('token')]);
    return (
        <>
            <header>
                <nav className="navbar" style={{ backgroundColor: 'rgb(67,195,234)' }}>
                    <div className="container-fluid">
                        <span className="navbar-text text-white fs-5 d-flex align-items-center ms-5">
                            <span className="rounded-circle border border-2 border-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-solid fa-phone"></i>
                            </span>
                            <span className="ms-2">1800-56-78-9012</span>
                        </span>
                        <div className="dropdown me-5">
                            <button
                                className="btn btn-outline-light dropdown-toggle fs-5"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa-solid fa-user-tie"></i>
                                Tài Khoản
                            </button>
                            <ul className="dropdown-menu">

                                {!isLoggedIn ? (
                                    <>
                                        <li>
                                            <NavLink className="dropdown-item" to="/buyer/login">
                                                <i className="fa-regular fa-face-smile-beam "></i> Đăng Nhập
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" to="/buyer/register"><i className="fa-solid fa-key"></i> Tạo Tài Khoản
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <a className="dropdown-item" href="/user/profile">
                                                <i className="fa-solid fa-user"></i> Thông Tin Cá Nhân
                                            </a>
                                        </li>

                                        <li>
                                            <button
                                                className="btn btn-secondary dropdown-item"
                                                type="button"
                                                onClick={handleRemoveCookie}
                                            >
                                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất
                                            </button>
                                        </li>
                                    </>
                                )}
                                {admin === "ROLE_Admin" && (
                                    <li>
                                        <a className="dropdown-item" href="/admin">
                                            <i className="fa-solid fa-user"></i> Quản lý
                                        </a>
                                    </li>
                                )}



                            </ul>
                        </div>
                    </div>
                </nav>


                <nav className="navbar">
                    <div className="container-fluid">
                        <a className="navbar-brand ms-5" href="/">
                            <img
                                src="/img/t.png"
                                alt=""
                                style={{ width: "150px", height: "120px" }}
                            />
                        </a>

                        <span
                            className="navbar-text text-dark fs-5 d-flex align-items-center ms-auto me-5"
                            style={{ gap: "10px" }} // Thêm khoảng cách giữa icon và text
                        >
                            <span
                                className="rounded-circle border border-2 border-dark d-flex justify-content-center align-items-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                <i className="fa fa-envelope"></i>
                            </span>
                            <span>info@janus.com</span>
                        </span>

                        <form
                            className="d-flex align-items-center"
                            role="search"
                            onSubmit={handleSearch}
                            style={{
                                margin: "0 auto", // Căn giữa theo chiều ngang trong navbar
                                maxWidth: "800px", // Giới hạn chiều rộng form để cân đối
                                flexGrow: 1, // Để form co giãn chiếm không gian hợp lý
                            }}
                        >
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={noiDungTimKiem}
                                onChange={(e) => setNoidungTimKiem(e.target.value)}
                                style={{
                                    padding: "10px 15px",
                                    borderRadius: "25px",
                                    border: "2px solid #0d6efd",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    width: "100%", // Đảm bảo input chiếm toàn bộ không gian form
                                    marginRight: "10px", // Khoảng cách giữa input và nút
                                }}
                            />
                            <button
                                className="btn btn-outline-dark"
                                type="submit"
                                style={{
                                    borderRadius: "25px",
                                    backgroundColor: "#0d6efd",color: "white",
                                    padding: "10px 20px",
                                    border: "none",
                                    fontWeight: "bold",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                Search
                            </button>
                        </form>


                    </div>
                </nav>

                <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(21,37,69)' }}>
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarText">
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/">Trang Chủ</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/gioithieu">Giới Thiệu</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/lienhe">Liên Hệ</a>
                                </li> {/* <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/listhoadon">Hóa đơn</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/ListHoaDonadmin">Hóa đơn admin</a>
                                </li> */}

                                <li className="nav-item dropdown mx-3">
                                    <a className="nav-link dropdown-toggle text-white fs-5 fw-bold" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Manager
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="/manager">Thông tin</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="/thongke">Thống kê</a></li>
                                    </ul>
                                </li>

                            </ul>
                            <span className="navbar-text text-white">
                                <a href="/cart" className="btn btn-outline-info me-5">
                                    <i className="fa-solid fa-basket-shopping text-white fs-3"></i>
                                </a>
                            </span>
                        </div>
                    </div>
                </nav>

            </header>



            {/* {content} */}
            <Outlet /><footer style={{ height: '400px', backgroundColor: 'rgb(21,37,69)' }} className="text-white py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3 mb-4">
                            <h4>Thông Tin</h4>
                            <div className="opacity-50">
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Khuyến Mãi</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Giao Hàng</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Nhận Hàng</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Trả Hàng</h5>
                            </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                            <h4>Chính Sách</h4>
                            <div className="opacity-50">
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Chính Sách Vận Chuyển</h5> <h5 className="mb-2" style={{ fontSize: '15px' }}>Luôn Bảo Mật</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Theo Đơn Hàng</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Tuyển Dụng</h5>
                            </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                            <h4>Hỗ Trợ</h4>
                            <div className="opacity-50">
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Hướng Dẫn Mua Hàng</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Thanh Toán</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Hướng Dẫn Đặt Hàng</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Miễn Phí Vận Chuyển</h5>
                            </div>
                        </div>
                        <div className="col-sm-3 mb-4">
                            <h4>Liên Hệ</h4>
                            <div className="opacity-50">
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>
                                    Chúng tôi luôn cam kết với khách hàng mang lại các sản phẩm với giá cả phải chăng.
                                </h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>Ngõ 15 Duy Tân, Mỹ Đình 2, Từ Liêm, Hà Nội</h5>
                                <h5 className="mb-2" style={{ fontSize: '15px' }}>info@janus.com</h5>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <h6 className="text-center opacity-50 mb-0"> Copyright © 2016 Janus Fashion - All rights reserved. Powered by Haravan
                    </h6>
                </div>
            </footer>
        </>
    )

};
export default TrangChu;