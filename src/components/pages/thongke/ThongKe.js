import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./ThongKe.css"; // Import CSS

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ThongKe = () => {
  const [filter, setFilter] = useState("day");
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const sampleData = {
    day: [
      { label: "01/11", revenue: 500000 },
      { label: "02/11", revenue: 700000 },
      { label: "03/11", revenue: 400000 },
    ],
    month: [
      { label: "Tháng 1", revenue: 15000000 },
      { label: "Tháng 2", revenue: 20000000 },
      { label: "Tháng 3", revenue: 18000000 },
    ],
    year: [
      { label: "2020", revenue: 200000000 },
      { label: "2021", revenue: 250000000 },
      { label: "2022", revenue: 300000000 },
    ],
  };

  // Lấy dữ liệu theo bộ lọc và tìm kiếm
  const filteredData = sampleData[filter]?.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Format dữ liệu cho biểu đồ
  const chartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: filteredData.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê doanh thu",
      },
    },
  };

  return (
    <div className="container">
      <h2 className="heading">Thống kê doanh thu</h2>
      <div className="filter-search-container">
        {/* Dropdown lọc */}
        <div className="filter-container">
          <label htmlFor="filter" className="filter-label">
            Lọc theo:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="search-container">
          <input
            type="text"
            placeholder={`Tìm kiếm theo ${
              filter === "day" ? "ngày" : filter === "month" ? "tháng" : "năm"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ThongKe;
