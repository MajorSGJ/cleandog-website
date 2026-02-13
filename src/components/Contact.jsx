import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, Heart } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableKeyText from '../admin/inline/EditableKeyText'
import { sanitizeInput, isValidEmail, isValidPhone, RateLimiter } from '../utils/security'

const Contact = () => {
  const { data, updateNestedData, updateData, getText } = useData()
  const siteInfo = data.siteInfo
  const primaryLocation = data.locations?.find(l => l.isPrimary) || data.locations?.[0]
  const rateLimiter = useMemo(() => new RateLimiter(3, 60000), [])
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    // Rate limiting check
    if (!rateLimiter.canAttempt()) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime() / 1000)
      setSubmitError(`Zbyt wiele prób. Spróbuj ponownie za ${remainingTime} sekund.`)
      return
    }

    // Validate inputs
    if (!isValidEmail(formData.email)) {
      setSubmitError('Podaj prawidłowy adres email.')
      return
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      setSubmitError('Podaj prawidłowy numer telefonu.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        message: sanitizeInput(formData.message)
      }

      // Send email using server-side proxy
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(sanitizedData)
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        setSubmitError('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.')
      }
    } catch (error) {
      setSubmitError('Nie udało się wysłać wiadomości. Sprawdź połączenie internetowe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      href: `tel:${siteInfo.phone.replace(/\s/g, '')}`,
      valueNode: (
        <EditableText
          value={siteInfo.phone}
          onSave={(next) => updateNestedData('siteInfo', 'phone', next)}
          as="span"
        />
      ),
      description: 'Zadzwoń, aby umówić wizytę',
    },
    {
      icon: Mail,
      title: 'Email',
      href: `mailto:${siteInfo.email}`,
      valueNode: (
        <EditableText
          value={siteInfo.email}
          onSave={(next) => updateNestedData('siteInfo', 'email', next)}
          as="span"
        />
      ),
      description: 'Napisz do nas',
    },
    {
      icon: MapPin,
      title: 'Adres',
      href: '#locations',
      valueNode: (
        <EditableText
          value={primaryLocation?.address || 'ul. Narutowicza 28a'}
          onSave={(next) => {
            if (!primaryLocation) return
            const nextLocations = data.locations.map((l) =>
              l.id === primaryLocation.id ? { ...l, address: next } : l
            )
            updateData('locations', nextLocations)
          }}
          as="span"
        />
      ),
      description: primaryLocation?.city || 'Nowe Miasto Lubawskie',
    },
    {
      icon: Clock,
      title: 'Godziny',
      href: '#locations',
      valueNode: (
        <span>Codziennie indywidualnie</span>
      ),
      description: 'Umów się telefonicznie',
    },
  ]

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-primary-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary-500 font-semibold text-sm uppercase tracking-wider mb-4">
            <MessageCircle className="w-4 h-4" />
            <EditableKeyText textKey="contact.badge" fallback="Kontakt" as="span" />
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <EditableKeyText textKey="contact.title.line1" fallback="Skontaktuj się" as="span" />
            <br />
            <span className="gradient-text">
              <EditableKeyText textKey="contact.title.line2" fallback="z nami" as="span" />
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            <EditableKeyText
              textKey="contact.description"
              fallback="Masz pytania lub chcesz umówić wizytę? Skontaktuj się z nami telefonicznie lub wyślij wiadomość. Odpowiemy najszybciej jak to możliwe!"
              as="span"
              multiline
            />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-primary-600 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-primary-600 font-medium mb-1">{item.valueNode}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    <EditableKeyText textKey="contact.social.title" fallback="Dołącz do grona zadowolonych klientów!" as="span" />
                  </h3>
                  <p className="text-primary-100">
                    <EditableKeyText
                      textKey="contact.social.subtitle"
                      fallback="Profesjonalna pielęgnacja i metamorfozy na najwyższym poziomie"
                      as="span"
                      multiline
                    />
                  </p>
                </div>
              </div>
              
              <p className="text-primary-100 leading-relaxed">
                <EditableKeyText
                  textKey="contact.social.body"
                  fallback="W Clean Dog każdy pupil jest traktowany z miłością i profesjonalizmem. Zaufaj doświadczeniu Dari Wiśniewskiej i umów wizytę już dziś!"
                  as="span"
                  multiline
                />
              </p>

              <motion.a
                href="tel:723179982"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-full font-semibold mt-6 hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5" />
                <EditableKeyText textKey="contact.social.cta" fallback="Zadzwoń teraz" as="span" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              <EditableKeyText textKey="contact.form.title" fallback="Wyślij wiadomość" as="span" />
            </h3>
            <p className="text-gray-500 mb-8">
              <EditableKeyText
                textKey="contact.form.subtitle"
                fallback="Wypełnij formularz, a odezwiemy się do Ciebie"
                as="span"
                multiline
              />
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  <EditableKeyText textKey="contact.form.sentTitle" fallback="Wiadomość wysłana!" as="span" />
                </h4>
                <p className="text-gray-500">
                  <EditableKeyText
                    textKey="contact.form.sentBody"
                    fallback="Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe."
                    as="span"
                    multiline
                  />
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <EditableKeyText textKey="contact.form.name.label" fallback="Imię i nazwisko" as="span" />
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                    placeholder={siteInfo.name}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <EditableKeyText textKey="contact.form.email.label" fallback="Email" as="span" />
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                      placeholder={siteInfo.email}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <EditableKeyText textKey="contact.form.phone.label" fallback="Telefon" as="span" />
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all outline-none"
                      placeholder={siteInfo.phone}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    <EditableKeyText textKey="contact.form.message.label" fallback="Wiadomość" as="span" />
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all outline-none resize-none"
                    placeholder={getText('contact.form.message.placeholder', 'Opisz, w czym możemy Ci pomóc...')}
                  />
                </div>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
                  >
                    {submitError}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary-300/30 hover:shadow-primary-400/40 transition-all btn-shine disabled:opacity-70"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <EditableKeyText textKey="contact.form.sending" fallback="Wysyłanie..." as="span" />
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <EditableKeyText textKey="contact.form.submit" fallback="Wyślij wiadomość" as="span" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
