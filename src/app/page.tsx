'use client'

import Header from '@/components/header'
import Hero from '@/components/hero'
import SeasonalHighlights from '@/components/seasonal-highlights'
import CompanyStory from '@/components/company-story'
import ShopSection from '@/components/shop-section'
import B2BSection from '@/components/b2b-section'
import AboutSection from '@/components/about-section'
import Footer from '@/components/footer'
import ProductDetailDialog from '@/components/product-detail-dialog'
import CartSheet from '@/components/cart-sheet'
import CheckoutDialog from '@/components/checkout-dialog'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF8F0]">
      <Header />
      <main className="flex-1">
        <Hero />
        <SeasonalHighlights />
        <CompanyStory />
        <ShopSection />
        <B2BSection />
        <AboutSection />
      </main>
      <Footer />
      <ProductDetailDialog />
      <CartSheet />
      <CheckoutDialog />
    </div>
  )
}
