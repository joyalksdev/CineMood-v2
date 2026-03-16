import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

export const saveWatchlist = async (uid, watchlist) => {
  await setDoc(doc(db, "watchlists", uid), { movies: watchlist }, { merge: true })
}

export const getWatchlist = async (uid) => {
  const snap = await getDoc(doc(db, "watchlists", uid))
  if (!snap.exists()) return []
  return snap.data().movies || []
}
