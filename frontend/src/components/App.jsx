import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import '../styles/App.scss';
import FaceDetector from "./FaceDetector.jsx";
import ContactList from "./ContactList.jsx";
import VideoCallPopup from "./VideoCallPopup/index.jsx";
import {Box, Container} from "@mui/material";


/**
 * App component is the main component of the application
 * and is used to render the application into the root.
 * @returns {JSX.Element}
 * @component
 *
 */
const App = () => {
    const [videoCallLink, setVideoCallLink] = useState(null);


    const handleVideoVisibility = (event) => {
        setVideoCallLink(videoCallLink ? null : <VideoCallPopup/>);
        requestPermissionToSendNotification();

    };

    /**
     * Request permission from user to send notifications
     */
    function requestPermissionToSendNotification() {
        console.log("Requesting permission...");
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    }

    return (

        <Container className="App" onClick={handleVideoVisibility}>
            <Box>
                <Routes>
                    <Route path='/' element={<FaceDetector/>}/>
                    <Route path='/contactlist' element={<ContactList/>}/>
                </Routes>

            </Box>

            {videoCallLink}
        </Container>


    );
};

export default App;