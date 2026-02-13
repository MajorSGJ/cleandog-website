import { motion } from 'framer-motion'
import { Phone, MapPin, Star, Heart, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableImage from '../admin/inline/EditableImage'
import EditableKeyText from '../admin/inline/EditableKeyText'

const Hero = () => {
  const { data, updateNestedData } = useData()
  const { siteInfo, hero } = data
  
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with banner */}
      <div className="absolute inset-0">
        <EditableImage
          src={siteInfo.banner}
          alt="Clean Dog Salon"
          wrapperClassName="absolute inset-0 relative"
          className="w-full h-full object-cover"
          onSave={(next) => updateNestedData('siteInfo', 'banner', next)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 rounded-full border-4 border-dashed border-primary-200 opacity-50"
        />
      </div>
      
      <div className="absolute bottom-40 right-40 hidden lg:block">
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-12 h-12 text-primary-300 fill-primary-200" />
        </motion.div>
      </div>

      <div className="absolute top-40 left-1/3 hidden lg:block">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-0">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-primary-400" />
            <EditableText
              value={hero.subtitle}
              onSave={(next) => updateNestedData('hero', 'subtitle', next)}
              as="span"
              className=""
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          >
            <EditableKeyText textKey="hero.title.line1" fallback="Twój pupil" as="span" />
            <br />
            <span className="gradient-text">
              <EditableKeyText textKey="hero.title.line2" fallback="zasługuje na" as="span" />
            </span>
            <br />
            <span className="relative">
              <EditableKeyText textKey="hero.title.line3" fallback="najlepsze" as="span" />
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <motion.path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
          >
            <EditableText
              value={hero.description}
              onSave={(next) => updateNestedData('hero', 'description', next)}
              as="span"
              multiline
            />
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.a
              href="tel:723179982"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-primary-300/30 hover:shadow-primary-400/40 transition-all btn-shine"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5" />
              <EditableKeyText textKey="hero.cta.call" fallback="Umów wizytę" as="span" />
            </motion.a>
            
            <motion.a
              href="#locations"
              className="inline-flex items-center justify-center gap-3 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="w-5 h-5" />
              <EditableKeyText textKey="hero.cta.locations" fallback="Nasze salony" as="span" />
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8"
          >
            {hero.stats.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.number}</div>
                <div className="text-gray-500 text-sm">
                  <EditableText
                    value={stat.label}
                    onSave={(next) => {
                      const nextStats = [...hero.stats]
                      nextStats[index] = { ...nextStats[index], label: next }
                      updateNestedData('hero', 'stats', nextStats)
                    }}
                    as="span"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-300 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-3 bg-primary-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
