import React, { useState, useEffect } from "react";
import { useNavigate ,Outlet} from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner,Col,Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";

// import signInWithGoogle from "../../pages/logingoogle";
const Loginpage = () => {
  
  return (
    <div>
      <ToastContainer autoClose={5000} draggable limit={1} pauseOnFocusLoss={false} pauseOnHover={false} />
      <Container className="d-flex justify-content-center align-items-center vh-100 login-container row">
      <Form className="col-8 d-flex flex-column align-items-center text-center">
  <img src="/z6031447719157_599da22d960ebff0ff9d68fd6ed25c41-removebg-preview (1).png" alt="Platform Logo" style={{ width: '240px', height: '290px' }} />
  <p>Nền tảng thương mại điện tử tốt nhất Việt Nam</p>
</Form>
<div className="col-4 ">
<Outlet />
       
       </div>
      </Container>
     
    </div>
  );
};

export default Loginpage;
