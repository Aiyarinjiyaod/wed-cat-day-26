import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { OrderStatusFilter } from "./status-filter"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "รอชำระเงิน", variant: "secondary" },
  paid: { label: "ชำระเงินแล้ว", variant: "default" },
  shipping: { label: "กำลังจัดส่ง", variant: "outline" },
  delivered: { label: "จัดส่งแล้ว", variant: "default" },
  cancelled: { label: "ยกเลิก", variant: "destructive" },
}

async function getOrders(status?: string) {
  if (status && status !== "all") {
    const orders = await sql`
      SELECT * FROM orders 
      WHERE status = ${status}
      ORDER BY created_at DESC
    `
    return orders
  }
  
  const orders = await sql`
    SELECT * FROM orders ORDER BY created_at DESC
  `
  return orders
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const orders = await getOrders(status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">จัดการออเดอร์</h1>
          <p className="text-muted-foreground">ตรวจสอบและอัปเดตสถานะคำสั่งซื้อ</p>
        </div>
      </div>

      <OrderStatusFilter currentStatus={status || "all"} />

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีออเดอร์</h3>
            <p className="text-muted-foreground">
              {status && status !== "all" 
                ? `ไม่พบออเดอร์ที่มีสถานะ "${statusLabels[status]?.label || status}"`
                : "ออเดอร์ใหม่จะแสดงที่นี่"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">
                      คำสั่งซื้อ #{order.id}
                    </CardTitle>
                    <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
                      {statusLabels[order.status]?.label || order.status}
                    </Badge>
                    {order.payment_slip_url && (
                      <Badge variant="outline" className="text-xs">
                        มีสลิป
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ชื่อลูกค้า</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">เบอร์โทร</p>
                    <p className="font-medium">{order.customer_phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ยอดรวม</p>
                    <p className="font-bold text-lg">
                      {Number(order.total_amount).toLocaleString("th-TH")} บาท
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
