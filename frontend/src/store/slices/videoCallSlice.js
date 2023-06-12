import {createSlice} from "@reduxjs/toolkit";

const videoCallSlice = createSlice({
    name: 'videoCall',
    initialState: {
        isVideoCallActive: false,

    },
    reducers: {
        setIsVideoCallActive: (state, action) => {
            state.isVideoCallActive = action.payload;
        }
    }
});

export const videoCallReducer = videoCallSlice.reducer;
export const {setIsVideoCallActive} = videoCallSlice.actions;
