import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYLpylBgyru7--Q7vhtjiKovA4TgJ4kf4",
  authDomain: "istockwalletapp.firebaseapp.com",
  projectId: "istockwalletapp",
  storageBucket: "istockwalletapp.appspot.com",
  messagingSenderId: "866777184467",
  appId: "1:866777184467:web:c0a1f1cf8ea5c9d494fc26",
  measurementId: "G-BHNMYLWLNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore();