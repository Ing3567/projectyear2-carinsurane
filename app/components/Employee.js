import React, { useState, useEffect } from 'react';
import '@/app/style/Employee.css';

// Function to fetch the employee's subordinates
async function fetchDependsOn() {
  try {
    const response = await fetch(`/api/dataSale/Employee/DependsOn`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Function to fetch the product count
async function fetchProductCount(employeeID, startMonth = 0) {
  try {
    const response = await fetch(`/api/dataSale/Employee?employeeID=${employeeID}&startMonth=${startMonth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching product count:', error);
    return null;
  }
}

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [productCount, setProductCount] = useState(null); // To store the product count
  const [startMonth, setStartMonth] = useState(0); // To store the selected month for query

  // Fetch employees data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const employeeData = await fetchDependsOn();
      setEmployees(employeeData.subordinate);
    };
    fetchData();
  }, []);

  // Function to handle selecting an employee
  const toggleEmployee = async (employee) => {
    if (selectedEmployee && selectedEmployee.EmployeeID === employee.EmployeeID) {
      setSelectedEmployee(null);
      setProductCount(null); // Clear product count if unselected
      setStartMonth(0); // Reset the month to current when unselecting employee
    } else {
      setSelectedEmployee(employee);
      setStartMonth(0); // Reset to current month when selecting a new employee
      const productCountResult = await fetchProductCount(employee.EmployeeID, 0); // Fetch product count with current month
      setProductCount(productCountResult);
    }
  };

  // Function to handle month change
  const handleMonthChange = (event) => {
    const selectedMonth = Number(event.target.value);
    setStartMonth(selectedMonth); // Update the selected month
    if (selectedEmployee) {
      fetchProductCount(selectedEmployee.EmployeeID, selectedMonth).then(setProductCount); // Re-fetch the data with the new month
    }
  };

  return (
    <div className="employee-container unique-employee">
      {/* Left side: Employee list */}
      <div className="employee-list">
        <h3>รายชื่อพนักงาน</h3>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <div
              key={employee.EmployeeID}
              className={`employee-form-item ${selectedEmployee && selectedEmployee.EmployeeID === employee.EmployeeID
                ? 'selected'
                : ''
                }`}
              onClick={() => toggleEmployee(employee)}
            >
              <div className="circle-button" title={`ดูรายละเอียดของ ${employee.FirstName}`}></div>
              <label className="employee-label">{employee.FirstName} {employee.LastName}</label>
            </div>
          ))
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </div>

      {/* Right side: Employee details */}
      <div className="employee-details">
        {selectedEmployee ? (
          <div>
            <h3>รายละเอียดพนักงาน</h3>
            <div className="sui">
              <label>ชื่อ-นามสกุล: {selectedEmployee.FirstName} {selectedEmployee.LastName}</label>
            </div>

            {/* Dropdown for selecting the month */}
            <div className="month-dropdown">
              <label htmlFor="monthSelect">เลือกเดือน: </label>
              <select id="monthSelect" value={startMonth} onChange={handleMonthChange}>
                <option value={0}>เดือนปัจจุบัน</option>
                <option value={1}>เดือนที่แล้ว</option>
                <option value={2}>สองเดือนที่แล้ว</option>
              </select>
            </div>

            {/* Display the product count */}
            <div className="sui">
              <h4>จำนวนสินค้าที่ขาย:</h4>
              <div className="form-group">
        <div className="form-item-EM">
            <label>แผนประกันรถยนต์ชั้น1:</label>
            <input
                type="text"
                value={productCount?.employee.find(emp => emp.PolicyType === "1")?._count._all || 0}
                readOnly
            />
        </div>
        <div className="form-item-EM">
            <label>แผนประกันรถยนต์ชั้น2+:</label>
            <input
                type="text"
                value={productCount?.employee.find(emp => emp.PolicyType === "2+")?._count._all || 0}
                readOnly
            />
        </div>
        <div className="form-item-EM">
            <label>แผนประกันรถยนต์ชั้น2:</label>
            <input
                type="text"
                value={productCount?.employee.find(emp => emp.PolicyType === "2")?._count._all || 0}
                readOnly
            />
        </div>
        <div className="form-item-EM">
            <label>แผนประกันรถยนต์ชั้น3+:</label>
            <input
                type="text"
                value={productCount?.employee.find(emp => emp.PolicyType === "3+")?._count._all || 0}
                readOnly
            />
        </div>
        <div className="form-item-EM">
            <label>แผนประกันรถยนต์ชั้น3:</label>
            <input
                type="text"
                value={productCount?.employee.find(emp => emp.PolicyType === "3")?._count._all || 0}
                readOnly
            />
        </div>
    </div>
            </div>
          </div>
        ) : (
          <p>กรุณาเลือกพนักงานเพื่อดูรายละเอียด</p>
        )}
      </div>
    </div>
  );
}

export default Employee;