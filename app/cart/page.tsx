"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"

interface CartItem {
  id: number
  session_id: string
  product_id: number
  quantity: number
  name: string
  name_th: string
  price: number
  image_url: string
  stock: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart")
      const data = await res.json()

      // ตรวจสอบว่าเป็น Array จริงไหม
      if (data && Array.isArray(data)) {
        setCartItems(data)
      } else {
        // ถ้าไม่ใช่ Array ให้เซ็ตเป็นค่าว่างเงียบๆ ไม่ต้องพ่น Error หนัก
        console.warn("Cart data is not an array, defaulting to empty.")
        setCartItems([]) 
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })
      fetchCart()
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      await fetch(`/api/cart?id=${itemId}`, { method: "DELETE" })
      fetchCart()
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? (subtotal >= 2000 ? 0 : 150) : 0
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartCount={0} />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <h1 className="text-3xl font-bold text-foreground mb-8">ตะกร้าสินค้า</h1>

          {cartItems.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent className="space-y-4">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-semibold text-foreground">ตะกร้าว่างเปล่า</h2>
                <p className="text-muted-foreground">เริ่มเลือกซื้อสินค้าสำหรับเจ้าเหมียวของคุณเลย!</p>
                <Link href="/products">
                  <Button className="mt-4">
                    ดูสินค้าทั้งหมด
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name_th}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/products/${item.product_id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.name_th}
                          </Link>
                          <p className="text-sm text-muted-foreground mb-2">{item.name}</p>
                          <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="flex items-center border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">สรุปคำสั่งซื้อ</h2>
                    
                    <div className="space-y-2 text-sm">
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
                      {subtotal > 0 && subtotal < 2000 && (
                        <p className="text-xs text-accent">
                          ซื้อเพิ่มอีก {formatPrice(2000 - subtotal)} เพื่อรับส่งฟรี!
                        </p>
                      )}
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-foreground">รวมทั้งหมด</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    <Link href="/checkout" className="block">
                      <Button className="w-full" size="lg">
                        ดำเนินการชำระเงิน
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>

                    <Link href="/products" className="block">
                      <Button variant="outline" className="w-full">
                        เลือกซื้อต่อ
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
