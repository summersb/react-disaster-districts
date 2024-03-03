import StyledFirebaseAuth from './StyledFirebaseAuth'
import 'firebase/compat/auth'
import React, { useEffect } from 'react'
import { auth } from '~/api'
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '~/hooks/useAuth'

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

const Login = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || location.pathname

  useEffect(() => {
    document.title = 'Book Review - Login'
  }, [])

  // if (user?.name) {
  //   navigate(from, { replace: true })
  // }

  console.log('Login', from, location.pathname)
  uiConfig.signInSuccessUrl = from

  return (
    <div>
      {user?.name && <Navigate to={from} />}
      <center>
        <p>Please sign-in:</p>
      </center>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  )
}

export default Login
