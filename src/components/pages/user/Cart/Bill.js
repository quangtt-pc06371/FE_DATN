import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState("choxacnhan");
  const [orders, setOrders] = useState({
    choxacnhan: [],
    cholayhang: [],
    chogiohang: [],
    dagiao: [],
    dahuy: [],
  });

  const fetchOrders = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Vui lòng đăng nhập.");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/order/list", {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        const allOrders = response.data.donHang;
        const categorizedOrders = {
          choxacnhan: allOrders.filter((order) => order.trangThaiDonHang === 0),
          cholayhang: allOrders.filter((order) => order.trangThaiDonHang === 1),
          chogiohang: allOrders.filter((order) => order.trangThaiDonHang === 2),
          dagiao: allOrders.filter((order) => order.trangThaiDonHang === 3),
          dahuy: allOrders.filter((order) => order.trangThaiDonHang === 4),
        };
        setOrders(categorizedOrders);
      } else {
        alert("Đã có lỗi xảy ra khi lấy danh sách hóa đơn.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Phân nhóm sản phẩm theo shop
  const groupByShop = (orderData) => {
    const grouped = {};

    orderData.forEach((order) => {
      order.chiTietDonHangs.forEach((chiTiet) => {
        const shop = chiTiet.sanPhamEntity.shop;
        const product = {
          idSanPham: chiTiet.sanPhamEntity.idSanPham,
          tenSanPham: chiTiet.sanPhamEntity.tenSanPham,
          hinhAnh: chiTiet.skuEntity.hinhAnh.tenAnh,
          sku2: chiTiet.skuEntity.tuyChonThuocTinhSkus[0].tuyChonThuocTinh.giaTri,
          sku1: chiTiet.skuEntity.tuyChonThuocTinhSkus[0].tuyChonThuocTinh.thuocTinh.ten,
          giaSanPham: chiTiet.sanPhamEntity.skus[0].giaSanPham,
          soLuongMua: chiTiet.soLuong,
        };

        if (!grouped[shop.id]) {
          grouped[shop.id] = {
            shopName: shop.shopName,
            shopImage: shop.shopImage,
            products: [],
          };
        }
        grouped[shop.id].products.push(product);
      });
    });

    return grouped;
  };

  const groupedProducts = groupByShop(orders[activeTab]);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Đơn Hàng</h2>

      {/* Navigation Tab */}
      <ul className="nav nav-pills justify-content-center mt-4">
        {["choxacnhan", "cholayhang", "chogiohang", "dagiao", "dahuy"].map(
          (key) => (
            <li className="nav-item" key={key}>
              <a
                className={`nav-link ${activeTab === key ? "active" : ""}`}
                href={`#${key}`}
                onClick={() => setActiveTab(key)}
              >
                {key === "choxacnhan" && "Chờ Xác Nhận"}
                {key === "cholayhang" && "Chờ Lấy Hàng"}
                {key === "chogiohang" && "Chờ Giao Hàng"}
                {key === "dagiao" && "Đã Giao"}
                {key === "dahuy" && "Đã Hủy"}
              </a>
            </li>
          )
        )}
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {Object.keys(orders).map((key) => (
          <div
            key={key}
            className={`tab-pane fade ${activeTab === key ? "show active" : ""}`}
            id={key}
          >
            <h5>
              {key === "choxacnhan" && "Đơn hàng đang chờ xác nhận"}
              {key === "cholayhang" && "Đơn hàng đang chờ lấy hàng"}
              {key === "chogiohang" && "Đơn hàng đang chờ giao hàng"}
              {key === "dagiao" && "Đơn hàng đã giao"}
              {key === "dahuy" && "Đơn hàng đã hủy"}
            </h5>
            {orders[key].length > 0 ? (
              Object.keys(groupedProducts).map((shopId) => {
                const shop = groupedProducts[shopId];
                console.log(shop)
                return (
                  <div key={shopId} className="card-body">
                    <h6>{shop?.shopName}</h6>
                
                    {shop?.products.map((item) => (
                      <div
                        key={item.idSanPham}
                        className="row g-0 align-items-center mb-3 border-bottom"
                      >
                        <div className="col-md-2">
                          <img
                            src={item.hinhAnh}
                            alt={item.tenSanPham}
                            className="img-fluid"
                            style={{ width: "80px", height: "80px" }}
                          />
                        </div>
                        <div className="col-md-4">
                          <strong>{item.tenSanPham}</strong>
                          <p>{item.sku1} - {item.sku2}</p>
                        </div>
                        <div className="col-md-2">
                          {item.giaSanPham.toLocaleString()} VND
                        </div>
                        <div className="col-md-2">x{item.soLuongMua}</div>
                        <div className="col-md-2">
                          {(item.giaSanPham * item.soLuongMua).toLocaleString()} VND
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTabs;
