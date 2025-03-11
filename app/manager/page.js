'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut, getSession } from 'next-auth/react'; // Import getSession for fetching session details
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/style/manager.css';
import CustomerForm from '../components/CustomerForm.js';
import Employee from '../components/Employee.js';
import GraphSelection from '../components/GraphSelection.js';
import CustomerCheck from '../components/CustomerCheck.js';

export default function Manager() {
  const [activeTab, setActiveTab] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession(); // ใช้ useSession สำหรับดึงสถานะ session

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
        if (!(currentSession.user.positionID === 'P013' || currentSession.user.positionID === 'P017')) {
          console.log("User is not a manager, redirecting to login...");
          router.push('/login'); // ถ้าไม่ใช่ผู้จัดการ, ส่งไปหน้า login
        }
      }
    };
 
    checkSession(); // เช็คเซสชันหลังจากสถานะของผู้ใช้พร้อมแล้ว
  }, [status, router]);

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


  const handleGraphClick = () => {
    setActiveTab(activeTab === 'graphs' ? null : 'graphs');
  };

  const handleCustomerClick = () => {
    setActiveTab(activeTab === 'customers' ? null : 'customers');
  };

  const handleEmployeeClick = () => {
    setActiveTab(activeTab === 'employees' ? null : 'employees');
  };

  const handleCustomerInfoClick = () => {
    setActiveTab(activeTab === 'customerInfo' ? null : 'customerInfo');
  };

  return (
    <div className="manager-body">
      {/* Header Navbar */}
      <nav className="manager-header">
        <div className="manager-title">ตำแหน่งผู้จัดการฝ่ายขาย</div>
        <div className="manager-button-container">
          {/* Show Back button if user is admin */}
          {isAdmin && (
            <button className="manager-button" onClick={() => router.push('/admin')}>
              Back
            </button>
          )}
          <button className="manager-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <div className="manager-vertical-navbar">
        <Link
          href="#graphs"
          onClick={handleGraphClick}
          className={activeTab === 'graphs' ? 'active-tab' : ''}
        >
          กราฟ
        </Link>
        <Link
          href="#customers"
          onClick={handleCustomerClick}
          className={activeTab === 'customers' ? 'active-tab' : ''}
        >
          ลูกค้า
        </Link>
        {!isAdmin && (  
                    <Link
                        href="#employees"
                        onClick={handleEmployeeClick}
                        className={activeTab === "employees" ? "active-tab" : ""}
                    >
                        พนักงาน
                    </Link>
                )}
        <Link
          href="#customer-info"
          onClick={handleCustomerInfoClick}
          className={activeTab === 'customerInfo' ? 'active-tab' : ''}
        >
          ตรวจสอบข้อมูลลูกค้า
        </Link>
      </div>

      {/* Main Content */}
      <div className="manager-main-content">
        {activeTab === 'graphs' && <GraphSelection />}
        {activeTab === 'customers' && <CustomerForm />}
        {activeTab === 'employees' && <Employee />}
        {activeTab === 'customerInfo' && <CustomerCheck />}
        {!activeTab && <h2>Welcome to the Manager Dashboard</h2>}
      </div>
    </div>
  );
}
