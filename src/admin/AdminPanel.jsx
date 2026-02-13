import { useAuth } from '../context/AuthContext'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const AdminContent = () => {
  const { isAuthenticated } = useAuth()
  
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />
}

const AdminPanel = () => {
  return <AdminContent />
}

export default AdminPanel
