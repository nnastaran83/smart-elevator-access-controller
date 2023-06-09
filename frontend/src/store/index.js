import React from 'react';
import {configureStore} from "@reduxjs/toolkit";
import {contactListReducer} from "./slices/contactListSlice.js";
import {faceDetectorReducer, startFaceRecognition, startSiri, setDetectedUserInfo} from "./slices/faceDetectorSlice.js";


const store = configureStore({
    reducer: {
        contactList: contactListReducer,
        faceDetector: faceDetectorReducer,
    }
});

export {store, faceDetectorReducer, contactListReducer, startFaceRecognition, startSiri, setDetectedUserInfo};
export * from "./thunks/loadRegisteredUsers.js";