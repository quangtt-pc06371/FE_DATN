import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import CreateAddress from "./CreateAddress"; // Component for adding address
import SelectAddress from "./SelectAddress";

function AddressForm() {
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("select");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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

  const saveSelectAddress = async (idDiaChi) => {
    const token = Cookies.get("token");

    if (!token) {
      alert("Vui lòng đăng nhập");
      return;
    }
    console.log(idDiaChi)
    try {
      const response = await axios.put(
      `http://localhost:8080/api/addresses/updateSelectAddress/${idDiaChi}`,
        // {
        //   idDiaChi: idDiaChi,
        // },
        {
          headers: { Authorization: `${token}` },
        }
      );
      console(response.data)
      if (response.data) {
        setAddresses(response.data.diaChi);
      } else {
        alert("Không tìm thấy địa chỉ");
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ: ", error);
      alert("Không thể tải địa chỉ.");
    }
  };

  return (
    <div>
      <div className="d-flex">
        <h3>Địa chỉ giao hàng</h3>
        <button
          type="button"
          className="btn btn-primary ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        
        >
          Thay Đổi
        </button>
      </div>

      {addresses.length > 0 ? (
        addresses
          .filter((address) => address.selected === true) // Filter out addresses with isSelect as true
          .map((address) => (
            <div key={address.id} className="card mb-3">
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
          ))
      ) : (
        <p>Không có địa chỉ nào.</p>
      )}

      {/* Modal SelectAddress */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              {/* Tab Navigation */}
              <ul className="nav">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "select" ? "active fw-bold" : ""
                    }`}
                    onClick={() => handleTabChange("select")}
                  >
                    Chọn Địa Chỉ
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "create" ? "active fw-bold" : ""
                    }`}
                    onClick={() => handleTabChange("create")}
                  >
                    Thêm Địa Chỉ
                  </button>
                </li>
              </ul>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "select" && (
                  <div className="tab-pane fade show active">
                    <SelectAddress />
                  </div>
                )}
                {activeTab === "create" && (
                  <div className="tab-pane fade show active">
                    <CreateAddress />
                  </div>
                )}
              </div>
            </div>

            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveSelectAddress}
              >
                Lưu thay đổi
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
