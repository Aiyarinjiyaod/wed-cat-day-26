import { sql, Product } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Package, Eye } from "lucide-react"
import { DeleteProductButton } from "./delete-button"

async function getProducts() {
  const products = await sql`
    SELECT * FROM products ORDER BY created_at DESC
  `
  return products as Product[]
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
          <p className="text-muted-foreground">เพิ่ม แก้ไข หรือลบสินค้าในระบบ</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มสินค้าใหม่
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีสินค้า</h3>
            <p className="text-muted-foreground mb-4">เริ่มต้นเพิ่มสินค้าใหม่เข้าสู่ระบบ</p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มสินค้าใหม่
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name_th || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {product.model_url && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    AR Ready
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">
                  {product.name_th || product.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {product.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg">
                    {Number(product.price).toLocaleString("th-TH")} บาท
                  </span>
                  <span className="text-sm text-muted-foreground">
                    คงเหลือ: {product.stock}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Pencil className="h-3 w-3 mr-1" />
                      แก้ไข
                    </Button>
                  </Link>
                  {product.model_url && (
                    <Link href={`/admin/products/${product.id}/preview`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                  <DeleteProductButton productId={product.id} productName={product.name_th || product.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
