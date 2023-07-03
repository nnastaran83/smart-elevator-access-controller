import {createAction} from "@reduxjs/toolkit";

export const setIsVideoCallActive = createAction('videoCall/setIsVideoCallActive', (payload) => {
    return {
        payload
    };
});
