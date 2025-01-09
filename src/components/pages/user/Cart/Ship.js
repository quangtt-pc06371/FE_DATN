import React, { useState, useEffect } from "react";
import axios from "axios";

function ShippingCalculator({ shop, onChange }) {
  const [shippingFee, setShippingFee] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const GHN_API_KEY = "170c2289-75de-11ef-8a64-e298e9300273"; // API Key GHN
  const GHN_SHOP_ID = 5332507; // Shop ID GHN

  const calculateShipping = async () => {
    setLoading(true);

    try {
      const address = JSON.parse(localStorage.getItem("address")) || [];

      if (!address.addresses) {
        setError("Không tìm thấy địa chỉ trong localStorage.");
        setLoading(false);
        return;
      }

      const shopAddress = shop[0]?.sanPhamEntity.shop.diaChiEntities[0];
      const fromDistrictId = shopAddress?.idDistrict;
      const fromWardCode = shopAddress?.idWard;

      const toDistrictId = address.addresses[0]?.idDistrict;
      const toWardCode = address.addresses[0]?.idWard;

      const totalWeight = shop.reduce(
        (acc, item) => acc + item.soLuongMua * item.sanPhamEntity.canNang,
        0
      );

      if (
        !fromDistrictId ||
        !fromWardCode ||
        !toDistrictId ||
        !toWardCode ||
        totalWeight <= 0
      ) {
        setError("Thông tin không đầy đủ để tính phí vận chuyển.");
        setLoading(false);
        return;
      }

      // Kiểm tra nếu đã có phí vận chuyển trong localStorage
      const existingOrder = JSON.parse(localStorage.getItem("order")) || {};
      const existingShippingFees = existingOrder.shippingFees || {};
      const currentFee = existingShippingFees[shop[0]?.sanPhamEntity.shop.shopName];

      if (currentFee) {
        setShippingFee(currentFee); // Nếu đã có, không cần gọi API
        setLoading(false);
        return;
      }

      // Gửi yêu cầu tính phí vận chuyển
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          from_district_id: fromDistrictId,
          from_ward_code: fromWardCode,
          to_district_id: toDistrictId,
          to_ward_code: toWardCode,
          weight: totalWeight,
          service_type_id: 2, // Giao nhanh
        },
        {
          headers: {
            Token: GHN_API_KEY,
            ShopId: GHN_SHOP_ID,
          },
        }
      );

      const fee = response.data?.data?.total;
      if (fee) {
        setShippingFee(fee);

        // Cập nhật phí vận chuyển trong localStorage
        const updatedShippingFees = {
          ...existingShippingFees,
          [shop[0].sanPhamEntity.shop.id]: fee,
        };

        const updatedOrder = {
          ...existingOrder,
          shippingFees: updatedShippingFees,
        };
        setShippingFee(fee)
        setError(error);
        if (onChange) {
          onChange(fee);
        }
        // Sử dụng hàm createShippingFeeID
        createShippingFeeID(shop[0].sanPhamEntity.shop.id, fee);
        localStorage.setItem("order", JSON.stringify(updatedOrder));
      } else {
        setError("Không tìm thấy dữ liệu phí vận chuyển.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu:", err);
      setError("Có lỗi xảy ra khi tính phí vận chuyển.");
    } finally {
      setLoading(false);
    }
  };

  const createShippingFeeID = (shopId, fee) => {
    try {
      // Lấy dữ liệu hiện tại từ localStorage
      const existingShippingFees =
        JSON.parse(localStorage.getItem("shippingFeeID")) || {};

      // Cập nhật dữ liệu mới
      const updatedShippingFees = {
        ...existingShippingFees,
        [shopId]: fee,
      };

      // Lưu lại vào localStorage
      localStorage.setItem(
        "shippingFeeID",
        JSON.stringify(updatedShippingFees)
      );
    } catch (error) {
      console.error("Lỗi khi tạo shippingFeeID:", error);
    }
  };

  useEffect(() => {
    if (shop && shop.length > 0) {
      calculateShipping();
    }
  }, [shop]);

  return (
    <div>
      {loading ? (
        <p>Đang tính toán phí vận chuyển...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <p>Phí vận chuyển: {shippingFee?.toLocaleString()} VND</p>
      )}
    </div>
  );
}

export default ShippingCalculator;
