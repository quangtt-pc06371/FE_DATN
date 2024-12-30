import React, { useState, useEffect } from "react";
import axios from "axios";

function ShippingCalculator({ order }) {
  const [shippingCosts, setShippingCosts] = useState({}); // Lưu phí vận chuyển theo từng shop
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading set to true

  const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273"; // API Key GHN
  const GHN_SHOP_ID = 5332507; // Shop ID GHN

  // Hàm tính phí vận chuyển cho từng shop trong đơn hàng
  const calculateShippingCosts = async () => {
    setLoading(true); // Start loading

    try {
      const newShippingCosts = {}; // Lưu phí vận chuyển của từng shop

      // Lặp qua từng chi tiết đơn hàng trong order
      for (const item of order) {
        // Lấy thông tin địa chỉ của shop
        const fromDistrictId = item.chiTietDonHangs[0]?.skuEntity.sanPhamEntity.shop.diaChiEntities[0]?.idDistrict;
        const fromWardCode = item.chiTietDonHangs[0]?.skuEntity.sanPhamEntity.shop.diaChiEntities[0]?.idWard;
        
        // Lấy thông tin địa chỉ người mua
        const toDistrictId = item.taiKhoanEntity?.diaChiEntity[0]?.idDistrict;
        const toWardCode = item.taiKhoanEntity?.diaChiEntity[0]?.idWard;

        // Tính trọng lượng tổng của tất cả các sản phẩm trong shop này
        const totalWeight = item.chiTietDonHangs.reduce((acc, detail) => acc + (detail.skuEntity.sanPhamEntity.canNang || 0), 0);

        // Kiểm tra dữ liệu có đầy đủ không
        if (!fromDistrictId || !fromWardCode || !toDistrictId || !toWardCode || totalWeight <= 0) {
          setError("Thông tin không đầy đủ để tính phí vận chuyển.");
          setLoading(false); // End loading if error occurs
          return;
        }

        // Gửi yêu cầu tính phí vận chuyển cho shop
        const response = await axios.post(
          "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", // API tính phí vận chuyển của GHN
          {
            from_district_id: fromDistrictId,
            from_ward_code: fromWardCode,
            to_district_id: toDistrictId,
            to_ward_code: toWardCode,
            weight: totalWeight, // Tính phí vận chuyển cho tổng trọng lượng của shop
            service_type_id: 2, // Giao nhanh
          },
          {
            headers: {
              Token: GHN_API_KEY,
              ShopId: GHN_SHOP_ID,
            },
          }
        );

        // Lấy phí vận chuyển từ phản hồi GHN
        const fee = response.data?.data?.total;

        if (fee) {
          // Lưu phí vận chuyển cho shop này vào đối tượng
          newShippingCosts[item.chiTietDonHangs[0]?.skuEntity.sanPhamEntity.shop.id] = fee;

          // Cập nhật phí vận chuyển vào CSDL cho shop này
          await axios.post(
            "http://localhost:8080/api/order/update-shipping-fee", // Backend API để cập nhật phí vận chuyển cho shop
            {
              orderId: item.idDonHang, // ID đơn hàng
              shippingFee: fee, // Phí vận chuyển tính được
            }
          );
        } else {
          throw new Error("Không tìm thấy dữ liệu phí vận chuyển.");
        }
      }

      setShippingCosts(newShippingCosts); // Lưu phí vận chuyển cho tất cả các shop
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu:", err);
      setError("Có lỗi xảy ra khi tính phí vận chuyển.");
    } finally {
      setLoading(false); // Set loading to false after calculation is complete
    }
  };

  // Tự động gọi hàm tính phí vận chuyển khi component được render
  useEffect(() => {
    calculateShippingCosts();
  }, [order]); // Re-run khi 'order' thay đổi

  return (
    <div>
      {loading ? (
        <p>Đang tính toán phí vận chuyển...</p>
      ) : (
        // Hiển thị phí vận chuyển cho từng shop
        Object.keys(shippingCosts).map((shopId) => (
          <p key={shopId}>
            Phí vận chuyển cho shop {shopId}: {shippingCosts[shopId].toLocaleString()} VND
          </p>
        ))
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default ShippingCalculator;
