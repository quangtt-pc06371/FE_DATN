import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createtaikhoan } from '../services/taikhoanservice';
import { useNavigate,useParams } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
const  Addtaikhoan =() =>{
//     const[maTK, setmaTK]= useState('')
//     const[hoTen, sethoTen]= useState('')
//     const[matKhau, setmatKhau]= useState('')
//     const[email, setemail]= useState('')
//     const[sdt, setsdt]= useState('')

  
//     const[error, seterror] = useState({
//         maTK:'',hoTen:'',matKhau:'',email:'',sdt:'',
//     })
//     function hanlemaTK(e){
//          setmaTK(e.target.value)
//     }
//     function hanlematkhau(e){
//         setmatKhau(e.target.value)
//     }
//     function hanleemail(e){
//         setemail(e.target.value)
//     }
//     function hanlehoten(e){
//         sethoTen(e.target.value)
//     }
//     function hanlesdt(e){
//         setsdt(e.target.value)
//     }
//     const navirater = useNavigate();
//     function savetaikhoan(e){
//     // e.prevenDefault(); 
//     const taikhoan = {maTK,hoTen,matKhau,email,sdt}
//     console.log(taikhoan);
//     if(validateForm()){
//         createtaikhoan(taikhoan).then((response)=>{
//         //    setdada(response?.data)
//             navirater('/')
//           })
//     }
    
//     }
//     function validateForm(){
// let valid = true;
// const errorcopy= {... error}
// if(maTK.trim()){
//     errorcopy.maTK = ''; 
// }else{
//     errorcopy.maTK = 'khong bo trong'; 
//     valid=false;
// }
// if(matKhau.trim()){
//     errorcopy.matKhau = ''; 
// }else{
//     errorcopy.matKhau = 'khong bo trong'; 
//     valid=false;
// }
// if(email.trim()){
//     errorcopy.email = ''; 
// }else{
//     errorcopy.email = 'khong bo trong'; 
//     valid=false;
// }
// if(hoTen.trim()){
//     errorcopy.hoTen = ''; 
// }else{
//     errorcopy.hoTen = 'khong bo trong'; 
//     valid=false;
// }
// if(sdt.trim()){
//     errorcopy.sdt = ''; 
// }else{
//     errorcopy.sdt = 'khong bo trong'; 
//     valid=false;
// }
//  seterror(errorcopy);
//  return valid;
//     }
//   return (
//     <div>
//         <div className="bg-body-secondary">
//                     <h2 className="text-center">Đăng Ký</h2>
//                 </div>
                
//                 <div className="row mt-2 mb-2">
//                     <div className="col-sm-4 offset-4">
//                         <div className="card">
//                             <div className="card-body">
//                                 <div className="mb-3">
//                                     <label for="">Tên đăng nhập:</label>
//                                     <input type="text" className={`form-control ${error.maTK ? 'is-invali' :''}`} placeholder="Tên đăng nhập" name='maTK'
//                                     //  value={setmaTK} 
//                                      onChange={hanlemaTK}/>
//                                        {error.maTK && <div className='invalid-feeback'>{error.maTK} </div> }
//                                 </div>
//                                 <div className="mb-3">
//                                     <label for="">Mật khẩu:</label>
//                                     <input type="password" className={`form-control ${error.matKhau ? 'is-invali' :''}`} placeholder="Mật khẩu" name='matKhau'
//                                     //  value={setmatKhau} 
//                                      onChange={hanlematkhau}/>
//                                       {error.matKhau && <div className='invalid-feeback'>{error.matKhau} </div> }
//                                 </div>
//                                 {/* <div className="mb-3">
//                                     <label for="">Xác nhận mật khẩu:</label><input type="password" className="form-control" placeholder="Xác nhận mật khẩu" />
//                                 </div> */}
//                                 <div className="mb-3">
//                                     <label for="">Email:</label>
//                                     <input type="email" className={`form-control ${error.email ? 'is-invali' :''}`} placeholder="Email" name='email'
//                                     //  value={setemail}
//                                       onChange={hanleemail}/>
//                                        {error.email && <div className='invalid-feeback'>{error.email} </div> }
                                    
//                                 </div>
//                                 <div className="mb-3">
//                                     <label for="">Họ và tên:</label>
//                                     <input type="text" className={`form-control ${error.hoTen ? 'is-invali' :''}`} placeholder="Họ và tên" name='hoTen' 
//                                     // value={sethoTen}
//                                     onChange={hanlehoten}/>
//                                      {error.hoTen && <div className='invalid-feeback'>{error.hoTen} </div> }
//                                 </div>
//                                 <div className="mb-3">
//                                     <label for="">Số điện thoại:</label>
//                                     <input type="text" className={`form-control ${error.sdt ? 'is-invali' :''}`} placeholder="Số điện thoại" name='sdt'  
//                                     // value={setsdt}
//                                     onChange={hanlesdt} />
//                                      {error.sdt && <div className='invalid-feeback'>{error.sdt} </div> }
//                                 </div>
//                                 <div>
//                                     <button type="submit" className="btn btn-outline-info form-control mb-1" onClick={savetaikhoan}>Đăng Ký</button>
//                                     <button type="submit" className="btn btn-outline-secondary form-control">Quay Lại Cửa Hàng</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//     </div>
//   )

const [hoTen, setHoTen] = useState('');
const [email, setEmail] = useState('');
const [matKhau, setMatKhau] = useState('');
const [sdt, setSdt] = useState('');
const [diachi, setDiachi] = useState('');
const [cmnd, setCmnd] = useState('');
const [file, setFile] = useState(null);
const [vaitroId, setVaitroId] = useState('');
const [data, setdata] = useState([])
const [cookies] = useCookies(['user']);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);
const handleFileChange = (event) => {
  setFile(event.target.files[0]);
};

