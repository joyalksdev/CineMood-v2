import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDvNc-Hvo0VAVw_sFTeigvzboX_NokPM8w",
  authDomain: "cinemood-auth.firebaseapp.com",
  projectId: "cinemood-auth",
  storageBucket: "cinemood-auth.firebasestorage.app",
  messagingSenderId: "908057905234",
  appId: "1:908057905234:web:59ccd97acdde6f8731b78b"
}

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
