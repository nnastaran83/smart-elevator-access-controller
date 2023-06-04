import React, {useState} from 'react';
import '../../styles/PopupFrameOverlay.css';
import VideoCallPage from "./VideoCallPage.jsx";
import {Box} from "@mui/material";
import ContactList from "./ContactList.jsx";

/**
 * VideoCallPopup component is used to display a frame for video call.
 * @returns {JSX.Element}
 * @component
 */
const VideoCallPopup = () => {
    const [videoCall, setVideoCall] = useState(null);


    /**
     * Handles the click event of the contact button
     * Starts a video call with the user
     * @param event
     */
    const handleContactButtonClick = (event) => {
        // Access custom attributes
        const uid = event.currentTarget.getAttribute('data-uid');
        const token = event.currentTarget.getAttribute('data-token');
        // Do something with the custom attributes
        console.log(`Clicked on user with UID: ${uid} and token: ${token}`);
        setVideoCall(<VideoCallPage uid={uid} token={token}/>)


    };

    return (
        <Box className="overlay">
            <Box className="inner-popup" onClick={(event) => (event.stopPropagation())}>
                {videoCall ? videoCall : <ContactList handleContactButtonClick={handleContactButtonClick}/>}
                {/*<VideoCallPage/>*/}
            </Box>
        </Box>

    );
};

export default VideoCallPopup;