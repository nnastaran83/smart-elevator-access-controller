import React, {useCallback, useState,} from 'react';
import {createContext} from 'react';
import axios from "axios";

const RegisteredUsersContext = createContext();

/**
 * RegisteredUsersProvider component is used to provide the registered users to the application.
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
function RegisteredUsersProvider({children}) {
    const [registeredUsers, setRegisteredUsers] = useState([]);

    /**
     * Fetches the registered users from the Flask backend
     * @type {(function(): Promise<void>)|*}
     */
    const fetchRegisteredUsers = useCallback(async () => {
        console.log("useCallback is running");
        const response = await axios.get('http://localhost:5000/get_registered_users',
            {headers: {'Content-Type': 'application/json'}}
        );
        setRegisteredUsers(response.data);
    }, []);


    return (
        <RegisteredUsersContext.Provider value={{registeredUsers, fetchRegisteredUsers}}>
            {children}
        </RegisteredUsersContext.Provider>
    );
}


export default RegisteredUsersContext;
export {RegisteredUsersProvider};
