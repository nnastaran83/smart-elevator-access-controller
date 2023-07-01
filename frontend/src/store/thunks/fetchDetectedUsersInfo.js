import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Send frame data to the flask server and get information about detected user

 */
const fetchDetectedUsersInfo = createAsyncThunk(
    "server/fetchDetectedUsersInfo", async (frameData) => {
        const response = await axios.post('http://localhost:5000/recognize_face',
            {frame_data: frameData},
            {headers: {'Content-Type': 'application/json'}}
        );

        return {...response.data, imageFrameData: frameData};

    }
);

export {fetchDetectedUsersInfo};