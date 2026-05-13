'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Leaf, Calendar, Heart, MapPin } from 'lucide-react'

const stats = [
  { icon: Calendar, value: '7+', label: 'Anos de Experiência' },
  { icon: Leaf, value: '5+', label: 'Variedades' },
  { icon: Heart, value: '100%', label: 'Natural' },
  { icon: MapPin, value: 'Própria', label: 'Produção' },
]

export default function CompanyStory() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Badge
              variant="secondary"
              className="bg-[#D8F3DC] text-[#2D6A4F] mb-4 px-4 py-1"
            >
              Quem Somos
            </Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B4332] mb-6">
              A Nossa História
            </h2>
            <div className="space-y-4 text-[#5C7A6B] leading-relaxed">
              <p>
                Há mais de 7 anos, a <strong className="text-[#1B4332]">Lovelyproportion</strong> nasceu
                da paixão pela terra e pelo desejo de oferecer os melhores pequenos frutos
                de produção própria. Localizados no coração de Sátão, Viseu, cultivamos
                com dedicção e respeito pela natureza.
              </p>
              <p>
                A nossa produção é totalmente natural, sem pesticidas sintéticos,
                garantindo que cada mirtilo, framboesa, amora, groselha e morango
                que chega à sua mesa preserve todo o sabor autêntico e os nutrientes
                que a terra generosamente nos oferece.
              </p>
              <p>
                Do campo para a sua mesa — esta é a nossa promessa. Cada fruto é
                colhido no ponto ideal de maturação, assegurando frescura e qualidade
                incomparáveis.
              </p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="bg-[#F0F4F0] rounded-2xl p-6 sm:p-8 text-center hover:bg-[#D8F3DC] transition-colors group"
                >
                  <stat.icon className="h-8 w-8 text-[#2D6A4F] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1B4332]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#5C7A6B] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
