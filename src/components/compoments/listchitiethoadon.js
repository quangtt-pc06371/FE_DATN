import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import { useCookies } from "react-cookie";
import { useNavigate,useParams } from 'react-router-dom';
import {chitiethoadon} from '../services/hoadonchitietsevice';

const HoaDonchitiet = () => {
    const [giohoadonchitiet, sethoadonchitiet] = useState([])
    const {id} =useParams();
    useEffect(()=>{
        if(id){
            chitiethoadon(id).then((response) => {
                sethoadonchitiet(response?.data)
                // setemail(response?.data.email)
    
            }).catch(error => {
                console.error(error);
            })
        }
      }, [id]);
    return (
        <>
            
            <main className="container">
                <div className="container mb-5 mt-5">
                    <table className="table table-bordered">
                        <thead className="table">
                            <tr>
                                <th>tên</th>
                                <th>Ảnh</th>
                                <th>Giá</th>
                                <th>Số Lượng</th>
                                <th>tổng tiền</th>
                            
                            </tr>
                        </thead>
                        <tbody>

                            {giohoadonchitiet.map(a =>
                                <tr key={a.maHDCT} >
                                    <td >{a.sanPham.tenSP}</td>
                                    <td className="text-center">
                                        <img
                                            style={{ width: '100px', height: '100px' }}
                                            alt="Product"
                                            src={`/img/${a.sanPham.anh[0].tenAnh}`}
                                        />
                                    </td>

                                    <td >

                                        {a.sanPham.donGia}
                                    </td>
                                    <td >

                                        {a.soLuong}
                                    </td>
                                     <td >

                                        {a.soLuong * a.sanPham.donGia}
                                    </td>
                                 
                                </tr>
                         
                           
                        )}
                        </tbody>
                    </table>

                    <h3>
                        
                    </h3>




                  
                </div>
            </main>
           
        </>
    )
}
export default HoaDonchitiet;