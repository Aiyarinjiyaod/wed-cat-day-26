import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { sql } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: number
  email: string
  full_name: string
  phone: string | null
  address: string | null
  role: "member" | "admin"
  created_at: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    const users = await sql`
      SELECT id, email, full_name, phone, address, role, created_at
      FROM users WHERE id = ${decoded.userId}
    `

    if (users.length === 0) return null

    return users[0] as User
  } catch {
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
  address?: string
): Promise<User | { error: string }> {
  try {
    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว" }
    }

    const passwordHash = await hashPassword(password)

    const result = await sql`
      INSERT INTO users (email, password, full_name, phone, address, role)
      VALUES (${email}, ${passwordHash}, ${fullName}, ${phone || null}, ${address || null}, 'member')
      RETURNING id, email, full_name, phone, address, role, created_at
    `

    return result[0] as User
  } catch (error) {
    console.error("Error creating user:", error)
    return { error: "เกิดข้อผิดพลาดในการสร้างบัญชี" }
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    const users = await sql`
      SELECT id, email, password, full_name, phone, address, role, created_at
      FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }
    }

    const token = generateToken(user.id, user.role)

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" }
  }
}
