import useAuth from '@/hooks/useAuth'
import { Outlet } from 'react-router-dom'
import Login from '../home/Login'
import Sidebar from '@/components/Sidebar'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-64 p-2 fixed top-0 left-0 bottom-0 overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 bg-gray-900 overflow-y-auto p-4 ml-64">
        {user?.name ? <Outlet /> : <Login />}
      </main>
    </div>
  )
}

export default Layout
