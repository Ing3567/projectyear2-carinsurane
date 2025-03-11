'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut,getSession } from 'next-auth/react'; // Import signOut for handling logout
import { useRouter } from 'next/navigation'; // Correct hook for navigation in Next.js
import Link from 'next/link';
import '@/app/style/sales.css';
import CustomerForm from '../components/CustomerForm.js';

function Sales() {
  const router = useRouter(); // useRouter hook for navigation
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session, status } = useSession();

  const handleCustomerClick = () => {
    setShowCustomerForm(!showCustomerForm); // Toggle ฟอร์มลูกค้า
    setActiveTab(showCustomerForm ? null : "customers");
  };

  const handleLogout = async () => {
    try {
        const currentSession = await getSession();
        const res = await fetch('/api/logout', {
            method: 'POST',
            body: JSON.stringify({ username: currentSession.user.user }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (res.ok) {
            await signOut({ redirect: false });
            router.push('/login');
        } else {
            console.error('Failed to log out');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};


useEffect(() => {
  if (status === 'loading') {
    console.log("Session is loading...");
    return; // รอให้สถานะโหลดเสร็จ
  }

  if (status === 'unauthenticated') {
    console.log("User is unauthenticated, redirecting to login...");
    router.push('/login'); // ถ้าไม่มีการยืนยันตัวตน, ไปที่หน้า login
  }

  const checkSession = async () => {
    const currentSession = await getSession(); // ดึงข้อมูลเซสชัน
    console.log("Session data:", currentSession);

    if (currentSession && currentSession.user) {
      console.log("User position ID:", currentSession.user.positionID);
      if (currentSession.user.positionID === 'P017') {
        setIsAdmin(true); // แสดงปุ่ม Back สำหรับ Admin
      }
      if (!(currentSession.user.positionID === 'P016' || currentSession.user.positionID === 'P017')) {
        console.log("User is not a sale, redirecting to login...");
        router.push('/login'); // ถ้าไม่ใช่ผู้จัดการ, ส่งไปหน้า login
      }
    }
  };

  checkSession(); // เช็คเซสชันหลังจากสถานะของผู้ใช้พร้อมแล้ว
}, [status, router]);
  return (
    <div className="sales-body">
      {/* Header Navbar */}
      <nav className="sales-header">
        <div className="sales-title">ตำแหน่งฝ่ายขาย</div>
        <div className="sales-button-container">
          {isAdmin && (
            <button className="sales-button" onClick={() => router.push('/admin')}>
              Back
            </button>
          )}
          <button className="sales-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div className="sales-vertical-navbar">
        <Link 
          href="#customers" 
          onClick={handleCustomerClick} 
          className={activeTab === "customers" ? "active-tab" : ""}
        >
          ลูกค้า
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="sales-main-content">
        {!showCustomerForm ? (
          <h2>Welcome to the Sales Dashboard</h2>
        ) : (
          <CustomerForm /> 
        )}
      </div>
    </div>
  );
}

export default Sales;

