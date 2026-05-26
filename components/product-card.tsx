"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingCart, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/db"

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(product.price)

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image_url}
          alt={product.name_th}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
            แนะนำ
          </span>
        )}
        {product.model_url && (
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Box className="w-3 h-3" />
            AR
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="secondary" className="w-full" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              ดูรายละเอียด
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category === 'towers' ? 'คอนโดแมว' : 
             product.category === 'beds' ? 'ที่นอนแมว' :
             product.category === 'shelves' ? 'ชั้นติดผนัง' : 'เสาลับเล็บ'}
          </p>
          <h3 className="font-semibold text-foreground line-clamp-1">{product.name_th}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description_th}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">{formattedPrice}</span>
          <Button 
            size="sm" 
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
