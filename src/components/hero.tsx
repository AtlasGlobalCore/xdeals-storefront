'use client'

import { Button } from '@/components/ui/button'
import { Leaf, Truck, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const trustBadges = [
  {
    icon: Leaf,
    label: 'Produto Natural',
    description: 'Sem pesticidas',
  },
  {
    icon: Truck,
    label: 'Entrega Rápida',
    description: 'Em 24-48h',
  },
  {
    icon: MapPin,
    label: 'Produção Local',
    description: 'Sátão, Viseu',
  },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-banner.png')" }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/70 via-[#1B4332]/60 to-[#1B4332]/80" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FEFAE0] leading-tight mb-6">
            Do Campo Para
            <br />
            a Sua Mesa
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-[#D8F3DC] max-w-2xl mx-auto mb-10"
        >
          Pequenos frutos de produção própria, colhidos com cuidado em Sátão, Viseu
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <Button
            asChild
            size="lg"
            className="bg-[#2D6A4F] hover:bg-[#40916C] text-[#FEFAE0] px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <a href="#loja">Ver Loja</a>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <badge.icon className="h-8 w-8 text-[#74C69D]" />
              <span className="text-[#FEFAE0] font-semibold text-sm">
                {badge.label}
              </span>
              <span className="text-[#D8F3DC] text-xs opacity-80">
                {badge.description}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
