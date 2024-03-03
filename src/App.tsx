import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import AddMember from './AddMember'
import Distrits from './Districts'
import MapDisplay from './MapDisplay'

function App() {
  return (
    <div>
      <Tabs defaultValue="districts" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="addmembers">Add Member</TabsTrigger>
          <TabsTrigger value="map">View Map</TabsTrigger>
        </TabsList>
        <TabsContent value="districts">
          <Distrits />
        </TabsContent>
        <TabsContent value="addmembers">
          <AddMember />
        </TabsContent>
        <TabsContent value="map">
          <MapDisplay />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
