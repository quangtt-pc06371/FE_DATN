import React, { useState, useCallback } from "react";
import axios from "axios";

function ShippingCalculator({
  pickProvince,
  pickDistrict,
  province,
  district,
  weight,
  deliverOption,
}) {
  const [shippingCost, setShippingCost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const GHTK_API_KEY = "BXikH4dO7V2ql8v7qm95PNsVL3Eezmvr8q9FhX";

  // Hàm tính phí vận chuyển
  const calculateShippingCost = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    console.log("Gửi yêu cầu tính phí vận chuyển..."); // Log để kiểm tra

    try {
        const response = await axios.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
            params: {
                province: province,
                district: district,
                pick_province: pickProvince,
                pick_district: pickDistrict,
                weight: weight,
                deliver_option: deliverOption,
            },
            headers: {
                Token: GHTK_API_KEY,
            },
        });
        if (response.data && response.data.fee) {
            setShippingCost(response.data.fee.fee);
        }
    } catch (err) {
        console.error("Lỗi khi gửi yêu cầu:", err);
        setError("Có lỗi xảy ra khi tính phí vận chuyển.");
    } finally {
        setLoading(false);
    }
}, [loading, province, district, pickProvince, pickDistrict, weight, deliverOption]);


  return (
    <div>
      <h2>Tính Phí Vận Chuyển</h2>
      <button onClick={calculateShippingCost} disabled={loading}>
        {loading ? "Đang tính toán..." : "Tính Phí Vận Chuyển"}
      </button>

      {shippingCost !== null && (
        <p>Phí vận chuyển: {shippingCost.toLocaleString()} VND</p>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default ShippingCalculator;
