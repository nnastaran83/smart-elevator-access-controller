import React, {useEffect, useState} from 'react';
import '../../styles/PopupFrameOverlay.css';
import VideoCallPage from "./VideoCallPage.jsx";

/**
 * VideoCallPopup component is used to display a frame for video call.
 * @returns {JSX.Element}
 * @component
 */
const VideoCallPopup = () => {
    return (
        <div className="video-call-container">
            <div className="overlay">
                <div className="inner-popup">
                    {/*<iframe style={{width: "100%", height: "100%", overflowY: "hidden"}}
                            src={'https://smart-video-call.web.app/'} allow={"camera; microphone"}/>*/}
                    <VideoCallPage/>
                </div>
            </div>
        </div>
    );
};

export default VideoCallPopup;