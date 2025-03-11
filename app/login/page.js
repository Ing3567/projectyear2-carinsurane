'use client';  // ระบุว่าเป็น Client Component
import { useState, useEffect } from 'react';
import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@/app/style/Login.css';

const handleLogout = async () => {
    try {
        const currentSession = await getSession();
        if (currentSession) {
            const res = await fetch('/api/logout', {
                method: 'POST',
                body: JSON.stringify({ username: currentSession.user.user }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                await signOut({ redirect: false });
            } else {
                console.error('Failed to log out');
            }
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // เพิ่ม state สำหรับแสดงข้อผิดพลาด
    const router = useRouter();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // ลบข้อความข้อผิดพลาดก่อนหน้าทุกครั้งที่ส่งฟอร์มใหม่
        try {
            const checkSessionAndLogout = async () => {
                const session = await getSession();
                if (session) {
                    await handleLogout();  // เรียกใช้ฟังก์ชัน logout
                }
            };
            checkSessionAndLogout();
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError(result.error);  // ตั้งค่า error ที่ได้รับจาก NextAuth
            } else {
                const session = await getSession();
                console.log(session);

                if (session) {
                    if (session.user.positionID === 'P013' && session.user.departmentID === 'MK') {
                        router.push('/manager');  // ผู้จัดการ
                    } else if (session.user.positionID === 'P017' && session.user.departmentID === 'MK') {
                        router.push('/admin');  // ผู้ดูแล
                    } else if (session.user.positionID === 'P015' && session.user.departmentID === 'MK') {
                        router.push('/head');  // หัวหน้าฝ่ายขาย
                    } else if (session.user.positionID === 'P014' && session.user.departmentID === 'MK') {
                        router.push('/marketing');  // การตลาด
                    } else if (session.user.positionID === 'P016' && session.user.departmentID === 'MK') {
                        router.push('/sale');  // ฝ่ายขาย
                    }
                }
            }
        } catch (error) {
            console.log('error', error);
            setError('An unexpected error occurred. Please try again.');  // ตั้งค่า error ถ้ามีข้อผิดพลาด
        }
    };

    return (
        <div className="login-page">
            <nav className="login-nav">Pongpol Car Insurance</nav>
            <div className="login-container">
                <h1 className="login-title">Login</h1>
                {error && <div className="error-message">{error}</div>} {/* แสดงข้อผิดพลาด */}
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="mid">
                        <button type="submit" className="login-button">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


