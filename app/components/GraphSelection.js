import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import '@/app/style/GraphSelection.css';

// ลงทะเบียนคอมโพเนนต์ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GraphSelection = () => {
  const [selectedGraph, setSelectedGraph] = useState('bar');
  const [type, setType] = useState('Barchart'); // ประเภทกราฟเริ่มต้น
  const [data, setData] = useState('PolicyType'); // ประเภทข้อมูลเริ่มต้น
  const [time, setTime] = useState('7'); // ช่วงเวลาเริ่มต้น
  const [graphResult, setGraphResult] = useState(null); // ข้อมูลการตอบกลับจาก API

  // ฟังก์ชันในการเปลี่ยนประเภทกราฟและเรียก fetch ข้อมูลในครั้งเดียว
  const handleGraphChange = (graphType) => {
    setSelectedGraph(graphType);

    let newType = '';
    if (graphType === 'bar') {
      newType = 'Barchart';
    } else if (graphType === 'line') {
      newType = 'Linechart';
    } else if (graphType === 'pie') {
      newType = 'Piechart';
    }

    setType(newType);
    handleFetchGraph(newType, data, time);
  };

  // ดึงข้อมูลกราฟตามการเลือกของผู้ใช้
  const handleFetchGraph = async (newType = type, newData = data, newTime = time) => {
    try {
      const response = await fetch(
        `/api/dataSale/Graph?type=${newType}&data=${newData}&time=${newTime}`
      );
      const result = await response.json();

      if (response.ok) {
        setGraphResult(result);
        console.log('ดึงข้อมูลกราฟสำเร็จ:', result);
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.message}`);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      alert('ไม่สามารถเชื่อมต่อกับ API ได้');
    }
  };


  useEffect(() => {
    handleFetchGraph();
  }, [data, time]);

  const randomColors = [ //สีในกราฟเปลี่ยน
    '#AEC6CF', '#FFDAB9', '#B0E0E6', '#C3B1E1', '#FFB347', '#77DD77',
    '#FF6961', '#FDFD96', '#CFCFC4', '#D1C4E9', '#F8B88B', '#F5E6CC',
  ];

  let graphData = {
    labels: graphResult ? graphResult.labels : ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: graphResult ? graphResult.label : 'ข้อมูลการขาย',
        data: graphResult ? graphResult.data : [65, 59, 80, 81, 56],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (type === "Barchart" || type === "Piechart") {
    graphData = {
      labels: graphResult ? graphResult.labels : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      datasets: [
        {
          label: data,
          data: graphResult ? graphResult.counts : [65, 59, 80, 81, 56],
          backgroundColor: randomColors,
          borderColor: randomColors,
          borderColor: type === "Piechart" ? '#FFFFFF' : randomColors, // ขอบสีขาวสำหรับกราฟวงกลม
          borderWidth: type === "Piechart" ? 2 : 1, // ความหนาขอบ 2px สำหรับกราฟวงกลม
        },
      ],
    };
  } else if (type === "Linechart") { //โครงสร้างกราฟเส้น
    graphData = {
      labels: graphResult && graphResult.DateTime ?
        graphResult.DateTime.start.map((start, index) => `${start} - ${graphResult.DateTime.end[index]}`) :
        ["January", "February", "March", "April", "May"],
      datasets: graphResult && graphResult.Value && graphResult.Value.length > 0
        ? graphResult.Value.map((value, index) => ({
          label: `${value.data}`,
          data: value.count,
          fill: false,
          borderColor: randomColors[index],
          tension: 0.1, // ความโค้งของเส้น
          borderWidth: 2, // ความหนาของเส้น
          pointRadius: 3, // ขนาดจุดปกติ
          pointHoverRadius: 5, // ขนาดจุดเมื่อ hover
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: 'rgba(255, 255, 255, 1)',
        }))
        : [
          {
            label: 'ข้อมูลการขาย',
            data: [],
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1, // ความโค้งของเส้น
            borderWidth: 2, // ความหนาของเส้น
            pointRadius: 3, // ขนาดจุดปกติ
            pointHoverRadius: 5, // ขนาดจุดเมื่อ hover
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: 'rgba(255, 255, 255, 1)',
          },
        ],
    };

  }

  const renderGraph = () => {
    switch (selectedGraph) {
      case 'bar':
        return <Bar data={graphData} width={500} height={500} />;
      case 'line':
        return <Line data={graphData} width={500} height={500} />;
      case 'pie':
        return <Pie data={graphData} width={500} height={500} />;
      default:
        return <p>กรุณาเลือกประเภทกราฟ</p>;
    }
  };

  return (
    <div className="graph-container unique-graph">
      <div className="graph-list">
        <h3>เลือกประเภทกราฟ</h3>
        <div
          className={`graph-item ${selectedGraph === 'bar' ? 'selected' : ''}`}
          onClick={() => handleGraphChange('bar')}
        >
          <div className="circle-icon"></div>
          <label className="graph-label">กราฟแท่ง</label>
        </div>
        <div
          className={`graph-item ${selectedGraph === 'line' ? 'selected' : ''}`}
          onClick={() => handleGraphChange('line')}
        >
          <div className="circle-icon"></div>
          <label className="graph-label">กราฟเส้น</label>
        </div>
        <div
          className={`graph-item ${selectedGraph === 'pie' ? 'selected' : ''}`}
          onClick={() => handleGraphChange('pie')}
        >
          <div className="circle-icon"></div>
          <label className="graph-label">กราฟวงกลม</label>
        </div>
      </div>

      <div className="graph-details">
        <h3>รายละเอียด</h3>
        {/* ตัวควบคุมกราฟ */}
        <div className="graph-controls mt-4">
          <h4 className="text-lg font-semibold mb-4">เลือกตัวเลือกกราฟ</h4>

          <div className="mb-4">
            <label className="mr-2">ข้อมูล:</label>
            <select
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="CoverageAmount">จำนวนความคุ้มครอง</option>
              <option value="PolicyType">ประเภทกรมธรรม์</option>
              <option value="TypeOfUse">ประเภทการใช้งาน</option>
              <option value="CarDashCam">กล้องติดรถยนต์</option>
              <option value="Deductible">การหักลดหย่อน</option>
              <option value="GarageType">ประเภทอู่ซ่อม</option>
              {selectedGraph === 'line' && (
                <option value="ClaimStatus">การเคลมประกัน</option>
              )}
            </select>
          </div>

          {/* ซ่อนการเลือกช่วงเวลาสำหรับกราฟวงกลมและกราฟแท่ง */}
          {selectedGraph !== 'pie' && selectedGraph !== 'bar' && (
            <div className="mb-4">
              <label className="mr-2">ช่วงเวลา (เดือน):</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="7">7 วัน</option>
                <option value="1">1 เดือน</option>
                <option value="3">3 เดือน</option>
                <option value="12">12 เดือน</option>
              </select>
            </div>
          )}
        </div>

        {renderGraph()}
      </div>
    </div>
  );
};

export default GraphSelection;