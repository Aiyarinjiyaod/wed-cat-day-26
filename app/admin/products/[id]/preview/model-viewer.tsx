"use client"

import { useEffect, useRef } from "react"
import "@google/model-viewer"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          "ios-src"?: string
          alt?: string
          ar?: boolean
          "ar-modes"?: string
          "camera-controls"?: boolean
          "auto-rotate"?: boolean
          poster?: string
          "shadow-intensity"?: string
          "environment-image"?: string
        },
        HTMLElement
      >
    }
  }
}

export function ModelViewer({
  modelUrl,
  modelUsdzUrl,
  productName,
}: {
  modelUrl: string
  modelUsdzUrl?: string | null
  productName: string
}) {
  const viewerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Model-viewer is loaded via the import
  }, [])

  return (
    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
      <model-viewer
        ref={viewerRef}
        src={modelUrl}
        ios-src={modelUsdzUrl || undefined}
        alt={`3D model of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
        }}
      >
        <button
          slot="ar-button"
          style={{
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            borderRadius: "8px",
            border: "none",
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          ดูใน AR
        </button>
      </model-viewer>
    </div>
  )
}
