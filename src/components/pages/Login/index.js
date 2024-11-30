import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner,Col,Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./login.css";
import Swal from 'sweetalert2';
import Cookies from "js-cookie";
import { auth, GoogleAuthProvider, signInWithPopup } from "../../../config/firebase";
import { FaGoogle, FaFacebook } from 'react-icons/fa';
// import signInWithGoogle from "../../pages/logingoogle";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([""]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    toast.dismiss();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signin", { email, password });
      const { token, refreshToken } = response.data;

      const date = new Date();
      date.setHours(date.getHours() + 1);

      setCookie("token", token, { expires: date });
      setCookie("refreshToken", refreshToken, { expires: date });

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
       
      Swal.fire({
        title: "Đăng nhập thành công!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
     
      // toast.success("Đăng nhập thành công!", { position: "top-center", autoClose: 2000 });
      setTimeout(() => navigate("/"), 2000);
     
    } catch (error) {
      if (error.response?.status === 401) {
        const errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
        setError(errorMessage);
        // toast.error(errorMessage, { position: "top-center", autoClose: 2000 });
      } else if (error.response?.status === 400) {
        const errorMessage = "vui lòng nhập đủ thông tin";
        setError(errorMessage);
        // toast.error(errorMessage, { position: "top-center", autoClose: 2000 });
      }
       else {
        const generalError = "Đăng nhập thất bại. Vui lòng thử lại.";
        setError(generalError);
        // toast.error(generalError, { position: "top-center", autoClose: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };
  const signInWithGoogle = async () => { // const [cookies, setCookie] = useCookies(["user"]);
  const provider = new GoogleAuthProvider();
  
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Gửi token về Spring Boot để xác thực
    const response = await axios.post(
      "http://localhost:8080/api/taikhoan/google", 
      { token: idToken }, // Gửi token trong đối tượng JSON
      { headers: { "Content-Type": "application/json" } }
    );
    const { token, refreshToken } = response.data;
    Cookies.set('token',token); 
   Cookies.set('refreshToken',refreshToken); 
    console.log(idToken);
    Swal.fire({
      title: "Đăng nhập thành công!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    // window.location.reload()
    setTimeout(() => navigate("/"), 2000);
   
    // In ra kết quả từ server
    console.log("Response from backend: ", response.data);
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
  }
};
  return (
    <div>
      <ToastContainer autoClose={5000} draggable limit={1} pauseOnFocusLoss={false} pauseOnHover={false} />
      {/* <Container className="d-flex justify-content-center align-items-center vh-100  row"> */}
      {/* <Form className="col-8 d-flex flex-column align-items-center text-center">
  <img src="/z6031447719157_599da22d960ebff0ff9d68fd6ed25c41-removebg-preview (1).png" alt="Platform Logo" style={{ width: '240px', height: '290px' }} />
  <p>Nền tảng thương mại điện tử tốt nhất Việt Nam</p>
</Form> */}
        <Card className="login-card p-4 shadow-lg col-md-4 ">
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              
                placeholder="Nhập email của bạn"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật Khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               
                placeholder="Nhập mật khẩu"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Nhớ tài khoản"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {/* <div className="row ">    */}
            <Row className="mb-3">
  <Col>
    <Button onClick={signInWithGoogle} variant="outline-secondary" className="w-100">
    <img 
        src="https://tse2.mm.bing.net/th?id=OIP.HG6XtzIxf4Nbo_vZt8T3EAHaHa&...=0&h=220" 
        alt="Google Icon" 
        style={{ width: '20px', height: '20px', marginRight: '8px' }}
      /> Google
    </Button>
  </Col>
  <Col>
    <Button onClick={signInWithGoogle} variant="outline-secondary" className="w-100">
    <img 
        src="https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png" 
        alt="Facebook Icon" 
        style={{ width: '20px', height: '20px', marginRight: '8px' }}
      />
       Facebook
    </Button>
  </Col>
</Row>
{/* </div> */}
<button className="btn btn-info form-control mb-2 text-white "onClick={() => navigate('/buyer/register')}>Đăng Ký </button>
            <Button type="submit" variant="primary" className="login-btn w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Đăng Nhập"}
            </Button>
          </Form>
        </Card>
      {/* </Container> */}
    </div>
  );
};

export default Login;