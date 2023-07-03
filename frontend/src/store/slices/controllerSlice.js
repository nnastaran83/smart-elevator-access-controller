import {createSlice} from "@reduxjs/toolkit";
import {fetchDetectedUsersInfo} from "../thunks/fetchDetectedUsersInfo.js";
import {setIsVideoCallActive} from "../actions.js";

/**
 * @description Slice to handle controller
 * @type {Slice<{isFaceRecognitionActive: boolean, isSiriActive: boolean}, {startFaceRecognition: reducers.startFaceRecognition, startSiri: reducers.startSiri}, string>}
 */
const cotrollerSlice = createSlice({
    name: "controller",
    initialState: {
        isFaceRecognitionActive: true,
        isSiriActive: false,

    },
    reducers: {
        startFaceRecognition: (state) => {
            state.isFaceRecognitionActive = true;
            state.isSiriActive = false;
        },
        startSiri: (state) => {
            state.isFaceRecognitionActive = false;
            state.isSiriActive = true;
        }
    },
    extraReducers(builder) {

        builder.addCase(fetchDetectedUsersInfo.fulfilled, (state, action) => {
            state.isFaceRecognitionActive = false;
            state.isSiriActive = true;
        });
        builder.addCase(setIsVideoCallActive, (state, action) => {
            if (action.payload === true) {
                state.isFaceRecognitionActive = false;
                state.isSiriActive = false;
            }

        });


    }


});

export const controllerReducer = cotrollerSlice.reducer;
export const {startFaceRecognition, startSiri} = cotrollerSlice.actions;