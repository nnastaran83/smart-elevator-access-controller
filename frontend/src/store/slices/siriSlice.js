import {createSlice} from "@reduxjs/toolkit";

const siriSlice = createSlice({
    name: "siri",
    initialState: {
        textToSpeech: "",
    },
    reducers: {
        setTextToSpeech: (state, action) => {
            state.textToSpeech = action.payload;
        }
    }
});

export const siriReducer = siriSlice.reducer;
export const {setTextToSpeech} = siriSlice.actions;
