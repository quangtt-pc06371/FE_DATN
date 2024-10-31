import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { listhoadonadmin,updatehoadon ,listallhoadonbyid} from '../services/detailsevice';
import { listtrangthai } from '../services/trangthaihoadonsevice';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
// import { gettaikhoan } from '../../services/taikhoanservice';
const Listhoandonadmin = () => {
    // const [taikhoanabc, settaikhoan] = useState([])
    const [cookies] = useCookies(['user']);
    const [trangthaihoadon, settrangthai] = useState({});
    const [trnagthai2, settrangthai2] = useState({});

    const matk = cookies.user;
    // console.log(matk)
    const [hoadon, sethoadon] = useState([])
    const navigator = useNavigate();
    useEffect(() => {
        listhoadonadmin().then((Response) => {
// console.log(Response?.data)
            sethoadon(Response.data)
        }).catch(error => {
            console.error(error);
        })

    }, []
    )

    useEffect(() => {
        listtrangthai().then((Response) => {
// console.log(Response?.data)
settrangthai(Response.data)
        }).catch(error => {
            console.error(error);
        })

    }, []
    )
// console.log(trangthaihoadon)
const handletrangthai = (e) =>{
    const { name, value } = e.target;
    settrangthai2(value );
        // console.log(e.target.value)
        
    }

    // console.log(hoadon)
    // console.log(hoadon[0]?.trangthai.status)
    // console.log(trnagthai2)
    // console.log("trang thai mac định" + Response?.data.trangthai.id)  
    // console.log(Response?.data.trangthai.id)  
    console.log("trạng thái set"+trnagthai2);
    function updatetrangthai(id){
        // e.prevenDefault();
          console.log(id)
        listallhoadonbyid(id).then((Response) => {
            console.log("trnag thai"+Response?.data)  
        
           
                // sethoadon(Response.data)
                    
                      
       

                if (
                    (Response?.data.trangthai.id == 3 && (trnagthai2 == 4 || trnagthai2 == 2)) ||
                    (Response?.data.trangthai.id == 4 && (trnagthai2 == 1 || trnagthai2 == 2)) ||
                    (Response?.data.trangthai.id == 1 && (trnagthai2 == 5||trnagthai2 ==2)) ||
                    (Response?.data.trangthai.id == 5 && (trnagthai2 == 7 || trnagthai2 == 6|| trnagthai2 == 2)) ||
                    (Response?.data.trangthai.id == 7 && trnagthai2 == 7) ||
                    (Response?.data.trangthai.id == 6 && trnagthai2 == 1) ||
                    (Response?.data.trangthai.id == 2 && trnagthai2 == 1)
                ) {              
        const hoadon = {"trangthai" :{"id": parseInt (trnagthai2)}}
          console.log(trnagthai2);
          console.log(hoadon);   
              updatehoadon(id,hoadon).then((response)=>{
                  console.log(response?.data);
                  listhoadonadmin().then((Response) => {
                      sethoadon(Response.data)
                              }).catch(error => {
                                  console.error(error);
                              })
                })                               
            }     

                else{
                    alert("lỗi quy trình");
                    return;
                }
        }
       
        ).catch(error => {
            console.error(error);
        })
    }
    function chitiethoadon(maHD) {
        navigator(`/listhoadonchitiet/${maHD}`)
        // navigator(`/updatetaikhoan/${maTK}`)
    }
// function updatetaikhoan(maTK){
//     navigator(`/updatetaikhoan/${maTK}`)
// }
    return (
       


<>

<main className="container">
    <div className="container mb-5 mt-5">
        <table className="table table-bordered">
            <thead className="table">
                <tr>
                
            <th>Tên Khách Hàng</th>
            {/* <th>Tên Khách Hàng</th> */}
            <th>số điện thoại</th>  
                <th>Địa Chỉ</th> 
                                   
             <th>Ngày đặt</th>
             <th>trạng thái</th>
             <th colspan="2" className='text-center'>cập nhật trạng thái</th>
             {/* <th>action</th> */}
             <th>xem chi tiet</th>
       </tr>
               
            </thead>
            <tbody>
                      
                        
                            {hoadon.map(a =>
                            <tr key={a.maHD} >
                                
                                <td >{a.hoten}</td>
                                {/* <td >{a.taiKhoan.hoTen}</td> */}
                                <td >{a.sdt}</td> 
                                <td >{a.address}</td>                        
                                <td>{new Date(a.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td>{a.trangthai.status}</td>
                                <td>
                               
                                <select
                                className="form-control"
                                name="trnagthai2"
                                // value={a.trangthai.status}
                                onChange={handletrangthai}
                            >
                                <option value="">chọn</option>
                                {trangthaihoadon.map((th) => (
                                    <option key={th.id} value={th.id}>{th.status}</option>
                                ))}
                            </select>
                                    </td>

                                    <td>
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> updatetrangthai(a.maHD)}
                                    >
                                        update trạng thái
                                    </button>

                                </td>
                                <td>
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> chitiethoadon(a.maHD)}
                                    >
                                        xem chi tiết
                                    </button>

                                </td>

                            </tr>
                        )}
                          
            </tbody>
        </table>


      

      
    </div>
</main>

</>
    )
}
export default Listhoandonadmin;