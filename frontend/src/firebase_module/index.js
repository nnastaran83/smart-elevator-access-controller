import {initializeApp} from "firebase/app";
import {getFirestore, collection, getDoc, doc} from "firebase/firestore";
import {
    getAuth,
} from "firebase/auth";
import {getMessaging} from "firebase/messaging";
import axios from "axios";

/**
 * Web Firebase configuration
 * For Firebase JS SDK v7.20.0 and later, measurementId is optional
 * @see https://firebase.google.com/docs/web/setup#available-libraries
 * @type {{storageBucket: string, apiKey: string, messagingSenderId: string, appId: string, projectId: string, measurementId: string, authDomain: string}}
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};

const SERVER_KEY = import.meta.env.VITE_APP_MESSAGING_SERVER_KEY;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);


//const sendVideoCallRequest = async () => {
//    // This registration token comes from the client FCM SDKs.
//    const registrationToken = 'elTrm_4G3HFChZxPEcxg1C:APA91bFqpTdGrthaQoeScYvHQLV5UGjbzlGv5NMfv_1lLbgdjvgMWw3zAyxI5ZbXW2nN-w1cjSAZQenbft7BQ2YxEKEknAbU1PUE8_bKNIxfJVVrJKlZ0J-JrPw-E3QVRA4cZc2YosJz';
//
//    const message = {
//        data: {
//            score: '850',
//            time: '2:45'
//        },
//        token: registrationToken
//    };
//
//    // Send a message to the device corresponding to the provided
//    // registration token.
//    messaging.send(messaging, message).then((response) => {
//        // Response is a message ID string.
//        console.log('Successfully sent message:', response);
//    })
//        .catch((error) => {
//            console.log('Error sending message:', error);
//        });
//}


/**
 * Send video call request message to user
 * @param userId - in our case it is email of user
 * @param message
 * @returns {Promise<void>}
 */
const sendVideoCallRequestMessageToUser = async (userId, message) => {
    // Get a reference to this user's specific status document.
    const userRef = doc(collection(db, "users"), userId);

    try {
        // Find document with userRef
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            let registrationToken = userSnap.data().token;
            console.log(registrationToken);

            //Create data to send
            const data = JSON.stringify({
                data: message,
                to: registrationToken,
            });

            //Create configuration for axios request to FCM
            const config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://fcm.googleapis.com/fcm/send",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: SERVER_KEY,
                },
                data,
            };

            //Send request to FCM
            const response = await axios.request(config);

            console.log(JSON.stringify(response.data));
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.log("Error getting document!", error);
    }
};


export {db, auth, sendVideoCallRequestMessageToUser};
