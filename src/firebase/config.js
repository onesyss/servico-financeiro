import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhXIqoDSnF6LdzXPXObR4t5QkfFLsjyM0",
  authDomain: "controlfin-app.firebaseapp.com",
  projectId: "controlfin-app",
  storageBucket: "controlfin-app.firebasestorage.app",
  messagingSenderId: "598561517684",
  appId: "1:598561517684:web:eec61ba4a522b5b6716121",
  measurementId: "G-X7FFWTJ8WL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
