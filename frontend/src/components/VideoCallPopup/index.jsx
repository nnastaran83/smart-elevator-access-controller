import React, {useEffect, useState} from 'react';
import '../../styles/PopupFrameOverlay.css';
import VideoCallPage from "./VideoCallPage.jsx";
import {Box} from "@mui/material";

/**
 * VideoCallPopup component is used to display a frame for video call.
 * @returns {JSX.Element}
 * @component
 */
const VideoCallPopup = () => {
    return (
        <Box className="overlay">
            <Box className="inner-popup">
                {/*<iframe style={{width: "100%", height: "100%", overflowY: "hidden"}}
                            src={'https://smart-video-call.web.app/'} allow={"camera; microphone"}/>*/}
                <VideoCallPage/>
            </Box>
        </Box>

    );
};

export default VideoCallPopup;