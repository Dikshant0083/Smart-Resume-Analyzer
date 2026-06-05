import { initializeApp } from 'firebase/app'
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB9kH8knUsgg2xbylO_pArTInpCq61a1Vw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'resumeanalyzer-50e48.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'resumeanalyzer-50e48',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'resumeanalyzer-50e48.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '734092078043',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:734092078043:web:62db51a75673753bfbd5fe',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-H9KB7957M8',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const githubProvider = new GithubAuthProvider()
githubProvider.addScope('read:user')
githubProvider.addScope('user:email')

export { app, auth, googleProvider, githubProvider }
