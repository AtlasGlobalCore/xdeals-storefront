'use client'

import { StoreProvider as Provider, type StoreConfig } from '@/lib/store-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * Combined provider that wraps the store with:
 * - React Query for server state
 * - StoreProvider for store config and theme
 */
export default function StoreProviderWrapper({
  children,
  initialConfig,
  storeSlug,
}: {
  children: React.ReactNode
  initialConfig: StoreConfig | null
  storeSlug: string
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Provider initialConfig={initialConfig} storeSlug={storeSlug}>
        {children}
      </Provider>
    </QueryClientProvider>
  )
}
