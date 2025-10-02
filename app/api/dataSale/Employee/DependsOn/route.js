import { prisma } from '@app/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    
    const session = await getServerSession(authOptions)

    // ดึงข้อมูล subordinate จาก Employee ที่ DependsOn กับ session user
    const subordinateData = await prisma.employee.findMany({
      where: {
        DependsOn: session.user.employeeID,  
      },
      select: {
        FirstName: true,
        LastName: true,
        EmployeeID: true,
      },
    });

    // ตรวจสอบว่าพบ subordinate หรือไม่
    if (!subordinateData || subordinateData.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subordinates found" }), 
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // ส่งผลลัพธ์ subordinate กลับ
    return new Response(
      JSON.stringify({ subordinate: subordinateData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching subordinates:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
