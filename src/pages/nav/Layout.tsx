import useAuth from '@/hooks/useAuth'
import { Outlet } from 'react-router-dom'
import Login from '../home/Login'
import Sidebar from '@/pages/nav/Sidebar.tsx'

const Layout = () => {
  const { user } = useAuth()

  return (
    <div className="h-screen print:h-auto">
      <div className="bg-gray-800 text-white w-64 p-2 fixed top-0 left-0 bottom-0 overflow-y-auto print:hidden">
        <Sidebar />
      </div>
      <main className="bg-gray-900 overflow-y-auto p-4 ml-64 print:w-full print:ml-0 print:p-0">
        {user?.name ? <Outlet /> : <Login />}
      </main>
    </div>
  )
}

export default Layout
