import { Map, School, School2, User, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="flex flex-col w-[300px] min-w[-300px] border-r min-h-screen p-4 m-1 space-y-2">
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
      <div>Settings</div>
    </div>
  )
}

export default Sidebar
