import {createSlice} from '@reduxjs/toolkit';

const USER_STATES = {
    REGISTERED_USER: 'registered',
    RETURNING_USER: 'returning_user',
    UNREGISTERED_USER: 'unregistered'
};

const currentDetectedUser = createSlice({
    name: 'currentDetectedUser',
    initialState: {
        detectedUserInfo: {name: null, floor_number: null, uid: null, imageFrameData: null},
        userType: null,
    },
    reducers: {

        setDetectedUserInfo: (state, action) => {
            state.detectedUserInfo = action.payload;
            if (action.payload.uid) {
                state.userType = USER_STATES.REGISTERED_USER;

            } else if (action.payload.floor_number) {
                state.userType = USER_STATES.RETURNING_USER;
            } else {
                state.userType = USER_STATES.UNREGISTERED_USER;
            }

        },

        changeUserType: (state, action) => {
            state.userType = action.payload;
        }
    },
});


export const currentDetectedUserReducer = currentDetectedUser.reducer;
export const {
    setDetectedUserInfo,
    changeUserType
} = currentDetectedUser.actions;

