import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCkzY79TdVuSIwNDzZPvCG1eTS2Z2ghtQU",
    authDomain: "duantotnghiep-940ce.firebaseapp.com",
    projectId: "duantotnghiep-940ce",
    storageBucket: "duantotnghiep-940ce.appspot.com",
    messagingSenderId: "723213997945",
    appId: "1:723213997945:web:758184f48766e46fd901a8",
    measurementId: "G-XBN34NZZ9V"
  }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth, GoogleAuthProvider, signInWithPopup };
