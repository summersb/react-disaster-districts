import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import AddMember from './AddMember'
import Distrits from './Districts'
import { auth } from '@/api'
import MapDisplay from './MapDisplay'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import StyledFirebaseAuth from './StyledFirebaseAuth'
import useAuth from '@/hooks/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
import { ModeToggle } from './components/mode-toggle'

const uiConfig = {
  // Popup sign in flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/Home',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
}

function App() {
  const { user } = useAuth()
  console.log('user', user)

  return (
    <div>
      <ModeToggle />
      <Tabs defaultValue="districts" className="w-full">
        <TabsList>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="addmembers">Add Member</TabsTrigger>
          <TabsTrigger value="map">View Map</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
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
        <TabsContent value="login">
          <Avatar>
            <AvatarImage src={user.photoURL} />
            <AvatarFallback>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
            </AvatarFallback>
          </Avatar>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
