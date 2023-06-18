import React from 'react';
import {configureStore} from "@reduxjs/toolkit";
import {contactListReducer} from "./slices/contactListSlice.js";
import {
    controllerReducer,
    startFaceRecognition,
    startSiri
} from "./slices/controllerSlice.js";
import {
    faceDetectorReducer,
    setDetectedUserInfo,
    setCurrentDetectedImageFrameData
} from "./slices/faceDetectorSlice.js";
import {videoCallReducer, setIsVideoCallActive} from "./slices/videoCallSlice.js";


const store = configureStore({
    reducer: {
        contactList: contactListReducer,
        faceDetector: faceDetectorReducer,
        videoCall: videoCallReducer,
        controller: controllerReducer,

    }
});

export {
    store,
    faceDetectorReducer,
    contactListReducer,
    startFaceRecognition,
    startSiri,
    setDetectedUserInfo,
    setCurrentDetectedImageFrameData,
    setIsVideoCallActive,
};
export * from "./thunks/loadRegisteredUsers.js";