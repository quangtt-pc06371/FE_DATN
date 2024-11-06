// import React, { useEffect, useState } from 'react'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min'; 
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import { createtaikhoan } from '../services/taikhoanservice';
// import { useNavigate,useParams } from 'react-router-dom';
// import { useCookies } from "react-cookie";
// import axios from "axios";
// const  Addtaikhoan =() =>{
  
// const [hoTen, setHoTen] = useState('');
// const [email, setEmail] = useState('');
// const [matKhau, setMatKhau] = useState('');
// const [sdt, setSdt] = useState('');
// const [diachi, setDiachi] = useState('');
// const [cmnd, setCmnd] = useState('');
// const [file, setFile] = useState(null);
// const [vaitroId, setVaitroId] = useState('');
// const [data, setdata] = useState([])
// const [cookies] = useCookies(['user']);
// const [error, setError] = useState('');
// const [loading, setLoading] = useState(true);
// const handleFileChange = (event) => {
//   setFile(event.target.files[0]);
// };

// const handleSubmit =  async (e) => {
//   e.preventDefault();

// //   const formData = new FormData();
//   const taiKhoan = {   
//     hoTen,
//     email,
//     matKhau,
//     sdt,
//     diachi,
//     cmnd,
//     vaitro: {
//       id: 1
//     }
//   };
//   try {
//     const token = cookies?.token;
//     console.log(taiKhoan)
//     console.log(cookies?.token)
//         if (!token) {
//           setError('Token không tồn tại, vui lòng đăng nhập lại.');
//           setLoading(false);
//           return;
//         }   

//     const taiKhoanResponse = await axios.post(`http://localhost:8080/api/taikhoan/user`, taiKhoan, {
//       headers: {
//         Authorization: `Bearer ${token}`,  
//           }
//     });
    
//     console.log(taiKhoanResponse)

//     // Nếu tạo tài khoản thành công, tiếp tục upload ảnh
//     if (taiKhoanResponse.status === 201) {
//       const maTK = taiKhoanResponse.data.id; // Lấy ID của tài khoản vừa tạo
//       console.log(maTK)
//       const formData = new FormData();
//       formData.append("file", file);
//       const uploadResponse = await axios.post(
//         `http://localhost:8080/api/taikhoan/upload/${maTK}`,formData  , 
//          {
//           headers: {
//             Authorization: `Bearer ${token}`, 
//             'Content-Type': 'multipart/form-data',
//           }
         
//             }
        
//       );
//       console.log(uploadResponse)
//       if (uploadResponse.status === 200) {
//         alert("Tài khoản và ảnh đã được tạo thành công!");
//       }
//     }
//   } catch (error) {
   
//     alert("khoong thanh cong");
   
   
//   }

    
// };

// return (
//   <form onSubmit={handleSubmit}>
//     <div>
//       <label>Họ tên:</label>
//       <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
//     </div>
//     <div>
//       <label>Email:</label>
//       <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//     </div>
//     <div>
//       <label>Mật khẩu:</label>
//       <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} required />
//     </div>
//     <div>
//       <label>Số điện thoại:</label>
//       <input type="text" value={sdt} onChange={(e) => setSdt(e.target.value)} required />
//     </div>
//     <div>
//       <label>Địa chỉ:</label>
//       <input type="text" value={diachi} onChange={(e) => setDiachi(e.target.value)} required />
//     </div>
//     <div>
//       <label>CMND:</label>
//       <input type="text" value={cmnd} onChange={(e) => setCmnd(e.target.value)} required />
//     </div>
//     {/* <div>
//       <label>Vai trò ID:</label>
//       <input type="text" value={vaitroId} onChange={(e) => setVaitroId(e.target.value)} required />
//     </div> */}
//     <div>
//       <label>Ảnh đại diện:</label>
//       <input type="file" onChange={handleFileChange} />
//     </div>
//     <button type="submit">Tạo tài khoản</button>
//   </form>
// );
// }

// export default  Addtaikhoan