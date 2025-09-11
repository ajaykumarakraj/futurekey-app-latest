// firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';

// Your Firebase config object (from Firebase Console > Project Settings > General > Your apps)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
