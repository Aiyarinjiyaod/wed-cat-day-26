"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const statuses = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอชำระเงิน" },
  { value: "paid", label: "ชำระเงินแล้ว" },
  { value: "shipping", label: "กำลังจัดส่ง" },
  { value: "delivered", label: "จัดส่งแล้ว" },
  { value: "cancelled", label: "ยกเลิก" },
]

export function OrderStatusFilter({ currentStatus }: { currentStatus: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    router.push(`/admin/orders?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={currentStatus === status.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleStatusChange(status.value)}
          className={cn(
            currentStatus === status.value && "pointer-events-none"
          )}
        >
          {status.label}
        </Button>
      ))}
    </div>
  )
}
