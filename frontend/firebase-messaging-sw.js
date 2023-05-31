import {initializeApp} from "firebase/app";
import {getMessaging} from "firebase/messaging/sw";

/**
 * Web Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 * @see https://firebase.google.com/docs/web/setup#available-libraries
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, authDomain: string}}
 */
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAQ5zZXG0NS864OeXcRWib0zWzMFIxoaVs",
    authDomain: "smartpro-e44ec.firebaseapp.com",
    projectId: "smartpro-e44ec",
    storageBucket: "smartpro-e44ec.appspot.com",
    messagingSenderId: "992154298820",
    appId: "1:992154298820:web:0eb08f07044ac8d3719c91",
    measurementId: "G-DMSN2VRVZ8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);


