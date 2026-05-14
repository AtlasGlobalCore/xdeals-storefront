import { create } from 'zustand'

export type PolicyType = 'reembolso' | 'entrega' | 'privacidade' | 'reclamacoes' | null

interface UIState {
  activeSection: string
  selectedProductSlug: string | null
  isProductDialogOpen: boolean
  isCheckoutOpen: boolean
  activePolicy: PolicyType
  categoryFilter: string
  formatFilter: string
  setActiveSection: (section: string) => void
  setSelectedProduct: (slug: string | null) => void
  setProductDialogOpen: (open: boolean) => void
  setCheckoutOpen: (open: boolean) => void
  setActivePolicy: (policy: PolicyType) => void
  setCategoryFilter: (category: string) => void
  setFormatFilter: (format: string) => void
}

export const useUIStore = create<UIState>()((set) => ({
  activeSection: 'home',
  selectedProductSlug: null,
  isProductDialogOpen: false,
  isCheckoutOpen: false,
  activePolicy: null,
  categoryFilter: 'todos',
  formatFilter: 'todos',

  setActiveSection: (section) => set({ activeSection: section }),
  setSelectedProduct: (slug) => set({ selectedProductSlug: slug, isProductDialogOpen: !!slug }),
  setProductDialogOpen: (open) => set({ isProductDialogOpen: open, selectedProductSlug: open ? undefined : null }),
  setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
  setActivePolicy: (policy) => set({ activePolicy: policy }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setFormatFilter: (format) => set({ formatFilter: format }),
}))
