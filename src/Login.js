import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Tạo navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        email: username,
        password,
      });
      // Lưu token vào localStorage (hoặc context/store tùy vào yêu cầu của bạn)
      localStorage.setItem('token', response.data.token);

      // Sau khi đăng nhập thành công, chuyển hướng tới trang giỏ hàng
      navigate('/cart');  // Chuyển hướng tới trang giỏ hàng
    } catch (error) {
      setError('Đăng nhập không thành công.');
    }
  };

  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Đăng Nhập</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;
