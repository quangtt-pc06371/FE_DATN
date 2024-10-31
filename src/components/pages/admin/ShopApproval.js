import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import Swal
import Cookies from 'js-cookie'; // Import js-cookie
import { useNavigate } from "react-router-dom";

const ShopApproval = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy danh sách các shop chưa được duyệt
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/shops/unapproved', {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`, // Lấy token từ cookie
          },
        });
        console.log(response.data); // Kiểm tra dữ liệu
        setShops(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách shop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Xử lý duyệt shop
  const handleApprove = async (shopId) => {
    // Hiện thông báo xác nhận
    const result = await Swal.fire({
      title: 'Xác nhận duyệt shop',
      text: 'Bạn có chắc chắn muốn duyệt shop này không?',
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
            Authorization: `Bearer ${Cookies.get('token')}`, // Lấy token từ cookie
          },
        });
        setShops((prevShops) => prevShops.filter((shop) => shop.id !== shopId));
        Swal.fire('Thành công!', 'Shop đã được duyệt.', 'success'); // Thông báo thành công
      } catch (error) {
        console.error('Lỗi khi duyệt shop:', error);
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
      }
    }
  };

  // Xử lý từ chối shop
  const handleReject = async (shopId) => {
    // Hiện thông báo xác nhận
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn không?',
      text: "Bạn sẽ không thể khôi phục lại yêu cầu này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đúng, hủy yêu cầu!',
      cancelButtonText: 'Không, quay lại!',
    });

    // Nếu người dùng xác nhận, thực hiện hủy yêu cầu
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/shops/${shopId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`, // Lấy token từ cookie
          },
        });
        setShops((prevShops) => prevShops.filter((shop) => shop.id !== shopId));
        Swal.fire('Đã hủy!', 'Yêu cầu đã được hủy.', 'success'); // Thông báo thành công
      } catch (error) {
        console.error('Lỗi khi từ chối shop:', error);
        const isConfirmed = window.confirm("Vui lòng đăng nhập để thực hiện thao tác này !");
        if (!isConfirmed) {
            return; // Dừng thực hiện nếu người dùng không xác nhận
        }
        try {
          navigate("/login");
        } catch (error) {
            console.error("Có lỗi xảy ra", error);
        }   
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center my-4">DUYỆT SHOP</h2>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Shop</th>
                <th>Mô Tả</th>
                <th>Hình Ảnh</th>
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
                      <span>No Image</span> // Hoặc một hình ảnh mặc định
                    )}
                  </td>
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
        </Col>
      </Row>
    </Container>
  );
};

export default ShopApproval;
