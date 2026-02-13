import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon,
  FileText, 
  MapPin, 
  Settings,
  LogOut,
  Save,
  RotateCcw,
  Download,
  Upload,
  Menu,
  X,
  Home,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import GalleryManager from './sections/GalleryManager'
import ContentEditor from './sections/ContentEditor'
import LocationsEditor from './sections/LocationsEditor'
import SiteSettings from './sections/SiteSettings'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('gallery')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const { logout } = useAuth()
  const { hasChanges, exportData, resetToDefault, importData } = useData()

  const tabs = [
    { id: 'gallery', label: 'Galeria', icon: ImageIcon, color: 'from-pink-500 to-rose-500' },
    { id: 'content', label: 'Treści', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { id: 'locations', label: 'Lokalizacje', icon: MapPin, color: 'from-emerald-500 to-teal-500' },
    { id: 'settings', label: 'Ustawienia', icon: Settings, color: 'from-violet-500 to-purple-500' },
  ]

  const handleExport = () => {
    exportData()
    showSuccessNotification('Dane zostały wyeksportowane!')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (file) {
        const text = await file.text()
        const result = importData(text)
        if (result.success) {
          showSuccessNotification('Dane zostały zaimportowane!')
        } else {
          alert(result.error)
        }
      }
    }
    input.click()
  }

  const handleReset = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia? Wszystkie zmiany zostaną utracone.')) {
      resetToDefault()
      showSuccessNotification('Przywrócono ustawienia domyślne')
    }
  }

  const showSuccessNotification = (message) => {
    setShowNotification(message)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        return <GalleryManager onSuccess={showSuccessNotification} />
      case 'content':
        return <ContentEditor onSuccess={showSuccessNotification} />
      case 'locations':
        return <LocationsEditor onSuccess={showSuccessNotification} />
      case 'settings':
        return <SiteSettings onSuccess={showSuccessNotification} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed lg:relative z-40 w-72 h-screen bg-gray-900 text-white flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold">Clean Dog</h1>
                  <p className="text-xs text-gray-400">Panel Admina</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tab.color}`}>
                    <tab.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Quick Actions */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Eksportuj dane
              </button>
              <button
                onClick={handleImport}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importuj dane
              </button>
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Resetuj do domyślnych
              </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Wyloguj się</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">
                Zarządzaj zawartością strony
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full"
              >
                Niezapisane zmiany
              </motion.span>
            )}
            
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Podgląd strony</span>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Save className="w-4 h-4" />
            </div>
            <span>{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard
