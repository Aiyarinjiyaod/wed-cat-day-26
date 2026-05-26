import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"


async function getDashboardStats() {
  const [productsResult, ordersResult, revenueResult, pendingOrdersResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM products`,
    sql`SELECT COUNT(*) as count FROM orders`,
    sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN ('paid', 'shipping', 'delivered')`,
    sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`,
  ])

  return {
    totalProducts: Number(productsResult[0]?.count || 0),
    totalOrders: Number(ordersResult[0]?.count || 0),
    totalRevenue: Number(revenueResult[0]?.total || 0),
    pendingOrders: Number(pendingOrdersResult[0]?.count || 0),
  }
}

async function getRecentOrders() {
  const orders = await sql`
    SELECT id, customer_name, total_amount, status, created_at 
    FROM orders 
    ORDER BY created_at DESC 
    LIMIT 5
  `
  return orders
}

async function getTopProducts() {
  const products = await sql`
    SELECT p.id, p.name, p.name_th, p.price, p.image_url, 
           COALESCE(SUM(oi.quantity), 0) as total_sold
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id, p.name, p.name_th, p.price, p.image_url
    ORDER BY total_sold DESC
    LIMIT 5
  `
  return products
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "รอชำระเงิน", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "ชำระเงินแล้ว", color: "bg-green-100 text-green-800" },
  shipping: { label: "กำลังจัดส่ง", color: "bg-blue-100 text-blue-800" },
  delivered: { label: "จัดส่งแล้ว", color: "bg-gray-100 text-gray-800" },
  cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
}

export default async function AdminDashboard() {
  const [stats, recentOrders, topProducts] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(),
    getTopProducts(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground">ภาพรวมร้านค้า Meow Furniture</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              สินค้าทั้งหมด
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ออเดอร์ทั้งหมด
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ยอดขายรวม
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString("th-TH")}
            </div>
            <p className="text-xs text-muted-foreground">บาท</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รอชำระเงิน
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">ออเดอร์</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ออเดอร์ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีออเดอร์
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        #{order.id} - {new Date(order.created_at).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {Number(order.total_amount).toLocaleString("th-TH")} บาท
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        statusLabels[order.status]?.color || "bg-gray-100"
                      }`}>
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีข้อมูลสินค้า
              </p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product: any, index: number) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name_th || product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Number(product.price).toLocaleString("th-TH")} บาท
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.total_sold}</p>
                      <p className="text-xs text-muted-foreground">ขายแล้ว</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
