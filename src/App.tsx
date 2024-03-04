import AddMember from './pages/members/AddMember'
import MapDisplay from './pages/map/MapDisplay'
import useAuth from '@/hooks/useAuth'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/nav/Layout'
import Districts from './pages/districts/Districts'
import Home from './pages/home/Home'
import RequireAuth from './components/RequireAuth'
import Login from './pages/home/Login'
import { auth } from '@/api'
import { useEffect } from 'react'
import MemberList from './pages/members/MemberList'
import Settings from './pages/settings/Settings'

function App() {
  const { setUser } = useAuth()

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser({ name: user.displayName, photoURL: user.photoURL })
      } else {
        setUser({})
      }
    })
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="districts" element={<Districts />} />
          <Route path="members" element={<MemberList />} />
          <Route path="addmember" element={<AddMember />} />
          <Route path="map" element={<MapDisplay />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
