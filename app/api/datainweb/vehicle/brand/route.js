import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const brand = await prisma.model.findMany({
            distinct: ['Brand'],
            select: {
                Brand: true
            }
        });

        const brandArray = brand.map(item => item.Brand);

        if (brandArray.length > 0) {
            // Return response with status 200
            return new Response(JSON.stringify({ message: "brand found", brand: brandArray }), { status: 200 });
        } else {
            // Return response with status 404
            return new Response(JSON.stringify({ message: "brand not found" }), { status: 404 });
        }
    } catch (error) {
        // Return response with status 500 for internal errors
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
