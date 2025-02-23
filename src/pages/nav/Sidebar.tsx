import React from 'react'
import {
  HardDriveUpload,
  Map,
  Rows3,
  School,
  School2,
  Settings,
  User,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx'
import useAuth from '@/hooks/useAuth.tsx'
import { useLocalStorageState } from '@/hooks/useLocalStorageState.tsx'
import { WardConfig } from '@/type/Ward.ts'
import { Button } from '@/components/ui/button'
import { auth, signOut } from '@/api/firebase.ts'

const Sidebar = (): React.ReactElement => {
  const { user } = useAuth()
  const [wardDoc] = useLocalStorageState<WardConfig>('ward', undefined)

  const logout = async () => {
    try {
      await signOut(auth)
      console.log('User logged out successfully')
    } catch (error) {
      console.log('Unable to sign out')
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-row">
        <Avatar>
          <AvatarImage src={user.photoURL ?? ''} />
          <AvatarFallback>
            {user.name?.match(/\b(\w)/g)?.join('')}
          </AvatarFallback>
        </Avatar>
        {user.name}
      </div>
      <div className="flex flex-row">
        <img alt="logo" src="/favicon.ico" width={24} height={24} /> Disaster
        Districts
      </div>
      <div className="flex flex-row">{wardDoc?.wardName}</div>
      <div className="flex flex-row">
        <School />
        <Link to="/districts">Districts</Link>
      </div>
      <div className="flex flex-row">
        <School2 />
        <Link to="/adddistrict">Add Districts</Link>
      </div>
      <div className="flex flex-row">
        <Rows3 />
        <Link to="/printdistricts">Print Districts</Link>
      </div>
      <div className="flex flex-row">
        <Users /> <Link to="/members">Members</Link>
      </div>
      <div className="flex flex-row">
        <User /> <Link to="/addmember">Add/Update Members</Link>
      </div>
      <div className="flex flex-row">
        <HardDriveUpload /> <Link to="/upload">Upload Members</Link>
      </div>
      <div className="flex flex-row grow">
        <Map />
        <Link to="/map">Map</Link>
      </div>
      <div className="flex flex-row grow">
        <Button onClick={logout}>Logout</Button>
      </div>
      <div className="flex flex-row">
        <Settings />
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  )
}

export default Sidebar
