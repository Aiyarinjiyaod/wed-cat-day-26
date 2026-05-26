import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, phone, address, items, total, paymentSlipUrl } = await request.json()

    const orderResult = await sql`
      INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, payment_slip_url, status)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${total}, ${paymentSlipUrl || null}, 'pending')
      RETURNING id
    `

    const orderId = orderResult[0].id

    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
        VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price})
      `
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

// GET orders by email for customer tracking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const orderId = searchParams.get("orderId")

    if (orderId) {
      const orders = await sql`
        SELECT * FROM orders WHERE id = ${parseInt(orderId)}
      `
      
      if (orders.length === 0) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }

      const items = await sql`
        SELECT oi.*, p.name, p.name_th, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${parseInt(orderId)}
      `

      return NextResponse.json({ ...orders[0], items })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const orders = await sql`
      SELECT * FROM orders 
      WHERE customer_email = ${email}
      ORDER BY created_at DESC
    `

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
