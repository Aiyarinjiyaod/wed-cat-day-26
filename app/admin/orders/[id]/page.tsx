import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Package, User, MapPin, Phone, Mail, Receipt, Truck } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { UpdateOrderStatus } from "./update-status"

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "รอชำระเงิน", variant: "secondary" },
  paid: { label: "ชำระเงินแล้ว", variant: "default" },
  shipping: { label: "กำลังจัดส่ง", variant: "outline" },
  delivered: { label: "จัดส่งแล้ว", variant: "default" },
  cancelled: { label: "ยกเลิก", variant: "destructive" },
}

async function getOrder(id: string) {
  const orders = await sql`
    SELECT * FROM orders WHERE id = ${parseInt(id)}
  `
  return orders[0]
}

async function getOrderItems(orderId: string) {
  const items = await sql`
    SELECT oi.*, p.name, p.name_th, p.image_url
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${parseInt(orderId)}
  `
  return items
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const orderItems = await getOrderItems(id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">คำสั่งซื้อ #{order.id}</h1>
            <Badge variant={statusLabels[order.status]?.variant || "secondary"}>
              {statusLabels[order.status]?.label || order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                รายการสินค้า
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  ไม่พบรายการสินค้า
                </p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name_th || item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.name_th || item.name || "สินค้าถูกลบ"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Number(item.price_at_time).toLocaleString("th-TH")} บาท x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {(Number(item.price_at_time) * item.quantity).toLocaleString("th-TH")} บาท
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-medium">ยอดรวมทั้งหมด</span>
                    <span className="text-xl font-bold">
                      {Number(order.total_amount).toLocaleString("th-TH")} บาท
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Slip */}
          {order.payment_slip_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  สลิปการชำระเงิน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative max-w-md mx-auto">
                  <img
                    src={order.payment_slip_url}
                    alt="Payment slip"
                    className="w-full rounded-lg border"
                  />
                  <a
                    href={order.payment_slip_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block"
                  >
                    <Button variant="outline" className="w-full">
                      ดูรูปขนาดเต็ม
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tracking Number Display */}
          {order.tracking_number && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  หมายเลขติดตามพัสดุ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-lg font-bold text-primary">
                  {order.tracking_number}
                </p>
                <a
                  href={`https://track.thailandpost.co.th/?trackNumber=${order.tracking_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    ตรวจสอบสถานะพัสดุ
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ข้อมูลลูกค้า
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              {order.customer_email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">อีเมล</p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">เบอร์โทร</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                </div>
              )}
              {order.customer_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">ที่อยู่จัดส่ง</p>
                    <p className="font-medium">{order.customer_address}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle>อัปเดตสถานะ</CardTitle>
            </CardHeader>
            <CardContent>
              <UpdateOrderStatus 
                orderId={order.id} 
                currentStatus={order.status} 
                currentTrackingNumber={order.tracking_number}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
