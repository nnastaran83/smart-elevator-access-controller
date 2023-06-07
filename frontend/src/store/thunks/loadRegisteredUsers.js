import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Load information about registered users from the flask server
 * @type {AsyncThunk<RejectWithValue<GetRejectValue<AsyncThunkConfig>, GetRejectedMeta<AsyncThunkConfig>> | RejectWithValue<AsyncThunkConfig extends {rejectValue: infer RejectValue} ? RejectValue : unknown, AsyncThunkConfig extends {rejectedMeta: infer RejectedMeta} ? RejectedMeta : unknown>, void, AsyncThunkConfig>}
 */
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

