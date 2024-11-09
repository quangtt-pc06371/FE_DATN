import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

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
    try {
      const response = await axios.post("http://localhost:8080/api/auth/signin", {
        email,
        password,
      });

      const { token, refreshToken } = response.data;

      const date = new Date();
      date.setHours(date.getHours() + 1);

      setCookie("token", token, { expires: date });
      setCookie("refreshToken", refreshToken, { expires: date });

      alert("Đăng nhập thành công!");
      // navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);

    toast.dismiss(); // Đảm bảo toast cũ đã được ẩn
    
    // Thực hiện yêu cầu đăng nhập
    try{
      const response= axios.post("http://localhost:8080/api/auth/signin", { email, password })
      toast.promise(response
      ,
        {
          pending: "Đang tải dữ liệu...",
          success: {
            render({ data }) {
              const { token, refreshToken } = data.data;
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
    
              setTimeout(() => navigate("/"), 2000);
              return "Đăng nhập thành công!";
            },
          },
          error: {
            render({ data }) {
              // Kiểm tra mã lỗi 401
              if (data.response?.status === 401) {
                const errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
                setError(errorMessage); // Cập nhật thông báo lỗi vào Alert
                toast.error(errorMessage); // Hiển thị thông báo lỗi bằng Toast
                return errorMessage;
              }
              // Xử lý lỗi chung khác
              const generalError = "Đăng nhập thất bại. Vui lòng thử lại.";
              setError(generalError);
              toast.error(generalError);
              return generalError;
            },
          },
        },
        {
          position: "top-center",
          autoClose: 2000,
        }
      ).finally(() => setLoading(false));
    }
    catch (error) {
      // Kiểm tra lỗi 401 và hiển thị thông báo
      if (error.response?.status === 401) {
        const errorMessage = "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
        });
     
      } else {
        const generalError = "Đăng nhập thất bại. Vui lòng thử lại.";
        setError(generalError);
        toast.error(generalError, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
   
  };
  
    }
  }
  return (
    <div>
      <ToastContainer
        autoClose={5000}
        draggable={true}
        limit={1}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />

      <Container className="d-flex justify-content-center align-items-center vh-100 login-container">
        <Card className="login-card p-4 shadow-lg">
          <h2 className="text-center mb-4">Đăng Nhập</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group className="mb-3 " >
              <Form.Label>Mật Khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}              
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />  
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Remember Me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button type="submit" variant="primary" className="login-btn" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Đăng Nhập"}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login
