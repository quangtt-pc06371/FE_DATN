import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Outlet, useNavigate } from "react-router-dom";
const HeaderAdmin = () => {
  const [noiDungTimKiem, setNoidungTimKiem] = useState('');
  const navigate = useNavigate();


  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/', { state: { noiDungTimKiem } });
  };
  return (
    <header>
      <nav className="navbar py-1" style={{ backgroundColor: 'rgb(67,195,234)' }}>
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
              <>
                <li>
                  <a className="dropdown-item" href="/login">
                    <i className="fa-regular fa-face-smile-beam "></i> Đăng Nhập
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/dangky">
                    <i className="fa-solid fa-key"></i> Tạo Tài KHoản
                  </a>
                </li>
              </>
            </ul>
          </div>
        </div>
      </nav>
      <nav className="navbar">
        <div className="container-fluid">
          <a className="navbar-brand ms-5" href="/sanpham">
            <img src="/img/t.png" alt="" style={{ width: '150px', height: '120px' }} />
          </a>
          <span className="navbar-text text-dark fs-5 d-flex align-items-center">
            <span className="rounded-circle border border-2 border-dark d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
              <i className="fa fa-home"></i>
            </span>
            <span className="ms-2">Ngõ 15 Duy Tân, Mỹ Đình 2, Từ Liêm, Hà Nội</span>
          </span>
          <span className="navbar-text text-dark fs-5 d-flex align-items-center ms-3">
            <span className="rounded-circle border border-2 border-dark d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
              <i className="fa fa-envelope"></i>
            </span>
            <span className="ms-2">info@janus.com</span>
          </span>
          <form className="d-flex me-5" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={noiDungTimKiem}
              onChange={(e) => setNoidungTimKiem(e.target.value)} // Cập nhật từ khóa tìm kiếm
            />
            <button className="btn btn-outline-dark" type="submit">Search</button>
          </form>
        </div>
      </nav>
      {/* <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(21,37,69)' }}>
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="navbarText">
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/">Trang Chủ</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/sanpham">Sản Phẩm</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/gioithieu">Giới Thiệu</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/lienhe">Liên Hệ</a>
                                </li>

                               <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/listhoadon">Hóa đơn</a>
                                </li>
                                <li className="nav-item mx-3">
                                    <a className="nav-link text-white fs-5 fw-bold" href="/ListHoaDonadmin">Hóa đơn admin</a>
                                </li>

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
                                <a href="/giohang" className="btn btn-outline-info me-5">
                                    <i className="fa-solid fa-basket-shopping text-white fs-3"></i>
                                </a>
                            </span>
                        </div>
                    </div>
                </nav>  */}

      <Navbar bg="blue" variant="blue" expand="lg" style={{ backgroundColor: 'rgb(67,195,234)' }}>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Admin Panel</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/category-management">
                <Nav.Link>Quản lý danh mục</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shop-approval">
                <Nav.Link>Duyệt shop</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/shop-management">
                <Nav.Link>Quản lý shop</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <LinkContainer to="/login">
                <Nav.Link>Đăng nhập</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/profile">
                <Nav.Link>Hồ sơ</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/updateuser">
                <Nav.Link>Cập nhật người dùng</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/register">
                <Nav.Link>Đăng ký</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/registergg">
                <Nav.Link>Đăng ký Google</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/addres">
                <Nav.Link>dia chỉ</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default HeaderAdmin;
