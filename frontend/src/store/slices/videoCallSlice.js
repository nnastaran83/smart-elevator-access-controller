import {createSlice} from "@reduxjs/toolkit";
import {setIsVideoCallActive} from "../actions.js";


/**
 * @description Slice to handle video call
 * @type {Slice<{isVideoCallActive: boolean}, {}, string>}
 */
const videoCallSlice = createSlice({
    name: 'videoCall',
    initialState: {
        isVideoCallActive: false,
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(setIsVideoCallActive, (state, action) => {
            state.isVideoCallActive = action.payload;
        });
    }
});

export const videoCallReducer = videoCallSlice.reducer;
