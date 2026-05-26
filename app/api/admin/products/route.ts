import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY created_at DESC
    `
    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
      INSERT INTO products (
        name, name_th, description, description_th, 
        price, category, image_url, model_url, model_usdz_url,
        dimensions, stock, featured
      ) VALUES (
        ${name}, ${name_th || null}, ${description || null}, ${description_th || null},
        ${price}, ${category || null}, ${image_url || null}, ${model_url || null}, ${model_usdz_url || null},
        ${dimensions || null}, ${stock || 0}, ${featured || false}
      )
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
