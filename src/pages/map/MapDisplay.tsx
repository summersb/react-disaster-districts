import {APIProvider, Map, MapCameraChangedEvent, MapCameraProps} from '@vis.gl/react-google-maps'
import {useQuery} from '@tanstack/react-query'
import Markers from './Markers'
import React, {useState, useCallback, useEffect} from 'react'
import {getMemberList} from '@/api'
import {DistrictDbType, Member} from "@/type";
import Marker from "@/pages/map/Marker.tsx";

type MapDisplayProps = {
  lat?: number
  lng?: number
  districts?: DistrictDbType
  members?: Member[]
}

const MapDisplay = ({
                      members,
                      lat = 33.1928423,
                      lng = -117.2413057,
                    }: MapDisplayProps): React.ReactElement => {
  const [cameraProps, setCameraProps] = useState<MapCameraProps>({center: {lat, lng}, zoom: 15})
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) =>
      setCameraProps(ev.detail),
    []
  )

  useEffect(() => {
    setCameraProps({center: {lat, lng}, zoom: 15})
  }, [lat, lng])

  const {data, isError, error} = useQuery({
    queryKey: ['members'],
    queryFn: getMemberList,
    retry: false,
  })

  if (isError) {
    alert(error)
  }

  const onSelect = (member: Partial<Member>): void => {
    const d = (members ?? data)?.find(m => m.id === member.id)
    if (d) {
      d.color = "#222222"
    }
    console.log(member, d)
  }

  const m = (members ?? data)?.filter(m => m.lat !== undefined)
  console.log("Center", lat, lng)

  return (
    <div className="h-full">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
        <Map
          defaultCenter={{lat, lng}}
          defaultZoom={15}
          mapId={import.meta.env.VITE_MAP_ID}
          {...cameraProps}
          onCameraChanged={handleCameraChange}
        >
          {m && m.filter(m => m.lat !== undefined && m.lng !== undefined).map(member => (
            <Marker member={member} onSelect={onSelect}/>
          ))}
        </Map>
      </APIProvider>
    </div>
  )
}

export default MapDisplay
