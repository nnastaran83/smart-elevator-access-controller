import React, {useEffect, useState} from 'react';
import '../styles/PopupFrameOverlay.css';

/**
 * VideoCallPopup component is used to display a frame for video call.
 * @returns {JSX.Element}
 * @constructor
 */
const VideoCallPopup = () => {
    return (
        <div className="video-call-container">
            <div className="overlay">
                <div className="inner-popup">
                    <iframe style={{width: "100%", height: "100%", overflowY: "hidden"}}
                            src={window.location.protocol + '//' + window.location.host + '/videocall'}/>
                </div>
            </div>
        </div>
    );
};

export default VideoCallPopup;