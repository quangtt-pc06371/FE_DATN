import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "./CartItem";
import { BASE_URL, API, CART } from "../assets/config/api";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [cartDetail, setCartDetail] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false); // Trạng thái chọn tất cả
  const [selectedIds, setSelectedIds] = useState([]); // Các ID được chọn

  // Nhóm sản phẩm theo shop
  const groupByShop = (chiTietGioHangList) => {
    if (!Array.isArray(chiTietGioHangList)) {
      console.error("Dữ liệu chi tiết giỏ hàng không hợp lệ");
      return {}; // Trả về đối tượng rỗng nếu không phải mảng
    }

    const grouped = {};

    chiTietGioHangList.forEach((item) => {
      // Kiểm tra cấu trúc dữ liệu của từng item
      const shopId = item?.skuEntity?.sanPhamEntity?.shop?.id;
      if (!shopId) {
        console.warn("Sản phẩm không có thông tin shop:", item);
        return; // Bỏ qua nếu không có thông tin shop
      }

      if (!grouped[shopId]) {
        grouped[shopId] = {
          shopName:
            item.skuEntity.sanPhamEntity.shop.shopName || "Shop không tên",
          products: [],
        };
      }

      grouped[shopId].products.push(item);
    });

    return grouped;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Vui lòng đăng nhập");
          return;
        }

        const response = await axios.get(`${BASE_URL}${API.Cart}${CART.List}`, {
          headers: { Authorization: `${token}` },
        });

        if (response.data.gioHang) {
          setCart(response.data.gioHang);
          setCartDetail(groupByShop(response.data.gioHang.chiTietGioHangList));
        } else {
          setError("Không tìm thấy giỏ hàng");
        }
      } catch (err) {
        setError("Không thể tải giỏ hàng: " + err.message);
      }
    };

    fetchCart();
  }, []);

  //Gọi API Để Xóa Detail
  const handleRemoveProduct = async (idDetail) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        return;
      }

      // Gửi yêu cầu xóa sản phẩm qua API với @RequestParam
      const response = await axios.delete(
        `${BASE_URL}${API.Cart}${CART.Delete}?idDetail=${idDetail}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (response.status === 200) {
        // Cập nhật giỏ hàng sau khi xóa sản phẩm thành công
        const updatedCartDetail = { ...cartDetail };

        // Loại bỏ sản phẩm khỏi giỏ hàng
        Object.keys(updatedCartDetail).forEach((shopId) => {
          updatedCartDetail[shopId].products = updatedCartDetail[
            shopId
          ].products.filter((product) => product.idDetail !== idDetail);
        });

        setCartDetail(updatedCartDetail); // Cập nhật lại giỏ hàng
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.message);
      setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  // Gọi API để cập nhật giỏ hàng
  const handleSkuChange = async (idDetail, newQuantity, idSku) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        return;
      }

      const payload = {
        idDetail,
        soLuongMua: newQuantity,
        idSku,
      };

      console.log(payload);

      // Gửi yêu cầu cập nhật SKU và số lượng
      await axios.put(`${BASE_URL}${API.Cart}${CART.Update}`, payload, {
        headers: { Authorization: `${token}` },
      });

      // Cập nhật giỏ hàng sau khi thay đổi SKU
      const updatedCart = await axios.get(
        `${BASE_URL}${API.Cart}${CART.List}`,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (updatedCart.data.gioHang) {
        setCart(updatedCart.data.gioHang);
        setCartDetail(groupByShop(updatedCart.data.gioHang.chiTietGioHangList));
      } else {
        setError("Không tìm thấy giỏ hàng");
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật SKU:",
        error.response ? error.response.data : error.message
      );
      setError("Không thể cập nhật giỏ hàng");
    }
  };

  // Hàm xử lý chọn tất cả
  const handleSelectAll = () => {
    const updatedCartDetail = { ...cartDetail };
    const newSelectedIds = [];
  
    Object.keys(updatedCartDetail).forEach((shopId) => {
      updatedCartDetail[shopId].products = updatedCartDetail[shopId].products.map((product) => {
        product.isSelected = !selectAll;
        if (product.isSelected) {
          newSelectedIds.push(product.idDetail); // Thêm vào danh sách đã chọn nếu được chọn
        }
        return product;
      });
    });
  
    setCartDetail(updatedCartDetail);
    setSelectAll(!selectAll); // Đảo trạng thái của "Chọn tất cả"
    setSelectedIds(newSelectedIds); // Cập nhật lại danh sách sản phẩm đã chọn
  };
  

  //Hàm xử lý chọn từng idDetail
  const handleSelectProduct = (idDetail) => {
  const updatedCartDetail = { ...cartDetail };

  Object.keys(updatedCartDetail).forEach((shopId) => {
    updatedCartDetail[shopId].products = updatedCartDetail[shopId].products.map((product) => {
      if (product.idDetail === idDetail) {
        product.isSelected = !product.isSelected;

        // Cập nhật selectedIds
        if (product.isSelected) {
          setSelectedIds(prevIds => [...prevIds, idDetail]); // Thêm vào danh sách đã chọn
        } else {
          setSelectedIds(prevIds => prevIds.filter(id => id !== idDetail)); // Xóa khỏi danh sách đã chọn
        }
      }
      return product;
    });
  });

  // Kiểm tra nếu tất cả các sản phẩm đã được chọn, cập nhật trạng thái "Chọn tất cả"
  const allSelected = Object.values(updatedCartDetail).every(shop =>
    shop.products.every(product => product.isSelected)
  );

  setCartDetail(updatedCartDetail);
  setSelectAll(allSelected); // Cập nhật trạng thái "Chọn tất cả"
};


  //Hàm Xử Lý Mua Hàng
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        return;
      }
  
      setIsSubmitting(true);
  
      const selectedProducts = selectedIds;
  
      if (selectedProducts.length === 0) {
        alert("Vui lòng chọn sản phẩm để đặt hàng.");
        setIsSubmitting(false);
        return;
      }
  
      const payload = {
        idDetail: selectedProducts,
      };
  
      const response = await axios.put(
        `${BASE_URL}${API.Cart}${CART.UpdateStatus}`,
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );
  
      if (response.status === 200) {
        alert("Đặt hàng thành công!");
  
        // Cách 1: Gọi lại API để lấy giỏ hàng cập nhật
        const updatedCart = await axios.get(`${BASE_URL}${API.Cart}${CART.List}`, {
          headers: { Authorization: `${token}` },
        });
  
        if (updatedCart.data.gioHang) {
          setCart(updatedCart.data.gioHang);
          setCartDetail(groupByShop(updatedCart.data.gioHang.chiTietGioHangList));
        } else {
          setCartDetail({});
        }
  
        // Reset danh sách sản phẩm đã chọn
        setSelectedIds([]);
      }
  
      setIsSubmitting(false);
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error.message);
      setError("Không thể đặt hàng. Vui lòng thử lại.");
      setIsSubmitting(false);
    }
  };
  
  

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!cart) {
    return <div className="loading-message">Đang tải giỏ hàng...</div>;
  }

  const totalAmount = cart.tongTien;

  return (
    <>
      <div className="container my-5">
        <h1 className="mb-4">Giỏ hàng của bạn</h1>
        {/* Dòng thông tin chung (hiển thị 1 lần) */}
        <div>
          <div className="card border shadow-sm mb-4">
            <div className="row g-0 align-items-center px-3 py-2 bg-light">
              {/* Cột Checkbox Select tất cả IdDetail*/}
              <div className="col-md-1 d-flex justify-content-center">
                <div className="form-check">
                  <input
                    className="form-check-input border shadow-sm"
                    type="checkbox"
                    checked={selectAll} // Liên kết trạng thái "Chọn tất cả"
                    onChange={handleSelectAll} // Gọi hàm xử lý khi người dùng nhấn vào checkbox
                  />
                </div>
              </div>

              {/* Tiêu đề các cột */}
              <div className="col-md-4">
                <strong>Sản Phẩm</strong>
              </div>
              <div className="col-md-2">
                <strong>Đơn Giá</strong>
              </div>
              <div className="col-md-2">
                <strong>Số Lượng</strong>
              </div>
              <div className="col-md-2">
                <strong>Thành Tiền</strong>
              </div>
              <div className="col-md-1">
                <strong>Thao Tác</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="row align-items-start">
          {cartDetail && Object.keys(cartDetail).length > 0 ? (
            Object.keys(cartDetail).map((shopId) => (
              <div key={shopId} className="mb-4">
                {/* Khung bao quanh từng cửa hàng */}
                <div className="card border shadow-sm">
                  <div className="card-header d-flex align-items-center bg-light">
                    <i className="bi bi-shop"></i>
                    <h3 className="ms-3 me-5 mb-0">
                      {cartDetail[shopId].shopName}
                    </h3>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      {cartDetail[shopId].products.map((product) => (
                        <li key={product.idDetail} className="mb-3">
                          <CartItem
                            product={product}
                            onSkuChange={handleSkuChange}
                            onSelect={handleSelectProduct}
                            deleteDetail={handleRemoveProduct}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn chưa có sản phẩm nào.</p>
          )}
        </div>

        {/* Phần thanh toán */}
        <div className="checkout-container position-fixed bottom-0 start-0 end-0 bg-white p-3 card border shadow-sm">
          <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-6">
                <h3 className="mb-0 fs-2 d-flex">
                  <p className="ms-5 me-3">Tổng tiền:</p>
                  <p className="text-danger">
                    {totalAmount.toLocaleString()} VND
                  </p>
                </h3>
              </div>
              <div className="col-6 text-end">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="btn btn-success w-50 fs-5 py-2 me-5"
                >
                  {isSubmitting ? "Đang mua hàng..." : "Mua hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
