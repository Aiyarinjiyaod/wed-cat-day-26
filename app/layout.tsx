import type { Metadata, Viewport } from 'next'
import { Kanit, Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const kanit = Kanit({ 
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit"
});

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist"
});

export const metadata: Metadata = {
  title: 'Meow Furniture | เฟอร์นิเจอร์แมวพรีเมียม',
  description: 'ร้านขายเฟอร์นิเจอร์แมวคุณภาพสูง พร้อมเทคโนโลยี AR ให้คุณดูสินค้าในห้องของคุณก่อนซื้อ',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#c17f59',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`${kanit.variable} ${geist.variable}`}>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
