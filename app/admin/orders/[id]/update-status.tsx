"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Check, Truck } from "lucide-react"

const statuses = [
  { value: "pending", label: "รอชำระเงิน" },
  { value: "paid", label: "ชำระเงินแล้ว" },
  { value: "shipping", label: "กำลังจัดส่ง" },
  { value: "delivered", label: "จัดส่งแล้ว" },
  { value: "cancelled", label: "ยกเลิก" },
]

export function UpdateOrderStatus({
  orderId,
  currentStatus,
  currentTrackingNumber,
}: {
  orderId: number
  currentStatus: string
  currentTrackingNumber?: string | null
}) {
  const [status, setStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || "")
  const [isUpdating, setIsUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const hasChanges = status !== currentStatus || trackingNumber !== (currentTrackingNumber || "")

  async function handleUpdate() {
    if (!hasChanges) return

    setIsUpdating(true)
    setSuccess(false)

    try {
      const updateData: { status?: string; trackingNumber?: string } = {}
      
      if (status !== currentStatus) {
        updateData.status = status
      }
      
      if (trackingNumber !== (currentTrackingNumber || "")) {
        updateData.trackingNumber = trackingNumber
      }

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (res.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 2000)
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>สถานะคำสั่งซื้อ</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tracking" className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          หมายเลขติดตามพัสดุ
        </Label>
        <Input
          id="tracking"
          placeholder="เช่น TH1234567890"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          ลูกค้าสามารถใช้หมายเลขนี้ติดตามพัสดุได้
        </p>
      </div>

      <Button
        onClick={handleUpdate}
        disabled={!hasChanges || isUpdating}
        className="w-full"
      >
        {isUpdating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            กำลังอัปเดต...
          </>
        ) : success ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            อัปเดตสำเร็จ
          </>
        ) : (
          "อัปเดต"
        )}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
        <p className="font-medium mb-2">คำอธิบายสถานะ:</p>
        <p><strong>pending:</strong> ลูกค้ายังไม่ชำระเงิน / รอตรวจสอบสลิป</p>
        <p><strong>paid:</strong> ตรวจสอบสลิปแล้ว ชำระเงินถูกต้อง</p>
        <p><strong>shipping:</strong> จัดส่งสินค้าแล้ว (ใส่ Tracking Number)</p>
        <p><strong>delivered:</strong> ลูกค้าได้รับสินค้าแล้ว</p>
        <p><strong>cancelled:</strong> ยกเลิกคำสั่งซื้อ</p>
      </div>
    </div>
  )
}
