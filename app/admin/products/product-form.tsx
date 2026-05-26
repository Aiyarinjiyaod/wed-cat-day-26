"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Loader2, Box } from "lucide-react"
import { Product } from "@/lib/db"

const categories = [
  { value: "beds", label: "เตียงแมว" },
  { value: "trees", label: "คอนโดแมว" },
  { value: "scratchers", label: "ที่ลับเล็บ" },
  { value: "toys", label: "ของเล่น" },
  { value: "bowls", label: "ชามอาหาร" },
  { value: "accessories", label: "อุปกรณ์เสริม" },
]

type ProductFormProps = {
  product?: Product
  mode: "create" | "edit"
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingModel, setUploadingModel] = useState(false)
  const [uploadingModelUsdz, setUploadingModelUsdz] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    name_th: product?.name_th || "",
    description: product?.description || "",
    description_th: product?.description_th || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    model_url: product?.model_url || "",
    model_usdz_url: product?.model_usdz_url || "",
    dimensions: product?.dimensions || "",
    stock: product?.stock?.toString() || "0",
    featured: product?.featured || false,
  })

  async function uploadFile(file: File, type: "image" | "model" | "model-usdz") {
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("type", type)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formDataUpload,
    })

    if (!res.ok) {
      throw new Error("Upload failed")
    }

    const data = await res.json()
    return data.url
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const url = await uploadFile(file, "image")
      setFormData((prev) => ({ ...prev, image_url: url }))
    } catch (error) {
      console.error("Failed to upload image:", error)
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleModelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingModel(true)
    try {
      const url = await uploadFile(file, "model")
      setFormData((prev) => ({ ...prev, model_url: url }))
    } catch (error) {
      console.error("Failed to upload model:", error)
    } finally {
      setUploadingModel(false)
    }
  }

  async function handleModelUsdzUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingModelUsdz(true)
    try {
      const url = await uploadFile(file, "model-usdz")
      setFormData((prev) => ({ ...prev, model_usdz_url: url }))
    } catch (error) {
      console.error("Failed to upload USDZ model:", error)
    } finally {
      setUploadingModelUsdz(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = mode === "create" 
        ? "/api/admin/products" 
        : `/api/admin/products/${product?.id}`
      
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      })

      if (res.ok) {
        router.push("/admin/products")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลสินค้า</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อสินค้า (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Cat Bed Premium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_th">ชื่อสินค้า (ภาษาไทย)</Label>
                  <Input
                    id="name_th"
                    value={formData.name_th}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name_th: e.target.value }))}
                    placeholder="เตียงแมวพรีเมียม"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">รายละเอียด (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_th">รายละเอียด (ภาษาไทย)</Label>
                <Textarea
                  id="description_th"
                  value={formData.description_th}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_th: e.target.value }))}
                  placeholder="รายละเอียดสินค้า..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">ราคา (บาท)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="1990"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">จำนวนคงเหลือ</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">หมวดหมู่</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">ขนาด</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: e.target.value }))}
                  placeholder="50 x 40 x 30 cm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">สินค้าแนะนำ</Label>
              </div>
            </CardContent>
          </Card>

          {/* 3D Model Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                โมเดล 3D สำหรับ AR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GLB Model */}
                <div className="space-y-2">
                  <Label>ไฟล์ .glb (Android / Web)</Label>
                  {formData.model_url ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Box className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1 truncate">
                        {formData.model_url.split("/").pop()}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, model_url: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".glb"
                        onChange={handleModelUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingModel}
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        {uploadingModel ? (
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              คลิกหรือลากไฟล์ .glb มาวาง
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* USDZ Model */}
                <div className="space-y-2">
                  <Label>ไฟล์ .usdz (iOS)</Label>
                  {formData.model_usdz_url ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Box className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1 truncate">
                        {formData.model_usdz_url.split("/").pop()}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, model_usdz_url: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".usdz"
                        onChange={handleModelUsdzUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingModelUsdz}
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        {uploadingModelUsdz ? (
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              คลิกหรือลากไฟล์ .usdz มาวาง
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                อัปโหลดโมเดล 3D เพื่อให้ลูกค้าสามารถดูสินค้าในโหมด AR ได้ รองรับไฟล์ .glb (Android/Web) และ .usdz (iOS)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>รูปภาพสินค้า</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.image_url ? (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImage}
                  />
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          คลิกหรือลากรูปมาวาง
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {mode === "create" ? "เพิ่มสินค้า" : "บันทึกการแก้ไข"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                >
                  ยกเลิก
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
