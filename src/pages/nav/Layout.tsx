import useAuth from '@/hooks/useAuth'
import { Outlet } from 'react-router-dom'
import Login from '../home/Login'
import Sidebar from '@/components/Sidebar'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="flex items-start justify-between">
      <Sidebar />
      <main className="w-full h-full">
        {user?.name ? <Outlet /> : <Login />}
      </main>
    </div>
  )
}

export default Layout
