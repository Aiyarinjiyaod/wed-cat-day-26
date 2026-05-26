import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Box, Truck, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-muted">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Box className="w-4 h-4" />
            <span>ใหม่! ดูสินค้าในห้องคุณด้วย AR</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            เฟอร์นิเจอร์แมว
            <span className="text-primary block mt-2">ที่ลงตัวกับบ้านคุณ</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            คอลเลคชันเฟอร์นิเจอร์แมวพรีเมียม ออกแบบเพื่อความสุขของเจ้าเหมียว 
            พร้อมเทคโนโลยี AR ให้คุณดูสินค้าในห้องจริงก่อนตัดสินใจ
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="text-base px-8">
                ดูสินค้าทั้งหมด
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/products?category=towers">
              <Button variant="outline" size="lg" className="text-base px-8">
                คอนโดแมวขายดี
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-12 max-w-xl mx-auto">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Box className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">AR Preview</span>
              <span className="text-xs text-muted-foreground">ดูในห้องจริง</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">จัดส่งฟรี</span>
              <span className="text-xs text-muted-foreground">ทั่วประเทศ</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">รับประกัน</span>
              <span className="text-xs text-muted-foreground">1 ปีเต็ม</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
