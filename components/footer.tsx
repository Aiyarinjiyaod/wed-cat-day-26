import Link from "next/link"
import { Cat, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Cat className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">
                Meow<span className="text-primary">Furniture</span>
              </span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              เฟอร์นิเจอร์แมวคุณภาพสูง ออกแบบเพื่อความสุขของเจ้าเหมียวและความสวยงามในบ้านคุณ
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">หมวดหมู่</h3>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>
                <Link href="/products?category=towers" className="hover:text-primary transition-colors">
                  คอนโดแมว
                </Link>
              </li>
              <li>
                <Link href="/products?category=beds" className="hover:text-primary transition-colors">
                  ที่นอนแมว
                </Link>
              </li>
              <li>
                <Link href="/products?category=shelves" className="hover:text-primary transition-colors">
                  ชั้นติดผนัง
                </Link>
              </li>
              <li>
                <Link href="/products?category=scratchers" className="hover:text-primary transition-colors">
                  เสาลับเล็บ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">บริการลูกค้า</h3>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  วิธีการสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  นโยบายการคืนสินค้า
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">ติดต่อ</h3>
            <ul className="space-y-3 text-background/70 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>02-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@meowfurniture.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>123 ถนนสุขุมวิท กรุงเทพฯ 10110</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50 text-sm">
          <p>&copy; 2026 MeowFurniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
