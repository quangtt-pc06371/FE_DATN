import React from 'react';
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap';

const CategoryManagement = () => {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Form>
            <h2 className="text-center my-4">QUẢN LÝ DANH MỤC</h2>
            <Form.Group controlId="formCategoryName">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Tên danh mục: </Form.Label>
              <Form.Control type="text" placeholder="Nhập tên danh mục" />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Mô tả:</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả" />
            </Form.Group>
            <div className="mt-4">
              <Button variant="success" className="me-2">Thêm</Button>
              <Button variant="warning" className="me-2">Sửa</Button>
              <Button variant="danger" className="">Xóa</Button>
            </div>
          </Form>
        </Col>
        <Col md={8}>
          <Row className="mb-3 pt-4">
            <Col>
              <Form.Control type="text" placeholder="Tìm theo tên danh mục" />
            </Col>
            <Col>
              <Form.Select>
                <option>Chọn danh mục</option>
                {/* Thêm các tùy chọn khác */}
              </Form.Select>
            </Col>
            <Col>
              <Button variant="primary">Tìm kiếm</Button>
            </Col>
          </Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN DANH MỤC</th>
                <th>MÔ TẢ</th>
                <th>CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {/* Dữ liệu sẽ được map ở đây */}
              <tr>
                <td>1</td>
                <td>Danh mục 1</td>
                <td>Mô tả cho danh mục 1</td>
                <td></td>
              </tr>
              <tr>
                <td>1</td>
                <td>Danh mục 1</td>
                <td>Mô tả cho danh mục 1</td>
                <td></td>
              </tr>
              <tr>
                <td>1</td>
                <td>Danh mục 1</td>
                <td>Mô tả cho danh mục 1</td>
                <td></td>
              </tr>
              <tr>
                <td>1</td>
                <td>Danh mục 1</td>
                <td>Mô tả cho danh mục 1</td>
                <td></td>
              </tr>
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

export default CategoryManagement;
