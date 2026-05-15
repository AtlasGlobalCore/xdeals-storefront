'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

/**
 * Store configuration returned by the Core Banking API.
 * This is the single source of truth for the storefront's
 * theme, branding, and available payment methods.
 */
export interface StoreConfig {
  storeId: string
  slug: string
  name: string
  logoUrl: string | null
  themePrimary: string
  themeSecondary: string
  publishableKey: string
  allowedMethods: AllowedMethod[]
  currency: string
  locale: string
}

export type AllowedMethod = 'CARD' | 'MBWAY' | 'MULTIBANCO' | 'PIX'

/** Mapping from API method codes to display metadata */
export const METHOD_META: Record<AllowedMethod, { label: string; description: string; icon: string }> = {
  CARD: { label: 'Cartão de Crédito', description: 'Visa, Mastercard', icon: 'credit-card' },
  MBWAY: { label: 'MB WAY', description: 'Pagamento via MB WAY', icon: 'smartphone' },
  MULTIBANCO: { label: 'Multibanco', description: 'Referência Multibanco', icon: 'landmark' },
  PIX: { label: 'PIX', description: 'Pagamento instantâneo via PIX', icon: 'qr-code' },
}

interface StoreContextValue {
  config: StoreConfig | null
  isLoading: boolean
  error: string | null
}

const StoreContext = createContext<StoreContextValue>({
  config: null,
  isLoading: true,
  error: null,
})

export function useStoreConfig() {
  return useContext(StoreContext)
}

interface StoreProviderProps {
  children: ReactNode
  initialConfig?: StoreConfig | null
  storeSlug: string
}

export function StoreProvider({ children, initialConfig, storeSlug }: StoreProviderProps) {
  const [config, setConfig] = useState<StoreConfig | null>(initialConfig ?? null)
  const [isLoading, setIsLoading] = useState(!initialConfig)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialConfig) return

    async function fetchConfig() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/stores/config?slug=${encodeURIComponent(storeSlug)}`)
        if (!res.ok) throw new Error(`Failed to fetch store config: ${res.status}`)
        const data = await res.json()
        setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [storeSlug, initialConfig])

  // Inject CSS variables for theming
  useEffect(() => {
    if (!config) return

    const root = document.documentElement
    root.style.setProperty('--color-primary', config.themePrimary)

    // Generate lighter/darker variants
    root.style.setProperty('--color-primary-light', adjustColor(config.themePrimary, 30))
    root.style.setProperty('--color-primary-dark', adjustColor(config.themePrimary, -20))

    // Update page title
    document.title = `${config.name} — xdeals.online`
  }, [config])

  return (
    <StoreContext.Provider value={{ config, isLoading, error }}>
      {children}
    </StoreContext.Provider>
  )
}

/**
 * Simple hex color adjustment (lighten/darken).
 */
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
