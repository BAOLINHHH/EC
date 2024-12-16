import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Col, Row, Form } from "react-bootstrap";
import statsApi from "../../api/statsApi.js";

// Đăng ký các phần tử cần thiết cho biểu đồ cột
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const BookSalesChart = () => {
  // Lấy năm và tháng hiện tại
  const currentYear = new Date().getFullYear();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");

  // Tạo danh sách 12 tháng
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return { value: month, label: `Tháng ${month}` };
  });

  // Tạo danh sách 10 năm gần nhất
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { value: year, label: year };
  });

  // State cho tháng và năm
  const [selectedMonth, setSelectedMonth] = useState(
    months.find((m) => m.value === currentMonth)
  );
  const [selectedYear, setSelectedYear] = useState(
    years.find((y) => y.value === currentYear.toString())
  );
  const [barData, setBarData] = useState(null);

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const handleCallApi = async () => {
    if (selectedMonth && selectedYear) {
      const params = {
        month: selectedMonth.value,
        year: selectedYear.value,
      };

      const response = await statsApi.getStatsPurchases(params);
      // Dữ liệu cho biểu đồ cột
      const finalData = {
        labels: response.data.map((item) => item.categoryName),
        datasets: [
          {
            label: "Số lượng sách bán ra",
            data: response.data.map((item) => item.totalQty),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

      setBarData(finalData);
    }
  };

  useEffect(() => {
    handleCallApi();
  }, [selectedMonth, selectedYear]);

  return (
    <div style={{ padding: "10px" }}>
      <h1 className="fw-bold">Thống kê sách bán chạy nhất</h1>

      <div style={{ marginBottom: "20px", marginTop: "1rem" }}>
        <Row className="align-items-center">
          <Col md={5} className="mb-3">
            <Form.Label>Chọn tháng</Form.Label>
            <Select
              options={months}
              value={selectedMonth}
              onChange={(selectedOption) => setSelectedMonth(selectedOption)}
              placeholder="Chọn tháng"
            />
          </Col>
          <Col md={5} className="mb-3">
            <Form.Label>Chọn năm</Form.Label>
            <Select
              options={years}
              value={selectedYear}
              onChange={(selectedOption) => setSelectedYear(selectedOption)}
              placeholder="Chọn năm"
            />
          </Col>
        </Row>
      </div>

      {barData && (
        <div
          style={{
            width: "80%",
            height: "400px",
            border: "1px solid #ddd",
            margin: "0 auto",
          }}
        >
          <Bar data={barData} options={options} />
        </div>
      )}
    </div>
  );
};

export default BookSalesChart;
