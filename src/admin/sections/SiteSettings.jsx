import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Phone, 
  Mail, 
  Facebook,
  Instagram,
  Image as ImageIcon,
  User,
  Calendar,
  Save,
  Key,
  Shield,
  Wrench
} from 'lucide-react'
import { useData } from '../../context/DataContext'

const SiteSettings = ({ onSuccess }) => {
  const { data, updateData } = useData()
  const [localData, setLocalData] = useState(data.siteInfo)
  const [hasChanges, setHasChanges] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  useEffect(() => {
    setLocalData(data.siteInfo)
    setHasChanges(false)
  }, [data.siteInfo])

  const handleChange = (key, value) => {
    setLocalData({ ...localData, [key]: value })
    setHasChanges(true)
  }

  const handleSave = () => {
    updateData('siteInfo', localData)
    setHasChanges(false)
    onSuccess('Ustawienia zostały zapisane')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Ustawienia Strony</h3>
        <p className="text-sm text-gray-500">Podstawowe informacje o firmie i dane kontaktowe</p>
      </div>

      {/* Maintenance Mode Toggle */}
      <motion.div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Tryb konserwacji</h4>
              <p className="text-sm text-gray-600">Gdy włączony, strona wyświetla komunikat "w trakcie budowy"</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localData.maintenanceMode || false}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            Informacje podstawowe
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa firmy</label>
              <input
                type="text"
                value={localData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
              <input
                type="text"
                value={localData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Właściciel
              </label>
              <input
                type="text"
                value={localData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Rok otwarcia
              </label>
              <input
                type="number"
                value={localData.openingYear}
                onChange={(e) => handleChange('openingYear', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary-500" />
            Dane kontaktowe
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefon
              </label>
              <input
                type="tel"
                value={localData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={localData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="w-4 h-4 inline mr-2" />
                Facebook
              </label>
              <input
                type="url"
                value={localData.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="w-4 h-4 inline mr-2" />
                Instagram
              </label>
              <input
                type="url"
                value={localData.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Web3Forms Access Key
              </label>
              <input
                type="text"
                value={localData.web3formsKey || ''}
                onChange={(e) => handleChange('web3formsKey', e.target.value)}
                placeholder="Wklej klucz API z web3forms.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Potrzebne do działania formularza kontaktowego. Zarejestruj się na web3forms.com</p>
            </div>
          </div>
        </motion.div>

        {/* Branding */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary-500" />
            Branding
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Logo</label>
              <input
                type="url"
                value={localData.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {localData.logo && (
                <div className="mt-2 p-4 bg-gray-100 rounded-xl flex items-center justify-center">
                  <img src={localData.logo} alt="Logo" className="h-16 w-16 object-cover rounded-full" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Banera</label>
              <input
                type="url"
                value={localData.banner}
                onChange={(e) => handleChange('banner', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {localData.banner && (
                <div className="mt-2">
                  <img src={localData.banner} alt="Banner" className="w-full h-24 object-cover rounded-xl" />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            Bezpieczeństwo
          </h4>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Dane logowania:</strong><br />
                Login: <code className="bg-amber-100 px-1 rounded">admin</code><br />
                Hasło: <code className="bg-amber-100 px-1 rounded">LU**%&d3</code>
              </p>
              <p className="text-xs text-amber-600 mt-2">
                Hasło jest zahashowane SHA-256. Aby zmienić, edytuj <code>src/data/defaultData.js</code>
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Backup danych:</strong><br />
                Wszystkie zmiany są zapisywane na serwerze i widoczne dla każdego użytkownika.
                Zalecamy regularny eksport danych do pliku JSON.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save button */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6"
        >
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all"
          >
            <Save className="w-5 h-5" />
            Zapisz ustawienia
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default SiteSettings
