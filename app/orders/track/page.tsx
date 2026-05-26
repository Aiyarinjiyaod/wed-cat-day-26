"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck,
  XCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react"

interface OrderItem {
  id: number
  product_id: number
  quantity: number
  price_at_time: number
  name: string
  name_th: string
  image_url: string
}

interface Order {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  total_amount: number
  status: string
  payment_slip_url: string | null
  tracking_number: string | null
  created_at: string
  items?: OrderItem[]
}

const statusConfig: Record<string, { 
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  icon: React.ReactNode
  description: string
}> = {
  pending: { 
    label: "รอการตรวจสอบ", 
    variant: "secondary",
    icon: <Clock className="w-5 h-5" />,
    description: "ทางร้านกำลังตรวจสอบการชำระเงินของคุณ"
  },
  paid: { 
    label: "ชำระเงินแล้ว", 
    variant: "default",
    icon: <CheckCircle2 className="w-5 h-5" />,
    description: "ยืนยันการชำระเงินเรียบร้อย กำลังเตรียมสินค้า"
  },
  shipping: { 
    label: "กำลังจัดส่ง", 
    variant: "outline",
    icon: <Truck className="w-5 h-5" />,
    description: "สินค้าอยู่ระหว่างการจัดส่ง"
  },
  delivered: { 
    label: "จัดส่งสำเร็จ", 
    variant: "default",
    icon: <PackageCheck className="w-5 h-5" />,
    description: "จัดส่งสินค้าเรียบร้อยแล้ว"
  },
  cancelled: { 
    label: "ยกเลิก", 
    variant: "destructive",
    icon: <XCircle className="w-5 h-5" />,
    description: "คำสั่งซื้อถูกยกเลิก"
  },
}

function OrderTrackingContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
      handleSearch(emailParam)
    }
  }, [searchParams])

  const handleSearch = async (searchEmail?: string) => {
    const emailToSearch = searchEmail || email
    if (!emailToSearch) return

    setLoading(true)
    setSearched(true)
    setSelectedOrder(null)

    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(emailToSearch)}`)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const viewOrderDetails = async (orderId: number) => {
    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`)
      const data = await res.json()
      setSelectedOrder(data)
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-2">ติดตามคำสั่งซื้อ</h1>
            <p className="text-muted-foreground mb-8">
              กรอกอีเมลที่ใช้สั่งซื้อเพื่อดูสถานะคำสั่งซื้อของคุณ
            </p>

            {/* Search Form */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSearch()
                  }}
                  className="flex gap-4"
                >
                  <div className="flex-1">
                    <Label htmlFor="email" className="sr-only">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="กรอกอีเมลที่ใช้สั่งซื้อ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        ค้นหา
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Details View */}
            {selectedOrder ? (
              <div className="space-y-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedOrder(null)}
                  className="mb-4"
                >
                  &larr; กลับไปรายการคำสั่งซื้อ
                </Button>

                {/* Status Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-full ${
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        selectedOrder.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {statusConfig[selectedOrder.status]?.icon || <Package className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold">คำสั่งซื้อ #{selectedOrder.id}</h2>
                          <Badge variant={statusConfig[selectedOrder.status]?.variant || "secondary"}>
                            {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {statusConfig[selectedOrder.status]?.description}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Number */}
                    {selectedOrder.tracking_number && (
                      <div className="p-4 bg-primary/10 rounded-lg mb-6">
                        <p className="text-sm text-muted-foreground mb-1">หมายเลขติดตามพัสดุ</p>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-lg font-bold text-primary">
                            {selectedOrder.tracking_number}
                          </p>
                          <a 
                            href={`https://track.thailandpost.co.th/?trackNumber=${selectedOrder.tracking_number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm">
                              ติดตามพัสดุ
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">วันที่สั่งซื้อ</p>
                        <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ยอดรวม</p>
                        <p className="font-bold text-lg text-primary">{formatPrice(Number(selectedOrder.total_amount))}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      รายการสินค้า
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name_th || item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name_th || item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(Number(item.price_at_time))} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold">
                            {formatPrice(Number(item.price_at_time) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>ที่อยู่จัดส่ง</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-muted-foreground">{selectedOrder.customer_phone}</p>
                    <p className="text-muted-foreground mt-2">{selectedOrder.customer_address}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Orders List */}
                {searched && (
                  <>
                    {orders.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">ไม่พบคำสั่งซื้อ</h3>
                          <p className="text-muted-foreground mb-4">
                            ไม่พบคำสั่งซื้อที่เชื่อมกับอีเมล {email}
                          </p>
                          <Link href="/products">
                            <Button>เริ่มต้นช้อปปิ้ง</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          พบ {orders.length} คำสั่งซื้อ
                        </p>
                        {orders.map((order) => (
                          <Card 
                            key={order.id} 
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => viewOrderDetails(order.id)}
                          >
                            <CardContent className="py-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-full ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                    order.status === 'shipping' ? 'bg-blue-100 text-blue-600' :
                                    'bg-muted text-muted-foreground'
                                  }`}>
                                    {statusConfig[order.status]?.icon || <Package className="w-4 h-4" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">คำสั่งซื้อ #{order.id}</p>
                                      <Badge variant={statusConfig[order.status]?.variant || "secondary"} className="text-xs">
                                        {statusConfig[order.status]?.label || order.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(order.created_at)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <p className="font-bold text-primary">
                                    {formatPrice(Number(order.total_amount))}
                                  </p>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                              {order.tracking_number && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs text-muted-foreground">
                                    หมายเลขติดตามพัสดุ: <span className="font-mono font-medium">{order.tracking_number}</span>
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!searched && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">ค้นหาคำสั่งซื้อของคุณ</h3>
                      <p className="text-muted-foreground">
                        กรอกอีเมลที่ใช้สั่งซื้อเพื่อดูสถานะและรายละเอียดคำสั่งซื้อ
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  )
}
