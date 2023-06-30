import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Load information about registered users from the flask server
 */
const loadRegisteredUsers = createAsyncThunk(
    "server/loadRegisteredUsers", async () => {
        const response = await axios.get('http://localhost:5000/get_registered_users',
            {headers: {'Content-Type': 'application/json'}}
        );
        return response.data;

    }
);


export {loadRegisteredUsers};

