import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavbarAdmin = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">Admin</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/category-management">
            <Nav.Link>Quản lý danh mục</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/shop-approval">
            <Nav.Link>Duyệt shop</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/shop-management">
            <Nav.Link>Quản lý shop</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarAdmin;
