import React from 'react';
import {configureStore} from "@reduxjs/toolkit";
import {contactListReducer} from "./slices/contactListSlice.js";
import {
    controllerReducer,
    startFaceRecognition,
    startSiri
} from "./slices/controllerSlice.js";
import {
    currentDetectedUserReducer,
    setDetectedUserInfo,
    changeUserType
} from "./slices/currentDetectedUser.js";
import {videoCallReducer, setIsVideoCallActive} from "./slices/videoCallSlice.js";
import {siriReducer} from "./slices/siriSlice.js";


const store = configureStore({
    reducer: {
        contactList: contactListReducer,
        videoCall: videoCallReducer,
        controller: controllerReducer,
        siri: siriReducer,
        currentDetectedUser: currentDetectedUserReducer

    }
});

export {
    store,
    startFaceRecognition,
    startSiri,
    setDetectedUserInfo,
    setIsVideoCallActive,
    changeUserType,


};
export * from "./thunks/loadRegisteredUsers.js";