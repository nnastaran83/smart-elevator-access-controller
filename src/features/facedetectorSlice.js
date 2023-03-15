import {createSlice} from "@reduxjs/toolkit";
import {useState} from "react";

export const facedetectorSlice = createSlice({
        name: 'progressbar',
        initialState: {
            labeledDescriptors: [],
            detected: false
        },
        reducers: {}
    }
);