import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Heart, Award, Shield, Sparkles } from 'lucide-react'
import { useData } from '../context/DataContext'
import EditableText from '../admin/inline/EditableText'
import EditableImage from '../admin/inline/EditableImage'
import EditableKeyText from '../admin/inline/EditableKeyText'

const iconMap = { Heart, Award, Shield, Sparkles }

const About = () => {
  const { data, updateNestedData } = useData()
  const about = data.about
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = about.features.map(f => ({
    ...f,
    icon: iconMap[f.icon] || Heart
  }))

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-primary-50/30 paw-pattern">
      <div className="max-w-7xl mx-auto px-4">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main image - salon interior */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary-200/50">
                <EditableImage
                  src={about.image}
                  alt="Salon Clean Dog"
                  wrapperClassName="relative"
                  className="w-full h-[500px] object-cover"
                  onSave={(next) => updateNestedData('about', 'image', next)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent" />
              </div>

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      <EditableKeyText textKey="about.floating.number" fallback="2+ lata" as="span" />
                    </div>
                    <div className="text-gray-500">
                      <EditableKeyText textKey="about.floating.label" fallback="doświadczenia" as="span" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative element */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-200 rounded-full opacity-50 blur-xl" />
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-wider mb-4">
              <EditableKeyText textKey="about.badge" fallback="O nas" as="span" />
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              <EditableText
                value={about.title}
                onSave={(next) => updateNestedData('about', 'title', next)}
                as="span"
              />
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              <EditableText
                value={about.description1}
                onSave={(next) => updateNestedData('about', 'description1', next)}
                as="span"
                multiline
              />
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              <EditableText
                value={about.description2}
                onSave={(next) => updateNestedData('about', 'description2', next)}
                as="span"
                multiline
              />
            </p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-primary-400 group-hover:to-primary-600 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      <EditableText
                        value={feature.title}
                        onSave={(next) => {
                          const nextFeatures = [...about.features]
                          nextFeatures[index] = { ...nextFeatures[index], title: next }
                          updateNestedData('about', 'features', nextFeatures)
                        }}
                        as="span"
                      />
                    </h3>
                    <p className="text-sm text-gray-500">
                      <EditableText
                        value={feature.description}
                        onSave={(next) => {
                          const nextFeatures = [...about.features]
                          nextFeatures[index] = { ...nextFeatures[index], description: next }
                          updateNestedData('about', 'features', nextFeatures)
                        }}
                        as="span"
                        multiline
                      />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
