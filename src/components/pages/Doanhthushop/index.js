import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DoanhThu() {
    const [shop, setShop] = useState(null);
    const [doanhThu, setDoanhThu] = useState(null);

    console.log(shop)
    console.log(doanhThu)
    useEffect(() => {
        const fetchShop = async () => {
            const token = Cookies.get("token");
            try {
                const response = await axios.get('http://localhost:8080/api/shops/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setShop(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin shop:", error);
            }
        };
        fetchShop();
        
    }, []);

    useEffect(() => {
        if (shop) {
            const hienThiDoanhThu = async () => {
                try {
                    const apiDoanhThu = 'http://localhost:8080/api/shops/total-amount';
                    const response = await axios.get(`${apiDoanhThu}/${shop.id}`);
                    setDoanhThu(response.data);
                } catch (err) {
                    alert("Không hiển thị được doanh thu.");
                }
            };
            hienThiDoanhThu();
        }
    }, [shop]);

    return (
        <div className="container my-5">
            <div className="card shadow-sm border-1">
                <div className="card-header  text-white d-flex justify-content-between align-items-center">
                   <h2 className="text-center">Doanh Thu Của Shop</h2>
                </div>
                <div className="card-body">
                    <table className="table table-hover table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Doanh Thu</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                           
                        
                                <tr >
                                   
                                    <td>
                                        <h3>{doanhThu}</h3>
                                       
                                    </td>
                                </tr>
                         
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
