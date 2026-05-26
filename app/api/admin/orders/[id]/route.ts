import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orders = await sql`
      SELECT * FROM orders WHERE id = ${parseInt(id)}
    `

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(orders[0])
  } catch (error) {
    console.error("Failed to fetch order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, trackingNumber } = body

    // Build update query dynamically based on what's provided
    if (status !== undefined) {
      const validStatuses = ["pending", "paid", "shipping", "delivered", "cancelled"]
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        )
      }
    }

    let result
    if (status !== undefined && trackingNumber !== undefined) {
      result = await sql`
        UPDATE orders SET
          status = ${status},
          tracking_number = ${trackingNumber},
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `
    } else if (status !== undefined) {
      result = await sql`
        UPDATE orders SET
          status = ${status},
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `
    } else if (trackingNumber !== undefined) {
      result = await sql`
        UPDATE orders SET
          tracking_number = ${trackingNumber},
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `
    } else {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      )
    }

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}
