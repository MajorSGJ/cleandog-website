import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableImage from '../admin/inline/EditableImage'
import EditableKeyText from '../admin/inline/EditableKeyText'

const Locations = () => {
  const { data, updateLocation } = useData()
  const locations = data.locations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="locations" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 paw-pattern opacity-50" />
      
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
            <MapPin className="w-4 h-4" />
            <EditableKeyText textKey="locations.badge" fallback="Nasze lokalizacje" as="span" />
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <EditableKeyText textKey="locations.title.line1" fallback="Odwiedź nas w" as="span" />
            <br />
            <span className="gradient-text">
              <EditableKeyText textKey="locations.title.line2" fallback="dwóch lokalizacjach" as="span" />
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            <EditableKeyText
              textKey="locations.description"
              fallback="Działamy w Nowym Mieście Lubawskim oraz w Iławie (Dom Handlowy Feniks). Wybierz najbliższą lokalizację i umów się na wizytę!"
              as="span"
              multiline
            />
          </p>
        </motion.div>

        {/* Locations grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border ${
                location.isPrimary ? 'border-primary-200' : 'border-gray-100'
              }`}
            >
              {/* Primary badge */}
              {location.isPrimary && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <EditableKeyText textKey="locations.primaryBadge" fallback="Główny salon" as="span" />
                </div>
              )}

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <EditableImage
                  src={location.image}
                  alt={location.name}
                  wrapperClassName="relative"
                  className="w-full h-full object-cover"
                  onSave={(next) => updateLocation(location.id, { image: next })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">
                    <EditableText
                      value={location.name}
                      onSave={(next) => updateLocation(location.id, { name: next })}
                      as="span"
                    />
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      <EditableText
                        value={location.address}
                        onSave={(next) => updateLocation(location.id, { address: next })}
                        as="span"
                      />
                    </p>
                    <p className="text-gray-500">
                      <EditableText
                        value={location.city}
                        onSave={(next) => updateLocation(location.id, { city: next })}
                        as="span"
                      />
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      <EditableText
                        value={location.phone}
                        onSave={(next) => updateLocation(location.id, { phone: next })}
                        as="span"
                      />
                    </p>
                    <p className="text-gray-500">Zadzwoń, aby umówić wizytę</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">Godziny otwarcia</p>
                    <div className="space-y-1">
                      {location.hours.map((hour, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            <EditableText
                              value={hour.day}
                              onSave={(next) => {
                                const nextHours = [...location.hours]
                                nextHours[idx] = { ...nextHours[idx], day: next }
                                updateLocation(location.id, { hours: nextHours })
                              }}
                              as="span"
                            />
                          </span>
                          <span className={`font-medium ${hour.time === 'Zamknięte' ? 'text-red-500' : 'text-gray-900'}`}>
                            <EditableText
                              value={hour.time}
                              onSave={(next) => {
                                const nextHours = [...location.hours]
                                nextHours[idx] = { ...nextHours[idx], time: next }
                                updateLocation(location.id, { hours: nextHours })
                              }}
                              as="span"
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.a
                    href={`tel:${location.phone.replace(/\s/g, '')}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-300/30 transition-all btn-shine"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Phone className="w-4 h-4" />
                    Zadzwoń
                  </motion.a>
                  
                  <motion.a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Navigation className="w-4 h-4" />
                    Mapa
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map embeds */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl overflow-hidden shadow-xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2386.536666751284!2d19.5936893!3d53.423985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471d448c7e303ca9%3A0x7396788225586617!2sul.%20Narutowicza%2028A%2C%2013-300%20Nowe%20Miasto%20Lubawskie!5e0!3m2!1spl!2spl!4v1699999999999!5m2!1spl!2spl"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clean Dog - Nowe Miasto Lubawskie"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-3xl overflow-hidden shadow-xl"
          >
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.1172151628174!2d19.5606679!3d53.5925827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471d331980862029%3A0x5a1955745422718e!2sNiepodleg%C5%82o%C5%9Bci%202%2C%2014-200%20I%C5%82awa!5e0!3m2!1spl!2spl!4v1708900000000!5m2!1spl!2spl"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clean Dog - Iława"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Locations
