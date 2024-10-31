import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopRating, setShopRating] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);

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

  // const handleAddShop = () => {
  //   if (!shopName || !shopDescription) {
  //     toast.warning('Tên shop và mô tả không được để trống.');
  //     return;
  //   }

  //   const isDuplicate = shops.some(shop => shop.shopName.toLowerCase() === shopName.toLowerCase());
  //   if (isDuplicate) {
  //     toast.warning('Tên shop đã tồn tại. Vui lòng chọn tên khác.');
  //     return;
  //   }

  //   const shopData = {
  //     shopName: shopName,
  //     shopDescription: shopDescription,
  //   };

  //   if (shopRating) {
  //     shopData.shopRating = shopRating;
  //   }

  //   axios.post('http://localhost:8080/api/shops', shopData)
  //     .then(response => {
  //       toast.success('Thêm shop thành công!');
  //       fetchApprovedShops();
  //       setShopName('');
  //       setShopDescription('');
  //       setShopRating('');
  //     })
  //     .catch(error => {
  //       console.error('Có lỗi xảy ra khi thêm shop:', error);
  //       toast.error('Không thể thêm shop.');
  //     });
  // };

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
        toast.error('Không thể sửa shop.');
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
            Swal.fire(
              'Đã xóa!',
              'Shop đã được xóa thành công.',
              'success'
            );
            fetchApprovedShops();
          })
          .catch(error => {
            console.error('Có lỗi xảy ra khi xóa shop:', error);
            toast.error('Không thể xóa shop.');
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
    <Container>
      <ToastContainer />
      <Row>
        <Col md={4}>
          <Form>
            <h2 className="text-center my-4">QUẢN LÝ SHOP</h2>
            <Form.Group controlId="formShopName">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Tên shop: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên shop"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Mô tả:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formRating" className="mt-3">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Đánh giá:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                placeholder="Nhập đánh giá (1-5)"
                value={shopRating}
                onChange={(e) => setShopRating(e.target.value)}
              />
            </Form.Group>
            <div className="mt-4">
              {/* <Button variant="success" className="me-2" onClick={handleAddShop}>Thêm</Button> */}
              <Button variant="warning" className="me-2" onClick={handleUpdateShop}>Sửa</Button>
              <Button variant="danger" onClick={() => handleDeleteShop(selectedShop?.id)}>Xóa</Button>
            </div>
          </Form>
        </Col>
        <Col md={8}>
        <Row className="mb-3 pt-4">
            <Col>
              <Form.Control type="text" placeholder="Tìm theo tên cửa hàng" />
            </Col>
            <Col>
              <Form.Select>
                <option>chọn cửa hàng</option>
                <option></option>
              </Form.Select>
            </Col>
            <Col>
              <Button variant="primary">Tìm kiếm</Button>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID_SHOP</th>
                <th>SHOP_NAME</th>
                <th>SHOP_DESCRIPTION</th>
                <th>SHOP_RATING</th>
                <th>CREATE_AT</th>
                <th>UPDATE_AT</th>
                <th>CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {shops.length > 0 ? shops.map(shop => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.shopName}</td>
                  <td>{shop.shopDescription}</td>
                  <td>{shop.shopRating}</td>
                  <td>{shop.createAt}</td>
                  <td>{shop.updateAt}</td>
                  <td>
                    <Button variant="info" onClick={() => handleSelectShop(shop)}>Chọn</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center">Không có shop nào</td>
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
  );
};

export default ShopManagement;
