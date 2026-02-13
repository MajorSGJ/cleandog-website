import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Scissors, Bath, Stethoscope, Brush, Heart, Sparkles, Star } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableKeyText from '../admin/inline/EditableKeyText'

const Services = () => {
  const { data, updateService } = useData()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const iconMap = { Scissors, Bath, Brush, Stethoscope, Heart }
  const services = data.services.map((s) => ({
    ...s,
    icon: iconMap[s.icon] || Scissors,
  }))

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />

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
            <Star className="w-4 h-4 fill-primary-400" />
            <EditableKeyText textKey="services.badge" fallback="Nasze usługi" as="span" />
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <EditableKeyText textKey="services.title.line1" fallback="Profesjonalna pielęgnacja" as="span" />
            <br />
            <span className="gradient-text">
              <EditableKeyText textKey="services.title.line2" fallback="dla Twojego pupila" as="span" />
            </span>
          </h2>
          
          <p className="text-lg text-gray-600">
            <EditableKeyText
              textKey="services.description"
              fallback="Oferujemy szeroki zakres usług groomerskich, dostosowanych do indywidualnych potrzeb każdego czworonoga. Zaufaj profesjonalistom!"
              as="span"
              multiline
            />
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 hover-card border border-gray-100"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                <EditableText
                  value={service.title}
                  onSave={(next) => updateService(service.id, { title: next })}
                  as="span"
                />
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                <EditableText
                  value={service.description}
                  onSave={(next) => updateService(service.id, { description: next })}
                  as="span"
                  multiline
                />
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    <EditableText
                      value={feature}
                      onSave={(next) => {
                        const nextFeatures = [...service.features]
                        nextFeatures[idx] = next
                        updateService(service.id, { features: nextFeatures })
                      }}
                      as="span"
                    />
                  </li>
                ))}
              </ul>

              {/* Hover decoration */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-6 h-6 text-primary-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Masz pytania dotyczące naszych usług? Skontaktuj się z nami!
          </p>
          <motion.a
            href="tel:723179982"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-primary-300/30 hover:shadow-primary-400/40 transition-all btn-shine"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Zadzwoń: 723 179 982
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
