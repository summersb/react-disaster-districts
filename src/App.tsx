import AddMember from './pages/members/AddMember'
import EditMember from './pages/members/EditMember'
import MapDisplay from './pages/map/MapDisplay'
import useAuth from '@/hooks/useAuth'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/nav/Layout'
import Districts from './pages/districts/Districts'
import Home from './pages/home/Home'
import RequireAuth from './components/RequireAuth'
import Login from './pages/home/Login'
import { auth } from '@/api'
import React, { useEffect } from 'react'
import MemberList from './pages/members/MemberList'
import Settings from './pages/settings/Settings'
import UploadMembers from './pages/members/UploadMembers'
import AddDistrict from '@/pages/districts/AddDistrict'
import EditDistrict from '@/pages/districts/EditDistrict'
import PrintAllDistricts from '@/pages/districts/PrintAllDistricts.tsx'
import ShowOneDistrictMap from '@/pages/districts/ShowOneDistrictMap.tsx'

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
          <Route path="adddistrict" element={<AddDistrict />} />
          <Route path="district/:districtId" element={<EditDistrict />} />
          <Route path="viewdistrict/:districtId" element={<ShowOneDistrictMap />} />
          <Route path="printdistrict" element={<PrintAllDistricts />} />
          <Route path="members" element={<MemberList />} />
          <Route path="addmember" element={<AddMember />} />
          <Route path="editmember/:memberId" element={<EditMember />} />
          <Route path="upload" element={<UploadMembers />} />
          <Route path="map" element={<div className="h-screen"><MapDisplay showLabel={false} /></div>} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
