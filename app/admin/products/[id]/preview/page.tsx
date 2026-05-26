import { sql, Product } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Box, Smartphone } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ModelViewer } from "./model-viewer"

async function getProduct(id: string) {
  const products = await sql`
    SELECT * FROM products WHERE id = ${parseInt(id)}
  `
  return products[0] as Product | undefined
}

export default async function ModelPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  if (!product.model_url) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/products/${id}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">ดูตัวอย่างโมเดล 3D</h1>
            <p className="text-muted-foreground">{product.name_th || product.name}</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Box className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีโมเดล 3D</h3>
            <p className="text-muted-foreground mb-4">
              กรุณาอัปโหลดไฟล์ .glb เพื่อดูตัวอย่าง
            </p>
            <Link href={`/admin/products/${id}`}>
              <Button>แก้ไขสินค้า</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/products/${id}`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">ดูตัวอย่างโมเดล 3D</h1>
          <p className="text-muted-foreground">{product.name_th || product.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                โมเดล 3D
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModelViewer
                modelUrl={product.model_url}
                modelUsdzUrl={product.model_usdz_url}
                productName={product.name_th || product.name}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลไฟล์</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ไฟล์ GLB (Android/Web)</p>
                <p className="font-mono text-xs truncate bg-muted p-2 rounded mt-1">
                  {product.model_url.split("/").pop()}
                </p>
              </div>
              {product.model_usdz_url && (
                <div>
                  <p className="text-sm text-muted-foreground">ไฟล์ USDZ (iOS)</p>
                  <p className="font-mono text-xs truncate bg-muted p-2 rounded mt-1">
                    {product.model_usdz_url.split("/").pop()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                ทดสอบ AR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                เปิดหน้านี้บนมือถือแล้วกดปุ่ม AR เพื่อดูสินค้าในห้องของคุณ
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>- Android: รองรับ ARCore</p>
                <p>- iOS: รองรับ ARKit (Safari)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
