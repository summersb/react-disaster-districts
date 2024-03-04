import StyledFirebaseAuth from '../../StyledFirebaseAuth'
import 'firebase/compat/auth'
import { useEffect } from 'react'
import { auth } from '@/api'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const uiConfig = {
  // Popup sign in flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/home',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
}

const Login = () => {
  const { user } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || location.pathname

  useEffect(() => {
    document.title = 'Disaster Districts - Login'
  }, [])

  uiConfig.signInSuccessUrl = from

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {user?.name && <Navigate to={from} />}
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}

export default Login
