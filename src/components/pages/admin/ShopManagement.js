import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Pagination, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import './ShopManagement.css';
import { useNavigate } from "react-router-dom";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopRating, setShopRating] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchApprovedShops();
  }, []);

  const fetchApprovedShops = () => {
    axios.get('http://localhost:8080/api/shops/approved')
      .then(response => {
        setShops(response.data);
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi lấy danh sách shop đã được duyệt:', error);
        toast.error('Không thể lấy danh sách shop đã được duyệt.');
      });
  };

  const handleUpdateShop = () => {
    if (!selectedShop) {
      toast.warning('Chưa chọn shop để sửa.');
      return;
    }

    if (!shopName || !shopDescription) {
      toast.warning('Tên shop và mô tả không được để trống.');
      return;
    }

    const shopData = {
      shopName: shopName,
      shopDescription: shopDescription,
    };

    if (shopRating) {
      shopData.shopRating = shopRating;
    }

    axios.put(`http://localhost:8080/api/shops/${selectedShop.id}`, shopData)
      .then(response => {
        toast.success('Sửa shop thành công!');
        fetchApprovedShops();
        setSelectedShop(null);
        setShopName('');
        setShopDescription('');
        setShopRating('');
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi sửa shop:', error);
        const isConfirmed = window.confirm("Vui lòng đăng nhập để thực hiện thao tác này !");
        if (!isConfirmed) {
            return; // Dừng thực hiện nếu người dùng không xác nhận
        }
        try {
          navigate("/login");
        } catch (error) {
            console.error("Có lỗi xảy ra", error);
        }       
      });
  };

  const handleDeleteShop = (shopId) => {
    if (!shopId) {
      toast.warning('Chưa chọn shop để xóa.');
      return;
    }

    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn sẽ không thể khôi phục shop này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/shops/${shopId}`)
          .then(response => {
            Swal.fire('Đã xóa!', 'Shop đã được xóa thành công.', 'success');
            fetchApprovedShops();
          })
          .catch(error => {
            console.error('Có lỗi xảy ra khi sửa shop:', error);
              const isConfirmed = window.confirm("Vui lòng đăng nhập để thực hiện thao tác này !");
              if (!isConfirmed) {
                  return; // Dừng thực hiện nếu người dùng không xác nhận
              }
              try {
                navigate("/login");
              } catch (error) {
                  console.error("Có lỗi xảy ra", error);
              }   
          });
      }
    });
  };

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
    setShopName(shop.shopName);
    setShopDescription(shop.shopDescription);
    setShopRating(shop.shopRating);
  };

  return (
    <>
      <div className="full-screen-background"></div>
      <Container className="content-overlay">
        <ToastContainer />
        <h2 className="text-center my-4 fw-bold text-primary animated-title">QUẢN LÝ SHOP</h2>
        <Row>
          <Col md={4}>
            <Form className="border p-4 rounded shadow-sm bg-light">
              <Form.Group controlId="formShopName" className="mb-3">
                <Form.Label>Tên shop:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên shop"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Mô tả:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả"
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formRating" className="mb-3">
                <Form.Label>Đánh giá:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Nhập đánh giá (1-5)"
                  value={shopRating}
                  onChange={(e) => setShopRating(e.target.value)}
                />
              </Form.Group>
              <Button variant="warning" className="me-2 w-100 mb-2" onClick={handleUpdateShop}>
                Sửa
              </Button>
              <Button variant="danger" className="w-100" onClick={() => handleDeleteShop(selectedShop?.id)}>
                Xóa
              </Button>
            </Form>
          </Col>
          <Col md={8}>
            <Row className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control placeholder="Tìm theo tên cửa hàng" />
                <Button variant="outline-primary">Tìm kiếm</Button>
              </InputGroup>
            </Row>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th>ID</th>
                  <th>Tên Shop</th>
                  <th>Ảnh Shop</th>
                  <th>Mô Tả</th>
                  <th>Đánh Giá</th>
                  <th>Ngày Tạo</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {shops.length > 0 ? shops.map(shop => (
                  <tr key={shop.id}>
                    <td>{shop.id}</td>
                    <td>{shop.shopName}</td>
                    <td>
                      <img 
                        src={`http://localhost:8080/api/shops/images/${shop.shopImage}`} 
                        alt={shop.shopName} 
                        style={{ width: '100px', height: 'auto' }} 
                      />
                    </td>
                    <td>{shop.shopDescription}</td>
                    <td>{shop.shopRating}</td>
                    <td>{shop.createAt}</td>
                    <td>{shop.updateAt}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleSelectShop(shop)}>Chọn</Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center">Không có shop nào</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShopManagement;
