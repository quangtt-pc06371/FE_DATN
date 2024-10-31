import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createtaikhoan, gettaikhoan, updatetaikhoan } from '../services/taikhoanservice';
import { useNavigate,useParams } from 'react-router-dom';




const   Updataikhoan =() =>{
    const[maTK, setmaTK]= useState('')
    const[hoTen, sethoTen]= useState('')
    const[matKhau, setmatKhau]= useState('')
    const[email, setemail]= useState('')
    const[sdt, setsdt]= useState('')
    const {id} =useParams();
    const navirater = useNavigate();
  useEffect(()=>{
    if(id){
        gettaikhoan(id).then((response) => {
            setmaTK(response?.data.maTK);
            setemail(response?.data.email);
            sethoTen(response?.data.hoTen);
            setmatKhau(response?.data.matKhau);
            setsdt(response?.data.sdt); 
            // setemail(response?.data.email)

        }).catch(error => {
            console.error(error);
        })
    }
  }, [id]);
    const[error, seterror] = useState({
        maTK:'',hoTen:'',matKhau:'',email:'',sdt:'',
    })

  
   
    
    // console.log(id);
    function savetaikhoan(e){
    // e.prevenDefault();
    const taikhoan = { maTK,hoTen,matKhau,email,sdt}
    console.log(taikhoan);
    if(validateForm()){
        updatetaikhoan(id,taikhoan).then((response)=>{
            console.log(response?.data);
            navirater('/listtaikhoan')
          })
    }
    
    }
    function validateForm(){
let valid = true;
const errorcopy= {... error}
if(maTK.trim()){
    errorcopy.maTK = ''; 
}else{
    errorcopy.maTK = 'khong bo trong'; 
    valid=false;
}
if(matKhau.trim()){
    errorcopy.matKhau = ''; 
}else{
    errorcopy.matKhau = 'khong bo trong'; 
    valid=false;
}
if(email.trim()){
    errorcopy.email = ''; 
}else{
    errorcopy.email = 'khong bo trong'; 
    valid=false;
}
if(hoTen.trim()){
    errorcopy.hoTen = ''; 
}else{
    errorcopy.hoTen = 'khong bo trong'; 
    valid=false;
}
if(sdt.trim()){
    errorcopy.sdt = ''; 
}else{
    errorcopy.sdt = 'khong bo trong'; 
    valid=false;
}
 seterror(errorcopy);
 return valid;
    }
    
    
  return (
    <div>
        <div className="bg-body-secondary">
                    <h2 className="text-center">UPDATE</h2>
                </div>
                
                <div className="row mt-2 mb-2">
                    <div className="col-sm-4 offset-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="mb-3">
                                    <label for="">Tên đăng nhập:</label>
                                    <input type="text" className={`form-control ${error.maTK ? 'is-invali' :''}`} placeholder="Tên đăng nhập" name='maTK'
                                     value={maTK} 
                                     onChange={(e)=> setmaTK(e.target.value)}
                                     />
                                       {error.maTK && <div className='invalid-feeback'>{error.maTK} </div> }
                                </div>
                                <div className="mb-3">
                                    <label for="">Mật khẩu:</label>
                                    <input type="password" className={`form-control ${error.matKhau ? 'is-invali' :''}`} placeholder="Mật khẩu" name='matKhau'readonly
                                    //  value={matKhau}
                                     onChange={(e)=> setmatKhau(e.target.value)}/>
                                      {error.matKhau && <div className='invalid-feeback'>{error.matKhau} </div> }
                                </div>
                               
                                <div className="mb-3">
                                    <label for="">Email:</label>
                                    <input type="email" className={`form-control ${error.email ? 'is-invali' :''}`} placeholder="Email" name='email'
                                      value={email}
                                      onChange={(e)=> setemail(e.target.value)}/>
                                   
                                       {error.email && <div className='invalid-feeback'>{error.email} </div> }
                                    
                                </div>
                                <div className="mb-3">
                                    <label for="">Họ và tên:</label>
                                    <input type="text" className={`form-control ${error.hoTen ? 'is-invali' :''}`} placeholder="Họ và tên" name='hoTen' 
                                     value={hoTen}
                                    onChange={(e)=> sethoTen(e.target.value)}/>
                                     {error.hoTen && <div className='invalid-feeback'>{error.hoTen} </div> }
                                </div>
                                <div className="mb-3">
                                    <label for="">Số điện thoại:</label>
                                    <input type="tel" className={`form-control ${error.sdt ? 'is-invali' :''}`} placeholder="Số điện thoại" name='sdt'  
                                     value={sdt}
                                    onChange={(e)=> setsdt(e.target.value)}/>
                                     {error.sdt && <div className='invalid-feeback'>{error.sdt} </div> }
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-outline-info form-control mb-1" onClick={savetaikhoan}>sua</button>
                                    <button type="submit" className="btn btn-outline-secondary form-control">Quay Lại Cửa Hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
  )
}
export default  Updataikhoan