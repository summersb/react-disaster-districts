import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useQuery } from '@tanstack/react-query'
import Markers from './Markers'
import React from 'react'
import { getMembers } from '../../api'

type MapDisplayProps = {
  lat?: number
  lng?: number
}

const MapDisplay = ({ lat = 33.1928423, lng = -117.2413057 }: MapDisplayProps): React.ReactElement => {
  const { data, isError, error } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    retry: false,
  })

  if (isError) {
    alert(error)
  }

  const m = data?.docs.map((d) => d.data()).filter(m => m.lat !== undefined)

  return (
    <div className="h-full">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
        <Map
          center={{ lat, lng }}
          defaultZoom={15}
          mapId={import.meta.env.VITE_MAP_ID}
        >
          {m && <Markers members={m} />}
        </Map>
      </APIProvider>
    </div>
  )
}

export default MapDisplay
