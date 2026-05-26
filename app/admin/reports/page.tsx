import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react"
import { SalesChart } from "./sales-chart"
import { DateRangeFilter } from "./date-filter"

async function getSalesStats(startDate?: string, endDate?: string) {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const end = endDate || new Date().toISOString().split("T")[0]

  const [totalSales, orderCount, avgOrderValue] = await Promise.all([
    sql`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE status IN ('paid', 'shipping', 'delivered')
      AND created_at >= ${start}::date
      AND created_at < (${end}::date + INTERVAL '1 day')
    `,
    sql`
      SELECT COUNT(*) as count
      FROM orders 
      WHERE status IN ('paid', 'shipping', 'delivered')
      AND created_at >= ${start}::date
      AND created_at < (${end}::date + INTERVAL '1 day')
    `,
    sql`
      SELECT COALESCE(AVG(total_amount), 0) as avg
      FROM orders 
      WHERE status IN ('paid', 'shipping', 'delivered')
      AND created_at >= ${start}::date
      AND created_at < (${end}::date + INTERVAL '1 day')
    `,
  ])

  return {
    totalSales: Number(totalSales[0]?.total || 0),
    orderCount: Number(orderCount[0]?.count || 0),
    avgOrderValue: Number(avgOrderValue[0]?.avg || 0),
  }
}

async function getDailySales(startDate?: string, endDate?: string) {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const end = endDate || new Date().toISOString().split("T")[0]

  const sales = await sql`
    SELECT 
      DATE(created_at) as date,
      COALESCE(SUM(total_amount), 0) as total,
      COUNT(*) as orders
    FROM orders 
    WHERE status IN ('paid', 'shipping', 'delivered')
    AND created_at >= ${start}::date
    AND created_at < (${end}::date + INTERVAL '1 day')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `
  return sales
}

async function getTopProducts(startDate?: string, endDate?: string) {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const end = endDate || new Date().toISOString().split("T")[0]

  const products = await sql`
    SELECT 
      p.id, p.name, p.name_th, p.price, p.image_url,
      COALESCE(SUM(oi.quantity), 0) as total_sold,
      COALESCE(SUM(oi.quantity * oi.price_at_time), 0) as total_revenue
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    WHERE (o.status IN ('paid', 'shipping', 'delivered') OR o.id IS NULL)
    AND (o.created_at >= ${start}::date AND o.created_at < (${end}::date + INTERVAL '1 day') OR o.id IS NULL)
    GROUP BY p.id, p.name, p.name_th, p.price, p.image_url
    ORDER BY total_sold DESC
    LIMIT 10
  `
  return products
}

async function getCategorySales(startDate?: string, endDate?: string) {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const end = endDate || new Date().toISOString().split("T")[0]

  const categories = await sql`
    SELECT 
      p.category,
      COALESCE(SUM(oi.quantity), 0) as total_sold,
      COALESCE(SUM(oi.quantity * oi.price_at_time), 0) as total_revenue
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('paid', 'shipping', 'delivered')
    AND o.created_at >= ${start}::date
    AND o.created_at < (${end}::date + INTERVAL '1 day')
    GROUP BY p.category
    ORDER BY total_revenue DESC
  `
  return categories
}

const categoryLabels: Record<string, string> = {
  beds: "เตียงแมว",
  trees: "คอนโดแมว",
  scratchers: "ที่ลับเล็บ",
  toys: "ของเล่น",
  bowls: "ชามอาหาร",
  accessories: "อุปกรณ์เสริม",
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ startDate?: string; endDate?: string }>
}) {
  const { startDate, endDate } = await searchParams
  
  const [stats, dailySales, topProducts, categorySales] = await Promise.all([
    getSalesStats(startDate, endDate),
    getDailySales(startDate, endDate),
    getTopProducts(startDate, endDate),
    getCategorySales(startDate, endDate),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">รายงานยอดขาย</h1>
        <p className="text-muted-foreground">สรุปยอดขายและสถิติสินค้า</p>
      </div>

      <DateRangeFilter startDate={startDate} endDate={endDate} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ยอดขายรวม
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSales.toLocaleString("th-TH")}
            </div>
            <p className="text-xs text-muted-foreground">บาท</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              จำนวนออเดอร์
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
            <p className="text-xs text-muted-foreground">ออเดอร์</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ยอดเฉลี่ยต่อออเดอร์
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.avgOrderValue).toLocaleString("th-TH")}
            </div>
            <p className="text-xs text-muted-foreground">บาท</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            กราฟยอดขายรายวัน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={dailySales} />
        </CardContent>
      </Card>

      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีข้อมูลการขาย
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
                    <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name_th || product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name_th || product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ขายแล้ว {product.total_sold} ชิ้น
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {Number(product.total_revenue).toLocaleString("th-TH")}
                      </p>
                      <p className="text-xs text-muted-foreground">บาท</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ยอดขายตามหมวดหมู่</CardTitle>
          </CardHeader>
          <CardContent>
            {categorySales.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                ยังไม่มีข้อมูลการขาย
              </p>
            ) : (
              <div className="space-y-4">
                {categorySales.map((cat: any) => {
                  const maxRevenue = Math.max(...categorySales.map((c: any) => Number(c.total_revenue)))
                  const percentage = maxRevenue > 0 ? (Number(cat.total_revenue) / maxRevenue) * 100 : 0
                  
                  return (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {categoryLabels[cat.category] || cat.category || "ไม่ระบุ"}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Number(cat.total_revenue).toLocaleString("th-TH")} บาท
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
