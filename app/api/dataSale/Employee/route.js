import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        const currentDate = new Date();
        const url = new URL(request.url);
        const employeeID = url.searchParams.get("employeeID");
        const startMonth = url.searchParams.get("startMonth");

        const starts = new Date(currentDate.getFullYear(), currentDate.getMonth() - Number(startMonth), 0).toISOString();
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 - Number(startMonth), 1).toISOString();

        let productCount = 0;

        if (session.user.positionID === "P015") {
            productCount = await prisma.policy.groupBy({
                by: ['PolicyType'],
                where: {
                    EmployeeID: Number(employeeID),
                    StartDate: {
                        gte: starts,
                        lte: end,
                    },
                },
                _count: {
                    _all: true,
                },
            });
        } else if (session.user.positionID === "P013") {
            productCount = await prisma.policy.groupBy({
                by: ['PolicyType'],
                where: {
                    employee: {
                        DependsOn: Number(employeeID),
                    },
                    StartDate: {
                        gte: starts,
                        lte: end,
                    },
                },
                _count: {
                    _all: true,
                },
            });
        }

        console.log(productCount)

        if (productCount && productCount.length > 0) {
            return new Response(JSON.stringify({ message: "productCount found", employee: productCount }), { status: 200 });
        } else {
            // Return default structure when no productCount is found
            return new Response(JSON.stringify({
                message: "productCount found",
                employee: [
                    { PolicyType: "1", _count: { _all: 0 } },
                    { PolicyType: "2+", _count: { _all: 0 } },
                    { PolicyType: "2", _count: { _all: 0 } },
                    { PolicyType: "3+", _count: { _all: 0 } },
                    { PolicyType: "3", _count: { _all: 0 } },
                ]
            }), { status: 200 });
        }

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
