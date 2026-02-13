import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Eye, LogOut, Settings, Download, X, ChevronUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

const AdminToolbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const { editMode, setEditMode, exportData } = useData()
  const [minimized, setMinimized] = useState(false)

  const handleLogout = () => {
    setEditMode(false)
    logout()
  }

  if (!isAuthenticated) return null

  if (minimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gray-900 text-white rounded-full shadow-2xl px-2 py-1.5 flex items-center gap-1">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors ${
            editMode
              ? 'bg-primary-500 text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {editMode ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
          {editMode ? 'Podgląd' : 'Edytuj'}
        </button>

        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Panel</span>
        </Link>

        <button
          onClick={exportData}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Backup</span>
        </button>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>

        <button
          onClick={() => setMinimized(true)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

export default AdminToolbar
