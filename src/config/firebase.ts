import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD1vKFxreHpUZNy96W1o3fhz-_POR2hiDY",
    authDomain: "vcpmc-project.firebaseapp.com",
    projectId: "vcpmc-project",
    storageBucket: "vcpmc-project.appspot.com",
    messagingSenderId: "935382553518",
    appId: "1:935382553518:web:be80da886d76f9d8eaee3f",
    measurementId: "G-76QWQMFJFG",
};

const app = initializeApp(firebaseConfig);
export const firestoreDatabase = getFirestore(app);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);