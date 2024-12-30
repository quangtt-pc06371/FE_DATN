import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, API, ORDER, ADDRESS } from "./api";
import Cookies from "js-cookie"; // Import thư viện js-cookie
import Voucher from "./Voucher"; // Import component Voucher
import ShippingCalculator from "./Ship";
import Payment from "./Payment";
import AddressForm from "./Address/AddressForm";

function Order() {
  const [shippingFee, setShippingFee] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0); // Khởi tạo tổng phí vận chuyển
  const [totalProduct, setTotalProduct] = useState(0); // Khởi tạo tổng tiền sản phẩm
  const [totalDiscount, setTotalDiscount] = useState(0); // Khởi tạo tổng tiền sản phẩm

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          alert("Vui lòng đăng nhập");
          return;
        }
        const response = await axios.get(
          `${BASE_URL}${API.Address}${ADDRESS.List}`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (response.data && response.data.diaChi) {
          const addresses = response.data.diaChi;

          const selectedAddresses = addresses.filter(
            (address) => address.selected === true
          );

          if (selectedAddresses.length > 0) {
            // Lưu địa chỉ đã chọn vào localStorage
            localStorage.setItem(
              "address",
              JSON.stringify({ addresses: selectedAddresses })
            );
          }
        } else {
          alert("Không tìm thấy địa chỉ");
        }
      } catch (err) {
        alert("Không thể tải địa chỉ: " + err.message);
      }
    };

    fetchAddress();
  }, []);

  const cartData = JSON.parse(localStorage.getItem("cart")) || [];

  const groupedByShop = cartData.reduce((acc, item) => {
    const shopName = item.sanPhamEntity.shop.shopName;

    if (!acc[shopName]) {
      acc[shopName] = [];
    }

    acc[shopName].push(item);

    return acc;
  }, {});

  // Lấy dữ liệu đơn hàng hiện tại từ localStorage
  const existingOrder = JSON.parse(localStorage.getItem("order")) || [];

  // Hàm cập nhật giá trị từ ChildComponent
  const handleShippingFeeChange = (newShippingFee) => {
    setShippingFee(newShippingFee); // Cập nhật state chỉ khi giá trị thay đổi
  };

  // Lưu đơn hàng vào localStorage khi `cartData` hoặc `shippingFees` thay đổi
  // Cập nhật đơn hàng vào localStorage chỉ khi có thay đổi rõ ràng
  useEffect(() => {
    const totals = calculateTotals(); // Tính toán tổng tiền một lần
    const updatedOrder = {
      ...existingOrder,
      cartData, // Dữ liệu giỏ hàng hiện tại
      totals, // Tổng tiền đã tính toán
    };

    // Kiểm tra nếu tổng tiền thay đổi trước khi lưu
    if (JSON.stringify(updatedOrder) !== JSON.stringify(existingOrder)) {
      localStorage.setItem("order", JSON.stringify(updatedOrder));
    }
  }, [cartData, existingOrder.shippingFees]);

  // Cập nhật tổng tiền sản phẩm và phí vận chuyển khi có sự thay đổi
  useEffect(() => {
    const totals = calculateTotals();
    setTotalProduct(totals.totalProductAmount);
    setTotalShippingFee(totals.totalShippingAmount);
  }, [groupedByShop]);

  // Tính toán tổng tiền sản phẩm và tổng phí vận chuyển
  const calculateTotals = () => {
    let totalAmount = 0;
    let totalProductAmount = 0; // Tổng tiền sản phẩm
    let totalShippingAmount = 0; // Tổng phí vận chuyển

    Object.keys(groupedByShop).forEach((shopName) => {
      const totalShopAmount = groupedByShop[shopName].reduce(
        (total, item) =>
          total +
          item.sanPhamEntity.skuEntities[0].giaSanPham * item.soLuongMua,
        0
      );
      const shippingFee =
        (existingOrder.shippingFees && existingOrder.shippingFees[shopName]) ||
        0;

      totalProductAmount += totalShopAmount;
      totalShippingAmount += shippingFee;

      totalAmount += totalShopAmount + shippingFee;
    });

    return { totalProductAmount, totalShippingAmount, totalAmount };
  };

  return (
    <div className="container my-5">
      <h1>Thanh Toán</h1>
      <div className="my-4">
        <AddressForm></AddressForm>
      </div>
      {Object.keys(groupedByShop).length > 0 ? (
        Object.keys(groupedByShop).map((shopName) => (
          <div key={shopName} className="card mb-3">
            <div className="card-header">
              <h5>
                <i className="bi bi-shop"></i> {shopName}
              </h5>
            </div>

            <div className="card-body">
              {groupedByShop[shopName].map((item) => (
                <div
                  key={item.idDetail}
                  className="row g-0 align-items-center mb-3 border-bottom"
                >
                  <div className="col-md-2">
                    <img
                      src="https://dosi-in.com/images/detailed/42/CDL3_1.jpg"
                      alt={item.sanPhamEntity.tenSanPham}
                      className="img-fluid"
                      style={{ width: "80px", height: "80px" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <strong>{item.sanPhamEntity.tenSanPham}</strong>
                    <p>{item.sanPhamEntity.moTa}</p>
                  </div>
                  <div className="col-md-2">
                    {item.sanPhamEntity.skuEntities[0].giaSanPham.toLocaleString()}{" "}
                    VND
                  </div>
                  <div className="col-md-2">x{item.soLuongMua}</div>
                  <div className="col-md-2">
                    {(
                      item.sanPhamEntity.skuEntities[0].giaSanPham *
                      item.soLuongMua
                    ).toLocaleString()}{" "}
                    VND
                  </div>
                </div>
              ))}
            </div>

            <div className="card-footer">
              <ShippingCalculator
                shop={groupedByShop[shopName]}
                onChange={handleShippingFeeChange}
              />
              <strong>
                Tổng tiền sản phẩm:{" "}
                {groupedByShop[shopName]
                  .reduce(
                    (total, item) =>
                      total +
                      item.sanPhamEntity.skuEntities[0].giaSanPham *
                        item.soLuongMua,
                    0
                  )
                  .toLocaleString()}{" "}
                VND
              </strong>
            </div>
          </div>
        ))
      ) : (
        <p>Giỏ hàng của bạn đang trống.</p>
      )}

      <div
        className="border border-secondary rounded-3 mt-1"
        style={{ width: "auto", height: "5rem" }}
      >
        <div className="d-flex">
          {" "}
          <i class="bi bi-ticket-perforated ms-3"></i>{" "}
          <i class="bi bi-ticket-perforated-fill ms-3"></i>{" "}
          <h5 className="ms-3">Voucher Bill</h5>
          <div className="ms-auto">
            <Voucher totalDonHang={existingOrder.totalAmount} />
          </div>
        </div>
      </div>

      <div className="sticky-bottom bg-light text-dark p-3 mt-3 border border-secondary rounded-3">
        <h6>Tổng tiền sản phẩm: {totalProduct.toLocaleString()} VND</h6>
        <h6>Tổng phí vận chuyển: {totalShippingFee.toLocaleString()} VND</h6>
        <h6>
          Giảm giá: -{""}
          {totalDiscount.toLocaleString()} VND
        </h6>
        <h4>
          Tổng thanh toán: {(totalProduct + totalShippingFee).toLocaleString()}{" "}
          VND
        </h4>
        <Payment></Payment>
      </div>
    </div>
  );
}

export default Order;
