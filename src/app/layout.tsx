import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'xdeals.online — SaaS Storefront Platform',
  description: 'Plataforma de e-commerce multi-loja headless. Aceda à sua loja através do subdomínio.',
}

/**
 * Root Layout — Required by Next.js
 *
 * Defines the mandatory <html> and <body> tags.
 * Fonts and globals.css are loaded here so all routes inherit them.
 * Store-specific theming is handled by StoreProvider in [storeSlug]/layout.tsx
 * which injects CSS variables into document.documentElement.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}
