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
    changeUserType,
    setRequestedFloorNumber
} from "./slices/currentDetectedUser.js";
import {videoCallReducer} from "./slices/videoCallSlice.js";
import {siriReducer, setTextToSpeech} from "./slices/siriSlice.js";
import {setIsVideoCallActive} from "./actions.js";


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
    setRequestedFloorNumber,
    setTextToSpeech

};
export * from "./thunks/loadRegisteredUsers.js";
export * from "./thunks/fetchDetectedUsersInfo.js";