import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'xdeals.online — SaaS Storefront Platform',
  description: 'Plataforma de e-commerce multi-loja headless. Aceda à sua loja através do subdomínio.',
}

/**
 * Root Layout — Platform Landing Page
 *
 * The root layout only wraps the landing page (no subdomain).
 * When a subdomain is detected, the middleware rewrites to
 * /[storeSlug]/... which has its own layout with store config.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
