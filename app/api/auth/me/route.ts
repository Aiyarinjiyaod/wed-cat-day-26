import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { hashPassword, verifyPassword, generateToken } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ user: null })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      )
    }

    const { fullName, phone, address, currentPassword, newPassword } = await request.json()

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "กรุณากรอกรหัสผ่านปัจจุบัน" },
          { status: 400 }
        )
      }

      const users = await sql`
        SELECT password_hash FROM users WHERE id = ${user.id}
      `

      const isValid = await verifyPassword(currentPassword, users[0].password_hash)
      if (!isValid) {
        return NextResponse.json(
          { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
          { status: 400 }
        )
      }

      const newPasswordHash = await hashPassword(newPassword)
      await sql`
        UPDATE users SET
          full_name = ${fullName || user.full_name},
          phone = ${phone || user.phone},
          address = ${address || user.address},
          password_hash = ${newPasswordHash},
          updated_at = NOW()
        WHERE id = ${user.id}
      `
    } else {
      await sql`
        UPDATE users SET
          full_name = ${fullName || user.full_name},
          phone = ${phone || user.phone},
          address = ${address || user.address},
          updated_at = NOW()
        WHERE id = ${user.id}
      `
    }

    // Fetch updated user
    const updatedUsers = await sql`
      SELECT id, email, full_name, phone, address, role, created_at
      FROM users WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      user: updatedUsers[0],
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    )
  }
}
