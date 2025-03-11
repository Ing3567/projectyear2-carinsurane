import React, { useState } from 'react';
import Link from 'next/link';
import '@/app/style/CustomerCheck.css';


// Function to fetch customer data from the API
async function fetchPolicyData(name) {
  const url = new URL(`/api/dataSale/Customer/serch?name=${encodeURIComponent(name)}`, window.location.origin);

  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data; 
   
  } catch (error) {
      console.error('Error fetching policy data:', error);
      return null;
  }
}

const CustomerCheck = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedCustomers, setSearchedCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchedCustomers([]);
      setErrorMessage('กรุณากรอกชื่อให้ครบ');
      return;
    }

    try {
      // Fetch the customer data from the API
      const data = await fetchPolicyData(searchTerm);

      // Check if data exists and contains the policy information
      if (data && data.policy && data.policy.length > 0) {
        setSearchedCustomers(data.policy); // Set the policies directly
        setErrorMessage(''); // Clear error if data is found
      } else {
        setSearchedCustomers([]);
        setErrorMessage('ไม่พบข้อมูล');
      }
    } catch (error) {
      setSearchedCustomers([]);
      setErrorMessage('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  // Handle the Enter key press to trigger search
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search on Enter key
    }
  };

  return (
    <div className="customer-check-container">
      <div className="customer-search">
        <input
          type="text"
          placeholder="ค้นหาชื่อลูกค้า"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>ค้นหา</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {searchedCustomers.length > 0 && (
        <div className="customer-display">
          <h3>ผลการค้นหา</h3>
          <ul>
            {searchedCustomers.map((policy) => (
              <li key={policy}>
                <Link href={`/policy/${policy}`}>{policy}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerCheck;
