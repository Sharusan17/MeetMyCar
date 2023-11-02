import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyDLtAYA6ACkBZbGf1zV4mZniKZp0zMtjcs",
    authDomain: "meetmycar-bfa6b.firebaseapp.com",
    projectId: "meetmycar-bfa6b",
    storageBucket: "meetmycar-bfa6b.appspot.com",
    messagingSenderId: "671944782564",
    appId: "1:671944782564:web:45127b75a322edce15f2f1"
})

export const auth = app.auth()
export default app