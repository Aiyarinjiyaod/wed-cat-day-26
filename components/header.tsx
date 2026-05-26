"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Cat, Menu, X, User, LogIn, LogOut, UserPlus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  cartCount?: number
}

interface UserData {
  id: number
  email: string
  full_name: string
  role: string
}

export function Header({ cartCount = 0 }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Cat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              Meow<span className="text-primary">Furniture</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              หน้าแรก
            </Link>
            <Link 
              href="/products" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              สินค้าทั้งหมด
            </Link>
            <Link 
              href="/orders/track" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              ติดตามคำสั่งซื้อ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="max-w-[100px] truncate">{user.full_name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="w-4 h-4" />
                          บัญชีของฉัน
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                            <Settings className="w-4 h-4" />
                            จัดการระบบ
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        <LogIn className="w-4 h-4 mr-2" />
                        เข้าสู่ระบบ
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        สมัครสมาชิก
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                หน้าแรก
              </Link>
              <Link 
                href="/products" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                สินค้าทั้งหมด
              </Link>
              <Link 
                href="/orders/track" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                ติดตามคำสั่งซื้อ
              </Link>
              
              {/* Mobile Auth Links */}
              {!loading && (
                <div className="border-t border-border mt-2 pt-2">
                  {user ? (
                    <>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        บัญชีของฉัน ({user.full_name})
                      </Link>
                      {user.role === "admin" && (
                        <Link 
                          href="/admin" 
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          จัดการระบบ
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors font-medium px-2 py-2 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LogIn className="w-4 h-4" />
                        เข้าสู่ระบบ
                      </Link>
                      <Link 
                        href="/register" 
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium px-2 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserPlus className="w-4 h-4" />
                        สมัครสมาชิก
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
