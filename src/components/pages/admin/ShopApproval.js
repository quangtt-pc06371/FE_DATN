import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const ShopApproval = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/shops/unapproved', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      console.log(response.data);
      setShops(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách cửa hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý duyệt shop
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

    // Nếu người dùng xác nhận, thực hiện duyệt shop
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

  // Xử lý từ chối shop
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

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
        <h2 className="text-center my-4 fw-bold text-primary animated-title">DUYỆT CỬA HÀNG</h2>
        </Col>
      </Row>
      <Row>
        <Col md={12} className='border p-2 rounded shadow-sm bg-light'>
          <Table striped bordered hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Shop</th>
                <th>Mô Tả</th>
                <th>Hình Ảnh</th>
                <th>Ngày Tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop, index) => (
                <tr key={shop.id}>
                  <td>{index + 1}</td>
                  <td>{shop.shopName}</td>
                  <td>{shop.shopDescription}</td>
                  <td>
                    {shop.shopImage ? (
                      <img
                        src={`http://localhost:8080/api/shops/images/${shop.shopImage}`}
                        alt={shop.shopName}
                        style={{ width: '50px', height: '50px' }}
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
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </div>
    </Container>
  );
};

export default ShopApproval;
