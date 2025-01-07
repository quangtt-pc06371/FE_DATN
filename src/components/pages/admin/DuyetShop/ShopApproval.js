import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Pagination, Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const ShopApproval = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const token = Cookies.get('token'); 
  const shopsPerPage = 5;
  const navigate = useNavigate();
  useEffect(() => {
    fetchShops();
  }, []);

console.log(token)
  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shops/unapproved', {
        headers: {
          Authorization: `${token}`,
        },
      });
      setShops(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cửa hàng:', error);
    }
  };

  const handleApprove = async (shopId) => {
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

    const result = await Swal.fire({
      title: 'Xác nhận duyệt shop',
      text: 'Bạn có chắc chắn muốn duyệt cửa hàng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng, duyệt!',
      cancelButtonText: 'Không, quay lại!',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:8080/api/shops/approve/${shopId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShops((prevShops) => prevShops.filter((shop) => shop.id !== shopId));
        Swal.fire('Thành công!', 'Cửa hàng đã được duyệt.', 'success');
      } catch (error) {
        console.error('Lỗi khi duyệt cửa hàng:', error);
        Swal.fire('Có lỗi xảy ra khi duyệt cửa hàng!', error.response.data.message || 'Vui lòng thử lại.', 'error');
      }
    }
  };

  const handleReject = async (shopId) => {
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
          fetchShops();
        } catch (error) {
          console.error('Lỗi khi xóa cửa hàng:', error);
          Swal.fire('Có lỗi xảy ra khi xóa cửa hàng!', error.response.data.message || 'Vui lòng thử lại.', 'error');
        }
      }
    });
  };
  
  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xác định các shop trên trang hiện tại
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);
  console.log(currentShops)
  // Tính số trang tổng cộng
  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center my-4 fw-bold text-primary animated-title">DUYỆT CỬA HÀNG</h2>
        </Col>
      </Row>
      <Row>
        <Col md={12} className='border p-4 rounded shadow-sm bg-light'>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên cửa hàng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Shop</th>
                <th>Mô Tả</th>
                <th>Ảnh</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
         

            <tbody>
              {currentShops.length > 0 ? (
                currentShops.filter(shop => shop.isActive !== false).map((shop, index) => (
                  <tr key={shop.id}>
                    <td>{index + 1 + indexOfFirstShop}</td>
                    <td>{shop.shopName}</td>
                    <td>{shop.shopDescription}</td>
                    <td>
                      {shop.shopImage ? (
                        <img
                          src={shop.shopImage}
                          alt={shop.shopName}
                          style={{ width: '50px' }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{shop.createAt}</td>
                    <td>
                      <Button variant="success" className="me-2" onClick={() => handleApprove(shop.id)}>
                        Duyệt
                      </Button>
                      <Button variant="danger" onClick={() => handleReject(shop.id)}>
                        Hủy
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">Không có shop nào</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </Container>
  );
};

export default ShopApproval;
