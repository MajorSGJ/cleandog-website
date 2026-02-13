import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Heart, Facebook, Instagram } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableImage from '../admin/inline/EditableImage'
import EditableKeyText from '../admin/inline/EditableKeyText'

const Footer = () => {
  const { data, updateNestedData } = useData()
  const siteInfo = data.siteInfo
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Strona główna', href: '#home' },
    { name: 'O nas', href: '#about' },
    { name: 'Usługi', href: '#services' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Lokalizacje', href: '#locations' },
    { name: 'Kontakt', href: '#contact' },
  ]

  const services = data.services.map(s => s.title)

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <EditableImage
                src={siteInfo.logo}
                alt={`${siteInfo.name} Logo`}
                wrapperClassName="relative"
                className="h-12 w-12 object-cover rounded-full"
                onSave={(next) => updateNestedData('siteInfo', 'logo', next)}
              />
              <div>
                <h3 className="text-xl font-bold">
                  <EditableText
                    value={siteInfo.name}
                    onSave={(next) => updateNestedData('siteInfo', 'name', next)}
                    as="span"
                  />
                </h3>
                <p className="text-gray-400 text-sm">
                  <EditableText
                    value={siteInfo.tagline}
                    onSave={(next) => updateNestedData('siteInfo', 'tagline', next)}
                    as="span"
                  />
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              <EditableKeyText
                textKey="footer.brand.description"
                fallback="Profesjonalny salon groomerski Dari Wiśniewskiej. Dbamy o Twojego pupila z miłością i profesjonalizmem."
                as="span"
                multiline
              />
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              <motion.a
                href={siteInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={siteInfo.instagram || '#'}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              <EditableKeyText textKey="footer.quickLinks.title" fallback="Szybkie linki" as="span" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <EditableKeyText textKey={`footer.link.${link.href.replace('#', '')}`} fallback={link.name} as="span" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              <EditableKeyText textKey="footer.services.title" fallback="Usługi" as="span" />
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400 inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              <EditableKeyText textKey="footer.contact.title" fallback="Kontakt" as="span" />
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-primary-400 transition-colors group"
                >
                  <Phone className="w-5 h-5 mt-0.5 text-primary-500" />
                  <div>
                    <p className="font-medium text-white group-hover:text-primary-400">
                      <EditableText
                        value={siteInfo.phone}
                        onSave={(next) => updateNestedData('siteInfo', 'phone', next)}
                        as="span"
                      />
                    </p>
                    <p className="text-sm">
                      <EditableKeyText textKey="footer.contact.callHint" fallback="Zadzwoń do nas" as="span" />
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="flex items-start gap-3 text-gray-400 hover:text-primary-400 transition-colors group"
                >
                  <Mail className="w-5 h-5 mt-0.5 text-primary-500" />
                  <div>
                    <p className="font-medium text-white group-hover:text-primary-400">
                      <EditableText
                        value={siteInfo.email}
                        onSave={(next) => updateNestedData('siteInfo', 'email', next)}
                        as="span"
                      />
                    </p>
                    <p className="text-sm">
                      <EditableKeyText textKey="footer.contact.mailHint" fallback="Napisz do nas" as="span" />
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary-500" />
                  <div>
                    <p className="font-medium text-white">
                      <EditableKeyText textKey="footer.contact.address1" fallback="ul. Narutowicza 28a" as="span" />
                    </p>
                    <p className="text-sm">
                      <EditableKeyText textKey="footer.contact.address2" fallback="13-300 Nowe Miasto Lubawskie" as="span" />
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear}{' '}
              <EditableKeyText textKey="footer.bottom.copyright" fallback="Clean Dog - Salon Groomerski. Wszelkie prawa zastrzeżone." as="span" />
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <EditableKeyText textKey="footer.bottom.madeWith" fallback="Stworzone z" as="span" />
              <Heart className="w-4 h-4 text-primary-500 fill-primary-500" />
              <EditableKeyText textKey="footer.bottom.for" fallback="dla zwierząt" as="span" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
