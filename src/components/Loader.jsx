import { motion } from 'framer-motion'
import { Scissors } from 'lucide-react'

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-300/50">
            <Scissors className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold gradient-text mb-2"
        >
          Clean Dog
        </motion.h2>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 rounded-full max-w-[200px] mx-auto"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-500 text-sm"
        >
          Salon Groomerski
        </motion.p>
      </div>
    </motion.div>
  )
}

export default Loader
