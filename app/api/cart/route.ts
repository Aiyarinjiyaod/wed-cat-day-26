import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getSessionId() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("session_id")?.value
  
  if (!sessionId) {
    sessionId = crypto.randomUUID()
  }
  
  return sessionId
}

export async function GET() {
  const sessionId = await getSessionId()
  
  try {
    const cartItems = await sql`
      SELECT 
        ci.id,
        ci.session_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        p.name,
        p.name_th,
        p.price,
        p.image_url,
        p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ${sessionId}
      ORDER BY ci.created_at DESC
    `
    
    return NextResponse.json(cartItems)
    
  } catch (error) {
    console.error("Error fetching cart:", error)
    // ส่ง [] กลับไปเพื่อให้หน้าบ้านไม่พัง และยังบอก status error ได้
    return NextResponse.json([], { status: 500 }) 
  }
}

export async function POST(request: Request) {
  const sessionId = await getSessionId()
  const { productId, quantity = 1 } = await request.json()
  
  try {
    const existing = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE session_id = ${sessionId} AND product_id = ${productId}
    `
    
    if (existing.length > 0) {
      await sql`
        UPDATE cart_items 
        SET quantity = quantity + ${quantity}
        WHERE id = ${existing[0].id}
      `
    } else {
      await sql`
        INSERT INTO cart_items (session_id, product_id, quantity)
        VALUES (${sessionId}, ${productId}, ${quantity})
      `
    }
    
    const response = NextResponse.json({ success: true })
    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    
    return response
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const sessionId = await getSessionId()
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get("id")
  
  try {
    if (itemId) {
      await sql`
        DELETE FROM cart_items 
        WHERE id = ${parseInt(itemId)} AND session_id = ${sessionId}
      `
    } else {
      await sql`
        DELETE FROM cart_items WHERE session_id = ${sessionId}
      `
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const sessionId = await getSessionId()
  const { itemId, quantity } = await request.json()
  
  try {
    if (quantity <= 0) {
      await sql`
        DELETE FROM cart_items 
        WHERE id = ${itemId} AND session_id = ${sessionId}
      `
    } else {
      await sql`
        UPDATE cart_items 
        SET quantity = ${quantity}
        WHERE id = ${itemId} AND session_id = ${sessionId}
      `
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    )
  }
}
