'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Leaf, ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart-store'

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Loja', href: '#loja' },
  { label: 'B2B', href: '#b2b' },
  { label: 'Sobre Nós', href: '#sobre' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.getItemCount())
  const setCartOpen = useCartStore((s) => s.setCartOpen)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#1B4332]/95 backdrop-blur-md shadow-lg'
          : 'bg-[#1B4332]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="#inicio"
            className="flex items-center gap-2 group"
          >
            <Leaf className="h-6 w-6 text-[#74C69D] group-hover:text-[#95D5B2] transition-colors" />
            <span className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#FEFAE0] tracking-tight">
              Lovelyproportion
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-[#D8F3DC] hover:text-[#FEFAE0] hover:bg-[#2D6A4F]/50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-[#D8F3DC] hover:text-[#FEFAE0] hover:bg-[#2D6A4F]/50"
              onClick={() => setCartOpen(true)}
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9B2226] text-white text-xs flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#D8F3DC] hover:text-[#FEFAE0] hover:bg-[#2D6A4F]/50"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1B4332] border-[#2D6A4F] w-72">
                <SheetTitle className="text-[#FEFAE0] font-[family-name:var(--font-playfair)] text-xl mb-6">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleNavClick}
                      className="px-4 py-3 text-base font-medium text-[#D8F3DC] hover:text-[#FEFAE0] hover:bg-[#2D6A4F]/50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
