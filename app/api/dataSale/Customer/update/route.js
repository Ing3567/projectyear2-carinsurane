import { prisma } from '@app/lib/prisma';
import { PremiumAmountforRenew } from "@/app/function/PremiumAmount";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'


const prisma = new PrismaClient();


async function gencustomerid() {
    const min = 1000000000;
    const max = 2000000000;
    const customerID = Math.floor(Math.random() * (max - min + 1)) + min;
    const check = await prisma.customer.findUnique({
        where: {
            CustomerID: customerID
        }
    });

    if (!check) {
        return customerID;  // Return the generated customerID
    }
    return gencustomerid();  // Retry if the ID exists
}

async function genpolicyid() {
    const min = 1000000000;
    const max = 2000000000;
    const policyID = Math.floor(Math.random() * (max - min + 1)) + min;
    const check = await prisma.policy.findUnique({
        where: {
            PolicyID: policyID
        }
    });

    if (!check) {
        return policyID;  // Return the generated policyID
    }
    return genpolicyid();  // Retry if the ID exists
}

async function genvehicleid() {
    const min = 1000000000;
    const max = 2000000000;
    const vehicleID = Math.floor(Math.random() * (max - min + 1)) + min;
    const check = await prisma.vehicle.findUnique({
        where: {
            VehicleID: vehicleID
        }
    });

    if (!check) {
        return vehicleID;  // Return the generated vehicleID
    }
    return genvehicleid();  // Retry if the ID exists
}

export async function POST(req) {
    try {
        const data = await req.json();
        const price = await PremiumAmountforRenew({ Customer: data })
        const session = await getServerSession(authOptions)
        const [province, district, subdistrict] = data.Address.split(' ');
        

        const PostalCode = await prisma.thai_tambons.findFirst({
            where: {
                name_th: subdistrict,
            },
            select: {
                zip_code: true,
            }
        })


        // Check if the customer already exists
        const checkcustomer = await prisma.customer.findFirst({
            where: {
                FirstName: data.FirstName,
                LastName: data.LastName,
            },
            select: {
                CustomerID: true,
            }
        });

        let customer;
        if (!checkcustomer) {
            const customerID = await gencustomerid(); // Generate new customerID
            customer = await prisma.customer.create({
                data: {
                    CustomerID: customerID,
                    FirstName: data.FirstName,
                    LastName: data.LastName,
                    DateOfBirth: new Date(data.DateOfBirth).toISOString(),
                    PhoneNumber: data.PhoneNumber,
                    EmailAddress: data.EmailAddress,
                    Address: data.Address,
                    PostalCode: String(PostalCode.zip_code),
                    RegistrationDate: new Date(data.RegistrationDate).toISOString(),
                }
            });
        } else {
            customer = await prisma.customer.findFirst({
                where: {
                    CustomerID: checkcustomer.CustomerID
                },
                select: {
                    CustomerID: true,
                }
            });
        }
        

        
        const checkvehicle = await prisma.vehicle.findFirst({
            where: {
                VIN: data.VIN,
            },
            select: {
                VehicleID: true,
            }
        });

        let vehicle;
        if (!checkvehicle) {
            const vehicleID = await genvehicleid(); 
            vehicle = await prisma.vehicle.create({
                data: {
                    VehicleID: vehicleID,
                    LicensePlate: data.LicensePlate,
                    Brand: data.Brand,
                    Model: data.Model,
                    Registration: Number(new Date(data.Registration).toLocaleDateString('en-US', { year: 'numeric' })),
                    VIN: data.VIN,
                }
            });
        } else {
            vehicle = await prisma.vehicle.findFirst({
                where: { VehicleID: checkvehicle.VehicleID },
                select: {
                    VehicleID: true,
                }
            });


        }

   
        const policyID = await genpolicyid(); 
        const finalCustomerID = customer?.CustomerID ?? customer;
        const finalVehicleID = vehicle?.VehicleID ?? vehicle;


        await prisma.policy.create({
            data: {
                PolicyID: policyID,
                PremiumAmount: price,
                PolicyType: data.PolicyType,
                RenewOrNew: data.RenewOrNew,
                CoverageAmount: Number(data.CoverageAmount),
                TypeOfUse: data.TypeOfUse,
                StartDate: new Date(data.StartDate).toISOString(),  
                EndDate: new Date(data.EndDate).toISOString(),
                CarDashCam: Number(data.CarDashCam),
                Deductible: Number(data.Deductible),
                GarageType: data.GarageType,
                ndperson: data.ndperson,
                DateOfBirth: Date.parse(data.DateOfBirth2) ? new Date(data.DateOfBirth2).toISOString() : null,
                PhoneNumber: data.PhoneNumber2,
                EmployeeID: session.user.employeeID,
                CustomerID: finalCustomerID,
                VehicleID: finalVehicleID,
            }
        });


        return new Response(
            JSON.stringify({
                message: "POST success",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const data = await req.json();

        // คำนวณค่า PremiumAmount ใหม่
        const price = await PremiumAmountforRenew({ Customer: data });
        const [province, district, subdistrict] = data.Address.split(' ');

        const PostalCode = await prisma.thai_tambons.findFirst({
            where: {
                name_th: subdistrict,
            },
            select: {
                zip_code: true,
            }
        })


        // อัปเดตข้อมูลลูกค้า
        await prisma.customer.update({
            where: {
                CustomerID: data.customerID,
            },
            data: {
                DateOfBirth: new Date(data.DateOfBirth).toISOString(),
                PhoneNumber: data.PhoneNumber,
                Address: data.Address,
                EmailAddress: data.EmailAddress,
                PostalCode: String(PostalCode.zip_code)
            },
        });

        // อัปเดตข้อมูลยานพาหนะ
        await prisma.vehicle.update({
            where: {
                VehicleID: data.vehicleID,
            },
            data: {
                LicensePlate: data.LicensePlate,
                Brand: data.Brand,
                Model: data.Model,
                Registration: Number(new Date(data.Registration).toLocaleDateString('en-US', { year: 'numeric' })),
                VIN: data.VIN,
            },
        });

        // อัปเดตข้อมูลกรมธรรม์
        await prisma.policy.update({
            where: {
                PolicyID: data.policyID,
            },
            data: {
                PremiumAmount: price,
                PolicyType: data.PolicyType,
                RenewOrNew: data.RenewOrNew,
                CoverageAmount: Number(data.CoverageAmount),
                TypeOfUse: data.TypeOfUse,
                StartDate: new Date(data.StartDate).toISOString(),
                EndDate: new Date(data.EndDate).toISOString(),
                CarDashCam:  Number(data.CarDashCam),
                Deductible: Number(data.Deductible),
                GarageType: data.GarageType,
                ndperson: data.ndperson,
                DateOfBirth: Date.parse(data.DateOfBirth2) ? new Date(data.DateOfBirth2).toISOString() : null,
                PhoneNumber: data.PhoneNumber2,
            },
        });

        console.log("PATCH success");
        return new Response(JSON.stringify({ message: "PATCH success" }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error", error: error.message }),
            { status: 500 }
        );
    }
}
