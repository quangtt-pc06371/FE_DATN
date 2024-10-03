import React from 'react';
import { Container, Row, Col, Table, Button, Pagination } from 'react-bootstrap';

const ProductApproval = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center my-4">DUYỆT SẢN PHẨM</h2>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID SHOP</th>
                <th>ID SẢN PHẨM</th>
                <th>TÊN SẢN PHẨM</th>
                <th>HÌNH ẢNH</th>
                <th>MÔ TẢ</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>SP001</td>
                <td>Sản phẩm 1</td>
                <td>
                  <div className="d-flex justify-content-around">
                    <div>
                      <img src="link-to-image1" alt="Ảnh 1" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div>
                      <img src="link-to-image2" alt="Ảnh 2" style={{ width: '50px', height: '50px' }} />
                    </div>
                    <div>
                      <img src="link-to-image3" alt="Ảnh 3" style={{ width: '50px', height: '50px' }} />
                    </div>
                  </div>
                </td>
                <td>Mô tả sản phẩm 1</td>
                <td>
                  <Button variant="success" className="me-2">Duyệt</Button>
                  <Button variant="danger">Hủy</Button>
                </td>
              </tr>
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

export default ProductApproval;
