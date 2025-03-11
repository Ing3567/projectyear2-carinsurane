import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึงค่าจาก query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    // ดึงข้อมูล policy ที่มี PolicyID ตรงกับที่ระบุใน query parameters
    const policyData = await prisma.policy.findUnique({
      where: {
        PolicyID: Number(id),
      },
      include: {
        customer: true,  // ดึงข้อมูลที่เกี่ยวข้องกับ customer
        vehicle: true,   // ดึงข้อมูลที่เกี่ยวข้องกับ vehicle
      }
    });

    console.log('policy:', policyData);

    // ตรวจสอบว่าไม่พบข้อมูล policy
    if (!policyData) {
      return new Response(JSON.stringify({ message: "Policy not found" }), {
        status: 404,
      });
    }
    const date = new Date(policyData.vehicle.Registration, 0, 1);  // วันที่ 1 มกราคม 2024

    // แปลงวันที่ให้เป็นรูปแบบ "YYYY-MM"
    const formattedDate = date.toISOString().split('T')[0].slice(0, 7);

    // แปลงวันที่ StartDate, EndDate, DateOfBirth, และ RegistrationDate ให้เป็นวันที่ (ไม่รวมเวลา)
    const formattedPolicyData = {
      ...policyData,
      StartDate: policyData.StartDate ? policyData.StartDate.toISOString().split('T')[0] : null,
      EndDate: policyData.EndDate ? policyData.EndDate.toISOString().split('T')[0] : null,
      DateOfBirth: policyData.DateOfBirth ? policyData.DateOfBirth.toISOString().split('T')[0] : null,
      customer: policyData.customer ? {
        ...policyData.customer,
        DateOfBirth: policyData.customer.DateOfBirth ? policyData.customer.DateOfBirth.toISOString().split('T')[0] : null,
        RegistrationDate: policyData.customer.RegistrationDate ? policyData.customer.RegistrationDate.toISOString().split('T')[0] : null,
      } : null,
      vehicle: policyData.vehicle ? {
        ...policyData.vehicle,
        Registration: formattedDate ? formattedDate: null,
      } : null,
    };
    console.log(formattedPolicyData)

    // ส่งข้อมูลผลลัพธ์กลับไป
    return new Response(JSON.stringify({ policydata: formattedPolicyData }), {
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching policy:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
