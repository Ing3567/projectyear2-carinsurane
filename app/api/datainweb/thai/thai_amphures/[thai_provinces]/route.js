import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
    try {
        const thai_amphures = await prisma.thai_amphures.findMany({
            where: {
                thai_provinces: {
                    name_th: await params.thai_provinces,  
                },
            },
            select: {
                name_th: true,
                id: true,
            },
            orderBy: {
                name_th: 'asc',  
            },
        })
        
        const amphures = thai_amphures.map(item => item.name_th);
        const idArray = thai_amphures.map(item => item.id);
        console.log({
            message: "thai_provinces found",
            thai_amphures: amphures,
            id: idArray
        })

        if (amphures.length > 0) {
            return new Response(
                JSON.stringify({
                    message: "thai_provinces found",
                    thai_amphures: amphures,
                    id: idArray
                }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "thai_amphures not found" }),
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
