import { Map, School, School2, Settings, User, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/useAuth'

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col w-[300px] min-w[-300px] border-r min-h-screen p-4 m-1 space-y-2">
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
      <div className="flex flex-row">
        <School />
        <Link to="/districts">Districts</Link>
      </div>
      <div className="flex flex-row">
        <School2 />
        <Link to="/adddistrict">Add Districts</Link>
      </div>
      <div className="flex flex-row">
        <Users /> <Link to="/members">Members</Link>
      </div>
      <div className="flex flex-row">
        <User /> <Link to="/addmember">Add/Update Members</Link>
      </div>
      <div className="flex flex-row grow">
        <Map />
        <Link to="/map">Map</Link>
      </div>
      <div className="flex flex-row">
        <Settings />
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  )
}

export default Sidebar
