'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // นำเข้า useRouter ด้วย
import '@/app/style/AdminPanel.css';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false); // ใช้ useState สำหรับเก็บสถานะ admin
  const router = useRouter(); // สร้าง router

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
        if (currentSession.user.positionID !== 'P017') {
          console.log("User is not a admin, redirecting to login...");
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

  return (
    <div className="admin-body">
      {/* Header Navbar */}
      <nav className="admin-header">
        <div className="admin-button-container">
          <button className="admin-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Title */}
      <div className="admin-main-title">คุณคือผู้ดูแล</div>

      {/* Main Content */}
      <div className="admin-container">
        <div className="admin-subtitle">เลือกตำแหน่งที่ต้องการเพื่อตรวจสอบ</div>

        {/* Position Links */}
        <div className="admin-positions">
          <Link href="/manager" className="admin-position-link">ตำแหน่งผู้จัดการฝ่ายขาย</Link>
          <Link href="/head" className="admin-position-link">ตำแหน่งหัวหน้าฝ่ายขาย</Link>
          <Link href="/sale" className="admin-position-link">ตำแหน่งฝ่ายขาย</Link>
          <Link href="/marketing" className="admin-position-link">ตำแหน่งการตลาด</Link>
        </div>
      </div>
    </div>
  );
}