import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "คอนโดแมว",
    slug: "towers",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600",
    count: "0 รายการ",
  },
  {
    name: "ที่นอนแมว",
    slug: "beds",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600",
    count: "10 รายการ",
  },
  {
    name: "ชั้นติดผนัง",
    slug: "shelves",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600",
    count: "0 รายการ",
  },
  {
    name: "เสาลับเล็บ",
    slug: "scratchers",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
    count: "2 รายการ",
  },
]

export function CategorySection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wide">หมวดหมู่</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            เลือกตามประเภท
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-white font-semibold text-lg md:text-xl">{category.name}</h3>
                <p className="text-white/70 text-sm mt-1">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
