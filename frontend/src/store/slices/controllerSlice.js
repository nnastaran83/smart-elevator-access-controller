import {createSlice} from "@reduxjs/toolkit";
import {fetchDetectedUsersInfo} from "../thunks/fetchDetectedUsersInfo.js";


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


    }


});

export const controllerReducer = cotrollerSlice.reducer;
export const {startFaceRecognition, startSiri} = cotrollerSlice.actions;