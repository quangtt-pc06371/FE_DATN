import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

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
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 login-container">
      <Card style={{ width: "400px" }} className="p-4">
        <h2 className="text-center mb-4">Đăng Nhập</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Nhập mật khẩu"
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex justify-content-between">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/")}>
              Quay lại
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
