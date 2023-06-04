import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


const loadRegisteredUsers = createAsyncThunk(
    "server/loadRegisteredUsers", async (_, {rejectWithValue}) => {
        return axios.get('http://localhost:5000/get_registered_users',
            {headers: {'Content-Type': 'application/json'}}
        ).then(response => {
            return response.data;
        }).catch(error => {
                return rejectWithValue(error.message);
            }
        );

    }
);


export {loadRegisteredUsers};

