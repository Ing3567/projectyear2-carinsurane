import { prisma } from '@app/lib/prisma';


export async function POST(req) {
  try {
    const { username } = await req.json(); // รับข้อมูลจาก body ของ request

    // ลบ session login จากฐานข้อมูลโดยอิงจาก username
    await prisma.login.delete({
      where: { username: username },
    });

    // ส่ง response กลับไปเมื่อทำงานสำเร็จ
    return new Response(
      JSON.stringify({ message: 'Logged out successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error during logout:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to log out' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
