import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req,{ params }) {
    try {
        // ตรวจสอบว่า params.thai_amphures มีค่าหรือไม่
        if (!params.thai_amphures) {
            return new Response(
                JSON.stringify({ message: "Thai amphure ID is required" }),
                { status: 400 }
            );
        }

        const thai_tambons = await prisma.thai_tambons.findMany({
            where: {
                thai_amphures: {
                    name_th: await params.thai_amphures,  
                },
            },
            select: {
                name_th: true,
            },
            orderBy: {
                name_th: 'asc', 
            }
        })

        const tambonsArray = thai_tambons.map(item => item.name_th);


        if (tambonsArray.length > 0) {
            return new Response(
                JSON.stringify({
                    message: "thai_tambons found",
                    thai_tambons: tambonsArray
                }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "thai_tambons not found" }),
                { status: 404 }
            );
        }
    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
