import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// รับ params จาก context
export async function GET(req, { params }) {
    try {
        const model = await prisma.model.findMany({
            where: {
                Brand: params.brand,  // ใช้ params ที่ได้จาก context
            },
            select: {
                Model: true,
            }
        })
        const modelArray = model.map(item => item.Model);
        if (modelArray.length > 0) {
            return new Response(
                JSON.stringify({ message: "model found", model: modelArray }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "model not found" }),
                { status: 404 }
            );
        }
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
