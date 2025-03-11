'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut, getSession } from 'next-auth/react'; // Import getSession for fetching session details
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/style/head.css';
import CustomerForm from '../components/CustomerForm.js';
import Employee from '../components/Employee.js';
import CustomerCheck from '../components/CustomerCheck.js';

function Head() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const { data: session, status } = useSession(); // ใช้ useSession สำหรับดึงสถานะ session
    const router = useRouter();

    // Handle tab switching
    const handleCustomerClick = () => {
        setActiveTab(activeTab === "customers" ? null : "customers");
    };

    const handleEmployeeClick = () => {
        setActiveTab(activeTab === "employees" ? null : "employees");
    };

    const handleCustomerInfoClick = () => {
        setActiveTab(activeTab === "customerInfo" ? null : "customerInfo");
    };

    // Handle logout
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
                if (!(currentSession.user.positionID === 'P015' || currentSession.user.positionID === 'P017')) {
                    console.log("User is not a head, redirecting to login...");
                    router.push('/login'); // ถ้าไม่ใช่ผู้จัดการ, ส่งไปหน้า login
                }
            }
        };

        checkSession(); // เช็คเซสชันหลังจากสถานะของผู้ใช้พร้อมแล้ว
    }, [status, router]);

    return (
        <div className="head-body">
            {/* Header Navbar */}
            <nav className="head-header">
                <div className="head-title">ตำแหน่งหัวหน้าฝ่ายขาย</div>
                <div className="head-button-container">
                    {isAdmin && (
                        <button className="head-button" onClick={() => router.push('/admin')}>
                            Back
                        </button>
                    )}
                    <button className="head-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Sidebar Navigation */}
            <div className="head-vertical-navbar">
                <Link
                    href="#customers"
                    onClick={handleCustomerClick}
                    className={activeTab === "customers" ? "active-tab" : ""}
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
                    className={activeTab === "customerInfo" ? "active-tab" : ""}
                >
                    ตรวจสอบข้อมูลลูกค้า
                </Link>
            </div>

            {/* Main Content */}
            <div className="head-main-content">
                {activeTab === "customers" && <CustomerForm />}
                {activeTab === "employees" && <Employee />}
                {activeTab === "customerInfo" && <CustomerCheck />}
                {!activeTab && <h2>Welcome to the Head Dashboard</h2>}
            </div>
        </div>
    );
}

export default Head;
