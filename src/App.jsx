import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { DataProvider, useData } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Locations from './components/Locations'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Loader from './components/Loader'
import MaintenanceMode from './components/MaintenanceMode'
import SEO from './components/SEO'
import AdminPanel from './admin/AdminPanel'
import AdminToolbar from './admin/inline/AdminToolbar'

const MainSite = () => {
  const [loading, setLoading] = useState(true)
  const { data, loaded } = useData()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const isMaintenanceMode = data?.siteInfo?.maintenanceMode === true

  if (!loading && loaded && isMaintenanceMode && !isAuthenticated) {
    return <MaintenanceMode />
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SEO />
          <AdminToolbar />
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Locations />
            <Contact />
          </main>
          <Footer />
          <ScrollToTop />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainSite />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
