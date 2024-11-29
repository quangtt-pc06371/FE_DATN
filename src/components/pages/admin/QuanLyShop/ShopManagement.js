import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table, Pagination, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const ShopManagement = () => {
  const [approvedShops, setApprovedShops] = useState([]); // Danh sách tất cả các shop đã duyệt
  const [activeShops, setActiveShops] = useState([]); // Shop đang hiển thị
  const [hiddenShops, setHiddenShops] = useState([]); // Shop đã ẩn
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination states
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [currentHiddenPage, setCurrentHiddenPage] = useState(1);
  const [shopsPerPage] = useState(4);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedShops();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, approvedShops]);

  const fetchApprovedShops = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shops/approved', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      const allShops = response.data;

      // Phân loại shop đã được duyệt thành active và hidden
      setApprovedShops(allShops);
      setActiveShops(allShops.filter(shop => shop.isActive));
      setHiddenShops(allShops.filter(shop => !shop.isActive));
    } catch (error) {
      console.error('Lỗi khi tải danh sách cửa hàng đã được duyệt:', error);
    }
  };

  const handleSearch = () => {
    const filtered = approvedShops.filter(shop =>
      shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setActiveShops(filtered.filter(shop => shop.isActive));
    setHiddenShops(filtered.filter(shop => !shop.isActive));
    setCurrentActivePage(1);
    setCurrentHiddenPage(1);
  };

  const handleToggleShopStatus = async (shopId, isActive) => {
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
          navigate('/buyer/login');
        }
      });
      return;
    }

    const action = isActive ? 'ẩn' : 'hiện trở lại';

    Swal.fire({
      title: `Bạn có chắc chắn muốn ${action} shop này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:8080/api/shops/${shopId}/toggle`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire(`${action.charAt(0).toUpperCase() + action.slice(1)} thành công!`, '', 'success');
          fetchApprovedShops();
        } catch (error) {
          console.error(`Lỗi khi ${action} shop:`, error);
          Swal.fire('Đã xảy ra lỗi, vui lòng thử lại sau!', '', 'error');
        }
      }
    });
  };

  const paginate = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderShopTable = (shopsList, isActive, currentPage, setPage) => {
    const paginatedShops = paginate(shopsList, currentPage, shopsPerPage);

    return (
      <>
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
            {paginatedShops.length > 0 ? (
              paginatedShops.map(shop => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.shopName}</td>
                  <td>
                    <img 
                      src={shop.shopImage} 
                      alt={shop.shopName} 
                      style={{ width: '50px' }} 
                    />
                  </td>
                  <td>{shop.shopDescription}</td>
                  <td>{shop.shopRating}</td>
                  <td>{shop.createAt}</td>
                  <td>{shop.updateAt}</td>
                  <td>
                    <Button 
                      variant={isActive ? 'danger' : 'success'} 
                      size="sm" 
                      onClick={() => handleToggleShopStatus(shop.id, isActive)}
                    >
                      {isActive ? 'Ẩn Cửa Hàng' : 'Hiện Cửa Hàng'}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">Không có shop nào</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First onClick={() => setPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: Math.ceil(shopsList.length / shopsPerPage) }, (_, index) => (
              <Pagination.Item 
                key={index + 1} 
                active={index + 1 === currentPage}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage(currentPage + 1)} disabled={currentPage === Math.ceil(shopsList.length / shopsPerPage)} />
            <Pagination.Last onClick={() => setPage(Math.ceil(shopsList.length / shopsPerPage))} disabled={currentPage === Math.ceil(shopsList.length / shopsPerPage)} />
          </Pagination>
        </div>
      </>
    );
  };

  return (
    <>
      <Container>
        <h2 className="text-center my-4 fw-bold text-primary">QUẢN LÝ CỬA HÀNG</h2>
        <Row>
          <Col md={12}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Tìm theo tên cửa hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <div className="border p-4 rounded shadow-sm bg-light mb-4">
              <h4 className="fw-bold text-success">Cửa hàng đang đang hoạt động </h4>
              {renderShopTable(activeShops, true, currentActivePage, setCurrentActivePage)}
            </div>
            <div className="border p-4 rounded shadow-sm bg-light">
              <h4 className="fw-bold text-danger">Cửa hàng đã tắt hoạt dộng</h4>
              {renderShopTable(hiddenShops, false, currentHiddenPage, setCurrentHiddenPage)}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShopManagement;
