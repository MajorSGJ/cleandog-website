import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Type, 
  FileText, 
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Home,
  Info
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const ContentEditor = ({ onSuccess }) => {
  const { data, updateData, updateNestedData } = useData()
  const [expandedSection, setExpandedSection] = useState('hero')

  const sections = [
    { id: 'hero', label: 'Sekcja Hero (Główna)', icon: Home },
    { id: 'about', label: 'O Nas', icon: Info },
  ]

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Edycja Treści</h3>
        <p className="text-sm text-gray-500">Edytuj teksty i opisy na stronie w czasie rzeczywistym</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            layout
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-semibold text-gray-900">{section.label}</span>
              </div>
              {expandedSection === section.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSection === section.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-6 space-y-4"
              >
                {section.id === 'hero' && (
                  <HeroEditor data={data.hero} onChange={(newData) => updateData('hero', newData)} onSuccess={onSuccess} />
                )}
                {section.id === 'about' && (
                  <AboutEditor data={data.about} onChange={(newData) => updateData('about', newData)} onSuccess={onSuccess} />
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats Editor */}
      <motion.div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          Statystyki (Hero)
        </h4>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {data.hero.stats.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 mb-1">Liczba</label>
              <input
                type="text"
                value={stat.number}
                onChange={(e) => {
                  const newStats = [...data.hero.stats]
                  newStats[index] = { ...stat, number: e.target.value }
                  updateNestedData('hero', 'stats', newStats)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold"
              />
              
              <label className="block text-xs font-medium text-gray-500 mb-1 mt-3">Etykieta</label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...data.hero.stats]
                  newStats[index] = { ...stat, label: e.target.value }
                  updateNestedData('hero', 'stats', newStats)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const HeroEditor = ({ data, onChange, onSuccess }) => {
  const [localData, setLocalData] = useState(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key, value) => {
    const newData = { ...localData, [key]: value }
    setLocalData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Type className="w-4 h-4 inline mr-2" />
          Podtytuł (badge)
        </label>
        <input
          type="text"
          value={localData.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-2" />
          Opis główny
        </label>
        <textarea
          value={localData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>
    </div>
  )
}

const AboutEditor = ({ data, onChange, onSuccess }) => {
  const [localData, setLocalData] = useState(data)

  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (key, value) => {
    const newData = { ...localData, [key]: value }
    setLocalData(newData)
    onChange(newData)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł sekcji</label>
        <input
          type="text"
          value={localData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Opis 1 (główny)</label>
        <textarea
          value={localData.description1}
          onChange={(e) => handleChange('description1', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Opis 2 (lokalizacje)</label>
        <textarea
          value={localData.description2}
          onChange={(e) => handleChange('description2', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL zdjęcia sekcji</label>
        <input
          type="url"
          value={localData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {localData.image && (
          <img
            src={localData.image}
            alt="Podgląd"
            className="mt-2 w-full h-32 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="pt-4 border-t">
        <h5 className="font-medium text-gray-900 mb-3">Cechy salonu</h5>
        <div className="grid sm:grid-cols-2 gap-3">
          {localData.features?.map((feature, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-xl">
              <input
                type="text"
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...localData.features]
                  newFeatures[index] = { ...feature, title: e.target.value }
                  handleChange('features', newFeatures)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium mb-2"
                placeholder="Tytuł"
              />
              <input
                type="text"
                value={feature.description}
                onChange={(e) => {
                  const newFeatures = [...localData.features]
                  newFeatures[index] = { ...feature, description: e.target.value }
                  handleChange('features', newFeatures)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                placeholder="Opis"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
