'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut,getSession } from 'next-auth/react'; // Import signOut for handling logout
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/style/marketing.css';
import GraphSelection from '../components/GraphSelection.js';

function Marketing() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState(null); // State สำหรับควบคุมแท็บ

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
            if (!(currentSession.user.positionID === 'P014' || currentSession.user.positionID === 'P017')) {
              console.log("User is not a marketing, redirecting to login...");
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
        setActiveTab(activeTab === 'graph' ? null : 'graph'); // ควบคุมการเลือกแท็บ
    };

    return (
        <div className="marketing-body">
            {/* Header Navbar */}
            <nav className="marketing-header">
                <div className="marketing-title">ตำแหน่งการตลาด</div>
                <div className="marketing-button-container">
                    {isAdmin && (
                        <button className="marketing-button" onClick={() => router.push('/admin')}>
                            Back
                        </button>
                    )}
                    <button className="marketing-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Sidebar Navigation */}
            <div className="marketing-vertical-navbar">
                <Link
                    href="#graph"
                    onClick={handleGraphClick}
                    className={activeTab === 'graph' ? 'active-tab' : ''}
                >
                    กราฟ
                </Link>
            </div>

            {/* Main Content Area */}
            <div className="marketing-main-content">
                {activeTab === 'graph' ? (
                    <GraphSelection /> // แสดง GraphSelection เมื่อเลือกแท็บ Graph
                ) : (
                    <h2>Welcome to the Marketing Dashboard</h2> // เนื้อหาหลักเมื่อไม่มีแท็บใดถูกเลือก
                )}
            </div>
        </div>
    );
}

export default Marketing;

