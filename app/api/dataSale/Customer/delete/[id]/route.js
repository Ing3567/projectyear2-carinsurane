import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const id = params.id;  // ไม่ต้องใช้ await กับ params
    console.log(id);

    if (!id) {  // ตรวจสอบว่า id มีค่าไหม
      return new Response(JSON.stringify({ message: 'Policy ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ลบข้อมูลในตาราง policy ตาม policyId ที่รับมา
    const deletedPolicy = await prisma.policy.delete({
      where: {
        PolicyID: Number(id),
      },
    });

    return new Response(
      JSON.stringify({ message: 'Policy deleted successfully', deletedPolicy }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting policy:', error);  // log error เพื่อดูปัญหา
    return new Response(JSON.stringify({ message: 'Error deleting policy' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
