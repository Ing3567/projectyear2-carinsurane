import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function Piechart(data) {
  try {
    const result = await prisma.policy.groupBy({
      by: [data],
      _count: {
        _all: true,
      },
    });

    // แปลงค่า 1 และ 0 เป็น "มี" และ "ไม่มี"
    const labels = result.map(item => {
      if (item[data] === 1) {
        return "มี";  // ถ้าเป็น 1 ให้แสดงว่า "มี"
      } else if (item[data] === 0) {
        return "ไม่มี";  // ถ้าเป็น 0 ให้แสดงว่า "ไม่มี"
      } else {
        return item[data];  // ถ้าไม่ใช่ 1 หรือ 0 ก็คืนค่าเดิม
      }
    });

    const counts = result.map(item => item._count._all);  // เอาค่าของ _count._all

    // ส่งผลลัพธ์เป็นอาเรย์ของชื่อและอาเรย์ของจำนวน
    return { labels, counts, name: data };
  } catch (error) {
    // ส่งข้อผิดพลาดในรูปแบบ JSON พร้อมสถานะ 500
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}


const check = {
  P015: ["/api", '/api/path*'],
  P014: ["/api", '/api/path*'],
  P016: ["/api", '/api/path*'],
  P017: ["/api*", '/api/path*'],
  P013: ["/api", '/api/path*'],
};