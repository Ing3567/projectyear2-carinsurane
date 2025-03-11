import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generateDateRanges(date) {
    const { subDays, format } = require('date-fns');
    const currentDate = new Date();
    if (date === 7) {
        const startlast7Days = Array.from({ length: 7 }, (_, i) => format(subDays(currentDate, i), 'yyyy-MM-dd')).reverse();
        return { start: startlast7Days, end: startlast7Days }
    } else if (date === 1) {
        const startlast30Days = Array.from({ length: 7 }, (_, i) =>
            format(subDays(currentDate, i * 5), 'yyyy-MM-dd')
        ).reverse(); // กลับลำดับวันที่

        // สร้างช่วงเวลาทั้งหมด 6 ช่วง
        const timeRanges = startlast30Days.map((start, index) => {
            // หาค่าวันที่สิ้นสุดสำหรับช่วงเวลานั้นๆ
            const end = startlast30Days[index + 1] || start; // ถ้าเป็นตัวสุดท้ายก็ให้ใช้ค่า start เดิม

            return { start, end };
        }).slice(0, 6); // เราจะได้ 6 ช่วงเวลาจาก 7 วัน

        console.log(timeRanges);

        // ใช้ map ให้คืนค่าอย่างถูกต้อง
        const start = timeRanges.map((day) => day.start);  // ใช้ return ให้ถูกต้อง
        const end = timeRanges.map((day) => day.end);      // ใช้ return ให้ถูกต้อง

        console.log(start);
        console.log(end);

        return { start: start, end: end };

    } else if (date === 3) {
        const startlast3Months = Array.from({ length: 3 }, (_, i) => format(new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1), 'yyyy-MM-dd')
        ).reverse();
        const endDatesLast3Months = Array.from({ length: 3 }, (_, i) =>
            format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 - i, 0), 'yyyy-MM-dd')
        ).reverse();
        return { start: startlast3Months, end: endDatesLast3Months }
    } else if (date === 12) {
        const startlast12Months = Array.from({ length: 12 }, (_, i) => format(new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1), 'yyyy-MM-dd')
        ).reverse();
        const endDatesLast12Months = Array.from({ length: 12 }, (_, i) =>
            format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 - i, 0), 'yyyy-MM-dd')
        ).reverse();
        return { start: startlast12Months, end: endDatesLast12Months }
    }
}

async function Datafromclaim(data, date) {
    const datetime = await generateDateRanges(date);
    console.log(datetime);
    const Value = await Promise.all(
        datetime.start.map(async (Time, index) => {
            return prisma.claim.groupBy({
                by: [data],
                where: {
                    ClaimDate: {
                        gte: new Date(`${Time}T00:00:00Z`),
                        lte: new Date(`${datetime.end[index]}T23:59:59Z`),
                    },
                },
                _count: {
                    _all: true,
                },
            });
        })
    );

    let uniqueClaimTypes;

    uniqueClaimTypes = [...new Set(Value.flatMap(monthData => 
           monthData.map(item => item[data])))];
   
           console.log(uniqueClaimTypes)
           
           let result = uniqueClaimTypes.map((claimType) => {
               const count = Value.map((monthData) => {
                   const found = monthData.find((item) => item[data] === claimType);
                   return found ? found._count._all : 0;
               });
           
               // แปลงค่า 1 หรือ 0 เป็น "มี" หรือ "ไม่มี"
               const displayClaimType = (claimType === 1) ? "สำเร็จ" : (claimType === 0) ? "ไม่สำเร็จ" : claimType;
           
               return { data: displayClaimType, count };
    });

    return { DateTime: datetime, Value: result };
}


async function Datafrompolicy(data, date) {
    const datetime = await generateDateRanges(date);
    const Value = await Promise.all(
        datetime.start.map(async (Time, index) => {
            return prisma.policy.groupBy({
                by: [data],
                where: {
                    StartDate: {
                        gte: new Date(`${Time}T00:00:00Z`),
                        lte: new Date(`${datetime.end[index]}T23:59:59Z`),
                    },
                },
                _count: {
                    _all: true,
                },
            });
        })
    );

    
    let uniqueClaimTypes;

 uniqueClaimTypes = [...new Set(Value.flatMap(monthData => 
        monthData.map(item => item[data])))];

        console.log(uniqueClaimTypes)
        
        let result = uniqueClaimTypes.map((claimType) => {
            const count = Value.map((monthData) => {
                const found = monthData.find((item) => item[data] === claimType);
                return found ? found._count._all : 0;
            });
        
            // แปลงค่า 1 หรือ 0 เป็น "มี" หรือ "ไม่มี"
            const displayClaimType = (claimType === 1) ? "มี" : (claimType === 0) ? "ไม่มี" : claimType;
        
            return { data: displayClaimType, count };
        });
        



    return { DateTime: datetime, Value: result };
}

export async function Linechart(data, date) {
    try {
        if (data === "ClaimStatus") {
            const Value = await Datafromclaim(data, date);  // Add await here
            return Value
        } else {
            const Value = await Datafrompolicy(data, date);  // Add await here
            return Value
        }

    } catch (error) { return error; }
}
