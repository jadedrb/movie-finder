import firebase from "firebase/compat/app" // issue with v9 of firebase
import "firebase/compat/auth"

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FB_KEY,
    authDomain: process.env.REACT_APP_FB_AUTH,
    databaseURL: process.env.REACT_APP_FB_DB_URL,
    projectId: process.env.REACT_APP_FB_PID,
    storageBucket: process.env.REACT_APP_FB_STB,
    messagingSenderId: process.env.REACT_APP_FB_MSID,
    appId: process.env.REACT_APP_FB_AID,
    measurementId: process.env.REACT_APP_FB_MEID
})

export const auth = app.auth()
export default app