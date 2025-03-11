import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request) {
    const user = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    // Get the pathname of the request
    const { pathname } = request.nextUrl

    if (pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.startsWith('/_next/')) {
        return NextResponse.next();
    }

    // ตรวจสอบหาก pathname เป็น '/login' จะไม่ให้เข้า middleware
    if (pathname === '/api/auth/providers'|| pathname === '/api/auth/csrf'|| pathname === '/api/auth/callback/credentials'|| pathname === '/api/auth/session'|| pathname === '/api/logout'|| pathname === '/api/auth/signout') {
        return NextResponse.next(); // ข้าม middleware ถ้าเป็น /login
    }

    // รายการ path ที่อนุญาตสำหรับแต่ละ positionID
    const check = {
        P015: ["/api/datainweb*", '/api/auth*', "/api/dataSale/Customer*", "/api/dataSale/Employee*", '/api/logout'],
        P014: ["/api/dataSale/Graph*", '/api/auth*', '/api/logout'],
        P016: ["/api/dataSale/Customer/update", '/api/auth*', '/api/logout' ,"/api/datainweb*"],
        P017: ["/api/auth*", '/api/datainweb*', "/api/dataSale/Customer*", "/api/dataSale/Graph*", '/api/logout'],
        P013: ["/api*"],
    };

    if (!user || !check[user?.positionID]) {
        // ถ้าไม่มี user หรือ positionID ไม่ตรงกับข้อมูลใน check ให้ redirect ไปยังหน้า login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ตรวจสอบตำแหน่ง positionID ของ user และเส้นทางที่อนุญาต
    const allowedPaths = check[user?.positionID]; 

    // ตรวจสอบว่า pathname ตรงกับเส้นทางที่อนุญาตหรือไม่
    const isAllowed = allowedPaths.some((path) => {
        const regex = new RegExp(`^${path.replace('*', '.*')}$`); // แปลงเส้นทางเป็น regex เพื่อให้รองรับ path*
        return regex.test(pathname);
    });

    // ถ้า pathname ไม่ตรงกับเส้นทางที่อนุญาตให้ redirect
    if (!isAllowed) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // หากเป็น P014 และต้องการให้อนุญาตเฉพาะ POST
    if (user?.positionID === "P016" && request.method !== 'POST' && pathname === "/api/dataSale/Customer/update") {
        return NextResponse.redirect(new URL('/login', request.url)); 
    }

    // ถ้า pathname ตรงกับเส้นทางที่อนุญาตก็ให้ดำเนินการต่อ
    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*', // จับทุกเส้นทาง
}
