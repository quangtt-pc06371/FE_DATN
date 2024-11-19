import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ShopDetail = () => {
  const { shopId } = useParams(); // Lấy ID của cửa hàng từ URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Tải thông tin cửa hàng và danh sách sản phẩm
  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const shopResponse = await axios.get(`http://localhost:8080/api/shops/${shopId}`);
        const productResponse = await axios.get(`http://localhost:8080/api/shops/${shopId}/products`);
        setShop(shopResponse.data);
        setProducts(productResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải thông tin cửa hàng:", error);
        Swal.fire("Lỗi", "Không thể tải thông tin cửa hàng", "error");
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">Đang tải thông tin...</div>
      ) : shop ? (
        <div>
          {/* Thông tin cửa hàng */}
          <div className="card mb-4">
            <div className="card-header text-center">
              <h2 className="fw-bold text-primary">{shop.shopName}</h2>
            </div>
            <div className="card-body text-center">
              <div
                className="image-preview mb-3"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  backgroundImage: `url(${shop.shopImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  margin: "0 auto",
                }}
              />
              <p>{shop.shopDescription}</p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="card">
            <div className="card-header text-center">
              <h3 className="fw-bold">Danh sách sản phẩm</h3>
            </div>
            <div className="card-body">
              {products.length > 0 ? (
                <div className="row">
                  {products.map((product) => (
                    <div className="col-md-4 mb-3" key={product.id}>
                      <div className="card h-100">
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.productName}</h5>
                          <p className="card-text">{product.productDescription}</p>
                          <p className="fw-bold text-primary">
                            Giá: {product.productPrice.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">Cửa hàng chưa có sản phẩm nào.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          Không tìm thấy thông tin cửa hàng.
        </div>
      )}
    </div>
  );
};

export default ShopDetail;
