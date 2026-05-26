"use client"

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts"

type SalesData = {
  date: string
  total: number
  orders: number
}

export function SalesChart({ data }: { data: SalesData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        ยังไม่มีข้อมูลการขายในช่วงเวลานี้
      </div>
    )
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
    }),
    total: Number(item.total),
    orders: Number(item.orders),
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border rounded-lg p-3 shadow-lg">
                    <p className="font-medium mb-1">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      ยอดขาย: {Number(payload[0].value).toLocaleString("th-TH")} บาท
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ออเดอร์: {payload[0].payload.orders} รายการ
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="total" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
