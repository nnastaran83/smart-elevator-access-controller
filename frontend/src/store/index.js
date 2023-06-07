import React from 'react';
import {configureStore} from "@reduxjs/toolkit";
import {contactListReducer} from "./slices/contactListSlice.js";


const store = configureStore({
    reducer: {
        contactList: contactListReducer,
    }
});

export {store};
export * from "./thunks/loadRegisteredUsers.js";