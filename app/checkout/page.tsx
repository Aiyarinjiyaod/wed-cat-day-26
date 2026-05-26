"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, CreditCard, Upload, X, Copy, Building2 } from "lucide-react"

interface CartItem {
  id: number
  product_id: number
  quantity: number
  name_th: string
  price: number
  image_url: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [paymentSlipPreview, setPaymentSlipPreview] = useState<string | null>(null)
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  const bankInfo = {
    bank: "ธนาคารกสิกรไทย",
    accountNumber: "123-4-56789-0",
    accountName: "บริษัท แคทช็อป จำกัด",
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart
        const cartRes = await fetch("/api/cart")
        const cartData = await cartRes.json()
        setCartItems(cartData)
        if (cartData.length === 0) {
          router.push("/cart")
          return
        }

        // Fetch user data to pre-fill form
        const userRes = await fetch("/api/auth/me")
        const userData = await userRes.json()
        if (userData.user) {
          setFormData({
            name: userData.user.full_name || "",
            email: userData.user.email || "",
            phone: userData.user.phone || "",
            address: userData.user.address || "",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 2000 ? 0 : 150
  const total = subtotal + shipping

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ต้องมีขนาดไม่เกิน 5MB")
        return
      }
      setPaymentSlip(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPaymentSlipPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSlip = () => {
    setPaymentSlip(null)
    setPaymentSlipPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const copyBankNumber = async () => {
    await navigator.clipboard.writeText(bankInfo.accountNumber)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!paymentSlip) {
      alert("กรุณาอัปโหลดสลิปการโอนเงิน")
      return
    }

    setSubmitting(true)

    try {
      // Upload payment slip first
      setUploadingSlip(true)
      const slipFormData = new FormData()
      slipFormData.append("file", paymentSlip)
      slipFormData.append("type", "slip")

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: slipFormData,
      })

      if (!uploadRes.ok) {
        throw new Error("Failed to upload payment slip")
      }

      const { url: paymentSlipUrl } = await uploadRes.json()
      setUploadingSlip(false)

      // Create order with payment slip
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cartItems,
          total,
          paymentSlipUrl,
        }),
      })

      if (res.ok) {
        const { orderId: newOrderId } = await res.json()
        setOrderId(newOrderId)
        await fetch("/api/cart", { method: "DELETE" })
        setOrderComplete(true)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setSubmitting(false)
      setUploadingSlip(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <Card className="max-w-md w-full mx-4 text-center">
            <CardContent className="py-12 space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">สั่งซื้อสำเร็จ!</h1>
              <p className="text-muted-foreground">
                ขอบคุณสำหรับการสั่งซื้อ เราจะตรวจสอบการชำระเงินและจัดส่งสินค้าให้คุณเร็วที่สุด
              </p>
              {orderId && (
                <p className="text-sm font-medium text-primary">
                  หมายเลขคำสั่งซื้อ: #{orderId}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                รายละเอียดการสั่งซื้อจะถูกส่งไปยัง {formData.email}
              </p>
              <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                สถานะปัจจุบัน: <span className="font-medium text-foreground">รอการตรวจสอบ (Pending)</span>
                <br />
                คุณสามารถติดตามสถานะคำสั่งซื้อได้ที่หน้าติดตามคำสั่งซื้อ
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/orders/track?email=${encodeURIComponent(formData.email)}`}>
                  <Button className="w-full">ติดตามคำสั่งซื้อ</Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full">กลับไปเลือกซื้อสินค้า</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={cartItems.length} />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปตะกร้า
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">ชำระเงิน</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลการจัดส่ง</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="กรอกชื่อ-นามสกุล"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0xx-xxx-xxxx"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">อีเมล</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
                      <textarea
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="บ้านเลขที่ ซอย ถนน แขวง เขต จังหวัด รหัสไปรษณีย์"
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      ช่องทางการชำระเงิน
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Bank Transfer Info */}
                    <div className="p-4 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Building2 className="w-5 h-5" />
                        โอนเงินผ่านธนาคาร
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">ธนาคาร:</span>
                          <span className="font-medium">{bankInfo.bank}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">เลขบัญชี:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bankInfo.accountNumber}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={copyBankNumber}
                            >
                              {copiedBank ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">ชื่อบัญชี:</span>
                          <span className="font-medium">{bankInfo.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2 mt-2">
                          <span className="text-muted-foreground">ยอดที่ต้องชำระ:</span>
                          <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Upload Payment Slip */}
                    <div className="space-y-2">
                      <Label>อัปโหลดสลิปการโอนเงิน *</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {paymentSlipPreview ? (
                        <div className="relative">
                          <div className="relative w-full max-w-xs mx-auto">
                            <Image
                              src={paymentSlipPreview}
                              alt="Payment slip preview"
                              width={300}
                              height={400}
                              className="rounded-lg border object-contain w-full h-auto"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={removeSlip}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-2">
                            {paymentSlip?.name}
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium text-foreground">คลิกเพื่ออัปโหลดสลิป</p>
                          <p className="text-xs text-muted-foreground mt-1">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      หลังจากยืนยันคำสั่งซื้อ ระบบจะบันทึกสถานะเป็น &quot;รอการตรวจสอบ&quot; 
                      และทางร้านจะตรวจสอบการชำระเงินภายใน 24 ชั่วโมง
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.image_url}
                              alt={item.name_th}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {item.name_th}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ราคาสินค้า</span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ค่าจัดส่ง</span>
                        <span className="text-foreground">
                          {shipping === 0 ? "ฟรี" : formatPrice(shipping)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-foreground">รวมทั้งหมด</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={submitting || !paymentSlip}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                          {uploadingSlip ? "กำลังอัปโหลดสลิป..." : "กำลังดำเนินการ..."}
                        </>
                      ) : (
                        "ยืนยันคำสั่งซื้อ"
                      )}
                    </Button>

                    {!paymentSlip && (
                      <p className="text-xs text-center text-destructive">
                        กรุณาอัปโหลดสลิปการโอนเงินก่อนยืนยันคำสั่งซื้อ
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
