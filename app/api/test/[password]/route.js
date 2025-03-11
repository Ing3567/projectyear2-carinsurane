import bcrypt from 'bcrypt';

export async function GET(req, { params }) {
    try {
        const password = params.password;
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);
        return new Response(JSON.stringify({ message: hashedPassword }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        // รับค่าที่ส่งมาจาก body ของ request
        const { password, hashedPassword } = await req.json();

        // เทียบค่ารหัสผ่านที่เข้ากับค่าที่ถูก hash ไว้
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            // รหัสผ่านถูกต้อง
            return new Response(JSON.stringify({ message: "Password match!" }), { status: 200 });
        } else {
            // รหัสผ่านไม่ถูกต้อง
            return new Response(JSON.stringify({ message: "Password does not match." }), { status: 401 });
        }
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}

if (user?.positionID === "P014") {
    if (method === 'POST') { return NextResponse.next(); } else { return NextResponse.redirect(new URL('/', request.url)); }
} 