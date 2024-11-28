import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { listhoadonbyid ,updatehoadon,listallhoadonbyid ,deletehoadon} from '../services/detailsevice';
import { deletehoadonchitiet} from '../services/hoadonchitietsevice';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
// import { gettaikhoan } from '../../services/taikhoanservice';
const Listhoandon = () => {
    // const [taikhoanabc, settaikhoan] = useState([])
    const [cookies] = useCookies(['user']);
    const [userId, setUserId] = React.useState('');
    useEffect(() => {
        if (cookies.user) {
            // Giải mã user ID từ cookie
            const decodedUserId = atob(cookies.user); // Giải mã Base64
            setUserId(decodedUserId);
        }
    }, [cookies]);
    // useEffect(() => {

    //     gettaikhoan(matk).then((response) => {
    //         settaikhoan(response?.data)
    //     }).catch(error => {
    //         console.error(error);
    //     })
    // }, [settaikhoan]);
    const [hoadon, sethoadon] = useState([])
    const navigator = useNavigate();
    useEffect(() => {
        listhoadonbyid(userId).then((Response) => {
console.log(Response?.data)
            sethoadon(Response.data)
        }).catch(error => {
            console.error(error);
        })

    }, [userId]
    )


    function chitiethoadon(maHD) {
        navigator(`/listhoadonchitiet/${maHD}`)
        // navigator(`/updatetaikhoan/${maTK}`)
    }
    function huydon(maHD) {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy đơn?");
        if (!isConfirmed) {
            return; // Dừng thực hiện nếu người dùng không xác nhận
        }
        try {

            listallhoadonbyid(maHD).then((Response) => {
                console.log("trnag thai"+Response?.data)             
                    if (
                        (Response?.data.trangthai.id == 3) ||
                        (Response?.data.trangthai.id == 4 ) 
                    ) {              
            const hoadon = {"trangthai" :{"id": 2}}
            //   console.log(trnagthai2);
            //   console.log(hoadon);   
                  updatehoadon(maHD,hoadon).then((response)=>{
                      console.log(response?.data);
                      listhoadonbyid(userId).then((Response) => {
                        console.log(Response?.data)
                                    sethoadon(Response.data)
                                }).catch(error => {
                                    console.error(error);
                                })
                    })                               
                }     
    
                    else{
                        alert("không thể hủy đơn, vui lòng liên hệ shop");
                        return;
                    }
            }
           
            ).catch(error => {
                console.error(error);
            })
            // alert("Xóa thành công!");
        } 
        catch (error) {
            console.error("Có lỗi xảy ra khi xó", error);
        }
    
        
    }
        // navigator(`/updatetaikhoan/${maTK}`)
    
// function updatetaikhoan(maTK){
//     navigator(`/updatetaikhoan/${maTK}`)
// }

    // const a = {
    //   ngay: new Date()
    // };
function xoahoadon(maHD){
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa ?");
        if (!isConfirmed) {
            return; // Dừng thực hiện nếu người dùng không xác nhận
        }
        try {
            deletehoadonchitiet(maHD).then((response)=>{
                console.log(response?.data)
                deletehoadon(maHD).then((response)=>{
                    console.log(response?.data)
                    listhoadonbyid(userId).then((Response) => {
                        console.log(Response?.data)
                                    sethoadon(Response.data)
                                }).catch(error => {
                                    console.error(error);
                                })
                  })
              })
          
            alert("Xóa thành công!");
        } catch (error) {
            console.error("Có lỗi xảy ra khi xó", error);
        }
    
}
function resetdonhan(maHD){
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đặt lại hàng");
    if (!isConfirmed) {
        return; // Dừng thực hiện nếu người dùng không xác nhận
    }
    try {
        listallhoadonbyid(maHD).then((Response) => {
            console.log("trnag thai"+Response?.data)             
                if (
                    (Response?.data.trangthai.id == 2) 
                    // (Response?.data.trangthai.id == 4 ) 
                ) {              
        const hoadon = {"trangthai" :{"id": 3}}
        //   console.log(trnagthai2);
        //   console.log(hoadon);   
              updatehoadon(maHD,hoadon).then((response)=>{
                  console.log(response?.data);
                  listhoadonbyid(userId).then((Response) => {
                    console.log(Response?.data)
                                sethoadon(Response.data)
                            }).catch(error => {
                                console.error(error);
                            })
                })                               
            }     

                else{
                    // alert("không thể hủy đơn, vui lòng liên hệ shop");
                    return;
                }
        }
       
        ).catch(error => {
            console.error(error);
        })
        // alert("Xóa thành công!");
    } 
     catch (error) {
        console.error("Có lỗi xảy ra khi xó", error);
    }

}
    return (
       


<>

<main className="container">
    <div className="container mb-5 mt-5">
        <table className="table table-bordered">
            <thead className="table">
                <tr>
                
            <th>Tên Khách Hàng</th>
            {/* <th>Tên Khách Hàng</th> */}
            <th>Địa Chỉ</th>                       
            <th>Ngày đặt</th>
              <th>số điện thoại</th>
            <th>trạng thái</th>
            <th>chi tiết</th>
            <th>hủy đơn</th>
            <th>đặt lại</th>
            <th>xóa</th>
       </tr>
               
            </thead>
            <tbody>                                          
                            {hoadon.map(a =>
                                <tr key={a.maHD} >                              
                                <td >{a.hoten}</td>
                                {/* <td >{a.taiKhoan.hoTen}</td> */}
                                
                                <td >{a.address}</td>   
                                        
                                <td>{new Date(a.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td >{a.sdt}</td>   
                                <td>{a.trangthai.status}</td>
                                <td>
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> chitiethoadon(a.maHD)}
                                    >
                                        xem chi tiết
                                    </button>

                                </td>
                                
                                <td>
                                {a.trangthai.id == "3" &&  (
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> huydon(a.maHD)}
                                    >
                                      hủy đơn
                                    </button>
                                )}
                                 {a.trangthai.id == "4" &&  (
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> huydon(a.maHD)}
                                    >
                                      hủy đơn
                                    </button>
                                )}
                                {a.trangthai.id == "1" &&  (
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> huydon(a.maHD)}
                                    >
                                      hủy đơn
                                    </button>
                                )}
                                 
                                </td>
                                <td>
                                {a.trangthai.id == "2" &&  (
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> resetdonhan(a.maHD)}
                                    >
                                       đặt lại
                                    </button>
                                 )}
                                </td>
                                <td>
                                {a.trangthai.id == "2" &&  (
                                    <button 
                                        type="button"
                                        class="btn btn-primary"
                                    onClick={()=> xoahoadon(a.maHD)}
                                    >
                                        xóa
                                    </button>
                                 )}
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
export default Listhoandon;