// Import the functions need from the SDKs need
//Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";// Add the Firebase products that need to use
import { getStorage } from "firebase/storage"; //Application's Firebase configuration
 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_Fire_Base_API_KEY,
  authDomain: "champions-stores.firebaseapp.com",
  projectId: "champions-stores",
  storageBucket: "champions-stores.appspot.com",
  messagingSenderId: "1081683885774",
  appId: "1:1081683885774:web:f508204a115d4a06005a9f",
  measurementId: "G-EP6ME9ES0R"
};


const app = initializeApp(firebaseConfig); // Initialize Firebase
export const imgStorage = getStorage(app); // Get the storage service for the default app