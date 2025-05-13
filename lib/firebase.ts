// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtTEZrM6Vu5iqoLE3N58sFA8PbJglDRu8",
  authDomain: "dev-izaan.firebaseapp.com",
  projectId: "dev-izaan",
  storageBucket: "dev-izaan.firebasestorage.app",
  messagingSenderId: "885437606402",
  appId: "1:885437606402:web:207624a312166db37f951b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
// Initialize storage with the default bucket
const storage = getStorage(app);

export { auth, db, storage };
export default app; 