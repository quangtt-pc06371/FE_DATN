import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ShopUser = () => {
  const [shopInfo, setShopInfo] = useState({
    name: "Tên cửa hàng của bạn",
    description: "Mô tả cửa hàng của bạn",
    image: "" // Chứa URL ảnh đại diện của cửa hàng nếu có
  });
  const [products, setProducts] = useState([
    { id: 1, name: "Sản phẩm 1", price: 100000 },
    { id: 2, name: "Sản phẩm 2", price: 200000 },
  ]);
  const navigate = useNavigate();

  const handleEditShopInfo = () => {
    // Hàm này sẽ xử lý cập nhật thông tin cửa hàng sau khi có API
    Swal.fire({
      icon: "info",
      title: "Chỉnh sửa thông tin cửa hàng",
      text: "Chức năng sẽ cập nhật sau khi có API",
    });
  };

  const handleAddProduct = () => {
    // Hàm này sẽ mở modal thêm sản phẩm mới sau khi có API
    Swal.fire({
      icon: "info",
      title: "Thêm sản phẩm",
      text: "Chức năng sẽ cập nhật sau khi có API",
    });
  };

  const handleEditProduct = (productId) => {
    // Hàm này sẽ xử lý chỉnh sửa sản phẩm theo ID sau khi có API
    Swal.fire({
      icon: "info",
      title: "Chỉnh sửa sản phẩm",
      text: `Sản phẩm ID: ${productId} - Chức năng sẽ cập nhật sau khi có API`,
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center my-4 fw-bold text-primary">Quản Lý Cửa Hàng</h2>

      <div className="card mb-4">
        <div className="card-header text-center">Thông Tin Cửa Hàng</div>
        <div className="card-body text-center">
          <div
            className="image-preview mb-3"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              backgroundImage: `url(${shopInfo.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              margin: "0 auto",
            }}
          />
          <h5>{shopInfo.name}</h5>
          <p>{shopInfo.description}</p>
          <button onClick={handleEditShopInfo} className="btn btn-primary">
            Chỉnh Sửa Thông Tin Cửa Hàng
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Sản Phẩm Trong Cửa Hàng</span>
          <button onClick={handleAddProduct} className="btn btn-success btn-sm">
            Thêm Sản Phẩm
          </button>
        </div>
        <div className="card-body">
          {products.length > 0 ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Hình Ảnh</th>
                  <th>Giá</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.image}</td>
                    <td>{product.price.toLocaleString()} VND</td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="btn btn-warning btn-sm"
                      >
                        Chỉnh Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">Không có sản phẩm nào</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopUser;
