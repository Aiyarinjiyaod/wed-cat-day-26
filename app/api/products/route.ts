import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")
  
  try {
    let products
    
    if (category) {
      products = await sql`
        SELECT * FROM products 
        WHERE category = ${category} 
        ORDER BY created_at DESC
      `
    } else if (featured === "true") {
      products = await sql`
        SELECT * FROM products 
        WHERE featured = true 
        ORDER BY created_at DESC
      `
    } else {
      products = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `
    }
    
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
