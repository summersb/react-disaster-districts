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
import React, { Suspense, useEffect } from 'react'
import MemberList from './pages/members/MemberList'
import Settings from './pages/settings/Settings'
import UploadMembers from './pages/members/UploadMembers'
import AddDistrict from '@/pages/districts/AddDistrict'
import EditDistrict from '@/pages/districts/EditDistrict'
import ShowOneDistrictMap from '@/pages/districts/ShowOneDistrictMap.tsx'
import WardAdmin from '@/pages/home/WardAdmin.tsx'
import { loadDefaultWard } from '@/api/wardApi.ts'
import { useLocalStorageState } from '@/hooks/useLocalStorageState.tsx'
import { WardConfig } from '@/type/Ward.ts'

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'))
const PrintAllDistricts = React.lazy(
  () => import('@/pages/districts/PrintAllDistricts.tsx'),
)
const PrintDistrict = React.lazy(
  () => import('@/pages/districts/PrintDistrict.tsx'),
)

function App(): React.ReactElement {
  const [, setActiveWard] = useLocalStorageState<WardConfig>('ward', undefined)
  const { setUser } = useAuth()

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user != null) {
        setUser({
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
        })
        const wardConfig = await loadDefaultWard(user.uid)
        setActiveWard(wardConfig)
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
          <Route
            path="admin"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="districts" element={<Districts />} />
          <Route path="adddistrict" element={<AddDistrict />} />
          <Route path="district/:districtId" element={<EditDistrict />} />
          <Route
            path="printdistrict/:districtId"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrintDistrict />
              </Suspense>
            }
          />
          <Route
            path="viewdistrict/:districtId"
            element={<ShowOneDistrictMap />}
          />
          <Route
            path="printdistricts"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PrintAllDistricts />
              </Suspense>
            }
          />
          <Route path="members" element={<MemberList />} />
          <Route path="addmember" element={<AddMember />} />
          <Route path="editmember/:memberId" element={<EditMember />} />
          <Route path="upload" element={<UploadMembers />} />
          <Route
            path="map"
            element={
              <div className="h-screen">
                <MapDisplay showLabel={false} />
              </div>
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="/" element={<WardAdmin />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
