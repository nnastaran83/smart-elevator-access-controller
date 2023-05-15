import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDocs} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import {getAnalytics} from "firebase/analytics";
import {getToken} from "firebase/messaging";
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
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);


/**
 * Get registration token. Initially this makes a network call, once retrieved
 * subsequent calls to getToken will return from cache.
 */
const getMessagingToken = () => {
    getToken(messaging, {
        vapidKey:
            "BEoYSAt84uere2NDQf_nu4DE-3FhTCyJHgqtMWATFfdbrz-nxneYlwKR9SeENhJ1ZBwWCTA1Oq4MVdpjERk-cKs",
    })
        .then((currentToken) => {
            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                console.log(currentToken);
            } else {
                // Show permission request UI
                console.log(
                    "No registration token available. Request permission to generate one."
                );
                // ...
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
        });

};


export {db, auth, messaging};
