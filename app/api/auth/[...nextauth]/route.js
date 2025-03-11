import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
                password: { label: 'Password', type: 'password' },
            },
            session: {
                jwt: true,         // ใช้ JWT สำหรับ session
                maxAge: 60*60*8,         // หมดอายุทันทีเมื่อปิดเบราว์เซอร์
            },
            adapter: PrismaAdapter(prisma),
            async authorize(credentials, req) {
                if (!credentials) return null
                const user = await prisma.employee.findUnique({
                    where: { username: credentials.email },
                    select: {
                        EmployeeID: true,
                        Password: true,
                        DepartmentID: true,
                        PositionID: true
                    },
                })
                if (!user) {
                    throw new Error('Invalid email')
                }




                if (
                    (await bcrypt.compare(credentials.password, user.Password))
                ) {
                    const currentSession = await prisma.login.findUnique({
                        where: {
                            username: credentials.email,
                        },
                    })
    
                    if (currentSession) {
                        throw new Error('User is already logged in on another device')
                    }
    
                    await prisma.login.create({
                        data:{
                            username:credentials.email
                        }
                    })
                    return {
                        id: user.EmployeeID,
                        user: credentials.email,
                        departmentID: user.DepartmentID,
                        positionID: user.PositionID
                    }
                } else {
                    throw new Error('Invalid password')
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.employeeID = user.id;
                token.departmentID = user.departmentID;
                token.positionID = user.positionID;
                token.user = user.user;
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.employeeID = token.employeeID;
                session.user.departmentID = token.departmentID;
                session.user.positionID = token.positionID;
                session.user.user = token.user;
            }
            return session
        },

    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }