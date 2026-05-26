"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Smartphone, Maximize2, RotateCcw, View } from "lucide-react"

interface ARViewerProps {
  modelUrl: string
  productName: string
}

export function ARViewer({ modelUrl, productName }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelViewerRef = useRef<HTMLElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isARSupported, setIsARSupported] = useState(false)
  const [arStatus, setArStatus] = useState<"idle" | "activating" | "active">("idle")

  useEffect(() => {
    import("@google/model-viewer").then(() => {
    })
  }, [])

  useEffect(() => {
    if (isLoaded && modelViewerRef.current) {
      const mv = modelViewerRef.current as HTMLElement & { canActivateAR?: boolean }
      
      const checkAR = () => {
        setIsARSupported(mv.canActivateAR === true)
      }
      
      mv.addEventListener("ar-status", (e: Event) => {
        const detail = (e as CustomEvent).detail
        if (detail.status === "session-started") {
          setArStatus("active")
        } else if (detail.status === "not-presenting") {
          setArStatus("idle")
        }
      })

      setTimeout(checkAR, 500)
    }
  }, [isLoaded])

  const activateAR = () => {
    if (modelViewerRef.current) {
      const mv = modelViewerRef.current as HTMLElement & { activateAR?: () => void }
      if (mv.activateAR) {
        setArStatus("activating")
        mv.activateAR()
      }
    }
  }

  const resetCamera = () => {
    if (modelViewerRef.current) {
      const mv = modelViewerRef.current as HTMLElement & { 
        cameraOrbit?: string
        resetTurntableRotation?: () => void 
      }
      mv.cameraOrbit = "auto auto auto"
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
  }

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="relative w-full aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden group">
        {/* @ts-expect-error - model-viewer is a custom element */}
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          alt={productName}
          ar
          ar-scale="auto"
          ar-modes="webxr scene-viewer quick-look" //ระบบที่จัดการการลากวาง
          camera-controls //เปิดให้หมุนด้วยเมาส์/นิ้วและซูมได้
          touch-action="pan-y" //จัดการการใช้นิ้วเลื่อนบนมือถือ
          auto-rotate //สั่งให้โมเดลหมุนรอบตัวเองอัตโนมัติ
          shadow-intensity="1"
          shadow-softness="0.5"
          exposure="0.8"
          environment-image="neutral"
          style={{ width: "100%", height: "100%" }}
        >
          {/* Hidden AR button - we use our custom button */}
          <button slot="ar-button" style={{ display: "none" }} />
        </model-viewer >

        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-lg bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={resetCamera}
            title="รีเซ็ตมุมกล้อง"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-10 h-10 rounded-full shadow-lg bg-background/90 backdrop-blur-sm hover:bg-background"
            onClick={toggleFullscreen}
            title="เต็มหน้าจอ"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <View className="w-3 h-3" />
            หมุนด้วยเมาส์ | ซูมด้วย Scroll
          </p>
        </div>
      </div>

      {/* AR Camera Button - Big and prominent */}
      <Button
        size="lg"
        className="w-full h-14 text-lg font-semibold gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
        onClick={activateAR}
        disabled={arStatus === "activating"}
      >
        {arStatus === "activating" ? (
          <>
            <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            กำลังเปิดกล้อง AR...
          </>
        ) : (
          <>
            <Camera className="w-6 h-6" />
            เปิดกล้อง AR วางในห้องจริง
          </>
        )}
      </Button>

      {/* AR Support info */}
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
        <Smartphone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">วิธีใช้งาน AR</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>กดปุ่ม &quot;เปิดกล้อง AR&quot; ด้านบน</li>
            <li>อนุญาตให้เข้าถึงกล้อง</li>
            <li>หันกล้องไปที่พื้นหรือโต๊ะ</li>
            <li>แตะเพื่อวางเฟอร์นิเจอร์</li>
          </ol>
          <p className="mt-2 text-xs opacity-75">
            * รองรับ iOS Safari และ Android Chrome
          </p>
        </div>
      </div>
    </div>
  )
}