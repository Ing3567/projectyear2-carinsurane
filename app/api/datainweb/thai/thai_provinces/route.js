import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
    try {
        const thai_provinces = await prisma.thai_provinces.findMany({
            select: {
                name_th: true,
                id: true,
            },

            orderBy: {
                name_th: 'asc',  
            },
        });
        const provincesArray = thai_provinces.map((item) => item.name_th);
        const idArray = thai_provinces.map((item) => item.id);

        if (provincesArray.length > 0) {
            return new Response(
                JSON.stringify({
                    message: "thai_provinces found",
                    thai_provinces: provincesArray,
                    id: idArray,
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "thai_provinces not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }
    } catch (error) {
        console.error("Error fetching thai_provinces:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
