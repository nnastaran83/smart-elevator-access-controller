import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
    getAuth
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getToken } from "firebase/messaging";
import { getMessaging } from "firebase/messaging/sw";

/**
 * Web Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 * @see https://firebase.google.com/docs/web/setup#available-libraries
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, authDomain: string}}
 */
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBWLr7DrODHLbB2Zvb5o6ANvBAws0MH8_8",
    authDomain: "smart-4e774.firebaseapp.com",
    projectId: "smart-4e774",
    storageBucket: "smart-4e774.appspot.com",
    messagingSenderId: "267084890357",
    appId: "1:267084890357:web:73c058772bfe998b4f45bc",
    measurementId: "G-XLLC8D755N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);


