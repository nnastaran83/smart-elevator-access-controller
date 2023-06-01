import React from 'react';
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
    return (
        <Box className="overlay">
            <Box className="inner-popup" onClick={(event) => (event.stopPropagation())}>
                <ContactList/>
                {/*<VideoCallPage/>*/}
            </Box>
        </Box>

    );
};

export default VideoCallPopup;