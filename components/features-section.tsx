import { Smartphone, Ruler, Palette, Sparkles } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "AR Preview",
    description: "ดูสินค้าในห้องของคุณผ่านกล้องมือถือก่อนตัดสินใจซื้อ เพื่อความมั่นใจว่าขนาดและสไตล์ลงตัวกับพื้นที่",
  },
  {
    icon: Ruler,
    title: "วัดขนาดแม่นยำ",
    description: "ทุกสินค้าระบุขนาดละเอียด พร้อมโมเดล 3D ที่สามารถหมุนดูได้รอบทิศทาง",
  },
  {
    icon: Palette,
    title: "ดีไซน์ทันสมัย",
    description: "เฟอร์นิเจอร์แมวที่ออกแบบมาให้เข้ากับบ้านยุคใหม่ สวยงามไม่แปลกแยกจากของตกแต่งอื่น",
  },
  {
    icon: Sparkles,
    title: "วัสดุคุณภาพสูง",
    description: "ใช้วัสดุที่ปลอดภัยสำหรับแมว ทนทาน และง่ายต่อการทำความสะอาด",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wide">ทำไมต้องเลือกเรา</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            ประสบการณ์ช้อปปิ้งที่แตกต่าง
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            เราใช้เทคโนโลยี AR ช่วยให้คุณมั่นใจก่อนซื้อ ไม่ต้องกังวลเรื่องขนาดหรือสไตล์อีกต่อไป
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 text-center space-y-4 hover:shadow-lg transition-shadow border border-border/50"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
