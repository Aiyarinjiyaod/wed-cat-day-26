import { ProductForm } from "../product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">เพิ่มสินค้าใหม่</h1>
          <p className="text-muted-foreground">กรอกข้อมูลสินค้าและอัปโหลดโมเดล 3D</p>
        </div>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}
