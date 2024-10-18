import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi lấy danh sách danh mục:', error);
        toast.error('Không thể lấy danh sách danh mục.');
      });
  };

  const handleAddCategory = () => {
    axios.post('http://localhost:8080/api/categories', {
      tenDanhMuc: categoryName,
      moTa: description
    })
      .then(response => {
        toast.success('Thêm danh mục thành công!');
        fetchCategories(); // Refresh danh sách danh mục sau khi thêm
        setCategoryName('');
        setDescription('');
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi thêm danh mục:', error);
        toast.error('Không thể thêm danh mục.');
      });
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory) {
      toast.warning('Chưa chọn danh mục để sửa.');
      return;
    }
    axios.put(`http://localhost:8080/api/categories/${selectedCategory.id}`, {
      tenDanhMuc: categoryName,
      moTa: description
    })
      .then(response => {
        toast.success('Sửa danh mục thành công!');
        fetchCategories();
        setSelectedCategory(null);
        setCategoryName('');
        setDescription('');
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi sửa danh mục:', error);
        toast.error('Không thể sửa danh mục.');
      });
  };

  const handleDeleteCategory = (categoryId) => {
    if (!categoryId) {
      toast.warning('Chưa chọn danh mục để xóa.');
      return;
    }
  
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn sẽ không thể khôi phục danh mục này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/categories/${categoryId}`)
          .then(response => {
            Swal.fire(
              'Đã xóa!',
              'Danh mục đã được xóa thành công.',
              'success'
            );
            fetchCategories(); // Refresh the categories list
          })
          .catch(error => {
            console.error('Có lỗi xảy ra khi xóa danh mục:', error);
            toast.error('Không thể xóa danh mục.');
          });
      }
    });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.tenDanhMuc);
    setDescription(category.moTa);
  };

  return (
    <Container>
      <ToastContainer />
      <Row>
        <Col md={4}>
          <Form>
            <h2 className="text-center my-4">QUẢN LÝ DANH MỤC</h2>
            <Form.Group controlId="formCategoryName">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Tên danh mục: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label style={{ textAlign: 'left', display: 'block', fontWeight: 'bold' }}>Mô tả:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <div className="mt-4">
              <Button variant="success" className="me-2" onClick={handleAddCategory}>Thêm</Button>
              <Button variant="warning" className="me-2" onClick={handleUpdateCategory}>Sửa</Button>
              <Button variant="danger" onClick={() => handleDeleteCategory(selectedCategory?.id)}>Xóa</Button>
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
                <th>ID</th>
                <th>TÊN DANH MỤC</th> 
                <th>MÔ TẢ</th>
                <th>CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.tenDanhMuc}</td>
                  <td>{category.moTa}</td>
                  <td>
                    <Button variant="info" onClick={() => handleSelectCategory(category)}>Chọn</Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center">Không có danh mục nào</td>
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

export default CategoryManagement;
