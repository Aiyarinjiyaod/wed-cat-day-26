"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Search } from "lucide-react"

const presets = [
  { label: "7 วัน", days: 7 },
  { label: "30 วัน", days: 30 },
  { label: "90 วัน", days: 90 },
  { label: "1 ปี", days: 365 },
]

export function DateRangeFilter({
  startDate,
  endDate,
}: {
  startDate?: string
  endDate?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const defaultEnd = new Date().toISOString().split("T")[0]
  const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  
  const [start, setStart] = useState(startDate || defaultStart)
  const [end, setEnd] = useState(endDate || defaultEnd)

  function handlePreset(days: number) {
    const endDate = new Date()
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set("startDate", startDate.toISOString().split("T")[0])
    params.set("endDate", endDate.toISOString().split("T")[0])
    router.push(`/admin/reports?${params.toString()}`)
  }

  function handleCustomRange() {
    const params = new URLSearchParams(searchParams.toString())
    params.set("startDate", start)
    params.set("endDate", end)
    router.push(`/admin/reports?${params.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.days}
            variant="outline"
            size="sm"
            onClick={() => handlePreset(preset.days)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {preset.label}
          </Button>
        ))}
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row items-end gap-2">
        <div className="flex-1 w-full sm:w-auto">
          <Label htmlFor="startDate" className="text-xs text-muted-foreground">
            วันเริ่มต้น
          </Label>
          <Input
            id="startDate"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex-1 w-full sm:w-auto">
          <Label htmlFor="endDate" className="text-xs text-muted-foreground">
            วันสิ้นสุด
          </Label>
          <Input
            id="endDate"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-9"
          />
        </div>
        <Button onClick={handleCustomRange} size="sm">
          <Search className="h-3 w-3 mr-1" />
          ค้นหา
        </Button>
      </div>
    </div>
  )
}
