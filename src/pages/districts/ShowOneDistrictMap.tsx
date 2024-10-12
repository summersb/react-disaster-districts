import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDistrict, getMemberList } from '@/api'
import OSMMapWithMarkers from '@/components/OSMMapWithMarkers2'
import { useParams } from 'react-router-dom'
import { District, DistrictDbType } from '@/type'
import { useMap } from 'react-leaflet'
import MemberDisplayName from '@/components/MemberDisplayName.tsx'

const MapWithBounds = ({ bounds }) => {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      // Fit the map to the given bounds (southwest and northeast corners)
      map.fitBounds(bounds)
    }
    map.off('resize')
    return () => {
      map.on('resize', map._onResize)
    }
  }, [map, bounds])

  return null
}

type ShowOneDistrictMap = {
  district?: District
}

const ShowOneDistrictMap = (props: ShowOneDistrictMap) => {
  const { districtId } = useParams()
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList
  })

  const { data } = useQuery({
    queryKey: ['district', districtId],
    queryFn: () => getDistrict(districtId as string),
    enabled: districtId !== undefined && members !== undefined,
    retry: false
  })

  const convertDbDistrict = (db: DistrictDbType): District | undefined => {
    if (!db) {
      return undefined
    }
    return {
      id: db.id,
      name: db.name,
      leader: members?.find((m) => m.id == db.leaderId),
      assistant: members?.find((m) => m.id == db.assistantId),
      color: db.color,
      members: members?.filter((m) => db.members?.includes(m.id))
    }
  }

  const district = props.district ? props.district : convertDbDistrict(data)

  const bounds = (d: District) => {
    const distMembers = d.members
    const lats = distMembers.map(m => m.lat ?? 0)
    const lngs = distMembers.map(m => m.lng ?? 0)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)

    return <MapWithBounds bounds={[[minLat, minLng], [maxLat, maxLng]]} />
  }

  return (
    <div>
      {district &&
        <div>
          <div className="w-full">
            <h1>{district?.name}</h1>
            {district?.leader && <h2>Leader: <MemberDisplayName member={district.leader} /></h2>}
            {district?.assistant && <h2>Assistant: <MemberDisplayName member={district.assistant} /></h2>}
          </div>
          <div className="w-[700px] h-[500px]">
            <OSMMapWithMarkers district={district} members={members || []} bounds={bounds(district)} />
          </div>
        </div>
      }
    </div>
  )
}

export default ShowOneDistrictMap