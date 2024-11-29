import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Pagination, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [shopsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedShops();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, shops]);

  const fetchApprovedShops = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shops/approved', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      setShops(response.data);
      setFilteredShops(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cửa hàng:', error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredShops(shops);
    } else {
      const filtered = shops.filter(shop =>
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredShops(filtered);
    }
    setCurrentPage(1);
  };

  const handleDeleteShop = async (shopId) => {
    const token = Cookies.get('token');
    if (!token) {
      Swal.fire({
        title: 'Yêu cầu đăng nhập',
        text: 'Vui lòng đăng nhập để thực hiện thao tác này!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn sẽ không thể khôi phục cửa hàng này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/shops/${shopId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire('Xóa thành công!', '', 'success');
          fetchApprovedShops();
        } catch (error) {
          console.error('Lỗi khi xóa cửa hàng:', error);
        }
      }
    });
  };

  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="full-screen-background"></div>
      <Container className="content-overlay">
        <h2 className="text-center my-4 fw-bold text-primary animated-title">QUẢN LÝ CỬA HÀNG</h2>
        <Row>
          <Col md={12}>
            <div className="border p-4 rounded shadow-sm bg-light">
              <Row className="mb-3">
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm theo tên cửa hàng"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Row>
              <Table striped bordered hover responsive className="shadow-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th>ID</th>
                    <th>Tên Shop</th>
                    <th>Ảnh</th>
                    <th>Mô Tả</th>
                    <th>Đánh Giá</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Cập Nhật</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentShops.length > 0 ? currentShops.map(shop => (
                    <tr key={shop.id}>
                      <td>{shop.id}</td>
                      <td>{shop.shopName}</td>
                      <td>
                        <img 
                          src={shop.shopImage} 
                          alt={shop.shopName} 
                          style={{ width: '50px'}} 
                        />
                      </td>
                      <td>{shop.shopDescription}</td>
                      <td>{shop.shopRating}</td>
                      <td>{shop.createAt}</td>
                      <td>{shop.updateAt}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteShop(shop.id)}>Xóa</Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="text-center">Không có shop nào</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item 
                    key={index + 1} 
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShopManagement;
