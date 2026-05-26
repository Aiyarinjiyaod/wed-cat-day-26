import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const products = await sql`
      SELECT * FROM products WHERE id = ${parseInt(id)}
    `

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(products[0])
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
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
    const {
      name,
      name_th,
      description,
      description_th,
      price,
      category,
      image_url,
      model_url,
      model_usdz_url,
      dimensions,
      stock,
      featured,
    } = body

    const result = await sql`
      UPDATE products SET
        name = ${name},
        name_th = ${name_th || null},
        description = ${description || null},
        description_th = ${description_th || null},
        price = ${price},
        category = ${category || null},
        image_url = ${image_url || null},
        model_url = ${model_url || null},
        model_usdz_url = ${model_usdz_url || null},
        dimensions = ${dimensions || null},
        stock = ${stock || 0},
        featured = ${featured || false},
        updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await sql`
      DELETE FROM products WHERE id = ${parseInt(id)}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
