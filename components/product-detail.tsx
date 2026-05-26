"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Box, Ruler, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ARViewer } from "@/components/ar-viewer"
import type { Product } from "@/lib/db"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [viewMode, setViewMode] = useState<"image" | "ar">("image")
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(product.price)

  const totalPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(product.price * quantity)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const categoryNames: Record<string, string> = {
    towers: "คอนโดแมว",
    beds: "ที่นอนแมว",
    shelves: "ชั้นติดผนัง",
    scratchers: "เสาลับเล็บ",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/products" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้าสินค้า
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("image")}
            >
              รูปภาพ
            </Button>
            {product.model_url && (
              <Button
                variant={viewMode === "ar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("ar")}
              >
                <Box className="w-4 h-4 mr-2" />
                ดู 3D / AR
              </Button>
            )}
          </div>

          {viewMode === "image" ? (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image
                src={product.image_url}
                alt={product.name_th}
                fill
                className="object-cover"
                priority
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  แนะนำ
                </span>
              )}
            </div>
          ) : (
            <ARViewer modelUrl={product.model_url} productName={product.name_th} />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wide mb-2">
              {categoryNames[product.category] || product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {product.name_th}
            </h1>
            <p className="text-muted-foreground text-sm">{product.name}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-accent font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                มีสินค้า ({product.stock} ชิ้น)
              </span>
            ) : (
              <span className="text-sm text-destructive font-medium">สินค้าหมด</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description_th}
          </p>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ขนาด</p>
                <p className="text-sm font-medium text-foreground">{product.dimensions}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">หมวดหมู่</p>
                <p className="text-sm font-medium text-foreground">
                  {categoryNames[product.category] || product.category}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">จำนวน:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-muted-foreground text-sm">
                รวม: <span className="font-semibold text-foreground">{totalPrice}</span>
              </span>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  เพิ่มในตะกร้าแล้ว!
                </>
              ) : isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  กำลังเพิ่ม...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  เพิ่มลงตะกร้า
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
