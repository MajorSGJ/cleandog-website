import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableKeyText from '../admin/inline/EditableKeyText'
import EditableImage from '../admin/inline/EditableImage'

const Navbar = () => {
  const { data, updateNestedData } = useData()
  const siteInfo = data.siteInfo
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { key: 'navbar.link.home', name: 'Strona główna', href: '#home' },
    { key: 'navbar.link.about', name: 'O nas', href: '#about' },
    { key: 'navbar.link.services', name: 'Usługi', href: '#services' },
    { key: 'navbar.link.gallery', name: 'Galeria', href: '#gallery' },
    { key: 'navbar.link.locations', name: 'Lokalizacje', href: '#locations' },
    { key: 'navbar.link.contact', name: 'Kontakt', href: '#contact' },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary-100 transition-colors">
              <Phone className="w-4 h-4" />
              {siteInfo.phone}
            </a>
            <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-2 hover:text-primary-100 transition-colors">
              <Mail className="w-4 h-4" />
              {siteInfo.email}
            </a>
          </div>
          <p className="text-primary-100">
            <EditableKeyText textKey="navbar.top.locations" fallback="Nowe Miasto Lubawskie & Iława" as="span" />
          </p>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-100/20'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('#home')
              }}
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <EditableImage
                src={siteInfo.logo}
                alt="Clean Dog Logo"
                wrapperClassName="relative"
                className="h-14 w-14 object-cover rounded-full shadow-md"
                onSave={(next) => {
                  const cleaned = (next || '').trim()
                  updateNestedData('siteInfo', 'logo', cleaned)
                }}
              />
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  <EditableKeyText textKey="navbar.brand.name" fallback={siteInfo.name} as="span" />
                </h1>
                <p className="text-xs text-gray-500">
                  <EditableKeyText textKey="navbar.brand.tagline" fallback={siteInfo.tagline} as="span" />
                </p>
              </div>
            </motion.a>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className="relative text-gray-700 font-medium hover:text-primary-500 transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  <EditableKeyText textKey={link.key} fallback={link.name} as="span" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>

            {/* CTA Button */}
            <motion.a
              href="tel:723179982"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary-300/30 hover:shadow-primary-400/40 transition-all btn-shine"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-4 h-4" />
              <EditableKeyText textKey="navbar.cta" fallback="Umów wizytę" as="span" />
            </motion.a>

            {/* Mobile menu button */}
            <motion.button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-primary-100"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.key}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block py-3 px-4 text-gray-700 font-medium hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors"
                  >
                    <EditableKeyText textKey={link.key} fallback={link.name} as="span" />
                  </motion.a>
                ))}
                <motion.a
                  href="tel:723179982"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold mt-4"
                >
                  <Phone className="w-4 h-4" />
                  <EditableKeyText textKey="navbar.cta" fallback="Umów wizytę" as="span" />
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