const handleSubmit =  async (e) => {
  e.preventDefault();

//   const formData = new FormData();
  const taiKhoan = {   
    hoTen,
    email,
    matKhau,
    sdt,
    diachi,
    cmnd,
    vaitro: {
      id: 1
    }
  };
  try {
    const token = cookies?.token;
    console.log(taiKhoan)
    console.log(cookies?.token)
        if (!token) {
          setError('Token không tồn tại, vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }   

    const taiKhoanResponse = await axios.post(`http://localhost:8080/api/taikhoan/user`, taiKhoan, {
      headers: {
        Authorization: `Bearer ${token}`,  
          }
    });
    
    console.log(taiKhoanResponse)

    // Nếu tạo tài khoản thành công, tiếp tục upload ảnh
    if (taiKhoanResponse.status === 201) {
      const maTK = taiKhoanResponse.data.id; // Lấy ID của tài khoản vừa tạo
      console.log(maTK)
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await axios.post(
        `http://localhost:8080/api/taikhoan/upload/${maTK}`,formData  , 
         {
          headers: {
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data',
          }
         
            }
        
      );
      console.log(uploadResponse)
      if (uploadResponse.status === 200) {
        alert("Tài khoản và ảnh đã được tạo thành công!");
      }
    }
  } catch (error) {
   
    alert("khoong thanh cong");
   
   
  }

    
};

return (
  <form onSubmit={handleSubmit}>
    <div>
      <label>Họ tên:</label>
      <input type="text" value={hoTen} onChange={(e) => setHoTen(e.target.value)} required />
    </div>
    <div>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    </div>
    <div>
      <label>Mật khẩu:</label>
      <input type="password" value={matKhau} onChange={(e) => setMatKhau(e.target.value)} required />
    </div>
    <div>
      <label>Số điện thoại:</label>
      <input type="text" value={sdt} onChange={(e) => setSdt(e.target.value)} required />
    </div>
    <div>
      <label>Địa chỉ:</label>
      <input type="text" value={diachi} onChange={(e) => setDiachi(e.target.value)} required />
    </div>
    <div>
      <label>CMND:</label>
      <input type="text" value={cmnd} onChange={(e) => setCmnd(e.target.value)} required />
    </div>
    {/* <div>
      <label>Vai trò ID:</label>
      <input type="text" value={vaitroId} onChange={(e) => setVaitroId(e.target.value)} required />
    </div> */}
    <div>
      <label>Ảnh đại diện:</label>
      <input type="file" onChange={handleFileChange} />
    </div>
    <button type="submit">Tạo tài khoản</button>
  </form>
);
}

export default  Addtaikhoan