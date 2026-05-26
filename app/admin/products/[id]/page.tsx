import { sql, Product } from "@/lib/db"
import { ProductForm } from "../product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getProduct(id: string) {
  const products = await sql`
    SELECT * FROM products WHERE id = ${parseInt(id)}
  `
  return products[0] as Product | undefined
}

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">แก้ไขสินค้า</h1>
          <p className="text-muted-foreground">{product.name_th || product.name}</p>
        </div>
      </div>

      <ProductForm mode="edit" product={product} />
    </div>
  )
}
