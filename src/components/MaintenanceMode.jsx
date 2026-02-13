import { motion } from 'framer-motion'
import { Wrench, Phone, Mail } from 'lucide-react'
import { useData } from '../context/DataContext'

const MaintenanceMode = () => {
  const { data } = useData()
  const siteInfo = data.siteInfo
  
  console.log('🔧 MaintenanceMode component rendered!', { siteInfo })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 mb-8"
        >
          <Wrench className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Strona w trakcie budowy
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Pracujemy nad ulepszeniami naszej strony. Wrócimy wkrótce!
        </p>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Skontaktuj się z nami
          </h2>
          
          <div className="space-y-4">
            <a
              href={`tel:${siteInfo.phone.replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group"
            >
              <Phone className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
              <span className="text-white font-medium">{siteInfo.phone}</span>
            </a>

            <a
              href={`mailto:${siteInfo.email}`}
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors group"
            >
              <Mail className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
              <span className="text-white font-medium">{siteInfo.email}</span>
            </a>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} {siteInfo.name} - {siteInfo.tagline}
        </p>
      </motion.div>
    </div>
  )
}

export default MaintenanceMode
