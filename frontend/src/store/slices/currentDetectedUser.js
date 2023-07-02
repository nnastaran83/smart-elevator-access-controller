import {createSlice} from '@reduxjs/toolkit';
import {fetchDetectedUsersInfo} from "../thunks/fetchDetectedUsersInfo.js";

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
        requestedFloorNumber: null,
        loading: false,
        error: null,
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
        },
        setRequestedFloorNumber: (state, action) => {
            state.requestedFloorNumber = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchDetectedUsersInfo.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchDetectedUsersInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.requestedFloorNumber = null;
            state.detectedUserInfo = action.payload;
            if (action.payload.uid) {
                state.userType = USER_STATES.REGISTERED_USER;

            } else if (action.payload.floor_number) {
                state.userType = USER_STATES.RETURNING_USER;
            } else {
                state.userType = USER_STATES.UNREGISTERED_USER;
            }

        });

        builder.addCase(fetchDetectedUsersInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error;

        });

    }
});


export const currentDetectedUserReducer = currentDetectedUser.reducer;
export const {
    setDetectedUserInfo,
    changeUserType,
    setRequestedFloorNumber
} = currentDetectedUser.actions;

