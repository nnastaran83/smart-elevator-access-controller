import {createSlice} from '@reduxjs/toolkit';

const faceDetectorSlice = createSlice({
    name: 'faceDetector',
    initialState: {
        detectedUserInfo: {name: null, floor_number: null, uid: null},
        isFaceRecognitionActive: true,
        isSiriActive: false,
        currentDetectedImageFrameData: null,

    },
    reducers: {
        startFaceRecognition: (state) => {
            state.isFaceRecognitionActive = true;
            state.isSiriActive = false;
        },
        startSiri: (state) => {
            state.isFaceRecognitionActive = false;
            state.isSiriActive = true;
        },
        setDetectedUserInfo: (state, action) => {
            state.detectedUserInfo = action.payload;

        },
        setCurrentDetectedImageFrameData: (state, action) => {
            state.currentDetectedImageFrameData = action.payload;
        }
    },
});


export const faceDetectorReducer = faceDetectorSlice.reducer;
export const {
    startFaceRecognition,
    startSiri,
    setDetectedUserInfo,
    setCurrentDetectedImageFrameData
} = faceDetectorSlice.actions;

