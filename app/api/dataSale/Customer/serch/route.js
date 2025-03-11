import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const name = url.searchParams.get('name');  

        if (!name) {
            return new Response(JSON.stringify({ message: "Name is required" }), { status: 400 });
        }

        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts[1];

        const policyData = await prisma.customer.findMany({
            where: {
                FirstName: firstName,
                LastName: lastName,
            },
            include: {
                policy: {
                    select: {
                        PolicyID: true,
                    },
                },
            },
        });

        const policyArray = policyData.flatMap(item => item.policy.map(p => p.PolicyID));
        console.log(policyArray)

        if (policyArray.length > 0) {
            return new Response(
                JSON.stringify({ message: "PolicyID found", policy: policyArray }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "PolicyID not found" }),
                { status: 404 }
            );
        }
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}
