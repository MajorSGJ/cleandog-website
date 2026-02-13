import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Image as ImageIcon,
  Building,
  Save
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const LocationsEditor = ({ onSuccess }) => {
  const { data, updateLocation } = useData()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Zarządzanie Lokalizacjami</h3>
        <p className="text-sm text-gray-500">Edytuj dane kontaktowe i godziny otwarcia salonów</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {data.locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onUpdate={(updates) => {
              updateLocation(location.id, updates)
              onSuccess('Lokalizacja została zaktualizowana')
            }}
          />
        ))}
      </div>
    </div>
  )
}

const LocationCard = ({ location, onUpdate }) => {
  const [localData, setLocalData] = useState(location)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalData(location)
    setHasChanges(false)
  }, [location])

  const handleChange = (key, value) => {
    setLocalData({ ...localData, [key]: value })
    setHasChanges(true)
  }

  const handleHoursChange = (index, field, value) => {
    const newHours = [...localData.hours]
    newHours[index] = { ...newHours[index], [field]: value }
    setLocalData({ ...localData, hours: newHours })
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdate(localData)
    setHasChanges(false)
  }

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
        location.isPrimary ? 'ring-2 ring-primary-500' : ''
      }`}
      layout
    >
      {/* Header with image */}
      <div className="relative h-40">
        <img
          src={localData.image}
          alt={localData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            {location.isPrimary && (
              <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Główny salon
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4" />
            Nazwa lokalizacji
          </label>
          <input
            type="text"
            value={localData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4" />
            Adres
          </label>
          <input
            type="text"
            value={localData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
            placeholder="Ulica i numer"
          />
          <input
            type="text"
            value={localData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Kod i miasto"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4" />
            Telefon
          </label>
          <input
            type="tel"
            value={localData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Hours */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4" />
            Godziny otwarcia
          </label>
          <div className="space-y-2">
            {localData.hours.map((hour, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={hour.day}
                  onChange={(e) => handleHoursChange(index, 'day', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Dzień"
                />
                <input
                  type="text"
                  value={hour.time}
                  onChange={(e) => handleHoursChange(index, 'time', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Godziny"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ImageIcon className="w-4 h-4" />
            URL zdjęcia
          </label>
          <input
            type="url"
            value={localData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Save button */}
        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg"
          >
            <Save className="w-4 h-4" />
            Zapisz zmiany
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default LocationsEditor
