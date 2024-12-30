import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function SelectedAddress() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = Cookies.get("token");

      if (!token) {
        alert("Vui lòng đăng nhập");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/addresses/list",
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (response.data) {
          setAddresses(response.data.diaChi); // Set the fetched addresses to state
        } else {
          alert("Không tìm thấy địa chỉ");
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ: ", error);
        alert("Không thể tải địa chỉ.");
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div>
      <div>
        <div className="form-check">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div key={address.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id={`flexRadioDefault${address.id}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`flexRadioDefault${address.id}`}
                >
                  <div className="card mb-3">
                    <div className="d-flex">
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Tên người nhận:</strong> {address.hoTen}
                        </p>
                        <p className="card-text">
                          <strong>Số điện thoại:</strong> {address.soDienThoai}
                        </p>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <strong>Địa chỉ:</strong> {address.diachiDetail}
                        </p>
                        <p className="card-text">
                          <strong>Khu vực:</strong> {address.nameWard},{" "}
                          {address.nameDistrict}, {address.nameProvince}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))
          ) : (
            <p>Không có địa chỉ nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectedAddress;
