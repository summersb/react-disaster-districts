// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
//import { getAnalytics } from 'firebase/analytics'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
//import { ReCaptchaV3Provider, initializeAppCheck } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  //  measurementId: import.meta.env.VITE_measurementId,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
if (import.meta.env.MODE === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099')
}
//const analytics = getAnalytics(app)
const provider = new GoogleAuthProvider()
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('User signed in ', result.user)
  } catch (error) {
    console.error('Error signing in', error)
  }
}

const db = getFirestore(app)
if (import.meta.env.MODE === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}
//const appCheck = initializeAppCheck(app, {
//  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
//  isTokenAutoRefreshEnabled: true,
//})

export { auth, db, app, signOut, getAuth }
